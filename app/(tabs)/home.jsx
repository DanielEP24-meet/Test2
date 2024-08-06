import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useUser, fetchOrgs } from '../../context/userContext';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import VolunteerActivity from '../../components/VolunteerActivity';

export default function Home() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const loadOrgData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedOrgs = await fetchOrgs();
        if (!fetchedOrgs || typeof fetchedOrgs !== 'object') {
          throw new Error('Fetched organizations data is not an object');
        }
        
        const orgsArray = await Promise.all(Object.entries(fetchedOrgs).map(async ([id, org]) => {
          try {
            if (org.orgPic) {
              const storage = getStorage();
              const imageRef = storageRef(storage, org.orgPic);
              const imageUrl = await getDownloadURL(imageRef);
              return {
                id,
                org: org.name,
                type: org.type || 'N/A',
                location: org.location || 'N/A',
                image: imageUrl
              };
            }
            return {
              id,
              org: org.name,
              type: org.type || 'N/A',
              location: org.location || 'N/A',
              image: null
            };
          } catch (imageError) {
            console.error('Error fetching image for org:', org.name, imageError);
            return {
              id,
              org: org.name,
              type: org.type || 'N/A',
              location: org.location || 'N/A',
              image: null
            };
          }
        }));
        
        setOrgs(orgsArray);
      } catch (error) {
        console.error('Error fetching org data:', error);
        setError(error.message);
      }
      setLoading(false);
    };

    loadOrgData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello, {user?.username || 'User'}!</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {orgs.map((org) => (
          <VolunteerActivity key={org.id} {...org} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    padding: 20,
  },
  scrollContent: {
    padding: 10,
  },
});
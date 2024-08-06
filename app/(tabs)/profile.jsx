import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useUser, fetchOrgs } from '../../context/userContext'; 
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import VolunteerActivity from '../../components/VolunteerActivity';

export default function Profile() {
  const { user } = useUser();
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState(null);

  useEffect(() => {
    const loadProfileData = async () => {
      if (user?.profileImagePath) {
        try {
          const storage = getStorage();
          const imageRef = storageRef(storage, user.profileImagePath);
          const url = await getDownloadURL(imageRef);
          setProfileImage(url);
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      }
      
      if (user?.orgs) {
        try {
          const userOrgs = await fetchOrgs(user.orgs);
          const orgsWithImages = await Promise.all(
            Object.entries(userOrgs).map(async ([orgId, orgData]) => {
              if (orgData.orgPic) {
                const storage = getStorage();
                const imageRef = storageRef(storage, orgData.orgPic);
                try {
                  const imageUrl = await getDownloadURL(imageRef);
                  return [orgId, { ...orgData, imageUrl }];
                } catch (error) {
                  console.error(`Error fetching image for org ${orgId}:`, error);
                  return [orgId, { ...orgData, imageUrl: null }];
                }
              }
              return [orgId, { ...orgData, imageUrl: null }];
            })
          );
          setOrgs(Object.fromEntries(orgsWithImages));
        } catch (error) {
          console.error("Error fetching user orgs:", error);
        }
      }
      setLoading(false);
    };

    loadProfileData();
  }, [user]);

  const UserActivities = ({ orgs }) => {
    if (!orgs || typeof orgs !== 'object') {
      return <Text style={styles.noOrgsText}>No organizations available</Text>;
    }
  
    return (
      <ScrollView style={styles.activitiesContainer}>
        {Object.entries(orgs).map(([orgId, orgData]) => (
          <VolunteerActivity
            key={orgId}
            id={orgId}
            org={orgData.name}
            type={orgData.type || 'N/A'}
            location={orgData.location || 'N/A'}
            image={orgData.imageUrl || 'https://picsum.photos/200/300'}
          />
        ))}
      </ScrollView>
    );
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileImagePlaceholderText}>
              {user?.username?.charAt(0) || "U"}
            </Text>
          </View>
        )}
        <Text style={styles.name}>{user?.username || "User"}</Text>
      </View>
      <View style={styles.infoContainer}>
        <InfoItem label="Email" value={user?.email} />
        <InfoItem label="Location" value={user?.location} />
      </View>
      <Text style={styles.sectionTitle}>My Organizations</Text>
      <UserActivities orgs={orgs}/>
    </ScrollView>
  );
}

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || "Not provided"}</Text>
  </View>
);

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
  profileHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#3498db',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImagePlaceholderText: {
    fontSize: 48,
    color: '#ffffff',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    margin: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#34495e',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  activitiesContainer: {
    paddingHorizontal: 15,
  },
  noOrgsText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 20,
  },
});
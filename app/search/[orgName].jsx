import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, FlatList, ImageBackground } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchOrgs, useUser } from '../../context/userContext'; // Assume useUser is available
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { LinearGradient } from 'expo-linear-gradient';

const OrganizationPage = () => {
  const { orgName } = useLocalSearchParams();
  const { user, userLoading } = useUser(); // Get current user and loading state
  const [orgData, setOrgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [orgImage, setOrgImage] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const start = 10 + i;
    const end = start + 1;
    return `${start.toString().padStart(2, '0')}:00-${end.toString().padStart(2, '0')}:00`;
  });

  useEffect(() => {
    const loadOrgData = async () => {
      if (orgName) {
        try {
          const result = await fetchOrgs({ [orgName]: '' });
          
          if (result && result[orgName]) {
            setOrgData(result[orgName]);
            if (result[orgName].orgPic) {
              const storage = getStorage();
              const imageRef = storageRef(storage, result[orgName].orgPic);
              const url = await getDownloadURL(imageRef);
              setOrgImage(url);
            }
            // Check if user exists and has orgs property
            setIsMember(user?.orgs ? Object.keys(user.orgs).includes(orgName) : false);
          } else {
            setError('Organization not found in the result');
          }
        } catch (error) {
          console.error('Error fetching org data:', error);
          setError(error.message || 'An error occurred while fetching data');
        } finally {
          setLoading(false);
        }
      } else {
        setError('No organization name provided');
        setLoading(false);
      }
    };

    loadOrgData();
  }, [orgName, user]);

  useEffect(() => {
    console.log('User object:', user);
    console.log('User orgs:', user?.orgs);
    console.log('Org name:', orgName);
    console.log('Is member:', user?.orgs ? Object.keys(user.orgs).includes(orgName) : false);
  }, [user, orgName]);

  const renderTimeSlot = ({ item }) => (
    <TouchableOpacity
      style={styles.timeSlotButton}
      onPress={() => {
        setSelectedTimeSlot(item);
        setModalVisible(false);
      }}
    >
      <Text style={styles.timeSlotText}>{item}</Text>
    </TouchableOpacity>
  );

  const handleApply = () => {
    // Here you would typically send an application request to your backend
    setRequestSent(true);
  };

  if (loading || userLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
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

  if (!orgData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Organization not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={{ uri: orgImage || 'https://via.placeholder.com/400x200' }}
        style={styles.orgImage}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <Text style={styles.orgName}>{orgData.name}</Text>
          <Text style={styles.orgType}>{orgData.type}</Text>
          <Text style={styles.orgLocation}>{orgData.location}</Text>
        </LinearGradient>
      </ImageBackground>
      
      {orgData.description && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>{orgData.description}</Text>
        </View>
      )}
      
      {(orgData.email || orgData.phone) && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Contact</Text>
          {orgData.email && <Text style={styles.sectionText}>Email: {orgData.email}</Text>}
          {orgData.phone && <Text style={styles.sectionText}>Phone: {orgData.phone}</Text>}
        </View>
      )}
      
      {orgData.volunteerOpportunities && orgData.volunteerOpportunities.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Volunteer Opportunities</Text>
          {orgData.volunteerOpportunities.map((opportunity, index) => (
            <View key={index} style={styles.opportunityItem}>
              <Text style={styles.opportunityText}>• {opportunity}</Text>
            </View>
          ))}
        </View>
      )}

      {isMember ? (
        <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.actionButtonText}>Select Time Slot</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.actionButton} onPress={handleApply}>
          <Text style={styles.actionButtonText}>Apply</Text>
        </TouchableOpacity>
      )}
      
      {isMember && selectedTimeSlot && (
        <Text style={styles.selectedTimeText}>Selected Time: {selectedTimeSlot}</Text>
      )}

      {!isMember && requestSent && (
        <Text style={styles.requestSentText}>Your request has been sent</Text>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Select a Time Slot</Text>
          <FlatList
            data={timeSlots}
            renderItem={renderTimeSlot}
            keyExtractor={(item) => item}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#d9534f',
    textAlign: 'center',
    marginTop: 50,
  },
  actionButton: {
    backgroundColor: '#5cb85c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  requestSentText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#5cb85c',
    fontWeight: 'bold',
  },
  orgImage: {
    width: '100%',
    height: 250,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  orgName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  orgType: {
    fontSize: 18,
    color: '#eee',
    marginBottom: 5,
  },
  orgLocation: {
    fontSize: 16,
    color: '#ddd',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  opportunityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  opportunityText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  selectTimeButton: {
    backgroundColor: '#5cb85c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectTimeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedTimeText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#333',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  timeSlotButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: 250,
    alignItems: 'center',
  },
  timeSlotText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#d9534f',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    marginTop: 15,
    width: 250,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrganizationPage;
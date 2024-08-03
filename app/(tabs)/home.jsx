import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useUser } from '../../context/userContext'; // Adjust the import path as needed

const VolunteerActivity = ({ org, type, time, image }) => (
  <TouchableOpacity style={styles.activityContainer} onPress={() => console.log('Activity pressed')}>
    <Image source={{ uri: image }} style={styles.activityImage} />
    <View style={styles.activityInfo}>
      <Text style={styles.orgName}>{org}</Text>
      <Text style={styles.activityType}>{type}</Text>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
  </TouchableOpacity>
);

const activities = [
  { org: 'Green Earth', type: 'Environmental Cleanup', time: 'Saturday, 10 AM', image: 'https://picsum.photos/200/300' },
  { org: 'Happy Paws', type: 'Animal Shelter Support', time: 'Sunday, 2 PM', image: 'https://picsum.photos/200/300' },
  { org: 'Tech for All', type: 'Computer Literacy Workshop', time: 'Wednesday, 6 PM', image: 'https://picsum.photos/200/300' },
  { org: 'Food Bank', type: 'Food Distribution', time: 'Monday, 9 AM', image: 'https://picsum.photos/200/300' },
  { org: 'Senior Care', type: 'Elderly Companionship', time: 'Tuesday, 3 PM', image: 'https://picsum.photos/200/300' },
];

export default function Home() {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activities.map((activity, index) => (
          <VolunteerActivity key={index} {...activity} />
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    padding: 20,
  },
  scrollContent: {
    padding: 10,
  },
  activityContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  activityInfo: {
    padding: 15,
  },
  orgName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  activityType: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 5,
  },
  activityTime: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});
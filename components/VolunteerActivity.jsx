import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const VolunteerActivity = ({ org, type, location, image, id }) => {
  const [color, setColor] = useState('grey');
  const [randomActivities, setRandomActivities] = useState([]);

  const activities = [
    "Serving Food",
    "Cleaning",
    "Legal Work",
    "Patrol",
    "Packing Food",
  ];

  const handleColorChange = () => {
    setColor(color === 'grey' ? 'red' : 'grey');
  };

  useEffect(() => {
    const shuffleActivities = () => {
      let shuffled = activities.sort(() => 0.5 - Math.random());
      setRandomActivities(shuffled.slice(0, 2));
    };

    shuffleActivities();
  }, []);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`search/${id}`)}
    >
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage} />
      )}
      <View style={styles.details}>
        <View style={styles.header}>
          <Text style={styles.orgName}>{org}</Text>
          <TouchableOpacity onPress={handleColorChange}>
            <FontAwesome name="heart" size={24} color={color} style={styles.likeIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.type}>{type}</Text>
        <Text style={styles.location}>{location}</Text>
        <View style={styles.badges}>
          {randomActivities.map((activity, index) => (
            <View key={index} style={styles.badge}>
              <Text style={styles.badgeText}>{activity}</Text>
            </View>
          ))}
        </View>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>5.0</Text>
          <FontAwesome name="star" size={14} color="#f1c40f" />
          <FontAwesome name="star" size={14} color="#f1c40f" />
          <FontAwesome name="star" size={14} color="#f1c40f" />
          <FontAwesome name="star" size={14} color="#f1c40f" />
          <FontAwesome name="star" size={14} color="#f1c40f" />
          <Text style={styles.reviewText}>(14 Reviews)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#dcdcdc',
  },
  details: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orgName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  likeIcon: {
    marginLeft: 10,
  },
  type: {
    fontSize: 16,
    color: '#7f8c8d',
    marginVertical: 5,
  },
  location: {
    fontSize: 16,
    color: '#95a5a6',
  },
  badges: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  badge: {
    backgroundColor: '#ecf0f1',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 14,
    color: '#3498db',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
  },
  reviewText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 5,
  },
});

export default VolunteerActivity;

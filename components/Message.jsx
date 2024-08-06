import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Message({ username, message, profilePicture }) {
  const initial = username.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      {profilePicture ? (
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
      ) : (
        <View style={styles.initialContainer}>
          <Text style={styles.initial}>{initial}</Text>
        </View>
      )}
      <View style={styles.messageContainer}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  initialContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  initial: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
  },
});
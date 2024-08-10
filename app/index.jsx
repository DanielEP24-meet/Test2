import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';

const WelcomePage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to</Text>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.subtitle}>A new way to volunteer</Text>
        <TouchableOpacity onPress={() => {router.push('login')}} style={styles.button}>
          <Text style={styles.buttonText}>Proceed to App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // White background
  },
  content: {
    alignItems: 'center',
    width: '80%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 200, // Adjust as needed
    height: 100, // Adjust as needed
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#8B0000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    elevation: 3,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WelcomePage;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../../context/userContext';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { user, isLoading, signup, logout } = useUser();

  const handleSignUp = async () => {
    setIsSigningUp(true);
    try {
      await signup(email, password, username);
      router.push('(tabs)/home');
    } catch (error) {
      console.error('Sign up failed:', error.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign Up for Hestia</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#95a5a6"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#95a5a6"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#95a5a6"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
          disabled={isSigningUp}
        >
          {isSigningUp ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  formContainer: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  button: {
    backgroundColor: '#8B0000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    elevation: 3,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  signInButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#3498db',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default SignUp;

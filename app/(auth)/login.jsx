import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../../context/userContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { user, isLoading, login, logout } = useUser();

  const handlePress = async () => {
    setIsLoggingIn(true);
    try {
      await login(email, password);
      router.push('(tabs)/home');
    } catch (error) {
      console.error('Login failed:', error.message);
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Login to Hestia</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#95a5a6"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#95a5a6"
          secureTextEntry
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={handlePress}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={() => {router.push('/signup')}}>
          <Text style={styles.signUpButtonText}>Don't have an account? Sign up here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
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
    borderRadius: 25,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    minHeight: 50,  
    justifyContent: 'center', 
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  signUpButton: {
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#3498db',
    fontSize: 16,
  },
});

export default Login;
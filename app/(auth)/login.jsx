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
      <View style={styles.formContainer}>
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
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#bdc3c7',
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8B0000',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  signUpButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#8B0000',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Login;

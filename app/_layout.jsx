import { View, Text } from 'react-native'
import React from 'react'
import { Slot , Stack } from 'expo-router'
import { UserProvider } from '../context/userContext'
const Layout = () => {
  return (
    <UserProvider>
        <Stack >
            <Stack.Screen name="index" options={{'headerShown' : false}} />
            <Stack.Screen name="(auth)" options={{'headerShown' : false}} />
            <Stack.Screen name="(tabs)" options={{'headerShown' : false}}/>
        </Stack>
    </UserProvider>
      

  )
}

export default Layout;
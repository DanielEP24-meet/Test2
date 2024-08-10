import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'view') {
            iconName = focused ? 'list' : 'list-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8B0000',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="view"
        options={{
          title: 'View All',
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false
        }}
      />
    </Tabs>
  );
}

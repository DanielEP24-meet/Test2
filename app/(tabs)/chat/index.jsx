import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { database } from '../../../context/userContext';
import { ref, onValue, off } from 'firebase/database';

export default function ChatScreen() {
    const router = useRouter();
    const [chatRooms, setChatRooms] = useState([]);
  
    useEffect(() => {
      const chatRoomsRef = ref(database, 'chatRooms');
      const unsubscribe = onValue(chatRoomsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const chatRoomsList = Object.entries(data).map(([id, room]) => {
            const messages = room.messages ? Object.values(room.messages) : [];
            const lastMessage = messages.length > 0 ? 
              messages.reduce((latest, current) => 
                current.timestamp > latest.timestamp ? current : latest
              ) : null;
            return {
              id,
              name: room.name,
              lastMessage: lastMessage || { text: 'No messages yet', timestamp: Date.now() },
              users: Object.keys(room.users || {}).length
            };
          });
  
          // Sort chat rooms by last message timestamp
          chatRoomsList.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
          setChatRooms(chatRoomsList);
        }
      });
  
      // Cleanup function
      return () => off(chatRoomsRef);
    }, []);
  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <Image 
        source={{ uri: `https://picsum.photos/200?random=${item.id}` }} 
        style={styles.avatar} 
      />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>
            {formatTimestamp(item.lastMessage.timestamp)}
          </Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage.text}
        </Text>
        <Text style={styles.userCount}>{item.users} users</Text>
      </View>
    </TouchableOpacity>
  );

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        style={styles.chatList}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatTime: {
    fontSize: 12,
    color: '#888',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#25D366',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  userCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
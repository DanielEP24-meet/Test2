import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Message from '../../../components/Message';
import { useUser } from '../../../context/userContext';
import { database } from '../../../context/userContext';
import { ref, onValue, off, push, set } from 'firebase/database';

export default function ChatRoomScreen() {
  const { chatId } = useLocalSearchParams();
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    const chatRoomRef = ref(database, `chatRooms/${chatId}`);
    const unsubscribe = onValue(chatRoomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRoomName(data.name);
        if (data.messages) {
          const messageList = Object.entries(data.messages).map(([id, msg]) => ({
            id,
            ...msg,
          }));
          messageList.sort((a, b) => a.timestamp - b.timestamp);
          setMessages(messageList);
        }
      }
    });

    return () => off(chatRoomRef);
  }, [chatId, user, isLoading, router]);

  const sendMessage = () => {
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    if (inputText.trim() === '') return;

    const messagesRef = ref(database, `chatRooms/${chatId}/messages`);
    const newMessageRef = push(messagesRef);
    
    const messageData = {
      sender: user.uid,
      text: inputText.trim(),
      timestamp: Date.now(),
    };

    set(newMessageRef, messageData)
      .then(() => {
        console.log('Message sent successfully');
        setInputText('');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to access this chat room.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{roomName || `Chat Room: ${chatId}`}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Message
            username={item.sender === user.uid ? 'You' : item.sender}
            message={item.text}
            profilePicture={null}
          />
        )}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageList: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
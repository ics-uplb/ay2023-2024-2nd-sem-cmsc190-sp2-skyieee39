import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import AppHeader from '../../components/AppHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from '../../firebase-config';
import { ref, push, set, onValue } from 'firebase/database';
import { useSelector } from 'react-redux';

const Chat = ({ closeModal, otherUser }) => {
  const [content, setContent] = useState(''); 
  const [messages, setMessages] = useState([]); 
  const userId = useSelector(state => state.user.userId);

  // Construct chatId consistently
  const chatId = [userId, otherUser[0].userid].sort().join('-');

  useEffect(() => {
    const messagesRef = ref(db, `chats/${chatId}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setMessages(loadedMessages.reverse());
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [userId, otherUser]);

  const sendMessage = () => {
    if (content.trim().length === 0) return;

    const messagesRef = ref(db, `chats/${chatId}`);
    const newMessageRef = push(messagesRef);
    set(newMessageRef, {
      sender: userId,
      text: content,
      timestamp: Date.now(),
    });

    setContent('');
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === userId ? styles.sentMessage : styles.receivedMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <AppHeader />
        <TouchableOpacity onPress={() => closeModal(false)} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={35} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.nameView}>
        <Text style={styles.name}>{otherUser[0].name}</Text>
        <Text style={styles.email}>{otherUser[0].email}</Text>
      </View>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.chatContainer}
        inverted
      />
      <KeyboardAvoidingView behavior="padding" style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your message..."
          value={content}
          onChangeText={setContent}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <MaterialCommunityIcons name="send" size={25} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    position: 'absolute',
    marginLeft: 20,
    justifyContent: 'center'
  },
  nameView: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  name: {
    fontSize: 15,
    fontFamily: 'CantataOne-Regular',
  },
  email: {
    paddingTop: 3,
    fontSize: 13,
    color: 'grey'
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  sendButton: {
    backgroundColor: '#B7505C',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    textAlign: 'right',
    marginTop: 5,
  },
});

export default Chat;

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config'; // Import your database configuration
import { ref, onValue, remove } from "firebase/database";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const StaffMessDB = () => {
  const [staffMessages, setStaffMessages] = useState([]);
  const [expandedMessages, setExpandedMessages] = useState({}); // State for expanded messages
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const supportiveMesRef = ref(db, 'supportivemessages');
    const unsubscribe = onValue(supportiveMesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allMessages = [];
        for (let userId in data) {
          for (let messageId in data[userId]) {
            allMessages.push({
              id: messageId,
              userId,
              ...data[userId][messageId],
            });
          }
        }
        const sortedMessages = allMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setStaffMessages(sortedMessages);
        setLoading(false); // Stop loading once data is fetched
      }
    },{
      onlyOnce: false // Set this if you want to fetch the data only once
    }
  );

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const toggleExpandMessage = (id) => {
    setExpandedMessages(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const getDynamicFontSize = (name) => {
    const length = name.length;
    if (length <= 16) return 20;
    if ( 16 < length && length < 20 )  return 18;
    return 17;
  };

  const confirmDeleteMessage = (messageId, userId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this message?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => handleDeleteMessage(messageId, userId),
          style: "destructive"
        }
      ]
    );
  };

  const handleDeleteMessage = (messageId, userId) => {
    const messageRef = ref(db, 'supportivemessages/' + userId + '/' + messageId);
    remove(messageRef)
      .then(() => {
        console.log('Message deleted successfully');
        setStaffMessages(prevMessages => prevMessages.filter(message => message.id !== messageId));
      })
      .catch((error) => {
        console.error('Failed to delete message: ', error);
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        showsHorizontalScrollIndicator={false}
      >
        {staffMessages.map((message) => (
          <View key={message.id} style={styles.card}>
            <View style={styles.header}>
              <Text style={[styles.title, { fontSize: getDynamicFontSize(message.name) }]}>{message.name}</Text>
              <View style={styles.updateButtons}>
                    <TouchableOpacity onPress={() => confirmDeleteMessage(message.id, message.userId)}>
                      <MaterialCommunityIcons name='delete' color='black' size={25} />
                    </TouchableOpacity>
                  </View>
            </View>
            <View style={styles.content}>
              <Text style={styles.text} onPress={() => toggleExpandMessage(message.id)}>
                {expandedMessages[message.id] ? message.message : (message.message.length > 100 ? message.message.substring(0, 100) + '...' : message.message)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 18,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    width: 300,
    margin: 20
  },
  header: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontFamily: 'CantataOne-Regular',
    color: 'black',
    width: 180
  },
  text: {
    fontSize: 15,
    color: '#444444',
  },
  content: {
    marginTop: 10,
  },
  updateButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default StaffMessDB
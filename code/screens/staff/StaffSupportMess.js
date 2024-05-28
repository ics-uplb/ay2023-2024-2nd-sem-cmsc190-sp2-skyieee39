import { View, Text, StyleSheet, Modal, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SupportMessForm from './SupportMessForm';
import EditSuppMess from './EditSuppMess';
import { db } from '../../firebase-config'; // Import your database configuration
import { ref, onValue, remove } from "firebase/database";
import { useSelector } from 'react-redux';

const StaffSupportMess = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const userId = useSelector(state => state.user.userId);
  const [staffMessages, setStaffMessages] = useState([]);
  const [expandedMessages, setExpandedMessages] = useState({}); // State for expanded messages

  useEffect(() => {
    const supportiveMesRef = ref(db, 'supportivemessages/' + userId);
    const unsubscribe = onValue(supportiveMesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const supportMessArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setStaffMessages(supportMessArray);
      }
    }, {
      onlyOnce: false // Set this if you want to fetch the data only once
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [userId]);

  const handleEditMessage = (message) => {
    setSelectedMessage(message);
    setEditModalVisible(true);
  };

  const confirmDeleteMessage = (messageId) => {
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
          onPress: () => handleDeleteMessage(messageId),
          style: "destructive"
        }
      ]
    );
  };

  const handleDeleteMessage = (messageId) => {
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
                <TouchableOpacity onPress={() => handleEditMessage(message)}>
                  <MaterialCommunityIcons name='pencil' color='black' size={25} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDeleteMessage(message.id)}>
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
      {!modalVisible && !editModalVisible && (
        <TouchableOpacity 
          style={styles.floatingbutton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialCommunityIcons name='plus-circle' color='#B7505C' size={70} />
        </TouchableOpacity>
      )}
      <SafeAreaView>
        <Modal
          animationType="slide"
          visible={modalVisible}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: '#d9d9d9' }}>
            <SupportMessForm />
            <TouchableOpacity style={styles.buttonClose} onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
        <Modal
          animationType="slide"
          visible={editModalVisible}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: '#d9d9d9' }}>
            {selectedMessage && <EditSuppMess message={selectedMessage} />}
            <TouchableOpacity style={styles.buttonClose} onPress={() => setEditModalVisible(false)}>
              <Text style={styles.textStyle}>Back</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingbutton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: 15,
    bottom: 15,
  },
  buttonClose: {
    backgroundColor: "#B7505C",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 30
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
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
  updateButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -1,
  },
  text: {
    fontSize: 15,
    color: '#444444',
  },
  content: {
    marginTop: 10,
  },
});

export default StaffSupportMess;

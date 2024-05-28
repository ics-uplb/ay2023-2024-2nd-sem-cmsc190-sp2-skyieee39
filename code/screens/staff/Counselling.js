import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, SafeAreaView } from 'react-native';
import { db } from '../../firebase-config'; // Import your database configuration
import { ref, onValue } from "firebase/database";
import { useSelector } from 'react-redux';
import Chat from './Chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Counselling = () => {
    const [userRequests, setUserRequests] = useState({});
    const [expandedUser, setExpandedUser] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [userChat, setUserChat] = useState({});
    const uid = useSelector(state => state.user.userId);

    useEffect(() => {
      const requestsRef = ref(db, 'counsellingrequests');
      const unsubscribe = onValue(requestsRef, (snapshot) => {
        const data = snapshot.val();
        const groupedRequests = {};

        for (const req in data) {
          for (const request in data[req]) {
            if (data[req][request].status === 'relayed' && data[req][request].assignedstaff === uid) {

              if (!groupedRequests[req]) {
                  groupedRequests[req] = [];
              }

              groupedRequests[req].push({id: request, ...data[req][request]});

            }
          }
        }

        setUserRequests(groupedRequests);
        
      }, {
        onlyOnce: false
      });

      // Clean up the subscription on unmount
      return () => {
        unsubscribe();
      };
    }, []);

    const getDynamicFontSize = (name) => {
      const length = name.length;
      if (length <= 16) return 20;
      if ( 16 < length && length < 20 )  return 18;
      return 17;
    };

    const toggleExpandUser = (userId) => {
      setExpandedUser(prevState => ({
        ...prevState,
        [userId]: !prevState[userId]
      }));
    };

  return (
    <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        {Object.keys(userRequests).map((userId) => (
          <View key={userId} style={styles.card}>
            <TouchableOpacity onPress={() => toggleExpandUser(userId)}>
              <View style={styles.header}>
                <Text style={[styles.title, { fontSize: getDynamicFontSize(userRequests[userId][0].name) }]}>
                  {userRequests[userId][0].name}
                </Text>
                <TouchableOpacity onPress={() => {
                  setUserChat(userRequests[userId])
                  setModalVisible(true)
                }}>
                  <MaterialCommunityIcons name='chat' color='black' size={35} />
                </TouchableOpacity>
              </View>
              <Text style={styles.email}>
                  {userRequests[userId][0].email}
              </Text>
            </TouchableOpacity>
            {expandedUser[userId] && (
              <View>
                {userRequests[userId].map((request, index) => (
                  <View key={`${request.id}-${index}`}s style={styles.requestContainer}>
                    <Text style={styles.requestTitle}>
                      Request {index + 1}
                    </Text>
                    <Text style={styles.text}>
                      {request.notes}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
        <SafeAreaView>
          <Modal
            animationType="slide"
            visible={modalVisible}
          >
            <SafeAreaView style={{ flex: 1, backgroundColor:'#d9d9d9' }}>
              <Chat closeModal={setModalVisible} otherUser={userChat}/>
            </SafeAreaView>
          </Modal>
        </SafeAreaView>
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
    width: 210,
  },
  email: {
    color: 'grey',
    fontSize: 13
  },
  requestContainer: {
    marginTop: 10,
  },
  requestTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#444444',
  },
  text: {
    fontSize: 15,
    color: '#444444',
    marginTop: 5,
  },
});

export default Counselling;

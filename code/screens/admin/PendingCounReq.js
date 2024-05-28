import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, SafeAreaView } from 'react-native';
import { db } from '../../firebase-config'; // Import your database configuration
import { ref, onValue } from "firebase/database";
import CounsellingDetails from './CounsellingDetails';

const PendingCounReq = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [selectedRequest, setselectedRequest] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
  
    useEffect(() => {
      const requestsRef = ref(db, 'counsellingrequests');
      const unsubscribe = onValue(requestsRef, (snapshot) => {
        const data = snapshot.val();
        const pendingRequests = [];
    
        // Iterate through each user's requests
        for (const userId in data) {
          if (data.hasOwnProperty(userId)) {
            const userRequests = data[userId];
            for (const requestId in userRequests) {
              if (userRequests.hasOwnProperty(requestId)) {
                const request = userRequests[requestId];
                if (request.status === 'pending') {
                  pendingRequests.push({ id: requestId, ...request});
                }
              }
            }
          }
        }
    
        // Sort pending requests from latest to earliest
        pendingRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPendingRequests(pendingRequests);
      }, {
        onlyOnce: false
      });

      // Fetch staff list
      const usersRef = ref(db, 'users');
      const unsubscribeUsers = onValue(usersRef, (snapshot) => {
        const usersData = snapshot.val();
        const staffList = Object.keys(usersData)
          .filter(userId => usersData[userId].role === 'staff')
          .map(staffId => ({
            id: staffId,
            ...usersData[staffId]
          }));
        setStaffList(staffList);
      });
    
      // Clean up the subscription on unmount
      return () => {
        unsubscribe()
        unsubscribeUsers();
      };
    }, []);
    
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
          {pendingRequests.map((request) => (
            <TouchableOpacity key={request.id}
            onPress={() => {
              setselectedRequest(request);
              setModalVisible(true);
            }}
            >
              <View style={styles.card}>
                <View style={styles.header}>
                  <Text style={[styles.title, { fontSize: getDynamicFontSize(request.name) }]}>{request.name}</Text>
                </View>
                <View>
                  <Text style={styles.email}>{request.email}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <SafeAreaView>
          <Modal
            animationType="slide"
            visible={modalVisible}
          >
            <SafeAreaView style={{ flex: 1, backgroundColor:'#d9d9d9' }}>
              <CounsellingDetails request={selectedRequest} staffList={staffList} closeModal={setModalVisible}/>
              <TouchableOpacity style={styles.buttonClose} onPress={() => setModalVisible(false)}>
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
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
    },
    email: {
      fontSize: 13,
      color: 'grey',
      opacity: 10,
    },
    text: {
      fontSize: 15,
      color: '#444444',
    },
    content: {
      marginTop: 10,
    },
    buttonClose: {
      backgroundColor: "#B7505C",
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      marginTop: 15,
      marginHorizontal: 30,
      marginBottom: 5,
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
  });

export default PendingCounReq
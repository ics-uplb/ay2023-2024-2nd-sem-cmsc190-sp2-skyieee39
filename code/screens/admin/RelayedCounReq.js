import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { db } from '../../firebase-config'; // Import your database configuration
import { ref, onValue } from "firebase/database";
import RelayedDetails from './RelayedDetails';

const RelayedCounReq = () => {
  const [relayedRequests, setRelayedRequests] = useState([]);
    const [selectedRequest, setselectedRequest] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true); // State for loading
  
    useEffect(() => {
      const requestsRef = ref(db, 'counsellingrequests');
      const unsubscribe = onValue(requestsRef, (snapshot) => {
        const data = snapshot.val();
        const relayedRequests = [];
    
        // Iterate through each user's requests
        for (const userId in data) {
          if (data.hasOwnProperty(userId)) {
            const userRequests = data[userId];
            for (const requestId in userRequests) {
              if (userRequests.hasOwnProperty(requestId)) {
                const request = userRequests[requestId];
                if (request.status === 'relayed') {
                  relayedRequests.push({ id: requestId, ...request});
                }
              }
            }
          }
        }
    
        // Sort pending requests from latest to earliest
        relayedRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRelayedRequests(relayedRequests);
        setLoading(false); // Stop loading once data is fetched
      }, {
        onlyOnce: false
      });
    
      // Clean up the subscription on unmount
      return () => {
        unsubscribe()
      };
    }, []);
    
    const getDynamicFontSize = (name) => {
        const length = name.length;
        if (length <= 16) return 20;
        if ( 16 < length && length < 20 )  return 18;
        return 17;
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
          {relayedRequests.map((request) => (
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
              <RelayedDetails request={selectedRequest} closeModal={setModalVisible} />
              <TouchableOpacity style={styles.buttonClose} onPress={() => setModalVisible(false)}>
                <Text style={styles.textStyle}>Back</Text>
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
      backgroundColor: "#216a8d",
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
  });


export default RelayedCounReq
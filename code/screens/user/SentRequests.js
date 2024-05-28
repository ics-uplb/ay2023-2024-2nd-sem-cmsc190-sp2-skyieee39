import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { db } from '../../firebase-config'; // Import your database configuration
import { ref, onValue } from "firebase/database";
import { useSelector } from 'react-redux';

const SentRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [expandedRequest, setExpandedRequests] = useState({});
  const userId = useSelector(state => state.user.userId);
  const userEmail = useSelector(state => state.user.email);

  useEffect(() => {
    const requestsRef = ref(db, 'counsellingrequests/' + userId);
    const unsubscribe = onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const pendingRequests = Object.keys(data).map(key => {
          if (data[key].status === 'pending') {
            return { id: key, ...data[key] };
          }
          return null;
        }).filter(item => item !== null)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt descending

        setPendingRequests(pendingRequests);
      } else {
        setPendingRequests([]);
      }
    }, {
      onlyOnce: false
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [userId]);

  const toggleExpandRequest = (id) => {
    setExpandedRequests(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const getDynamicFontSize = (name) => {
    const length = name.length;
    if (length <= 16) return 20;
    if (16 < length && length < 20) return 18;
    return 17;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {pendingRequests.length === 0 ? (
          <Text style={styles.noRequestsText}>No sent counselling requests found.</Text>
        ) : (
          pendingRequests.map((request) => (
            <View key={request.id} style={styles.card}>
              <View style={styles.header}>
                <Text style={[styles.title, { fontSize: getDynamicFontSize(request.name) }]}>{request.name}</Text>
              </View>
              <View>
                <Text style={styles.email}>{userEmail}</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.text} onPress={() => toggleExpandRequest(request.id)}>
                  {expandedRequest[request.id] ? request.notes : (request.notes.length > 100 ? request.notes.substring(0, 100) + '...' : request.notes)}
                </Text>
              </View>
            </View>
          ))
        )}
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
    width: 180,
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
  noRequestsText: {
    fontSize: 18,
    color: 'grey',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SentRequests;

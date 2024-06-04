import { View, Text, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import AppHeader from '../../components/AppHeader';
import { db } from '../../firebase-config'; // Import your database configuration
import { ref, get, update, remove, onValue } from "firebase/database";

const CounsellingDetails = ({ request, staffList, closeModal }) => {
    const date = new Date(request.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); // '5/17/2023'
    const formattedTime = date.toLocaleTimeString(); // '2:37:00 PM'

    const [contentHeight, setContentHeight] = useState(0);
    const windowHeight = useWindowDimensions().height;

    const onContentSizeChange = (width, height) => {
        if (height > 350) {
        setContentHeight(350);
        } else {
        setContentHeight(height);
        }
    };

    const getDynamicFontSize = (name) => {
        const length = name.length;
        if (length <= 16) return 22;
        if ( 16 < length && length < 20 )  return 19;
        return 18;
      };

      const assignRandomStaff = (requestId, userId) => {
        if (staffList.length === 0) {
          Alert.alert('No staff available', 'There are no staff members available to assign.');
          return;
        }
    
        const randomIndex = Math.floor(Math.random() * staffList.length);
        const selectedStaff = staffList[randomIndex];
    
        const requestRef = ref(db, 'counsellingrequests/' + userId + '/' + requestId);
        update(requestRef, { assignedstaff: selectedStaff.id, status: 'relayed' })
          .then(() => {
            Alert.alert('Request assigned', `The request has been assigned to ${selectedStaff.name}.`);
          })
          .catch((error) => {
            Alert.alert('Error', `There was an error assigning the request: ${error.message}`);
          });
      };

  return (
    <View>
      <AppHeader />
      <View style={styles.titleView}>
        <Text style={[styles.title, { fontSize: getDynamicFontSize(request.name) }]}>{request.name}</Text>
      </View>
      <View style={styles.dateView}>
        <Text style={styles.date}>requested on {formattedDate} at {formattedTime}</Text>
      </View>
      <View style={styles.contentView}>
      <Text style={styles.contentTitle}>Notes for Counselling Request:</Text>
        <ScrollView 
          style={[styles.contentScroll, { height: contentHeight }]} 
          onContentSizeChange={onContentSizeChange}
          showsVerticalScrollIndicator={false} 
          showsHorizontalScrollIndicator={false}
        >
          <Text style={styles.content}>{request.notes}</Text>
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.buttonClose} onPress={() => {
        assignRandomStaff(request.id, request.userid)
        closeModal(false)
        }}>
        <Text style={styles.textStyle}>Pending</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    contentScroll: {
      maxHeight: 350,
    },
    titleView: {
      backgroundColor: 'white',
      margin: 20,
      marginBottom: 0,
      padding: 10,
      borderRadius: 10,
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 14,
    },
    dateView: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 10,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 14,
      },
    contentView: {
      backgroundColor: 'white',
      padding: 12,
      marginHorizontal: 15,
      borderRadius: 10,
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 14,
      maxHeight: '80%', // Ensures that the content doesn't overflow the screen height
    },
    title: {
      fontFamily: 'CantataOne-Regular',
    },
    content: {
      fontSize: 15,
    },
    contentTitle: {
        fontSize: 16,
        paddingBottom: 10,
        fontWeight: 'bold'
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    date: {
      fontSize: 12,
      color: 'grey',
      fontFamily: 'CantataOne-Regular',
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
  });

export default CounsellingDetails
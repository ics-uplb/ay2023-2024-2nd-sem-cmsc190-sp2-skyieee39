import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert  } from 'react-native'
import React, { useState, useRef } from 'react'
import AppHeader from '../../components/AppHeader'
import { useSelector } from 'react-redux';
import { db } from '../../firebase-config'; // Import your database configuration
import { set, ref } from "firebase/database";



const CounReqForm = ({ closeModal}) => {
  const [notes, setNotes] = useState(''); // State to hold the input text
  const [isFocused, setIsFocused] = useState(false);
  const textInputRef = useRef(null);
  const userId = useSelector(state => state.user.userId);
  const name = useSelector(state => state.user.userName);
  const userEmail = useSelector(state => state.user.email);

  const handleOutsideClick = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
    textInputRef.current.blur(); // Remove focus from TextInput
  };

  function sendCounsellingReq(userId, note) {
    const counselReqRef = ref(db, 'counsellingrequests/' + userId + '/' + 'request' + new Date().getTime());
    set(counselReqRef, {
      userid: userId,
      name: name,
      notes: note,
      status: 'pending',
      assignedstaff: '',
      email: userEmail,
      createdAt: new Date().toISOString()
    });

    closeModal(false)
  }

  const handleSendRequest = (userId, note) => {
    Alert.alert(
      "Confirm Request",
      "This message is to confirm that you are sending a counselling request.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () => sendCounsellingReq(userId, note),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
      <View style={{ flex: 1 }}>
        <AppHeader />
        <View style={styles.prompt}>
          <Text style={styles.textPrompt}>Send a Counselling Request.</Text>
        </View>
        <TextInput
          ref={textInputRef}
          style={styles.bodyinput}
          placeholder={isFocused ? '' : 'Enter notes for request.'}
          multiline={true}
          numberOfLines={10}
          value={notes}
          onChangeText={setNotes}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity
          style={styles.buttonClose}
          onPress={() => {
            if (notes === '') {
              Alert.alert("Notes Required", "Please enter details regarding your counselling request.")
            } else {
              handleSendRequest(userId, notes);
              setNotes('')
            }
            
          }}
        >
          <Text style={styles.textStyle}>Send Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonClose} onPress={() => closeModal(false)}>
            <Text style={styles.textStyle}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  prompt: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderRadius: 10,
    margin: 20,
    borderWidth: 3,
    borderColor: '#82c3f0'
  },
  textPrompt: {
    fontSize: 18,
    fontFamily: 'CantataOne-Regular',
    padding: 5,
  },
  input: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    width: 300,
    height: 40,
    borderColor: '#82c3f0',
    borderRadius: 8,
    borderWidth: 3,
    padding: 10,
    fontFamily: 'CantataOne-Regular'
  },
  bodyinput: {
    marginTop: 10,
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    width: 300,
    height: 40,
    borderColor: '#82c3f0',
    minHeight: 200,
    borderRadius: 8,
    borderWidth: 3,
    padding: 10,
    fontFamily: 'CantataOne-Regular',
    textAlignVertical: 'top'
  },
  buttonClose: {
    backgroundColor: "#216a8d",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20,
    marginHorizontal: 30
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default CounReqForm
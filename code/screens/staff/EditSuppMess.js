import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import React, { useState, useRef } from 'react';
import AppHeader from '../../components/AppHeader';
import { useSelector } from 'react-redux';
import { db } from '../../firebase-config'; // Import your database configuration
import { ref, update } from "firebase/database";

const EditSuppMess = ({ message, closeModal }) => {
  const [content, setContent] = useState(message.message); // assuming message object has a 'message' field
  const contentInputRef = useRef(null);
  const userId = useSelector(state => state.user.userId);
  const name = useSelector(state => state.user.userName);

  const handleOutsideClick = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
    if (contentInputRef.current) {
      contentInputRef.current.blur(); // Remove focus from content TextInput
    }
  };

  const handlePost = () => {
    if (content.trim() !== '') {
      const entryRef = ref(db, 'supportivemessages/' + userId + '/' + message.id);
      update(entryRef, {
        name,
        message: content
      }).then(() => {
        console.log("Supportive message updated successfully!");
        Alert.alert("Supportive message updated successfully!" )
        setContent(''); // Clear the content after posting
        closeModal(false);
      }).catch((error) => {
        console.error("Failed to update supportive message: ", error);
        Alert.alert("Supportive message update failed", error);
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
      <View style={{ flex: 1 }}>
        <AppHeader />
        <View style={styles.prompt}>
          <Text style={styles.textPrompt}> Edit your Supportive Message. </Text>
        </View>
        <TextInput
          ref={contentInputRef}
          style={styles.bodyinput}
          placeholder="Enter your supportive message here"
          multiline={true}
          numberOfLines={10}
          value={content}
          onChangeText={setContent}
        />
        <TouchableOpacity style={styles.buttonClose} onPress={handlePost}>
          <Text style={styles.textStyle}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonClose} onPress={() => closeModal(false)}>
          <Text style={styles.textStyle}>Back</Text>
        </TouchableOpacity>
        {/* Other components */}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  prompt: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderRadius: 10,
    margin: 30,
    borderWidth: 3,
    borderColor: '#82c3f0'
  },
  textPrompt: {
    fontSize: 18,
    fontFamily: 'CantataOne-Regular',
    padding: 5
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
    margin: 30,
    marginVertical: 15
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default EditSuppMess;

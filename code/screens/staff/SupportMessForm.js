import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback  } from 'react-native'
import React, { useState, useRef } from 'react'
import AppHeader from '../../components/AppHeader'
import { useSelector } from 'react-redux';
import { db } from '../../firebase-config'; // Import your database configuration
import { set, ref } from "firebase/database";

const SupportMessForm = () => {
  const [content, setContent] = useState('');
  const [isContentFocused, setIsContentFocused] = useState(false);
  const contentInputRef = useRef(null);
  const userId = useSelector(state => state.user.userId);
  const name = useSelector(state => state.user.userName);

  const handleOutsideClick = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
    if (contentInputRef.current) {
      contentInputRef.current.blur(); // Remove focus from content TextInput
    }
  };

  function addSupportiveMessage(userId, content) {
    const supportMessRef = ref(db, 'supportivemessages/' + userId + '/' + 'message' + new Date().getTime());
    set(supportMessRef, {
      name: name,
      message: content,
      createdAt: new Date().toISOString()
    });
  }

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
    <View style={{ flex: 1 }}>
        <AppHeader />
        <View style={styles.prompt}>
          <Text style={styles.textPrompt}> Post your Supportive Message. </Text>
        </View>
        <TextInput
          ref={contentInputRef}
          style={styles.bodyinput}
          placeholder={isContentFocused ? '' : 'Write down your message.'}
          multiline= {true}
          numberOfLines={10}
          value={content}
          onChangeText={setContent}
          onFocus={() => setIsContentFocused(true)}
          onBlur={() => setIsContentFocused(false)}
        />
        <TouchableOpacity style={styles.buttonClose} onPress={() => {
          addSupportiveMessage(userId, content)
          setContent('');
          }}>
          <Text style={styles.textStyle}>Post</Text>
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
    borderColor: '#ff9999'
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
    borderColor: '#ff9999',
    minHeight: 200,
    borderRadius: 8,
    borderWidth: 3,
    padding: 10,
    fontFamily: 'CantataOne-Regular',
    textAlignVertical: 'top'
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
  }
})

export default SupportMessForm
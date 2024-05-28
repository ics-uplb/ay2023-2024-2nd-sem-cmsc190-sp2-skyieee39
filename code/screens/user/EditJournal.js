import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { useState, useRef } from 'react';
import AppHeader from '../../components/AppHeader';
import { useSelector } from 'react-redux';
import { db } from '../../firebase-config'; // Import your database configuration
import { ref, update } from "firebase/database";
import { encryptData } from '../../security/userSecurity'; // Import your encryption utility
import Sentiment from 'sentiment';

const EditJournal = ({ journal, onSave }) => {
  const [content, setContent] = useState(journal.content); // assuming journal object has a 'content' field
  const [title, setTitle] = useState(journal.title);
  const contentInputRef = useRef(null);
  const titleInputRef = useRef(null);
  const userId = useSelector(state => state.user.userId);

  const handleOutsideClick = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
    if (titleInputRef.current) {
      titleInputRef.current.blur(); // Remove focus from title TextInput
    }
    if (contentInputRef.current) {
      contentInputRef.current.blur(); // Remove focus from content TextInput
    }
  };

  const analyzeSentiment = (text) => {
    const sentiment = new Sentiment();
    const result = sentiment.analyze(text);

    console.log('Sentiment Analysis Result:', result);

    return result;
  };

  const classifySentiment = (score) => {
    if (score > 0) {
      return 'positive';
    } else if (score < 0) {
      return 'negative';
    } else {
      return 'neutral';
    }
  };


  const handlePost = () => {
      const sentimentResult = analyzeSentiment(content);

      const sentiment = classifySentiment(sentimentResult.score);
    if (content.trim() !== '' && title.trim() !== '') {
      const entryRef = ref(db, 'journals/' + userId + '/' + journal.id);
      const encryptedContent = encryptData(content); // Encrypt the content before saving
      const updatedJournal = {
        ...journal,
        title,
        content: encryptedContent,
        sentimentScore: sentimentResult.score,
        sentiment: sentiment
      };
      update(entryRef, {
        title,
        content: encryptedContent,
        sentimentScore: sentimentResult.score,
        sentiment: sentiment
      }).then(() => {
        console.log("Journal entry updated successfully!");
        onSave(updatedJournal); // Pass the decrypted content for display
      }).catch((error) => {
        console.error("Failed to update journal entry: ", error);
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
      <View style={{ flex: 1 }}>
        <AppHeader />
        <View style={styles.prompt}>
          <Text style={styles.textPrompt}> Edit your Journal Entry. </Text>
        </View>
        <TextInput
          ref={titleInputRef}
          style={styles.input}
          placeholder="Enter journal entry title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          ref={contentInputRef}
          style={styles.bodyinput}
          placeholder="Enter your journal content here"
          multiline={true}
          numberOfLines={10}
          value={content}
          onChangeText={setContent}
        />
        <TouchableOpacity style={styles.buttonClose} onPress={handlePost}>
          <Text style={styles.textStyle}>Done</Text>
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
    margin: 30,
    borderWidth: 3,
    borderColor: '#ff9999'
  },
  textPrompt: {
    fontSize: 18,
    fontFamily: 'CantataOne-Regular',
    padding: 5
  },
  input: {
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    width: 300,
    height: 40,
    borderColor: '#ff9999',
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
});

export default EditJournal;

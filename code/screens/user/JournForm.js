import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import AppHeader from '../../components/AppHeader';
import { useSelector } from 'react-redux';
import { db } from '../../firebase-config'; // Import your database configuration
import { set, ref } from "firebase/database";
import { encryptData } from '../../security/userSecurity';
import Sentiment from 'sentiment';

const JournForm = () => {
  const [title, setTitle] = useState(''); // State to hold the input text
  const [content, setContent] = useState(''); // State to hold the input text
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isContentFocused, setIsContentFocused] = useState(false);
  const titleInputRef = useRef(null);
  const contentInputRef = useRef(null);
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

  const addJournalEntry = async (userId, title, content) => {
    try {
      const sentimentResult = analyzeSentiment(content);
      if (!sentimentResult || sentimentResult.score === undefined) {
        throw new Error('Sentiment analysis failed or returned undefined.');
      }

      const sentiment = classifySentiment(sentimentResult.score);

      const entryRef = ref(db, 'journals/' + userId + '/' + 'entry' + new Date().getTime()); // Using timestamp as a unique key for entries
      const encryptedContent = encryptData(content);
      await set(entryRef, {
        title,
        content: encryptedContent,
        sentiment: sentiment,
        sentimentScore: sentimentResult.score,
        createdAt: new Date().toISOString()
      });

      Alert.alert('Success', 'Journal entry added successfully.');
    } catch (error) {
      console.error('Error adding journal entry:', error);
      Alert.alert('Error', 'Could not add journal entry. Please try again later.');
    }
  };


  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
      <View style={{ flex: 1 }}>
        <AppHeader />
        <View style={styles.prompt}>
          <Text style={styles.textPrompt}> Tell me about your day! </Text>
        </View>
        <TextInput
          ref={titleInputRef}
          style={styles.input}
          placeholder={isTitleFocused ? '' : 'Enter journal entry title'}
          value={title}
          onChangeText={setTitle}
          onFocus={() => setIsTitleFocused(true)}
          onBlur={() => setIsTitleFocused(false)}
        />
        <TextInput
          ref={contentInputRef}
          style={styles.bodyinput}
          placeholder={isContentFocused ? '' : 'Write down your thoughts.'}
          multiline={true}
          numberOfLines={10}
          value={content}
          onChangeText={setContent}
          onFocus={() => setIsContentFocused(true)}
          onBlur={() => setIsContentFocused(false)}
        />
        <TouchableOpacity style={styles.buttonClose} onPress={async () => {
          await addJournalEntry(userId, title, content); // Ensure to use await here as well
          setTitle('');
          setContent('');
        }}>
          <Text style={styles.textStyle}>Post</Text>
        </TouchableOpacity>
        {/* Other components */}
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
    minHeight: 185,
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

export default JournForm;

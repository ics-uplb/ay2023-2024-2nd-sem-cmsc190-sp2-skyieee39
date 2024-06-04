import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert, Modal } from 'react-native';
import AppHeader from '../../components/AppHeader';
import { useSelector } from 'react-redux';
import { db } from '../../firebase-config'; // Import your database configuration
import { set, ref } from "firebase/database";
import { encryptData } from '../../security/userSecurity';
import Sentiment from 'sentiment';

const JournForm = ({ closeModal }) => {
  const [title, setTitle] = useState(''); // State to hold the input text
  const [content, setContent] = useState(''); // State to hold the input text
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isContentFocused, setIsContentFocused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detectedSentiment, setDetectedSentiment] = useState('');
  const [userSentiment, setUserSentiment] = useState('');

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

  const addJournalEntry = async (userId, title, content, sentiment) => {
    try {
      const entryRef = ref(db, 'journals/' + userId + '/' + 'entry' + new Date().getTime()); // Using timestamp as a unique key for entries
      const encryptedContent = encryptData(content);
      await set(entryRef, {
        title,
        content: encryptedContent,
        sentiment: sentiment,
        createdAt: new Date().toISOString()
      });

      Alert.alert('Success', 'Journal entry added successfully.');
    } catch (error) {
      console.error('Error adding journal entry:', error);
      Alert.alert('Error', 'Could not add journal entry. Please try again later.');
    }
  };

  const handlePost = async () => {
    const sentimentResult = analyzeSentiment(content);
    if (!sentimentResult || sentimentResult.score === undefined) {
      throw new Error('Sentiment analysis failed or returned undefined.');
    }

    const sentiment = classifySentiment(sentimentResult.score);
    setDetectedSentiment(sentiment);
    setUserSentiment(sentiment);
    setIsModalVisible(true);
  };

  const handleConfirmSentiment = async () => {
    setIsModalVisible(false);
    await addJournalEntry(userId, title, content, userSentiment);
    setTitle('');
    setContent('');
    closeModal(false);
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
        <TouchableOpacity style={styles.buttonClose} onPress={() => {
          if (content === '' || title === '') {
            Alert.alert("Content and Title Required", "Please enter journal content and/or title.")
          } else {
            handlePost();
          }
          }}>
          <Text style={styles.textStyle}>Post</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonClose} onPress={() => closeModal(false)}>
          <Text style={styles.textStyle}>Cancel</Text>
        </TouchableOpacity>
        
        <Modal
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>We detected the sentiment as {detectedSentiment}. Is this correct?</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity onPress={() => setUserSentiment('positive')}>
                  <Text style={userSentiment === 'positive' ? styles.selectedRadio : styles.radio}>Positive</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setUserSentiment('neutral')}>
                  <Text style={userSentiment === 'neutral' ? styles.selectedRadio : styles.radio}>Neutral</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setUserSentiment('negative')}>
                  <Text style={userSentiment === 'negative' ? styles.selectedRadio : styles.radio}>Negative</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmSentiment}>
                  <Text style={styles.textStyle}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    borderColor: '#82c3f0'
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
    minHeight: 185,
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
    marginTop: 30,
    marginHorizontal: 30
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  radio: {
    fontSize: 16,
    padding: 10,
  },
  selectedRadio: {
    fontSize: 16,
    padding: 10,
    fontWeight: 'bold',
    color: 'blue',
  },
  confirmButton: {
    backgroundColor: "#216a8d",
    borderRadius: 20,
    width: 130,
    padding: 10,
    elevation: 2,
  },
});

export default JournForm;

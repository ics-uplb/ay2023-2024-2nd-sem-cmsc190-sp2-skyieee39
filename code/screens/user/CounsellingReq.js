import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import CounReqForm from './CounReqForm';
import SentRequests from './SentRequests';
import Messages from './Messages';

const CounsellingReq = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedScreen, setSelectedScreen] = useState('SentRequests');
  const userId = useSelector(state => state.user.userId);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.button, selectedScreen === 'SentRequests' && styles.selectedButton]}
            onPress={() => setSelectedScreen('SentRequests')}
          >
            <Text style={[styles.buttonText, selectedScreen === 'SentRequests' && styles.selectedText]}>Sent Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedScreen === 'Messages' && styles.selectedButton]}
            onPress={() => setSelectedScreen('Messages')}
          >
            <Text style={[styles.buttonText, selectedScreen === 'Messages' && styles.selectedText]}>Messages</Text>
          </TouchableOpacity>
        </View>
        {selectedScreen === 'SentRequests' ? <SentRequests /> : <Messages />}
      </SafeAreaView>
      <TouchableOpacity 
        style={styles.floatingbutton}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name='calendar-plus' color='#FFFFFF' size={45} padding={10} />
      </TouchableOpacity>
      <SafeAreaView>
        <Modal
          animationType="slide"
          visible={modalVisible}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor:'#d9d9d9' }}>
            <CounReqForm />
            <TouchableOpacity style={styles.buttonClose} onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </View>
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
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  floatingbutton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right:15,
    bottom: 15,
    borderRadius: 45,
    backgroundColor: '#B7505C'
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
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    padding: 1,
    margin: 20,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
    borderRadius: 25,
  },
  selectedButton: {
    backgroundColor: '#ffffff',
  },
  buttonText: {
    fontSize: 15,
    color: '#888888',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#000000',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    fontSize: 20,
  },
});

export default CounsellingReq;

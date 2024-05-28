import { View, Text, StyleSheet, TouchableOpacity, Keyboard, SafeAreaView, Modal } from 'react-native';
import React, { useState, useRef } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { db } from '../../firebase-config'; // Import your database configuration
import { set, ref } from "firebase/database";
import { encryptData } from '../../security/userSecurity';
import AdminApprove from './AdminApprove';
import AdminReq from './AdminReq';
import StaffReq from './StaffReq';

const AccountReq = () => {
  const [selectedScreen, setSelectedScreen] = useState('StaffReq');
  const userId = useSelector(state => state.user.userId);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.toggleContainer}>
        <TouchableOpacity
            style={[styles.button, selectedScreen === 'StaffReq' && styles.selectedButton]}
            onPress={() => setSelectedScreen('StaffReq')}
          >
            <Text style={[styles.buttonText, selectedScreen === 'StaffReq' && styles.selectedText]}>Pending Staff</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedScreen === 'AdminReq' && styles.selectedButton]}
            onPress={() => setSelectedScreen('AdminReq')}
          >
            <Text style={[styles.buttonText, selectedScreen === 'AdminReq' && styles.selectedText]}>Pending Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedScreen === 'AdminApprove' && styles.selectedButton]}
            onPress={() => setSelectedScreen('AdminApprove')}
          >
            <Text style={[styles.buttonText, selectedScreen === 'AdminApprove' && styles.selectedText]}>Approved</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.screenContainer}>
          {selectedScreen === 'StaffReq' && <StaffReq />}
          {selectedScreen === 'AdminReq' && <AdminReq />}
          {selectedScreen === 'AdminApprove' && <AdminApprove />}
        </View>
      </SafeAreaView>
    </View>
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
    fontSize: 14,
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

export default AccountReq
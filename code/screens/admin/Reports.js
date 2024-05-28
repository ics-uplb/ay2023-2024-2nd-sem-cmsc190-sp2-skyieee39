import { View, Text, StyleSheet, TouchableOpacity, Keyboard, SafeAreaView, Modal } from 'react-native';
import React, { useState, useRef } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { db } from '../../firebase-config'; // Import your database configuration
import { set, ref } from "firebase/database";
import { encryptData } from '../../security/userSecurity';
import WeekReports from './WeekReports';
import YearReports from './YearReports';
import MonthReports from './MonthReports';

const Reports = () => {
  const [selectedScreen, setSelectedScreen] = useState('Week');
  const userId = useSelector(state => state.user.userId);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.toggleContainer}>
        <TouchableOpacity
            style={[styles.button, selectedScreen === 'Week' && styles.selectedButton]}
            onPress={() => setSelectedScreen('Week')}
          >
            <Text style={[styles.buttonText, selectedScreen === 'Week' && styles.selectedText]}>This Week</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedScreen === 'Month' && styles.selectedButton]}
            onPress={() => setSelectedScreen('Month')}
          >
            <Text style={[styles.buttonText, selectedScreen === 'Month' && styles.selectedText]}>This Month</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedScreen === 'Year' && styles.selectedButton]}
            onPress={() => setSelectedScreen('Year')}
          >
            <Text style={[styles.buttonText, selectedScreen === 'AdminApprove' && styles.selectedText]}>This Year</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.screenContainer}>
          {selectedScreen === 'Week' && <WeekReports />}
          {selectedScreen === 'Month' && <MonthReports />}
          {selectedScreen === 'Year' && <YearReports />}
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


export default Reports

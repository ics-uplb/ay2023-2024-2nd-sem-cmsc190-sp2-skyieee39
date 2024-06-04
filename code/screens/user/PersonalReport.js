import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import WeekReport from './WeekReport';
import MonthReport from './MonthReport';
import YearReport from './YearReport';

const PersonalReport = () => {
  const [selectedScreen, setSelectedScreen] = useState('WeekReport');

  const renderRadioButton = (label, value) => (
    <TouchableOpacity
      key={value}
      style={styles.radioButtonContainer}
      onPress={() => setSelectedScreen(value)}
    >
      <View style={styles.radioButton}>
        {selectedScreen === value && <View style={styles.radioButtonSelected} />}
      </View>
      <Text style={styles.radioButtonLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.radioGroup}>
        {renderRadioButton('Weekly', 'WeekReport')}
        {renderRadioButton('Monthly', 'MonthReport')}
        {renderRadioButton('Yearly', 'YearReport')}
      </View>
      <View style={styles.screenContainer}>
        {selectedScreen === 'WeekReport' && <WeekReport />}
        {selectedScreen === 'MonthReport' && <MonthReport />}
        {selectedScreen === 'YearReport' && <YearReport />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 30
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  radioButtonLabel: {
    fontSize: 16,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default PersonalReport;

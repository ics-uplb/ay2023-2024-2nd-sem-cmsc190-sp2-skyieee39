import React from 'react';
import { Header } from 'react-native-elements';
import { StyleSheet } from 'react-native';

const AppHeader = () => {
  return (
      <Header
      containerStyle={styles.headerContainer}
      placement="center"
      centerComponent={{
        text: 'UPLB Muni',
        style: styles.heading
      }}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#B7505C',  // Adjust the color to match the screenshot
    justifyContent: 'center',
    height: 100,  // Adjust based on your design requirements
    borderBottomWidth: 0,  // Removes the default border if necessary
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 35,  // Adjust font size as needed
    fontFamily: 'CantataOne-Regular'
  }
});

export default AppHeader;

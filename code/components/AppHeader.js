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
    backgroundColor: '#619aa9',  
    justifyContent: 'center',
    height: 100, 
    borderBottomWidth: 0, 
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17 
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 35,  
    fontFamily: 'CantataOne-Regular'
  }
});

export default AppHeader;

import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import React, { useState } from 'react';
import AppHeader from '../../components/AppHeader';

const JournalDetail = ({ journal }) => {
  const date = new Date(journal.createdAt);
  const formattedDate = date.toLocaleDateString(); // '5/17/2023'
  const formattedTime = date.toLocaleTimeString(); // '2:37:00 PM'

  const [contentHeight, setContentHeight] = useState(0);
  const windowHeight = useWindowDimensions().height;

  const onContentSizeChange = (width, height) => {
    if (height > 400) {
      setContentHeight(400);
    } else {
      setContentHeight(height);
    }
  };

  return (
    <View>
      <AppHeader />
      <View style={styles.titleView}>
        <Text style={styles.title}>{journal.title}</Text>
      </View>
      <View style={styles.contentView}>
        <ScrollView 
          style={[styles.contentScroll, { height: contentHeight }]} 
          onContentSizeChange={onContentSizeChange}
          showsVerticalScrollIndicator={false} 
          showsHorizontalScrollIndicator={false}
        >
          <Text style={styles.content}>{journal.content}</Text>
        </ScrollView>
        <View style={styles.dateView}>
          <Text style={styles.date}>Date: {formattedDate}</Text>
          <Text style={styles.date}>Time: {formattedTime}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentScroll: {
    maxHeight: 400,
  },
  titleView: {
    backgroundColor: 'white',
    margin: 20,
    padding: 10,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
  },
  contentView: {
    backgroundColor: 'white',
    padding: 12,
    marginHorizontal: 15,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    maxHeight: '80%', // Ensures that the content doesn't overflow the screen height
  },
  title: {
    fontSize: 25,
    fontFamily: 'CantataOne-Regular',
    textAlign: 'center',
  },
  content: {
    fontSize: 17,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  dateView: {
    marginVertical: 10
  },
  date: {
    fontSize: 12,
    color: 'grey'
  }
});

export default JournalDetail;

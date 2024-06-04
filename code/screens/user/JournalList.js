import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { db } from '../../firebase-config';
import { ref, onValue, remove } from "firebase/database";
import JournForm from './JournForm';
import JournalDetail from './JournalDetail';
import EditJournal from './EditJournal';
import { decryptData } from '../../security/userSecurity';

const Journaling = () => {
  const userId = useSelector(state => state.user.userId);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [journModalVisible, setJournModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [userJournals, setUserJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    const journalRef = ref(db, 'journals/' + userId);
    const unsubscribe = onValue(journalRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const journalsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          content: decryptData(data[key].content)
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUserJournals(journalsArray);
      }
      setLoading(false); // Set loading to false after journals are fetched
    }, {
      onlyOnce: false
    });

    return () => unsubscribe();
  }, [userId]);

  const confirmDeleteJournal = (journalId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this journal?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => handleDeleteJournal(journalId),
          style: "destructive"
        }
      ]
    );
  };

  const handleDeleteJournal = (journalId) => {
    const journalRef = ref(db, 'journals/' + userId + '/' + journalId);
    remove(journalRef)
      .then(() => {
        console.log('Journal deleted successfully');
        setUserJournals(prevJournals => prevJournals.filter(journal => journal.id !== journalId))
      })
      .catch((error) => {
        console.error('Failed to delete journal: ', error);
      });
  };

  const handleEditJournal = (journal) => {
    setSelectedJournal(journal);
    setEditModalVisible(true);
  };

  const handleUpdateJournal = (updatedJournal) => {
    const decryptedJournal = {
      ...updatedJournal,
      content: decryptData(updatedJournal.content)
    };
    setUserJournals(prevJournals => 
      prevJournals.map(journal => 
        journal.id === decryptedJournal.id ? decryptedJournal : journal
      )
    );
    setEditModalVisible(false);
  };

  const getDynamicFontSize = (name) => {
    const length = name.length;
    if (length <= 16) return 22;
    if ( 16 < length && length < 20 )  return 18;
    return 17;
  };

  const getHighlightColor = (sentiment) => {
    if (sentiment === 'positive') return styles.positiveTitle;
    if (sentiment ==='negative') return styles.negativeTitle;
    return styles.neutralTitle;
  };

  const handleFilter = (selectedFilter) => {
    setFilter(filter === selectedFilter ? null : selectedFilter);
  };
  

  const filteredJournals = filter ? userJournals.filter(journal => journal.sentiment === filter) : userJournals;

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => handleFilter('positive')}>
          <Text style={[styles.filterButton, filter === 'positive' && styles.activeFilter]}>Positive</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilter('negative')}>
          <Text style={[styles.filterButton, filter === 'negative' && styles.activeFilter]}>Negative</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilter('neutral')}>
          <Text style={[styles.filterButton, filter === 'neutral' && styles.activeFilter]}>Neutral</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#216a8d" />
      ) : filteredJournals.length === 0 ? (
        <Text style={{alignItems: 'center', justifyContent: 'center'}}>No journal entries</Text>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          showsHorizontalScrollIndicator={false}
        >
          {filteredJournals.map((journal, index) => {
            const highlightStyle = getHighlightColor(journal.sentiment);
            return (
              <TouchableOpacity key={index} onPress={() => {
                setSelectedJournal(journal);
                setJournModalVisible(true);
              }}>
                <View style={styles.card}>
                  <View style={styles.header}>
                    <Text style={[styles.title, highlightStyle, { fontSize: getDynamicFontSize(journal.title) }]}>{journal.title}</Text>
                    <View style={styles.updateButtons}>
                      <TouchableOpacity onPress={() => handleEditJournal(journal)}>
                        <MaterialCommunityIcons name='pencil' color='black' size={25} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => confirmDeleteJournal(journal.id)}>
                        <MaterialCommunityIcons name='delete' color='black' size={25} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.content}>
                    <Text style={styles.text}>
                      {journal.content.length > 85 ? journal.content.substring(0, 85) + '...' : journal.content}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
      <TouchableOpacity 
        style={styles.floatingbutton}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name='plus-circle' color='#216a8d' size={80} />
      </TouchableOpacity>
      <SafeAreaView>
        <Modal
          animationType="slide"
          visible={modalVisible}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor:'#d9d9d9' }}>
            <JournForm closeModal={setModalVisible}/>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
      <SafeAreaView>
        <Modal
          animationType="slide"
          visible={journModalVisible}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor:'#d9d9d9' }}>
            {selectedJournal && (
              <JournalDetail 
                journal={selectedJournal} 
                closeModal={setJournModalVisible}
              />
            )}
            <TouchableOpacity style={styles.buttonClose} onPress={() => setJournModalVisible(false)}>
              <Text style={styles.textStyle}>Back</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
        <Modal
          animationType="slide"
          visible={editModalVisible}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: '#d9d9d9' }}>
            {selectedJournal && (
              <EditJournal 
                journal={selectedJournal}
                onSave={handleUpdateJournal}
                closeModal={setEditModalVisible}
              />
            )}
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#216a8d',
    color: '#216a8d',
    marginHorizontal: 15,
  },
  activeFilter: {
    backgroundColor: '#216a8d',
    color: '#fff',
  },
  floatingbutton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: -20,
    bottom: 5,
  },
  updateButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -1,
  },
  positiveTitle: {
    backgroundColor: 'rgba(212, 237, 218, 0.9)',
  },
  negativeTitle: {
    backgroundColor: 'rgba(255, 158, 84, 0.5)'
  },
  neutralTitle: {
    backgroundColor: 'rgba(255, 245, 56, 0.5)',
  },
  buttonClose: {
    backgroundColor: "#216a8d",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    marginHorizontal: 30,
    marginBottom: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 18,
    shadowColor: 'black',
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    width: 300,
    height: 140,
    margin: 20
  },
  header: {
    marginBottom: 16,
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 25,
    fontFamily: 'CantataOne-Regular',
    color: 'black',
    width: 180,
  },
  content: {
    marginBottom: 10,
    paddingBottom: 20,
  },
  text: {
    fontSize: 15,
    color: '#444444',
    paddingBottom: 15
  },
});

export default Journaling;

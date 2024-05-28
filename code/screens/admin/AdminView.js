import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal } from 'react-native'
import React, {useState} from 'react'
import {AccountReq, CounsellingReqAdmin, Reports, StaffMessDB, AdProfile} from './index';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../../components/AppHeader';
import StatusBar from '../../components/StatusBar';

const tabScreens = [
  {
    name: 'Admin Requests',
    component: AccountReq,
    icon: 'account-multiple-plus',
    label: 'Account Requests'
  },
  {
    name: 'Counselling Requests',
    component: CounsellingReqAdmin,
    icon: 'clipboard-text-clock',
    label: 'Counselling Requests'
  },
  {
    name: 'User Reports',
    component: Reports,
    icon: 'calendar-check',
    label: 'User Reports',
  },
  {
    name: 'Supportive Messages',
    component: StaffMessDB,
    icon: 'message-text',
    label: 'Supportive Messages'
  },
  // Add more screens as needed
];

const AdminView = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
        <AppHeader style={styles.header} />
        <SafeAreaView style={styles.icon}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <MaterialCommunityIcons name="account-circle" color="#fff" size={40} />
          </TouchableOpacity>
        </SafeAreaView>
        <StatusBar components={tabScreens} />
        <SafeAreaView>
          <Modal
            animationType="slide"
            visible={modalVisible}
          >
          <SafeAreaView style={styles.modalContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
              <MaterialCommunityIcons name="arrow-left" color="#fff" size={30} />
            </TouchableOpacity>
            <View style={{ flex: 1, width: '100%' }}>
              <AdProfile />
            </View>
          </SafeAreaView>
          </Modal>
        </SafeAreaView>
        {/* Other components */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position:'relative'
  },
  icon:{
    position: 'absolute',
    top: 42,
    left: 20,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 35,
    left: 20,
    zIndex: 1
  },
});

export default AdminView
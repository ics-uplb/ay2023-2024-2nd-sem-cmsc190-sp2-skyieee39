// SupportMessUser.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppHeader from '../../components/AppHeader';
import StatusBar from '../../components/StatusBar';
import {Profile, SupportiveMessages, CounsellingReq, Journaling} from './index';

const tabScreens = [
  {
    name: 'Profile',
    component: Profile,
    icon: 'account-circle',
    label: 'Profile'
  },
  {
    name: 'Supportive Messages',
    component: SupportiveMessages,
    icon: 'message-text',
    label: 'Supportive Messages'
  },
  {
    name: 'Counselling',
    component: CounsellingReq,
    icon: 'calendar-check',
    label: 'Counselling Requests',
  },
  {
    name: 'Journal Logs',
    component: Journaling,
    icon: 'notebook-multiple',
    label: 'Journal Logs',
  },
  // Add more screens as needed
];

const UserView = ({ navigation }) => {
    return (
        <View style={{ flex: 1 }}>
          <AppHeader />
          <StatusBar components={tabScreens} />
          {/* Other components */}
        </View>
    );
}

export default UserView;

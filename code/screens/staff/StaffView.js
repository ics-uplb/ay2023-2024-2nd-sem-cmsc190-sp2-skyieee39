import { View } from 'react-native'
import React, {useState} from 'react'
import { Counselling, StaffProfile, StaffSupportMess, SupportMess } from './index';
import AppHeader from '../../components/AppHeader';
import StatusBar from '../../components/StatusBar';

const tabScreens = [
  {
    name: 'Profile',
    component: StaffProfile,
    icon: 'account-circle',
    label: 'Profile'
  },
  {
    name: 'Supportive Messages',
    component: SupportMess,
    icon: 'message-text',
    label: 'Supportive Messages'
  },
  {
    name: 'Counselling Chats',
    component: Counselling,
    icon: 'chat',
    label: 'Counselling Chats',
  },
  {
    name: 'My Supportive Messages',
    component: StaffSupportMess,
    icon: 'notebook',
    label: 'My Supportive Messages'
  },
  // Add more screens as needed
];

const StaffView = () => {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader />
      <StatusBar components={tabScreens} />
    </View>
  )
}

export default StaffView
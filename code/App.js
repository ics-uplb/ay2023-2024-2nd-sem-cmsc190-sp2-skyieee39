import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import AdminView from './screens/admin/AdminView';
import UserView from './screens/user/UserView';
import StaffView from './screens/staff/StaffView';
import { Provider } from 'react-redux';
import { store } from './store/store';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LogBox } from 'react-native';

const Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs(true);

function App() {

  useEffect(() => {
    const signOutUser = async () => {
      try {
        await auth().signOut();
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        console.log('User signed out on app reload');
      } catch (error) {
        console.error('Error signing out user:', error);
      }
    };
    signOutUser();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{
            headerShown: false  
          }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Admin" component={AdminView} />
          <Stack.Screen name="Staff" component={StaffView} />
          <Stack.Screen name="User" component={UserView} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;

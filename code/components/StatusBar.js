import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

const StatusBar = ({ components }) => {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        activeColor="#f0edf6"
        inactiveColor="#4e2025"
        barStyle={{ backgroundColor: '#B7505C', 
        paddingBottom: 8
        }}
      >
        {components.map((screen) => (
          <Tab.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={{
              tabBarLabel: screen.label,
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name={screen.icon} color={color} size={26} />
              ),
            }}
          />
        ))}
      </Tab.Navigator>
    );
}

export default StatusBar;
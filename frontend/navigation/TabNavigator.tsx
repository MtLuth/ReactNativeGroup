import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen, SettingScreen} from '../screen';
import {Icon} from 'react-native-elements';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          tabBarLabel: 'Setting',
          tabBarIcon: ({color, size}) => (
            <Icon name="gear" type="font-awesome" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

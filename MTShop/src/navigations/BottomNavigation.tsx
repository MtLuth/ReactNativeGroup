import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import {Icon} from 'react-native-elements';
import ProfileScreen from '../screens/user/ProfileScreen';
import NotificationsScreen from '../screens/notification/NotificationsScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({color, size}) => {
          let iconName = 'home';
          if (route.name === 'Home') {
            iconName = 'home';
          }
          if (route.name === 'Profile') {
            iconName = 'user';
          }
          if (route.name === 'Notification') {
            iconName = 'bell';
          }

          return (
            <Icon
              name={iconName}
              type="font-awesome"
              color={color}
              size={size}
            />
          );
        },
        tabBarActiveTintColor: '#05294B',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {paddingBottom: 5, height: 60},
        tabBarLabelStyle: {fontSize: 12},
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Notification" component={NotificationsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

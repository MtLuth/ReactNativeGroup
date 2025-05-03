import React from 'react';
import {View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import type {BottomTabBarButtonProps} from '@react-navigation/bottom-tabs';

import NotificationsScreen from '../screens/notification/NotificationsScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import CartScreen from '../screens/cart/CartScreen.tsx';
import HomeStackNavigator from './HomeStackNavigator.tsx';
import IconWithBadge from '../components/icons/IconWithBadge.tsx';
import {useBadgeCount} from '../hooks/useBadgeCountHooks.ts';
import {showSuccessToast} from '../utils/toast.tsx';
import {useCart} from '../context/CartContext.tsx';
import OrderTrackingScreen from '../screens/order/OrderTrackingScreen.tsx';

const Tab = createBottomTabNavigator();

const CustomTabBarButton: React.FC<BottomTabBarButtonProps> = ({
  children,
  onPress,
}) => (
  <View style={styles.absoluteCenterContainer}>
    <TouchableOpacity
      style={styles.customButton}
      onPress={onPress}
      activeOpacity={0.9}>
      {children}
    </TouchableOpacity>
  </View>
);

export default function BottomTabNavigator() {
  const {cartCount} = useCart();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#05294B',
        tabBarInactiveTintColor: '#777',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({color}) => (
            <Icon name="home" type="feather" color={color} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Thông báo',
          tabBarLabel: 'Thông báo',
          tabBarIcon: ({color}) => (
            <Icon name="bell" type="feather" color={color} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: () => (
            <IconWithBadge
              iconName="shopping-cart"
              iconType="feather"
              badgeCount={cartCount}
              iconStyle={{
                marginLeft: -2,
              }}
            />
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
          tabBarLabel: '',
        }}
      />

      <Tab.Screen
        name="OrderHistory"
        component={OrderTrackingScreen}
        options={{
          title: 'Đơn hàng',
          tabBarLabel: 'Đơn hàng',
          tabBarIcon: ({color}) => (
            <Icon
              name="document-text-outline"
              type="ionicon"
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Hồ sơ',
          tabBarLabel: 'Hồ sơ',
          tabBarIcon: ({color}) => (
            <Icon name="user" type="feather" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 8,
    elevation: 5,
  },

  tabBarItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  absoluteCenterContainer: {
    position: 'absolute',
    top: -10,
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
  },
  customButton: {
    width: 60,
    height: 60,
    paddingTop: 15,
    borderRadius: 35,
    backgroundColor: '#002D4C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});

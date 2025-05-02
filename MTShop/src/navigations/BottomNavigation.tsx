import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import NotificationsScreen from '../screens/notification/NotificationsScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import CartScreen from "../screens/cart/CartScreen.tsx";
import SearchScreen from "../screens/product/ProductSearchScreen.tsx";

const NullScreen = () => null;

const Tab = createBottomTabNavigator();

const CustomTabBarButton: React.FC<BottomTabBarButtonProps> = ({ children, onPress }) => (
    <View style={styles.absoluteCenterContainer}>
        <TouchableOpacity
            style={styles.customButton}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {children}
        </TouchableOpacity>
    </View>
);

export default function BottomTabNavigator() {
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
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Trang chủ',
                    tabBarIcon: ({ color }) => (
                        <Icon name="home" type="font-awesome" color={color} size={24} />
                    ),
                }}
            />

            <Tab.Screen
                name="Wishlist"
                component={NotificationsScreen}
                options={{
                    title: 'Thông báo',
                    tabBarLabel: 'Thông báo',
                    tabBarIcon: ({ color }) => (
                        <Icon name="bell" type="font-awesome" color={color} size={24} />
                    ),
                }}
            />

            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    tabBarIcon: () => (
                        <Icon name="shopping-cart" type="font-awesome" color="#fff" size={26} />
                    ),
                    tabBarButton: props => <CustomTabBarButton {...props} />,
                    tabBarLabel: '',
                }}
            />

            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    tabBarLabel: 'Tìm kiếm',
                    tabBarIcon: ({ color }) => (
                        <Icon name="search" type="font-awesome" color={color} size={24} />
                    ),
                }}
            />

            <Tab.Screen
                name="Setting"
                component={ProfileScreen}
                options={{
                    title: 'Hồ sơ',
                    tabBarLabel: 'Hồ sơ',
                    tabBarIcon: ({ color }) => (
                        <Icon name="user" type="font-awesome" color={color} size={24} />
                    ),
                }}
            />
        </Tab.Navigator>

    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 20 : 10,
        left: 20,
        right: 20,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 30,
        elevation: 5,
        paddingHorizontal: 10,
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
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
});

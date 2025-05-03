import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
// import ProductFilterScreen from '../screens/product/ProductFilterScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      {/* <Stack.Screen name="ProductFilter" component={ProductFilterScreen} /> */}
    </Stack.Navigator>
  );
}

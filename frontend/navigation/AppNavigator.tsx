import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {OnboardScreen, SplashScreen} from '../screen';
import TabNavigator from './TabNavigator';
import AuthNavigator from './AuthNavigator';
import Toast from 'react-native-toast-message';
export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Auth: undefined;
  Onboard: undefined;
  Tab: undefined;
  ProductDetail: {productId: string};
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Onboard"
            component={OnboardScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Tab"
            component={TabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
};

export default AppNavigator;

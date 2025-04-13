import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import Config from 'react-native-config';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignupScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import axios from 'axios';
import Toast, {BaseToastProps, ToastConfig} from 'react-native-toast-message';
import {StyleSheet, Text, View} from 'react-native';
import {appColors} from './src/themes/appColors';
import VerifyOTPScreen from './src/screens/auth/VerifyOTPScreen';

console.log('API URL:', Config.API_URL);
axios.defaults.baseURL = Config.API_URL;
const Stack = createStackNavigator();

const App = () => {
  const toastConfig: ToastConfig = {
    // eslint-disable-next-line react/no-unstable-nested-components
    success: (props: BaseToastProps) => (
      <View style={[styles.toastContainer, styles.toastSuccess]}>
        <Text style={styles.toastText}>{props.text2}</Text>
      </View>
    ),

    // eslint-disable-next-line react/no-unstable-nested-components
    error: (props: BaseToastProps) => (
      <View style={[styles.toastContainer, styles.toastError]}>
        <Text style={styles.toastText}>{props.text2}</Text>
      </View>
    ),
  };
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
      <Toast position="bottom" config={toastConfig} />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  toastText: {
    color: 'white',
    fontSize: 16,
  },
  toastSuccess: {
    backgroundColor: appColors.success,
  },
  toastError: {
    backgroundColor: appColors.error,
  },
});

export default App;

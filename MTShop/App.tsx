import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './src/screens/SplashScreen';
import Config from 'react-native-config';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignupScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import axios from 'axios';
import Toast, {BaseToastProps, ToastConfig} from 'react-native-toast-message';
import {StyleSheet, Text, View} from 'react-native';
import {appColors} from './src/themes/appColors';
import VerifyOTPScreen from './src/screens/auth/VerifyOTPScreen';
import BottomTabNavigator from './src/navigations/BottomNavigation';
import ProductDetailScreen from './src/screens/product/ProductDetailScreen';
import CartScreen from './src/screens/cart/CartScreen';
import OrderTrackingScreen from './src/screens/order/OrderTrackingScreen.tsx';
import OrderScreen from './src/screens/order/OrderScreen.tsx';
import OrderDetailScreen from './src/screens/order/OrderDetailScreen';
import ReviewScreen from './src/screens/review/ReviewScreen';
import Onboarding from './src/screens/Onboarding';
import ResetPasswordScreen from './src/screens/auth/ResetPasswordScreen';
import AdminTabSlide from './src/screens/dashboard/navigation/AdminTabSlide.tsx';
import ProductFilterScreen from './src/screens/product/ProductFilterScreen.tsx';
import {CartProvider} from './src/context/CartContext.tsx';
import ProfileDetailScreen from './src/screens/user/ProfileDetailScreen.tsx';
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
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
          <Stack.Screen name="Main" component={BottomTabNavigator} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="ProductFilter" component={ProductFilterScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Order" component={OrderScreen} />
          <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
          <Stack.Screen name="Review" component={ReviewScreen} />
          <Stack.Screen name="DashboardScreen" component={AdminTabSlide} />
          <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
        </Stack.Navigator>
        <Toast position="bottom" config={toastConfig} />
      </NavigationContainer>
    </CartProvider>
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

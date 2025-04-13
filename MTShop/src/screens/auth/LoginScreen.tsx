import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import InputComponent from '../../components/InputComponent';
import {AuthStyle} from '../../styles/authStyle';
import {Style} from '../../styles/style';
import axios from 'axios';
import {appColors} from '../../themes/appColors';
import {showErrorToast} from '../../utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateInputs = () => {
    let valid = true;

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!email.includes('@')) {
      setEmailError('Please enter a valid email');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const onSingInButtonPress = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });
      const accessToken = response.data?.accessToken;
      if (accessToken) {
        await AsyncStorage.setItem('accessToken', accessToken);
        navigation.navigate('Home');
      } else {
        showErrorToast('Login failed. Token not found.');
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        showErrorToast(error.response?.data.message || 'Login failed');
      } else {
        showErrorToast('Unexpected error occurred');
      }
    }
  };

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  const onForgotPasswordPress = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <ScrollView style={Style.container}>
      <View style={Style.headerContainer}>
        <Image
          source={require('../../assets/logo.png')}
          resizeMode="cover"
          style={Style.logo}
        />
      </View>

      <View style={AuthStyle.containerSecondary}>
        <Text style={Style.title}>Login</Text>
        <InputComponent
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          error={emailError}
        />
        <InputComponent
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={passwordError}
        />
        <View style={AuthStyle.actionContainer}>
          <TouchableOpacity onPress={onForgotPasswordPress}>
            <Text style={AuthStyle.actionText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View style={Style.flexContainer}>
          <TouchableOpacity
            style={[Style.button, Style.buttonPrimary]}
            onPress={onSingInButtonPress}>
            <Text style={Style.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[Style.button, Style.buttonSecondary]}
            onPress={onSignUpPress}>
            <Text style={Style.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={Style.footerContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={appColors.primary} />
        ) : (
          ''
        )}
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

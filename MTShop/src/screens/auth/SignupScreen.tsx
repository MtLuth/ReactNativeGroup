import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import InputComponent from '../../components/InputComponent';
import {AuthStyle} from '../../styles/authStyle';
import {Style} from '../../styles/style';
import axios from 'axios';
import {showErrorToast} from '../../utils/toast';
import AuthMainContainerComponent from '../../components/AuthMainContainerComponent';

const SignUpScreen = ({navigation}: {navigation: any}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  const validateInputs = () => {
    let valid = true;

    if (!fullName.trim()) {
      setNameError('Full name is required');
      valid = false;
    } else {
      setNameError('');
    }

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
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required');
      valid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    return valid;
  };

  const onSignUpButtonPress = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      await axios.post('/auth/register', {
        email,
        password,
        confirmPassword,
        fullName,
      });

      setLoading(false);
      navigation.navigate('VerifyOTP', {email});
    } catch (error: any) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        showErrorToast(error.response?.data?.message || 'Registration failed');
      } else {
        showErrorToast('Something went wrong.');
      }
    }
  };

  const onSignInPress = () => {
    navigation.navigate('Login');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
        <AuthMainContainerComponent title="Create an account">
          <View style={AuthStyle.containerSecondary}>
            <InputComponent
              placeholder="Email"
              value={email}
              onChangeText={value => {
                setEmail(value);
                setEmailError('');
              }}
              leftIcon={
                <Image source={require('../../assets/images/user.png')} />
              }
              keyboardType="email-address"
              error={emailError}
            />

            <InputComponent
              placeholder="Full Name"
              value={fullName}
              onChangeText={value => {
                setFullName(value);
                setNameError('');
              }}
              leftIcon={
                <Image source={require('../../assets/images/id-card.png')} />
              }
              error={nameError}
            />

            <InputComponent
              placeholder="Password"
              value={password}
              onChangeText={value => {
                setPassword(value);
                setPasswordError('');
              }}
              secureTextEntry
              leftIcon={
                <Image source={require('../../assets/images/lock.png')} />
              }
              error={passwordError}
            />

            <InputComponent
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={value => {
                setConfirmPassword(value);
                setConfirmPasswordError('');
              }}
              secureTextEntry
              leftIcon={
                <Image source={require('../../assets/images/lock.png')} />
              }
              error={confirmPasswordError}
            />
            <InputComponent
              placeholder="Phone number"
              value={''}
              onChangeText={() => {}}
              leftIcon={
                <Image source={require('../../assets/images/phone.png')} />
              }
              keyboardType="phone-pad"
            />

            <View style={AuthStyle.actionContainer}>
              <TouchableOpacity
                onPress={onSignInPress}
                style={{alignSelf: 'flex-end'}}>
                <Text style={AuthStyle.actionText}>
                  Already have an account?
                </Text>
              </TouchableOpacity>
            </View>

            <View style={Style.flexContainer}>
              <TouchableOpacity
                style={[Style.button, Style.buttonPrimary]}
                onPress={onSignUpButtonPress}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={Style.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </AuthMainContainerComponent>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SignUpScreen;

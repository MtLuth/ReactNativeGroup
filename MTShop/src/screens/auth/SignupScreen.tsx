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
        <ScrollView
          style={Style.container}
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          <View style={Style.headerContainer}>
            <Image
              source={require('../../assets/logo.png')}
              resizeMode="cover"
              style={Style.logo}
            />
          </View>
          <View style={AuthStyle.containerSecondary}>
            <Text style={Style.title}>Sign Up</Text>

            <InputComponent
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={value => {
                setFullName(value);
                setNameError('');
              }}
              error={nameError}
            />

            <InputComponent
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={value => {
                setEmail(value);
                setEmailError('');
              }}
              keyboardType="email-address"
              error={emailError}
            />

            <InputComponent
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={value => {
                setPassword(value);
                setPasswordError('');
              }}
              secureTextEntry
              error={passwordError}
            />

            <InputComponent
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={value => {
                setConfirmPassword(value);
                setConfirmPasswordError('');
              }}
              secureTextEntry
              error={confirmPasswordError}
            />

            <View style={AuthStyle.actionContainer}>
              <TouchableOpacity onPress={onSignInPress}>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SignUpScreen;

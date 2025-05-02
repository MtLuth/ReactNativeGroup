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
import {setItem} from '../../utils/storage';
import AuthMainContainerComponent from '../../components/AuthMainContainerComponent';
import AuthButton from '../../components/buttons/AuthButton';

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
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });
      const accessToken = response.data?.token;
      if (accessToken) {
        setItem('accessToken', accessToken);
        navigation.navigate('Main');
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
    <AuthMainContainerComponent title="Welcome Back!">
      <View style={AuthStyle.containerSecondary}>
        <InputComponent
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          leftIcon={<Image source={require('../../assets/images/user.png')} />}
          error={emailError}
        />
        <InputComponent
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          leftIcon={<Image source={require('../../assets/images/lock.png')} />}
          secureTextEntry
          error={passwordError}
        />
        <View style={AuthStyle.actionContainer}>
          <TouchableOpacity
            onPress={onForgotPasswordPress}
            style={{alignSelf: 'flex-end'}}>
            <Text style={AuthStyle.actionText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        <View style={Style.flexContainer}>
          {/* <TouchableOpacity
            style={[Style.button, Style.buttonPrimary]}
            onPress={onSingInButtonPress}>
            <Text style={Style.buttonText}>Login</Text>
          </TouchableOpacity> */}
          <AuthButton text="Đăng nhập" onPress={onSingInButtonPress} />
          <View style={AuthStyle.subActionContainer}>
            <Text style={AuthStyle.subActionText}>Bạn chưa có tài khoản?</Text>
            <TouchableOpacity onPress={onSignUpPress}>
              <Text
                style={[AuthStyle.subActionText, AuthStyle.textTouchOpacity]}>
                Đăng ký
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={Style.footerContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={appColors.primary} />
        ) : (
          ''
        )}
      </View>
    </AuthMainContainerComponent>
  );
};

export default LoginScreen;

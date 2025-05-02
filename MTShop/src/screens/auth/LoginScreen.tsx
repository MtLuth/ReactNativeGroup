import axios from 'axios';
import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import AuthButton from '../../components/buttons/AuthButton';
import AuthMainContainerComponent from '../../components/container/AuthMainContainerComponent';
import InputComponent from '../../components/InputComponent';
import {AuthStyle} from '../../styles/authStyle';
import {Style} from '../../styles/style';
import {setItem} from '../../utils/storage';
import {showErrorToast} from '../../utils/toast';

const LoginScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateInputs = () => {
    let valid = true;

    if (!email) {
      setEmailError('Vui lòng nhập email');
      valid = false;
    } else if (!email.includes('@')) {
      setEmailError('Enmail không hợp lệ');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu');
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
      const userRole    = response.data?.role;
      if (accessToken) {
        setItem('accessToken', accessToken);
        setItem('role', userRole);
        navigation.navigate('Main');
      } else {
        showErrorToast('Đăng nhập thất bại');
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        showErrorToast(error.response?.data.message || 'Đăng nhập thất bại');
      } else {
        showErrorToast('Lỗi không xác định');
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
          placeholder="Mật khẩu"
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
          <AuthButton
            text="Đăng nhập"
            onPress={onSingInButtonPress}
            loading={loading}
          />
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
    </AuthMainContainerComponent>
  );
};

export default LoginScreen;

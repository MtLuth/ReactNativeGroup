/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthButton from '../../components/buttons/AuthButton';
import AuthMainContainerComponent from '../../components/container/AuthMainContainerComponent';
import InputComponent from '../../components/InputComponent';
import {AuthStyle} from '../../styles/authStyle';
import {Style} from '../../styles/style';
import {appColors} from '../../themes/appColors';
import {appFonts} from '../../themes/appFont';
import {showErrorToast} from '../../utils/toast';

const SignUpScreen = ({navigation}: {navigation: any}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validateInputs = () => {
    let valid = true;

    if (!fullName.trim()) {
      setNameError('Vui lòng nhập tên đầy đủ');
      valid = false;
    } else {
      setNameError('');
    }

    if (!email) {
      setEmailError('Vui lòng nhập email');
      valid = false;
    } else if (!email.includes('@')) {
      setEmailError('Vui lòng nhập email hợp lệ');
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
    if (!confirmPassword) {
      setConfirmPasswordError('Vui lòng nhập lại mật khẩu');
      valid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Mật khẩu không khớp');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (!phone.trim()) {
      setPhoneError('Vui lòng nhập số điện thoại');
      valid = false;
    } else if (!/^[0-9]{9,11}$/.test(phone)) {
      setPhoneError('Số điện thoại không hợp lệ');
      valid = false;
    } else {
      setPhoneError('');
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
      navigation.navigate('VerifyOTP', {email, prevAction: 'register'});
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
            placeholder="Họ và tên"
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
            placeholder="Mật khẩu"
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
            placeholder="Nhập lại mật khẩu"
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
            placeholder="Số điện thoại"
            value={phone}
            onChangeText={value => {
              setPhone(value);
              setPhoneError('');
            }}
            leftIcon={
              <Image source={require('../../assets/images/phone.png')} />
            }
            keyboardType="phone-pad"
            error={phoneError}
          />

          <View style={AuthStyle.actionContainer}>
            <Text
              style={[
                AuthStyle.actionText,
                {
                  textAlign: 'justify',
                },
              ]}>
              Bằng cách nhấn nút{' '}
              <Text
                style={{
                  fontFamily: appFonts.MontserratBold,
                  color: appColors.primary,
                }}>
                Đăng ký
              </Text>
              , bạn đồng ý với điều khoản của chúng tôi
            </Text>
          </View>

          <View style={Style.flexContainer}>
            <AuthButton
              text="Đăng ký"
              onPress={onSignUpButtonPress}
              loading={loading}
            />
            <View style={AuthStyle.subActionContainer}>
              <Text style={AuthStyle.subActionText}>Đã có tài khoản?</Text>
              <TouchableOpacity onPress={onSignInPress}>
                <Text
                  style={[AuthStyle.subActionText, AuthStyle.textTouchOpacity]}>
                  Đăng nhập
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </AuthMainContainerComponent>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

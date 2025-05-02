import axios from 'axios';
import React, {useState} from 'react';
import {Image, Text, View} from 'react-native';
import AuthButton from '../../components/buttons/AuthButton';
import AuthMainContainerComponent from '../../components/container/AuthMainContainerComponent';
import InputComponent from '../../components/InputComponent';
import {AuthStyle} from '../../styles/authStyle';
import {Style} from '../../styles/style';

const ForgotPasswordScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const onVerifyButtonPress = async () => {
    console.log('Axios base URL:', axios.defaults.baseURL);
    if (!email.trim()) {
      setEmailError('Vui lòng nhập email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Email không hợp lệ');
      return;
    }
    setEmailError('');
    setLoading(true);
    try {
      const res = await axios.post('/auth/send-otp', {
        email,
      });
      console.log('Reset password response:', res.data);
      setLoading(false);
      navigation.navigate('VerifyOTP', {
        email,
        prevAction: 'forgotPassword',
      });
    } catch (error) {
      setLoading(false);
      console.error('Error resetting password:', error);
      if (axios.isAxiosError(error)) {
        setEmailError(error.response?.data?.message || 'Đã xảy ra lỗi');
      } else {
        setEmailError('Đã xảy ra lỗi');
      }
    }
  };

  return (
    <AuthMainContainerComponent title="Forgot Password?">
      <View style={AuthStyle.containerSecondary}>
        <InputComponent
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          leftIcon={
            <Image source={require('../../assets/images/envelope.png')} />
          }
          keyboardType="email-address"
          error={emailError}
        />
        <View style={AuthStyle.actionContainer}>
          <Text
            style={[
              AuthStyle.actionText,
              {
                textAlign: 'left',
              },
            ]}>
            Chúng tôi sẽ gữi mã OTP đến email của bạn
          </Text>
        </View>

        <View style={Style.flexContainer}>
          <AuthButton
            text="Xác nhận"
            onPress={onVerifyButtonPress}
            loading={loading}
          />
        </View>
      </View>
    </AuthMainContainerComponent>
  );
};

export default ForgotPasswordScreen;

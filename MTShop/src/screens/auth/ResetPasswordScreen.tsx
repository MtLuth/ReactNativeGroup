import axios from 'axios';
import React, {useState} from 'react';
import {Image, View} from 'react-native';
import AuthButton from '../../components/buttons/AuthButton';
import AuthMainContainerComponent from '../../components/container/AuthMainContainerComponent';
import InputComponent from '../../components/InputComponent';
import {AuthStyle} from '../../styles/authStyle';
import {Style} from '../../styles/style';
import {showErrorToast} from '../../utils/toast';

const ResetPasswordScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const {email} = route.params;
  const onResetPasswordPress = async () => {
    console.log('Resetting password...');
    if (!password.trim()) {
      setPasswordError('Vui lòng nhập mật khẩu');
    } else {
      setPasswordError('');
    }
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Vui lòng nhập lại mật khẩu');
    } else {
      setConfirmPasswordError('');
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu không khớp');
    } else {
      setConfirmPasswordError('');
    }
    setLoading(true);
    try {
      const res = await axios.put('/auth/reset-password', {
        email,
        password,
      });
      console.log('Reset password response:', res.data);
      setLoading(false);
      navigation.navigate('Login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setLoading(false);
        showErrorToast(error.response?.data?.message || 'Đã xảy ra lỗi');
      }
      setLoading(false);
      console.error('Error resetting password:', error);
    }
  };
  return (
    <AuthMainContainerComponent title="Reset Password">
      <View style={AuthStyle.containerSecondary}>
        <InputComponent
          placeholder="Mật khẩu mới"
          value={password}
          onChangeText={setPassword}
          leftIcon={<Image source={require('../../assets/images/lock.png')} />}
          secureTextEntry
          error={passwordError}
        />
        <InputComponent
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          leftIcon={<Image source={require('../../assets/images/lock.png')} />}
          secureTextEntry
          error={confirmPasswordError}
        />
      </View>
      <View style={Style.flexContainer}>
        <AuthButton
          text="Đặt lại mật khẩu"
          onPress={onResetPasswordPress}
          loading={loading}
        />
      </View>
    </AuthMainContainerComponent>
  );
};

export default ResetPasswordScreen;

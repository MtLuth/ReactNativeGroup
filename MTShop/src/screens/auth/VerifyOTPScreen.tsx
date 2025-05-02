import axios from 'axios';
import React, {useState} from 'react';
import {View} from 'react-native';
import AuthButton from '../../components/buttons/AuthButton';
import AuthMainContainerComponent from '../../components/container/AuthMainContainerComponent';
import InputComponent from '../../components/InputComponent';
import {AuthStyle} from '../../styles/authStyle';
import {showErrorToast} from '../../utils/toast';

const VerifyOTPScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const {email, prevAction} = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const onVerifyOtp = async () => {
    console.log('Previous action:', prevAction);
    if (!otp.trim()) {
      showErrorToast('Please enter OTP');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/auth/verify-otp', {
        email,
        otp,
      });

      setLoading(false);
      if (prevAction === 'forgotPassword') {
        navigation.navigate('ResetPassword', {email});
      } else {
        navigation.navigate('Login');
      }
    } catch (error: any) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        showErrorToast(error.response?.data?.message || 'Invalid OTP');
      } else {
        showErrorToast('Something went wrong');
      }
    }
  };

  return (
    <AuthMainContainerComponent title="Verify OTP">
      <View style={AuthStyle.containerSecondary}>
        <InputComponent
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          autoCapitalize="none"
          leftIcon={'key'}
        />

        <AuthButton
          text="Xác thực OTP"
          onPress={onVerifyOtp}
          loading={loading}
        />
      </View>
    </AuthMainContainerComponent>
  );
};

export default VerifyOTPScreen;

import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Style} from '../../styles/style';
import {AuthStyle} from '../../styles/authStyle';
import axios from 'axios';
import {showErrorToast, showSuccessToast} from '../../utils/toast';
import InputComponent from '../../components/InputComponent';

const VerifyOTPScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const {email} = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const onVerifyOtp = async () => {
    if (!otp.trim()) {
      showErrorToast('Please enter OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/auth/verify-otp', {
        email,
        otp,
      });

      setLoading(false);
      showSuccessToast(res.data.message || 'Verification successful!');
      navigation.navigate('Login');
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
    <ScrollView style={Style.container} keyboardShouldPersistTaps="handled">
      <View style={Style.headerContainer}>
        <Image
          source={require('../../assets/logo.png')}
          resizeMode="cover"
          style={Style.logo}
        />
      </View>

      <View style={AuthStyle.containerSecondary}>
        <Text style={Style.title}>Verify OTP</Text>

        <InputComponent
          label="OTP"
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[Style.button, Style.buttonPrimary, {marginTop: 20}]}
          onPress={onVerifyOtp}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={Style.buttonText}>Verify</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default VerifyOTPScreen;

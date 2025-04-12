import axios from 'axios';
import React, {useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {showErrorMessage, showSuccessMessage} from '../../utils/ToastMessage';

const baseUrl = 'http://10.0.2.2:8080/api/v1';

const ForgotPasswordScreen = ({navigation}) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOTP = async () => {
    try {
      const response = await axios.post(`${baseUrl}/auth/resend-otp`, {email});
      setMessage(response.data.message);
      setStep(2);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showErrorMessage(error?.response.data.message);
      }
    }
  };

  const handleVerifyOTP = async () => {
    try {
      console.log(email, otp);
      const response = await axios.post(`${baseUrl}/auth/verify-otp`, {
        email: email,
        otp: otp,
      });
      setMessage(response.data.message);
      setStep(3);
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.error || 'OTP không hợp lệ');
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.put(`${baseUrl}/auth/reset-password`, {
        email,
        password: newPassword,
      });
      showSuccessMessage(response?.data.message);
      setStep(1);
      navigation.navigate('LoginScreen');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Không thể đặt lại mật khẩu');
    }
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nhập email"
            value={email}
            onChangeText={setEmail}
          />
          <Button title="Gửi OTP" onPress={handleSendOTP} />
        </>
      )}

      {step === 2 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nhập OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
          />
          <Button title="Xác thực OTP" onPress={handleVerifyOTP} />
        </>
      )}

      {step === 3 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <Button title="Đặt lại mật khẩu" onPress={handleResetPassword} />
        </>
      )}

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  message: {
    marginTop: 12,
    color: 'red',
  },
});

export default ForgotPasswordScreen;

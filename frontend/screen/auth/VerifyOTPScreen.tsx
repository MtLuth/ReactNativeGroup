import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios, {isAxiosError} from 'axios';
import {showErrorMessage, showSuccessMessage} from '../../utils/ToastMessage';

axios.defaults.baseURL = 'http://192.168.1.138:8080/api/v1';

const VerifyOTPScreen = ({navigation, route}) => {
  const [otp, setOtp] = useState('');
  const {email} = route.params;

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Lỗi', 'Mã OTP phải có 6 chữ số');
      return;
    }

    try {
      const response = await axios.post('/auth/verify-otp', {
        email: email,
        otp: otp,
      });
      showSuccessMessage(response?.data.message);
      navigation.replace('LoginScreen');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showErrorMessage(error.response.data?.message);
      } else {
        showErrorMessage('Unexpected Error');
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await axios.post('/auth/resend-otp', {
        email: email,
      });

      showSuccessMessage(response?.data.message);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showErrorMessage(error.response.data?.message);
      } else {
        showErrorMessage('Unexpected Error');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác thực OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mã OTP"
        keyboardType="numeric"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, otp.length !== 6 && {backgroundColor: 'gray'}]}
          onPress={handleVerifyOTP}
          disabled={otp.length !== 6}>
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleResendOTP}>
          <Text style={styles.buttonText}>Gửi lại mã otp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerifyOTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },

  buttonContainer: {
    display: 'flex',
    gap: 10,
  },
});

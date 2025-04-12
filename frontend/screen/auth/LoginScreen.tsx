import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {showErrorMessage, showSuccessMessage} from '../../utils/ToastMessage';

const baseURL = 'http://10.0.2.2:8080';

const LoginScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${baseURL}/api/v1/auth/login`, {
        email,
        password,
      });
      console.log('Test login');
      const {resMessage, token} = response.data;
      showSuccessMessage(resMessage);
      await AsyncStorage.setItem('assetToken', token);
      await AsyncStorage.setItem('email', email);
      navigation.replace('Tab');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showErrorMessage(error.response.data.message);
      } else {
        console.log(error);
        showErrorMessage('An unexpected error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.customButtonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.customButtonText}>Forgot Password</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  customButton: {
    backgroundColor: '#fff', // Nền màu trắng
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
  customButtonText: {
    color: '#000', // Chữ màu đen
    fontSize: 16,
  },
});

export default LoginScreen;

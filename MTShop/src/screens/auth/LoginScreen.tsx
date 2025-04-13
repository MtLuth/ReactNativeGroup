import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import InputComponent from '../../components/InputComponent';
import {AuthStyle} from '../../styles/authStyle';
import {Style} from '../../styles/style';

const LoginScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  const onForgotPasswordPress = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <ScrollView style={Style.container}>
      <View style={Style.headerContainer}>
        <Image
          source={require('../../assets/logo.png')}
          resizeMode="cover"
          style={Style.logo}
        />
      </View>

      <View style={AuthStyle.containerSecondary}>
        <Text style={Style.title}>Login</Text>
        <InputComponent
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <InputComponent
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={AuthStyle.actionContainer}>
          <TouchableOpacity onPress={onForgotPasswordPress}>
            <Text style={AuthStyle.actionText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View style={Style.flexContainer}>
          <TouchableOpacity style={[Style.button, Style.buttonPrimary]}>
            <Text style={Style.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[Style.button, Style.buttonSecondary]}
            onPress={onSignUpPress}>
            <Text style={Style.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

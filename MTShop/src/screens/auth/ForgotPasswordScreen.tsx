import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import InputComponent from '../../components/InputComponent';
import {AuthStyle} from '../../styles/authStyle';
import {Style} from '../../styles/style';

const ForgotPasswordScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');

  const onVerifyButtonPress = () => {};

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  const onSignInButtonPress = () => {
    navigation.navigate('Login');
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
        <View style={AuthStyle.actionContainer}>
          <TouchableOpacity
            onPress={onSignUpPress}
            style={{alignSelf: 'flex-end'}}>
            <Text style={AuthStyle.actionText}>Do you have an account?</Text>
          </TouchableOpacity>
        </View>

        <View style={Style.flexContainer}>
          <TouchableOpacity
            style={[Style.button, Style.buttonPrimary]}
            onPress={onVerifyButtonPress}>
            <Text style={Style.buttonText}>Send OTP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[Style.button, Style.buttonSecondary]}
            onPress={onSignInButtonPress}>
            <Text style={Style.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ForgotPasswordScreen;

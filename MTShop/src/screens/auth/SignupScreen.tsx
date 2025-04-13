import {useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {ScrollView, Text} from 'react-native-gesture-handler';
import InputComponent from '../../components/InputComponent';
import {AuthStyle} from '../../styles/authStyle';
import {Style} from '../../styles/style';

const SignUpScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onSignInPress = () => {
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
        <Text style={Style.title}>Sign Up</Text>
        <InputComponent
          label="Full Name"
          placeholder="Enter your full name"
          value={email}
          onChangeText={setEmail}
        />
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
        <InputComponent
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <View style={AuthStyle.actionContainer}>
          <TouchableOpacity onPress={onSignInPress}>
            <Text style={AuthStyle.actionText}>Already have an account?</Text>
          </TouchableOpacity>
        </View>
        <View style={Style.flexContainer}>
          <TouchableOpacity style={[Style.button, Style.buttonPrimary]}>
            <Text style={Style.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;

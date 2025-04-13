import {Image, ScrollView, Text, View} from 'react-native';
import {Style} from '../../styles/style';
import {styled} from 'tailwindcss-react-native';
import {AuthStyle} from '../../styles/authStyle';

const VerifyOTPScreen = (navigation: {navigation: any}) => {
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
        <Text style={Style.title}>Verify OTP</Text>
      </View>
    </ScrollView>
  );
};

export default VerifyOTPScreen;

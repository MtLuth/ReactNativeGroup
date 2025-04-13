import React, {useEffect} from 'react';
import {View, ActivityIndicator, Image} from 'react-native';
import {appColors} from '../themes/appColors';
import {Style} from '../styles/style';
import {SplashScreenStyle} from '../styles/splashScreenStyle';

const SplashScreen = ({navigation}: {navigation: any}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
  }, [navigation]);

  return (
    <View style={[Style.container, SplashScreenStyle.splashContainer]}>
      <Image
        source={require('../assets/logo.png')}
        resizeMode="contain"
        style={SplashScreenStyle.logo}
      />
      <ActivityIndicator
        size="large"
        color={appColors.primary}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          marginTop: 20,
        }}
      />
    </View>
  );
};

export default SplashScreen;

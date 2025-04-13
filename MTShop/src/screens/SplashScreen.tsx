import React, {useEffect} from 'react';
import {View, ActivityIndicator, Image} from 'react-native';
import {appColors} from '../themes/appColors';
import {Style} from '../styles/style';
import {SplashScreenStyle} from '../styles/splashScreenStyle';
import {getItem} from '../utils/storage';

const SplashScreen = ({navigation}: {navigation: any}) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getItem('accessToken');
        if (token) {
          navigation.replace('Main');
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        navigation.replace('Login');
      }
    };

    setTimeout(() => {
      checkAuth();
    }, 1500);
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

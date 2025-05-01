import React, {useEffect} from 'react';
import {View, ActivityIndicator, Image} from 'react-native';
import {appColors} from '../themes/appColors';
import {Style} from '../styles/style';
import {SplashScreenStyle} from '../styles/splashScreenStyle';
import {getItem, setItem} from '../utils/storage';

const SplashScreen = ({navigation}: {navigation: any}) => {
  useEffect(() => {
    const checkAuth = async () => {
      const isFirstLaunch = getItem('isFirstLaunch');
      console.log('isFirstLaunch:', isFirstLaunch);
      if (!isFirstLaunch) {
        console.log('First launch');
        navigation.replace('Onboarding');
        setItem('isFirstLaunch', 'true');
        return;
      }
      navigation.replace('Onboarding');
      // const token = getItem('accessToken');
      // if (token) {
      //   navigation.replace('Home');
      // } else {
      //   navigation.replace('Login');
      // }
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
      <ActivityIndicator size="large" color={appColors.primary} />
    </View>
  );
};

export default SplashScreen;

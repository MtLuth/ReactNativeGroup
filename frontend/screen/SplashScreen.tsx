import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator'; // Đảm bảo đường dẫn đúng
import {RouteProp} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;
type SplashScreenRouteProp = RouteProp<RootStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
  route: SplashScreenRouteProp;
}

const SplashScreen: React.FC<Props> = ({navigation}) => {
  const checkLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('assetToken');
      if (token) {
        navigation.replace('Tab');
      } else {
        navigation.replace('Auth');
      }
    } catch (error) {
      console.error('Failed to fetch the token from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      checkLogin();
    }, 3000);

    return () => clearTimeout(timeout);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xin chào, em là Mai Tan Tai</Text>
      <Text style={styles.subtitle}>Đang tải...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    position: 'absolute',
    bottom: 20,
  },
});

export default SplashScreen;

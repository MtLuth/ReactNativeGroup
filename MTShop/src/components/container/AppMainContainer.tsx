import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {appColors} from '../../themes/appColors';

interface Props {
  children: React.ReactNode;
}

const AppMainContainer: React.FC<Props> = ({children}) => {
  const navigation = useNavigation<any>();

  const handleBack = () => {
    navigation.goBack();
  };

  const onProfilePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-left" size={20} color={appColors.primary} />
        </TouchableOpacity>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logoImage}
        />
        <TouchableOpacity onPress={onProfilePress}>
          <Image
            source={require('../../assets/images/user.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

export default AppMainContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  header: {
    height: 56,
    marginTop: 44,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  logoImage: {
    width: 200,
    borderRadius: 18,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});

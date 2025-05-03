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
import GlobalText from '../GlobalText';
import {appFonts} from '../../themes/appFont';
import IconWithBadge from '../icons/IconWithBadge';

interface Props {
  children: React.ReactNode;
  isShowingBackButton?: boolean;
  isShowRightIcon?: boolean;
  rightIconType?: 'profile' | 'cart';
  mainTitle?: string;
}

const AppMainContainer: React.FC<Props> = ({
  children,
  isShowingBackButton = false,
  isShowRightIcon = true,
  rightIconType = 'cart',
  mainTitle = false,
}) => {
  const navigation = useNavigation<any>();

  const handleBack = () => {
    navigation.goBack();
  };

  const onProfilePress = () => {
    navigation.navigate('Profile');
  };

  const onCartPress = () => {
    navigation.navigate('Cart', {navType: 'stack'});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{backgroundColor: appColors.white}}>
        <View style={styles.header}>
          {isShowingBackButton ? (
            <TouchableOpacity onPress={handleBack}>
              <Icon name="arrow-left" size={20} color={appColors.primary} />
            </TouchableOpacity>
          ) : (
            <View style={{width: 20}} />
          )}
          {mainTitle ? (
            <GlobalText
              style={{
                fontSize: 18,
                fontFamily: appFonts.MontserratBold,
                color: appColors.primary,
              }}>
              {mainTitle}
            </GlobalText>
          ) : (
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logoImage}
            />
          )}

          {isShowRightIcon ? (
            rightIconType === 'cart' ? (
              <TouchableOpacity onPress={onCartPress}>
                <IconWithBadge
                  iconName="shopping-cart"
                  iconType="feather"
                  badgeType="cart"
                  iconSize={24}
                  iconColor={appColors.primary}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onProfilePress}>
                <Image
                  source={require('../../assets/images/user.png')}
                  style={styles.avatar}
                />
              </TouchableOpacity>
            )
          ) : (
            <View style={{width: 36}} />
          )}
        </View>
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
    resizeMode: 'contain',
  },
});

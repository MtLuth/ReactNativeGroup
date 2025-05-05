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
import {useCart} from '../../context/CartContext';

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

  const {cartCount} = useCart();

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
              <TouchableOpacity
                onPress={onCartPress}
                style={{
                  width: 42,
                  height: 42,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 21,
                  backgroundColor: appColors.background,
                }}>
                <IconWithBadge
                  iconName="shopping-cart"
                  iconType="feather"
                  iconSize={24}
                  iconColor={appColors.primary}
                  badgeCount={cartCount}
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
    marginTop: 5,
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
    paddingTop: 12,
  },
  logoImage: {
    width: 200,
    resizeMode: 'contain',
  },
});

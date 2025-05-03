import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {appFonts} from '../themes/appFont';
import {appColors} from '../themes/appColors';

interface BannerComponentProps {
  image: any;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  buttonLabel?: string;
}

const BannerComponent: React.FC<BannerComponentProps> = ({
  image,
  title,
  subtitle,
  onPress,
  buttonLabel = 'View all',
}) => {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.bannerImage} resizeMode="cover" />
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {onPress && (
          <TouchableOpacity style={styles.viewAllButton} onPress={onPress}>
            <Text style={styles.viewAllText}>{buttonLabel}</Text>
            <Icon
              name="arrow-right"
              type="feather"
              color="#fff"
              size={16}
              containerStyle={{marginLeft: 6}}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default BannerComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 10,
    elevation: 2,
  },
  bannerImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: appFonts.MontserratBold,
    fontSize: 20,
    color: appColors.primary,
  },
  subtitle: {
    fontFamily: appFonts.MontserratMedium,
    fontSize: 16,
    color: appColors.textPrimary,
  },
  viewAllButton: {
    backgroundColor: appColors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#fff',
    fontFamily: appFonts.MontserratMedium,
    fontSize: 14,
  },
});

import {StyleSheet} from 'react-native';
import {appFonts} from '../themes/appFont';
import {appColors} from '../themes/appColors';

export const AuthStyle = StyleSheet.create({
  actionText: {
    textAlign: 'right',
    marginBottom: 40,
    marginRight: 5,
    fontSize: 14,
    color: appColors.textPrimary,
    fontFamily: appFonts.MontserratMedium,
  },
  containerSecondary: {
    marginTop: 41,
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  subActionContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
  },
  subActionText: {
    fontFamily: appFonts.MontserratSemiBold,
    fontSize: 16,
    color: appColors.textPrimary,
  },
  textTouchOpacity: {
    color: appColors.primary,
    textDecorationLine: 'underline',
  },
});

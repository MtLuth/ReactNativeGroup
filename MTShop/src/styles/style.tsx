import {StyleSheet} from 'react-native';
import {appColors} from '../themes/appColors';

export const Style = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: appColors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: appColors.primary,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logo: {
    width: 300,
    height: 200,
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  headerContainer: {
    height: 200,
    width: '100%',
    backgroundColor: appColors.border,
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  buttonPrimary: {
    backgroundColor: appColors.primary,
  },
  buttonSecondary: {
    backgroundColor: appColors.accent,
  },

  footerContainer: {
    display: 'flex',
    justifyContent: 'center',
    height: 50,
    width: '100%',
  },
});

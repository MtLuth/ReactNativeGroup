import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  ActivityIndicator,
} from 'react-native';
import {appColors} from '../../themes/appColors';
import {appFonts} from '../../themes/appFont';

interface AuthButtonProps {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  text,
  onPress,
  disabled = false,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, disabled && styles.buttonDisabled]}
      activeOpacity={0.8}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

export default AuthButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: appColors.primaryLight,
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 10,
    height: 55,
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: appFonts.MontserratSemiBold,
  },
});

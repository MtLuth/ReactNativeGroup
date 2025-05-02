import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  View,
} from 'react-native';
import {appColors} from '../../themes/appColors';
import {appFonts} from '../../themes/appFont';

interface SmallIconButtonProps {
  text: string;
  icon: React.ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

const SmallIconButton: React.FC<SmallIconButtonProps> = ({
  text,
  icon,
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}>
      <View style={styles.content}>
        <Text style={styles.text}>{text}</Text>
        {icon}
      </View>
    </TouchableOpacity>
  );
};

export default SmallIconButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    fontSize: 14,
    color: '#000',
    marginRight: 4,
    fontFamily: appFonts.MontserratMedium,
  },
});

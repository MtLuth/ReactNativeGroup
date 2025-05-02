import React, {useState, isValidElement} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {appColors} from '../themes/appColors';
import {appFonts} from '../themes/appFont';

interface InputComponentProps extends TextInputProps {
  error?: string;
  leftIcon?: string | React.ReactNode;
  rightIcon?: React.ReactNode;
}

const InputComponent: React.FC<InputComponentProps> = ({
  error,
  secureTextEntry,
  leftIcon = 'person',
  rightIcon,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = !!secureTextEntry;

  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    if (typeof leftIcon === 'string') {
      return (
        <Icon name={leftIcon} size={20} style={styles.icon} color="#666" />
      );
    }

    if (isValidElement(leftIcon)) {
      return <View style={styles.icon}>{leftIcon}</View>;
    }

    return null;
  };

  const renderRightIcon = () => {
    if (isPasswordField) {
      return (
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.iconRight}>
          <Icon
            name={isPasswordVisible ? 'visibility-off' : 'visibility'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      );
    }
    if (rightIcon && isValidElement(rightIcon)) {
      return <View style={styles.iconRight}>{rightIcon}</View>;
    }
    return null;
  };

  return (
    <View style={[styles.inputWrapper, error && styles.inputError]}>
      {renderLeftIcon()}
      <TextInput
        style={styles.input}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        {...props}
      />
      {renderRightIcon()}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: appColors.primary,
    paddingHorizontal: 12,
    height: 55,
    paddingVertical: Platform.OS === 'android' ? 0 : undefined,
    marginBottom: 15,
  },
  icon: {
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
  },
  iconRight: {
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: 'center',
    color: appColors.textPrimary,
    fontFamily: appFonts.MontserratRegular,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  inputError: {
    borderColor: appColors.error,
  },
});

export default InputComponent;

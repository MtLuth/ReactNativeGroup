import React from 'react';
import {View, Text, TextInput, StyleSheet, TextInputProps} from 'react-native';
import {appColors} from '../themes/appColors';

interface InputComponentProps extends TextInputProps {
  label?: string;
  error?: string;
}

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  error,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.inputError : styles.inputNormal]}
        placeholderTextColor={appColors.border}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 6,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: appColors.primary,
  },
  input: {
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1.2,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#221010',
    color: '#fff',
  },
  inputNormal: {
    borderColor: appColors.border,
  },
  inputError: {
    borderColor: appColors.error,
  },
  errorText: {
    color: appColors.error,
    marginTop: 4,
    fontSize: 13,
  },
});

export default InputComponent;

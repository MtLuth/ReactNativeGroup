import Toast from 'react-native-toast-message';

export const showSuccessToast = (message: string) => {
  Toast.show({
    type: 'success',
    text2: message,
  });
};

export const showErrorToast = (message: string) => {
  Toast.show({
    type: 'error',
    text2: message,
  });
};

import Toast from 'react-native-toast-message';

export const showSuccessMessage = (message: string): void => {
  Toast.show({
    type: 'success',
    position: 'top',
    text1: 'Thành công!',
    text2: message,
    visibilityTime: 3000,
  });
};

export const showErrorMessage = (message: string) => {
  Toast.show({
    type: 'error',
    position: 'top',
    text2: message,
    visibilityTime: 3000,
  });
};

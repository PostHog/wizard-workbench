import Toast from 'react-native-toast-message';

export function showSuccess(message) {
  Toast.show({
    type: 'success',
    text1: message,
  });
}

export function showError(message) {
  Toast.show({
    type: 'error',
    text1: message,
  });
}

export function showInfo(message) {
  Toast.show({
    type: 'info',
    text1: message,
  });
}

export default {
  showSuccess,
  showError,
  showInfo,
};

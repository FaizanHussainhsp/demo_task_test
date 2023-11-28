import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
export const checkPermission = async () => {
  try {
    const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    if (result !== RESULTS.GRANTED) {
      requestPermission();
    }
  } catch (error) {
    console.error('Error checking permission:', error);
  }
};

const requestPermission = async () => {
  try {
    const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    if (result === RESULTS.GRANTED) {
      console.log('Permission granted');
    } else {
      console.log('Permission denied');
    }
  } catch (error) {
    console.error('Error requesting permission:', error);
  }
};

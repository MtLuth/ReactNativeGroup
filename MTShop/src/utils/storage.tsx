import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV();

export const setItem = (key: string, value: string) => {
  storage.set(key, value);
};

export const getItem = (key: string) => {
  return storage.getString(key);
};

export const removeItem = (key: string) => {
  storage.delete(key);
};

export const decodeJWT = (token) => {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadDecoded = atob(payloadBase64);
    return JSON.parse(payloadDecoded);
  } catch (err) {
    console.error("Lỗi khi decode token:", err);
    return null;
  }
};


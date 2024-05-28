import CryptoJS from 'crypto-js';
import { REACT_APP_SECRET_KEY } from '@env';
import 'react-native-get-random-values';

const secretKey = REACT_APP_SECRET_KEY; // Keep this key secure and consistent.

export function encryptData(data) {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
}

export function decryptData(encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}
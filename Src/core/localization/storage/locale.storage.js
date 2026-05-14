import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCALE_STORAGE_KEY = '@customer_locale_settings';

export const saveLocale = async (localeData) => {
  try {
    const jsonValue = JSON.stringify(localeData);
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving customer locale data:', error);
    return false;
  }
};

export const getLocale = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading customer locale data:', error);
    return null;
  }
};

export const removeLocale = async () => {
  try {
    await AsyncStorage.removeItem(LOCALE_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error removing customer locale data:', error);
    return false;
  }
};

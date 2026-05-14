import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

const REGION_KEY = "APP_REGION";

export const saveRegion = async (value) => {
  try {
    storage.set(REGION_KEY, value);

  } catch (error) {
    console.log("SAVE REGION ERROR", error);
  }
};

export const getSavedRegion = async () => {
  try {
    return storage.getString(REGION_KEY);

  } catch (error) {
    console.log("GET REGION ERROR", error);

    return null;
  }
};

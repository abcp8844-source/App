import * as Localization from "expo-localization";

export const detectCountry = () => {
  try {
    const region = Localization.regionCode;

    return region || "USA";

  } catch (error) {
    console.log("COUNTRY DETECTION ERROR", error);

    return "USA";
  }
};

export const detectLanguage = () => {
  try {
    const languageCode =
      Localization.locale.split("-")[0];

    return languageCode || "en";

  } catch (error) {
    console.log("LANGUAGE DETECTION ERROR", error);

    return "en";
  }
};

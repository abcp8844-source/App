import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as Localization from "expo-localization";

import { COUNTRIES } from "../constants/countries.constants";

import {
  detectCountry,
  detectLanguage,
} from "../engine/detection.engine";

import {
  saveRegion,
  getSavedRegion,
} from "../storage/region.storage";

const LocalizationContext = createContext();

export const LocalizationProvider = ({ children }) => {
  const [country, setCountry] = useState(null);

  const [language, setLanguage] = useState("en");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeLocalization();
  }, []);

  const initializeLocalization = async () => {
    try {
      const savedRegion = await getSavedRegion();

      if (savedRegion) {
        setCountry(COUNTRIES[savedRegion]);
      } else {
        const detectedCountry = detectCountry();

        setCountry(COUNTRIES[detectedCountry]);
      }

      const detectedLanguage = detectLanguage();

      setLanguage(detectedLanguage);

    } catch (error) {
      console.log("LOCALIZATION INIT ERROR", error);

    } finally {
      setLoading(false);
    }
  };

  const changeRegion = async (countryCode) => {
    try {
      setCountry(COUNTRIES[countryCode]);

      await saveRegion(countryCode);

    } catch (error) {
      console.log("REGION CHANGE ERROR", error);
    }
  };

  const values = useMemo(() => {
    return {
      country,
      language,
      loading,
      changeRegion,
      locale: Localization.locale,
      timezone: Localization.timezone,
      currency: country?.currency,
    };
  }, [country, language, loading]);

  return (
    <LocalizationContext.Provider value={values}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalizationContext = () => {
  return useContext(LocalizationContext);
};

import React from "react";

import { Stack } from "expo-router";

import {
  LocalizationProvider,
} from "../core/localization";

export default function RootLayout() {
  return (
    <LocalizationProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      />
    </LocalizationProvider>
  );
    }

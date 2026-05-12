import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { GlobalProvider } from "../context/GlobalSystemContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade_from_bottom",
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(customer)" />
          <Stack.Screen name="(merchant)" />
          <Stack.Screen name="(admin)" />
        </Stack>
      </GlobalProvider>
    </AuthProvider>
  );
}

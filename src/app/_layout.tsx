import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { clusterApiUrl } from "@solana/web3.js";
import { MobileWalletProvider } from "@wallet-ui/react-native-web3js";
import Constants from "expo-constants";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";

import { OnboardingScreen } from "@/components/onboarding-screen";
import { useAppStore } from "@/store/app-store";

// Keep the native splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const chain = "solana:mainnet";
const endpoint = clusterApiUrl("mainnet-beta");
const identity = {
  name: "Ravolo",
  uri: "https://ravolo.app",
  icon: `${Constants.expoConfig?.icon ?? "favicon.ico"}`,
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isHydrated = useAppStore((state) => state._hasHydrated);
  const hasCompletedOnboarding = useAppStore(
    (state) => state.hasCompletedOnboarding,
  );

  useEffect(() => {
    if (isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [isHydrated]);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, []);

  if (!isHydrated) {
    return null;
  }

  if (!hasCompletedOnboarding) {
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <MobileWalletProvider
          chain={chain}
          endpoint={endpoint}
          identity={identity}
        >
          <StatusBar hidden />
          <OnboardingScreen />
        </MobileWalletProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <MobileWalletProvider
        chain={chain}
        endpoint={endpoint}
        identity={identity}
      >
        <StatusBar hidden />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="syndicate-chat"
            options={{
              presentation: "card",
              animation: "slide_from_bottom",
            }}
          />
        </Stack>
      </MobileWalletProvider>
    </ThemeProvider>
  );
}

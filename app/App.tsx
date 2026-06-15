import React, { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import {
  useFonts as useFraunces,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
} from '@expo-google-fonts/fraunces';
import {
  useFonts as useInter,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  useFonts as useNotoDevanagari,
  NotoSerifDevanagari_600SemiBold,
} from '@expo-google-fonts/noto-serif-devanagari';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [frauncesLoaded] = useFraunces({ Fraunces_500Medium, Fraunces_600SemiBold });
  const [interLoaded] = useInter({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  const [devanagariLoaded] = useNotoDevanagari({ NotoSerifDevanagari_600SemiBold });

  const fontsLoaded = frauncesLoaded && interLoaded && devanagariLoaded;

  const onLayout = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }} onLayout={onLayout}>
      <AppNavigator />
      <StatusBar style="dark" />
    </View>
  );
}

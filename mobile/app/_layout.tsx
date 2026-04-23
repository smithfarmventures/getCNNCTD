import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Slot, router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../store/authStore';

export default function RootLayout() {
  const { initialize, token, initialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!initialized) return;
    if (token) {
      router.replace('/(main)/discover');
    } else {
      router.replace('/(auth)');
    }
  }, [initialized, token]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      <Slot />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

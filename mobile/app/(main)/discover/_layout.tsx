import { Stack } from 'expo-router';

export default function DiscoverLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="company-detail"
        options={{ animation: 'slide_from_right', presentation: 'card' }}
      />
    </Stack>
  );
}

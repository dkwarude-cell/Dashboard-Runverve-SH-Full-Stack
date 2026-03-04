import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/lib/auth';

export default function AuthLayout() {
  const { user } = useAuth();

  // If already logged in, redirect to app
  if (user) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}

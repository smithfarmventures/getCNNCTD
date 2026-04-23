import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/colors';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import type { AuthResponse } from '../../constants/types';

export default function LoginScreen() {
  const { role } = useLocalSearchParams<{ role?: string }>();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });
      const { user, token, has_profile } = response.data;
      await login(user, token);

      if (!has_profile) {
        if (user.role === 'investor') {
          router.replace('/(onboarding)/investor');
        } else {
          router.replace('/(onboarding)/founder');
        }
      } else {
        router.replace('/(main)/discover');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>Stay CNNCTD — sign in to your account</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={Colors.inkMute}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              placeholderTextColor={Colors.inkMute}
              secureTextEntry
              autoComplete="current-password"
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/(auth)/signup',
                params: { role: role ?? '' },
              })
            }
            activeOpacity={0.7}
          >
            <Text style={styles.signupLink}>
              Don't have an account?{' '}
              <Text style={styles.signupLinkBold}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 24,
  },
  backText: {
    color: Colors.inkMute,
    fontSize: 15,
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 15,
    color: Colors.inkMute,
    marginBottom: 32,
    lineHeight: 22,
  },
  errorBox: {
    backgroundColor: 'rgba(224,60,80,0.07)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(224,60,80,0.25)',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    color: Colors.inkMute,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.ink,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  loginButton: {
    backgroundColor: Colors.ink,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupLink: {
    color: Colors.inkMute,
    fontSize: 14,
    textAlign: 'center',
  },
  signupLinkBold: {
    color: Colors.brand,
    fontWeight: '600',
  },
});

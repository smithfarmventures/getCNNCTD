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
import type { AuthResponse, UserRole } from '../../constants/types';

export default function SignupScreen() {
  const { role: initialRole } = useLocalSearchParams<{ role?: string }>();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(
    initialRole === 'investor' ? 'investor' : 'founder'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await api.post<AuthResponse>('/auth/signup', {
        email: email.trim().toLowerCase(),
        password,
        role,
      });
      const { user, token } = response.data;
      await login(user, token);

      if (role === 'investor') {
        router.replace('/(onboarding)/investor');
      } else {
        router.replace('/(onboarding)/founder');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Signup failed. Please try again.';
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

          <Text style={styles.heading}>Get CNNCTD today</Text>
          <Text style={styles.subheading}>Join to start making the right connections</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Role toggle */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>I am a</Text>
            <View style={styles.roleToggle}>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  role === 'founder' && styles.roleOptionActive,
                ]}
                onPress={() => setRole('founder')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.roleOptionText,
                    role === 'founder' && styles.roleOptionTextActive,
                  ]}
                >
                  Founder
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  role === 'investor' && styles.roleOptionActive,
                ]}
                onPress={() => setRole('investor')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.roleOptionText,
                    role === 'investor' && styles.roleOptionTextActive,
                  ]}
                >
                  Investor
                </Text>
              </TouchableOpacity>
            </View>
          </View>

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
              placeholder="Minimum 8 characters"
              placeholderTextColor={Colors.inkMute}
              secureTextEntry
              autoComplete="new-password"
            />
          </View>

          <TouchableOpacity
            style={[styles.signupButton, loading && styles.disabledButton]}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.7}
          >
            <Text style={styles.loginLink}>
              Already have an account?{' '}
              <Text style={styles.loginLinkBold}>Sign in</Text>
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
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.creamDark,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  roleOptionActive: {
    backgroundColor: Colors.cardBg,
  },
  roleOptionText: {
    fontSize: 15,
    color: Colors.inkMute,
    fontWeight: '600',
  },
  roleOptionTextActive: {
    color: Colors.ink,
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
  signupButton: {
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
  signupButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    color: Colors.inkMute,
    fontSize: 14,
    textAlign: 'center',
  },
  loginLinkBold: {
    color: Colors.brand,
    fontWeight: '600',
  },
});

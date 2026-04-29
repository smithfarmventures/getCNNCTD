import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { DS } from '../../constants/DS';

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoSection}>
        <Text style={styles.logoGet}>get</Text>
        <Text style={styles.logoCNNCTD}>CNNCTD</Text>
        <Text style={styles.tagline}>getCNNCTD, stay CNNCTD</Text>
      </View>

      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.founderButton}
          onPress={() => router.push({ pathname: '/(auth)/login', params: { role: 'founder' } })}
          activeOpacity={0.85}
        >
          <Text style={styles.founderButtonText}>I'm a Founder</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.investorButton}
          onPress={() => router.push({ pathname: '/(auth)/login', params: { role: 'investor' } })}
          activeOpacity={0.85}
        >
          <Text style={styles.investorButtonText}>I'm an Investor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.7}
        >
          <Text style={styles.signInLink}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
    justifyContent: 'space-between',
    paddingBottom: 48,
  },
  logoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGet: {
    fontFamily: DS.fontUI,
    fontSize: 18,
    color: Colors.inkMute,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: -4,
  },
  logoCNNCTD: {
    fontFamily: DS.fontDisplayItalic,
    fontSize: 64,
    color: Colors.brand,
    letterSpacing: -2,
    lineHeight: 68,
    marginBottom: 20,
  },
  tagline: {
    fontFamily: DS.fontUIMedium,
    fontSize: 12,
    color: Colors.inkMute,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  buttonSection: {
    paddingHorizontal: 28,
    gap: 10,
  },
  founderButton: {
    backgroundColor: Colors.ink,
    borderRadius: DS.radiusPill,
    paddingVertical: 18,
    alignItems: 'center',
  },
  founderButtonText: {
    fontFamily: DS.fontUISemiBold,
    color: '#ffffff',
    fontSize: 16,
    letterSpacing: 0.1,
  },
  investorButton: {
    backgroundColor: Colors.cream,
    borderRadius: DS.radiusPill,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
  },
  investorButtonText: {
    fontFamily: DS.fontUISemiBold,
    color: Colors.ink,
    fontSize: 16,
    letterSpacing: 0.1,
  },
  signInLink: {
    fontFamily: DS.fontUI,
    color: Colors.inkMute,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

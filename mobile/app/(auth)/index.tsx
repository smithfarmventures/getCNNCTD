import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

const { height } = Dimensions.get('window');

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoSection}>
        <View style={styles.logoRow}>
          <Text style={styles.logoCNN}>CNN</Text>
          <View style={styles.logoBridge}>
            <View style={styles.bridgeLine} />
            <View style={styles.bridgePillar} />
            <View style={styles.bridgeLine} />
          </View>
          <Text style={styles.logoCTD}>CTD</Text>
        </View>
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
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCNN: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.ink,
    letterSpacing: -2,
  },
  logoCTD: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.ink,
    letterSpacing: -2,
  },
  logoBridge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
    marginTop: 4,
  },
  bridgeLine: {
    width: 10,
    height: 2,
    backgroundColor: Colors.brand,
  },
  bridgePillar: {
    width: 4,
    height: 12,
    backgroundColor: Colors.brand,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  tagline: {
    fontSize: 13,
    color: Colors.inkMute,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  buttonSection: {
    paddingHorizontal: 28,
    gap: 10,
  },
  founderButton: {
    backgroundColor: Colors.ink,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
  },
  founderButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  investorButton: {
    backgroundColor: Colors.cream,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
  },
  investorButtonText: {
    color: Colors.ink,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  signInLink: {
    color: Colors.inkMute,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

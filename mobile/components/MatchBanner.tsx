import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/colors';

interface MatchBannerProps {
  visible: boolean;
  onClose: () => void;
  matchName: string;
  matchId?: string;
}

export default function MatchBanner({ visible, onClose, matchName, matchId }: MatchBannerProps) {
  const handleStartChatting = () => {
    onClose();
    if (matchId) {
      router.push(`/(main)/messages/${matchId}`);
    } else {
      router.push('/(main)/messages');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <Text style={styles.emoji}>🎉</Text>
            <Text style={styles.title}>You've Been CNNCTD!</Text>
            <Text style={styles.subtitle}>
              You and {matchName} are now connected
            </Text>
            <Text style={styles.slogan}>stay CNNCTD</Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleStartChatting}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Start Chatting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Keep Swiping</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(12,15,14,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
    backgroundColor: Colors.cardBg,
    borderRadius: 28,
    width: '100%',
  },
  emoji: {
    fontSize: 52,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.ink,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.inkMute,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  slogan: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.brand,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: Colors.brand,
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.inkSoft,
    fontSize: 16,
    fontWeight: '600',
  },
});

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../../constants/colors';
import { useDiscoverStore } from '../../../store/discoverStore';
import CardStack from '../../../components/CardStack';
import MatchBanner from '../../../components/MatchBanner';
import { toCompany } from '../../../components/SwipeCard';
import type { SwipeCard, SwipeResult } from '../../../constants/types';

const DAILY_SWIPE_LIMIT = 20;

export default function DiscoverFeedScreen() {
  const router = useRouter();
  const { cards, loading, dailySwipesUsed, fetchCards, swipe, setSelectedCompany } = useDiscoverStore();
  const [matchVisible, setMatchVisible] = useState(false);
  const [matchName, setMatchName] = useState('');
  const [matchId, setMatchId] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleSwipe = useCallback(
    async (userId: string, direction: 'like' | 'pass'): Promise<SwipeResult> => {
      const result = await swipe(userId, direction);
      if (result.matched) {
        setMatchName(result.match_name ?? 'your connection');
        setMatchId(result.match_id);
        setMatchVisible(true);
      }
      return result;
    },
    [swipe]
  );

  const handleCardPress = useCallback(
    (card: SwipeCard) => {
      setSelectedCompany(toCompany(card));
      router.push('/(main)/discover/company-detail');
    },
    [setSelectedCompany, router]
  );

  const handleCloseMatch = () => {
    setMatchVisible(false);
    setMatchId(undefined);
    setMatchName('');
  };

  const atDailyLimit = dailySwipesUsed >= DAILY_SWIPE_LIMIT;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Text style={styles.headerBold}>CNN</Text>
          <Text style={styles.headerAccent}>⬡</Text>
          <Text style={styles.headerBold}>CTD</Text>
        </Text>
        <Text style={styles.swipeCount}>
          {DAILY_SWIPE_LIMIT - dailySwipesUsed} swipes left today
        </Text>
      </View>

      {loading && cards.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.brand} />
          <Text style={styles.loadingText}>Getting you CNNCTD...</Text>
        </View>
      ) : atDailyLimit ? (
        <View style={styles.limitContainer}>
          <Text style={styles.limitTitle}>Daily limit reached</Text>
          <Text style={styles.limitSubtitle}>
            You&apos;ve used all 20 swipes for today. Come back tomorrow to stay CNNCTD!
          </Text>
        </View>
      ) : (
        <CardStack
          cards={cards}
          onSwipe={handleSwipe}
          onCardPress={handleCardPress}
        />
      )}

      <MatchBanner
        visible={matchVisible}
        onClose={handleCloseMatch}
        matchName={matchName}
        matchId={matchId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.ink,
  },
  headerBold: {
    color: Colors.ink,
    fontWeight: '800',
  },
  headerAccent: {
    color: Colors.brand,
    fontSize: 18,
  },
  swipeCount: {
    fontSize: 13,
    color: Colors.inkMute,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    color: Colors.inkMute,
    fontSize: 15,
  },
  limitContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  limitTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 12,
    textAlign: 'center',
  },
  limitSubtitle: {
    fontSize: 15,
    color: Colors.inkMute,
    textAlign: 'center',
    lineHeight: 22,
  },
});

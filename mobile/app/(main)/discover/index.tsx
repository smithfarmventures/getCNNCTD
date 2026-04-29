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
import { DS } from '../../../constants/DS';
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
        <View>
          <Text style={styles.overline}>Discover</Text>
          <Text style={styles.headline}>
            Get <Text style={styles.headlineAccent}>CNNCTD</Text>
          </Text>
        </View>
        <Text style={styles.swipeCount}>
          {DAILY_SWIPE_LIMIT - dailySwipesUsed} left today
        </Text>
      </View>

      {loading && cards.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.brand} />
          <Text style={styles.loadingText}>Getting you CNNCTD...</Text>
        </View>
      ) : atDailyLimit ? (
        <View style={styles.limitContainer}>
          <Text style={styles.limitTitle}>You're all caught up</Text>
          <Text style={styles.limitSubtitle}>
            Come back tomorrow to stay CNNCTD!
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
  container: { flex: 1, backgroundColor: Colors.cream },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  overline: {
    fontFamily: DS.fontUISemiBold,
    fontSize: 11,
    color: Colors.brand,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headline: {
    fontFamily: DS.fontDisplay,
    fontSize: 26,
    color: Colors.ink,
    letterSpacing: -0.5,
  },
  headlineAccent: {
    fontFamily: DS.fontDisplayItalic,
    color: Colors.brand,
  },
  swipeCount: {
    fontFamily: DS.fontUI,
    fontSize: 12,
    color: Colors.inkMute,
    paddingBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: DS.fontUI,
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
    fontFamily: DS.fontDisplay,
    fontSize: 24,
    color: Colors.ink,
    marginBottom: 12,
    textAlign: 'center',
  },
  limitSubtitle: {
    fontFamily: DS.fontUI,
    fontSize: 15,
    color: Colors.inkMute,
    textAlign: 'center',
    lineHeight: 22,
  },
});

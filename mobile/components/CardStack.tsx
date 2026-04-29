import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import SwipeCard from './SwipeCard';
import { Colors } from '../constants/colors';
import type { SwipeCard as SwipeCardType, SwipeResult } from '../constants/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;
const SWIPE_OUT_DISTANCE = SCREEN_WIDTH * 1.5;

interface CardStackProps {
  cards: SwipeCardType[];
  onSwipe: (userId: string, direction: 'like' | 'pass') => Promise<SwipeResult>;
  onCardPress?: (card: SwipeCardType) => void;
}

function BackCard({ card, index }: { card: SwipeCardType; index: number }) {
  const scale = index === 1 ? 0.95 : 0.90;
  const translateY = index === 1 ? 8 : 16;

  return (
    <View
      style={[
        styles.cardWrapper,
        styles.backCard,
        {
          transform: [{ scale }, { translateY }],
          opacity: index === 1 ? 0.85 : 0.7,
          zIndex: index === 1 ? 1 : 0,
        },
      ]}
    >
      <SwipeCard card={card} />
    </View>
  );
}

export default function CardStack({ cards, onSwipe, onCardPress }: CardStackProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const likeOpacity = useSharedValue(0);
  const passOpacity = useSharedValue(0);
  const isSwiping = useSharedValue(false);

  const handleSwipeComplete = useCallback(
    async (userId: string, direction: 'like' | 'pass') => {
      await onSwipe(userId, direction);
      // Reset values for next card
      translateX.value = 0;
      translateY.value = 0;
      likeOpacity.value = 0;
      passOpacity.value = 0;
      isSwiping.value = false;
    },
    [onSwipe, translateX, translateY, likeOpacity, passOpacity, isSwiping]
  );

  const snapBack = useCallback(() => {
    translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
    translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    likeOpacity.value = withTiming(0, { duration: 150 });
    passOpacity.value = withTiming(0, { duration: 150 });
    isSwiping.value = false;
  }, [translateX, translateY, likeOpacity, passOpacity, isSwiping]);

  const topCard = cards[0];

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (isSwiping.value) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.3;

      const progress = event.translationX / SWIPE_THRESHOLD;
      if (event.translationX > 0) {
        likeOpacity.value = interpolate(progress, [0, 1], [0, 1], Extrapolation.CLAMP);
        passOpacity.value = 0;
      } else {
        passOpacity.value = interpolate(-progress, [0, 1], [0, 1], Extrapolation.CLAMP);
        likeOpacity.value = 0;
      }
    })
    .onEnd((event) => {
      if (isSwiping.value || !topCard) return;

      if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe right = like
        isSwiping.value = true;
        translateX.value = withTiming(
          SWIPE_OUT_DISTANCE,
          { duration: 350 },
          () => {
            runOnJS(handleSwipeComplete)(topCard.user_id, 'like');
          }
        );
        translateY.value = withTiming(event.translationY * 2, { duration: 350 });
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Swipe left = pass
        isSwiping.value = true;
        translateX.value = withTiming(
          -SWIPE_OUT_DISTANCE,
          { duration: 350 },
          () => {
            runOnJS(handleSwipeComplete)(topCard.user_id, 'pass');
          }
        );
        translateY.value = withTiming(event.translationY * 2, { duration: 350 });
      } else {
        runOnJS(snapBack)();
      }
    });

  const topCardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-12, 0, 12],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  if (cards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>You're all caught up!</Text>
        <Text style={styles.emptySubtitle}>
          No more profiles right now — check back soon
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Render cards from bottom to top */}
      {cards[2] && <BackCard card={cards[2]} index={2} />}
      {cards[1] && <BackCard card={cards[1]} index={1} />}

      {/* Top card with gesture */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardWrapper, styles.topCard, topCardStyle]}>
          <SwipeCard
            card={topCard}
            likeOpacity={likeOpacity}
            passOpacity={passOpacity}
            onPress={onCardPress ? () => onCardPress(topCard) : undefined}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    position: 'absolute',
    width: SCREEN_WIDTH - 32,
    alignSelf: 'center',
  },
  topCard: {
    zIndex: 2,
  },
  backCard: {
    // z-index set inline
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.ink,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: Colors.inkMute,
    textAlign: 'center',
    lineHeight: 22,
  },
});

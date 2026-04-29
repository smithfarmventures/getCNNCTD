import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { DS } from '../../constants/DS';
import api from '../../lib/api';
import type { Match, MatchStatus } from '../../constants/types';

const STATUS_COLORS: Record<MatchStatus, string> = {
  new: Colors.brand,
  in_conversation: Colors.brandLight,
  meeting_scheduled: Colors.brand,
  passed: Colors.inkMute,
};

const STATUS_LABELS: Record<MatchStatus, string> = {
  new: 'New',
  in_conversation: 'In Conversation',
  meeting_scheduled: 'Meeting Scheduled',
  passed: 'Passed',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface MatchCardProps {
  match: Match;
  onPress: () => void;
}

function MatchCard({ match, onPress }: MatchCardProps) {
  const statusColor = STATUS_COLORS[match.status] ?? Colors.inkMute;
  const statusLabel = STATUS_LABELS[match.status] ?? match.status;
  const initial = match.counterparty_name?.[0]?.toUpperCase() ?? '?';

  return (
    <TouchableOpacity style={styles.matchCard} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.matchAvatar}>
        <Text style={styles.matchAvatarText}>{initial}</Text>
      </View>

      <View style={styles.matchInfo}>
        <Text style={styles.matchName}>{match.counterparty_name}</Text>
        <View style={styles.matchMeta}>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}22` }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.matchDate}>
        {formatDate(match.last_message_at ?? match.created_at)}
      </Text>
    </TouchableOpacity>
  );
}

export default function PipelineScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMatches = useCallback(async () => {
    try {
      const response = await api.get<{ matches: Match[] }>('/matches');
      setMatches(response.data.matches ?? []);
    } catch (err) {
      console.error('fetchMatches error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMatches();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pipeline</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.brand} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pipeline</Text>
        <Text style={styles.headerCount}>{matches.length} connections</Text>
      </View>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            onPress={() => router.push(`/(main)/messages/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.brand}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No connections yet</Text>
            <Text style={styles.emptySubtitle}>
              Start swiping to build your pipeline
            </Text>
          </View>
        }
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
    fontFamily: DS.fontDisplay,
    fontSize: 28,
    color: Colors.ink,
    letterSpacing: -0.5,
  },
  headerCount: {
    fontSize: 13,
    color: Colors.inkMute,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  matchCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  matchAvatar: {
    width: 48,
    height: 48,
    borderRadius: DS.radiusPill,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchAvatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.ink,
    marginBottom: 5,
    letterSpacing: -0.2,
  },
  matchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  matchDate: {
    fontSize: 12,
    color: Colors.inkMute,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.ink,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.inkMute,
    textAlign: 'center',
    lineHeight: 22,
  },
});

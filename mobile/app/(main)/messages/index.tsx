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
import { Colors } from '../../../constants/colors';
import api from '../../../lib/api';
import type { Match } from '../../../constants/types';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface ThreadItemProps {
  match: Match;
  onPress: () => void;
}

function ThreadItem({ match, onPress }: ThreadItemProps) {
  const initial = match.counterparty_name?.[0]?.toUpperCase() ?? '?';
  const hasMessage = !!match.last_message;

  return (
    <TouchableOpacity style={styles.threadItem} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <View style={styles.threadContent}>
        <View style={styles.threadHeader}>
          <Text style={styles.threadName}>{match.counterparty_name}</Text>
          <Text style={styles.threadTime}>
            {formatDate(match.last_message_at ?? match.created_at)}
          </Text>
        </View>
        <Text
          style={[styles.lastMessage, !hasMessage && styles.noMessage]}
          numberOfLines={1}
        >
          {hasMessage ? match.last_message : 'No messages yet — say hello!'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function MessagesIndexScreen() {
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
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.accentBlue} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThreadItem
            match={item}
            onPress={() => router.push(`/(main)/messages/${item.id}`)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.brand}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>
              Match with someone to start a conversation
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.ink,
    letterSpacing: -0.5,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  threadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
    backgroundColor: Colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  threadContent: {
    flex: 1,
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  threadName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.ink,
    letterSpacing: -0.2,
  },
  threadTime: {
    fontSize: 12,
    color: Colors.inkMute,
  },
  lastMessage: {
    fontSize: 13,
    color: Colors.inkMute,
  },
  noMessage: {
    fontStyle: 'italic',
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

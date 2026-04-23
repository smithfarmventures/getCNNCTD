import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { Colors } from '../../../constants/colors';
import api from '../../../lib/api';
import { useAuthStore } from '../../../store/authStore';
import type { Message } from '../../../constants/types';

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

interface BubbleProps {
  message: Message;
  isOwn: boolean;
}

function Bubble({ message, isOwn }: BubbleProps) {
  return (
    <View style={[styles.bubbleRow, isOwn ? styles.bubbleRowOwn : styles.bubbleRowOther]}>
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={[styles.bubbleText, isOwn && styles.bubbleTextOwn]}>{message.content}</Text>
        <Text style={[styles.bubbleTime, isOwn ? styles.bubbleTimeOwn : styles.bubbleTimeOther]}>
          {formatTime(message.created_at)}
        </Text>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const { user } = useAuthStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [counterpartyName, setCounterpartyName] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!matchId) return;
    try {
      const response = await api.get<{
        messages: Message[];
        counterparty_name?: string;
      }>(`/matches/${matchId}/messages`);
      setMessages(response.data.messages ?? []);
      if (response.data.counterparty_name) {
        setCounterpartyName(response.data.counterparty_name);
      }
    } catch (err) {
      console.error('fetchMessages error:', err);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Poll every 3 seconds when screen is focused
  useFocusEffect(
    useCallback(() => {
      pollIntervalRef.current = setInterval(fetchMessages, 3000);
      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }, [fetchMessages])
  );

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || sending || !matchId) return;

    setInputText('');
    setSending(true);

    // Optimistic update
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      match_id: matchId,
      sender_id: user?.id ?? '',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const response = await api.post<{ message: Message }>(
        `/matches/${matchId}/messages`,
        { content: text }
      );
      // Replace optimistic message with real one
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMsg.id ? response.data.message : m))
      );
    } catch (err) {
      console.error('sendMessage error:', err);
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      setInputText(text);
    } finally {
      setSending(false);
    }

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>
              {counterpartyName?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text style={styles.headerName}>{counterpartyName || 'Chat'}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Bubble message={item} isOwn={item.sender_id === user?.id} />
          )}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Text style={styles.emptyChatText}>
                Start the conversation below!
              </Text>
            </View>
          }
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.messageInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={Colors.inkMute}
            multiline
            maxLength={1000}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
            activeOpacity={0.8}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.sendButtonText}>↑</Text>
            )}
          </TouchableOpacity>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    gap: 12,
    backgroundColor: Colors.cardBg,
  },
  backBtn: {
    padding: 4,
  },
  backBtnText: {
    fontSize: 22,
    color: Colors.ink,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.ink,
    letterSpacing: -0.2,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageList: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
  },
  bubbleRow: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  bubbleRowOwn: {
    justifyContent: 'flex-end',
  },
  bubbleRowOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    borderRadius: 18,
  },
  bubbleOwn: {
    backgroundColor: Colors.brand,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: Colors.cardBg,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  bubbleText: {
    fontSize: 15,
    color: Colors.ink,
    lineHeight: 21,
  },
  bubbleTextOwn: {
    color: '#ffffff',
  },
  bubbleTime: {
    fontSize: 11,
    marginTop: 4,
  },
  bubbleTimeOwn: {
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'right',
  },
  bubbleTimeOther: {
    color: Colors.inkMute,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    backgroundColor: Colors.cardBg,
  },
  messageInput: {
    flex: 1,
    backgroundColor: Colors.pill,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.ink,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.pill,
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  emptyChat: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyChatText: {
    color: Colors.inkMute,
    fontSize: 15,
  },
});

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import type { InvestorProfile, FounderProfile } from '../../constants/types';

function formatMoney(value: number | null | undefined): string {
  if (value == null) return 'N/A';
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

interface FieldRowProps {
  label: string;
  value: string | number | null | undefined;
}

function FieldRow({ label, value }: FieldRowProps) {
  if (value == null || value === '') return null;
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{String(value)}</Text>
    </View>
  );
}

interface TagsRowProps {
  label: string;
  tags: string[];
}

function TagsRow({ label, tags }: TagsRowProps) {
  if (!tags || tags.length === 0) return null;
  return (
    <View style={styles.tagsSection}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.tagsContainer}>
        {tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState<InvestorProfile | FounderProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get<{
        user: typeof user;
        profile: InvestorProfile | FounderProfile;
      }>('/profile');
      setProfile(response.data.profile);
    } catch (err) {
      console.error('fetchProfile error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const handleEdit = () => {
    if (user?.role === 'investor') {
      router.push('/(onboarding)/investor');
    } else {
      router.push('/(onboarding)/founder');
    }
  };

  const renderInvestorProfile = (p: InvestorProfile) => (
    <>
      <FieldRow label="Firm" value={p.firm_name} />
      <FieldRow label="Founded" value={p.year_founded} />
      <FieldRow label="Location" value={p.hq_location} />
      <FieldRow label="Fund Size" value={formatMoney(p.fund_size)} />
      <FieldRow
        label="Check Size"
        value={
          p.check_size_min != null || p.check_size_max != null
            ? `${formatMoney(p.check_size_min)} – ${formatMoney(p.check_size_max)}`
            : null
        }
      />
      <TagsRow label="Stage Focus" tags={p.stage_focus ?? []} />
      <TagsRow label="Industry Focus" tags={p.industry_focus ?? []} />
      {p.investment_thesis ? (
        <View style={styles.thesisSection}>
          <Text style={styles.fieldLabel}>Investment Thesis</Text>
          <Text style={styles.thesisText}>{p.investment_thesis}</Text>
        </View>
      ) : null}
    </>
  );

  const renderFounderProfile = (p: FounderProfile) => (
    <>
      <FieldRow label="Company" value={p.company_name} />
      <FieldRow label="Founded" value={p.year_founded} />
      <FieldRow label="CEO" value={p.ceo_name} />
      <FieldRow label="Location" value={p.hq_location} />
      <FieldRow label="Industry" value={p.industry} />
      <FieldRow label="Stage" value={p.stage} />
      <FieldRow label="Team Size" value={p.employee_count} />
      {p.one_liner ? (
        <View style={styles.thesisSection}>
          <Text style={styles.fieldLabel}>One-liner</Text>
          <Text style={styles.thesisText}>{p.one_liner}</Text>
        </View>
      ) : null}
      <FieldRow label="Round Target" value={formatMoney(p.round_target)} />
      <FieldRow label="Capital Raised" value={formatMoney(p.capital_raised)} />
      <FieldRow label="Revenue LTM" value={formatMoney(p.revenue_ltm)} />
      <FieldRow
        label="YoY Growth"
        value={p.growth_yoy != null ? `${p.growth_yoy}%` : null}
      />
      <FieldRow
        label="Gross Margin"
        value={p.gross_margin != null ? `${p.gross_margin}%` : null}
      />
    </>
  );

  const profileName =
    user?.role === 'investor'
      ? (profile as InvestorProfile)?.firm_name
      : (profile as FounderProfile)?.company_name;

  const roleLabel = user?.role === 'investor' ? 'Investor' : 'Founder';
  const initial = profileName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>{initial}</Text>
          </View>
          <Text style={styles.profileName}>{profileName ?? user?.email ?? 'Your Profile'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{roleLabel}</Text>
          </View>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.brand} />
          </View>
        ) : profile ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Details</Text>
            {user?.role === 'investor'
              ? renderInvestorProfile(profile as InvestorProfile)
              : renderFounderProfile(profile as FounderProfile)}
          </View>
        ) : (
          <View style={styles.noProfile}>
            <Text style={styles.noProfileText}>No profile set up yet.</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEdit}
            activeOpacity={0.85}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    marginBottom: 8,
    backgroundColor: Colors.cardBg,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileAvatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  roleBadge: {
    backgroundColor: Colors.brandBg,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
  },
  roleBadgeText: {
    color: Colors.brand,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  profileEmail: {
    fontSize: 13,
    color: Colors.inkMute,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.inkMute,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  fieldLabel: {
    fontSize: 12,
    color: Colors.inkMute,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  fieldValue: {
    fontSize: 14,
    color: Colors.ink,
    flex: 2,
    textAlign: 'right',
  },
  tagsSection: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.brandBg,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: {
    color: Colors.brand,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  thesisSection: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  thesisText: {
    fontSize: 14,
    color: Colors.inkSoft,
    lineHeight: 22,
    marginTop: 8,
  },
  centered: {
    paddingTop: 60,
    alignItems: 'center',
  },
  noProfile: {
    paddingTop: 40,
    alignItems: 'center',
  },
  noProfileText: {
    color: Colors.inkMute,
    fontSize: 15,
  },
  actionsSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 12,
  },
  editButton: {
    backgroundColor: Colors.ink,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'rgba(224,60,80,0.07)',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(224,60,80,0.2)',
  },
  logoutButtonText: {
    color: Colors.danger,
    fontSize: 16,
    fontWeight: '600',
  },
});

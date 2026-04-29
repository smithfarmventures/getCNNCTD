import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { DS } from '../constants/DS';
import type { SwipeCard as SwipeCardType, Company } from '../constants/types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmtMoney(v: number | null | undefined): string {
  if (v == null) return 'N/A';
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

function fmtPct(v: number | null | undefined): string {
  if (v == null) return 'N/A';
  return `${v.toFixed(1)}%`;
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function toCompany(card: SwipeCardType): Company {
  if (card.type === 'founder') {
    const p = card.profile;
    return {
      user_id: card.user_id,
      name: p.company_name ?? 'Unknown',
      initials: initials(p.company_name ?? '?'),
      logo: p.logo_url ?? null,
      tagline: p.one_liner ?? '',
      stage: p.stage ?? '—',
      matchScore: Math.floor(Math.random() * 15) + 82,
      matchReason: 'Matches your thesis and stage focus',
      tags: [p.industry ?? 'Tech', p.hq_location ?? ''].filter(Boolean),
      arr: p.revenue_ltm != null ? fmtMoney(p.revenue_ltm) : 'N/A',
      yoyGrowth: p.growth_yoy != null ? fmtPct(p.growth_yoy) : 'N/A',
      raiseTarget: p.round_target != null ? fmtMoney(p.round_target) : 'N/A',
      churn: 'N/A',
      grossMargin: p.gross_margin != null ? fmtPct(p.gross_margin) : 'N/A',
      burnMultiple: 'N/A',
      tam: 'N/A',
      founded: p.year_founded != null ? String(p.year_founded) : '—',
      ceo: p.ceo_name ?? '—',
      hq: p.hq_location ?? '—',
      teamSize: p.employee_count ?? '—',
      capitalRaised: p.capital_raised != null ? fmtMoney(p.capital_raised) : '—',
      annualRevenue: p.revenue_ltm != null
        ? [{ year: '2024', label: fmtMoney(p.revenue_ltm), value: p.revenue_ltm }]
        : [],
    };
  }

  const p = card.profile;
  return {
    user_id: card.user_id,
    name: p.firm_name ?? 'Unknown',
    initials: initials(p.firm_name ?? '?'),
    logo: p.photo_url ?? null,
    tagline: p.investment_thesis ?? '',
    stage: (p.stage_focus ?? []).join(', ') || '—',
    matchScore: Math.floor(Math.random() * 15) + 82,
    matchReason: 'Matches your funding stage and industry',
    tags: [...(p.industry_focus ?? []), p.hq_location ?? ''].filter(Boolean),
    arr: p.fund_size != null ? fmtMoney(p.fund_size) + ' fund' : 'N/A',
    yoyGrowth: 'N/A',
    raiseTarget: p.check_size_min != null && p.check_size_max != null
      ? `${fmtMoney(p.check_size_min)}–${fmtMoney(p.check_size_max)}`
      : 'N/A',
    churn: 'N/A',
    grossMargin: 'N/A',
    burnMultiple: 'N/A',
    tam: 'N/A',
    founded: p.year_founded != null ? String(p.year_founded) : '—',
    ceo: '—',
    hq: p.hq_location ?? '—',
    teamSize: '—',
    capitalRaised: '—',
    annualRevenue: [],
  };
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface SwipeCardProps {
  card: SwipeCardType;
  style?: ViewStyle;
  likeOpacity?: SharedValue<number>;
  passOpacity?: SharedValue<number>;
  onPress?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SwipeCard({ card, style, likeOpacity, passOpacity, onPress }: SwipeCardProps) {
  const company = toCompany(card);

  const likeStyle = useAnimatedStyle(() => ({ opacity: likeOpacity ? likeOpacity.value : 0 }));
  const passStyle = useAnimatedStyle(() => ({ opacity: passOpacity ? passOpacity.value : 0 }));

  const stageLabels = ['Seed', 'Series A', 'Series B'];
  const activeStage = stageLabels.find(
    (s) => company.stage.toLowerCase().includes(s.toLowerCase())
  ) ?? null;

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      activeOpacity={0.96}
      onPress={onPress}
    >
      {/* Swipe overlays */}
      <Animated.View style={[styles.likeOverlay, likeStyle]}>
        <Text style={styles.likeText}>LIKE</Text>
      </Animated.View>
      <Animated.View style={[styles.passOverlay, passStyle]}>
        <Text style={styles.passText}>PASS</Text>
      </Animated.View>

      {/* Logo Zone */}
      <View style={styles.logoZone}>
        <View style={styles.matchChip}>
          <View style={styles.matchPip} />
          <Text style={styles.matchText}>{company.matchScore}% match</Text>
        </View>

        <View style={styles.logoBox}>
          <Text style={styles.logoInitials}>{company.initials}</Text>
        </View>

        <Text style={styles.companyName}>{company.name}</Text>
        {company.tagline ? (
          <Text style={styles.companyTagline} numberOfLines={2}>{company.tagline}</Text>
        ) : null}

        <View style={styles.stageRow}>
          {stageLabels.map((s) => (
            <View
              key={s}
              style={[styles.stageChip, activeStage === s && styles.stageChipActive]}
            >
              <Text style={[styles.stageText, activeStage === s && styles.stageTextActive]}>{s}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Grid — 4 uniform pills with JetBrains Mono values */}
      <View style={styles.statsZone}>
        <View style={styles.statsGrid}>
          <StatPill label="ARR" value={company.arr} />
          <StatPill label="YoY Growth" value={company.yoyGrowth} />
          <StatPill label="Raise Target" value={company.raiseTarget} />
          <StatPill label="Churn" value={company.churn} />
        </View>
        {company.tags.length > 0 && (
          <View style={styles.industryRow}>
            {company.tags.map((tag) => (
              <View key={tag} style={styles.indTag}>
                <Text style={styles.indTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.tapHint}>
        <Text style={styles.tapHintText}>Tap to view full profile</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: DS.radiusSwipe,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    flex: 1,
    ...DS.shadowSwipe,
  },
  likeOverlay: {
    position: 'absolute',
    top: 24,
    left: 24,
    borderWidth: 3,
    borderColor: Colors.brand,
    borderRadius: DS.radiusTag,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 10,
  },
  likeText: {
    fontFamily: DS.fontUISemiBold,
    color: Colors.brand,
    fontSize: 20,
    letterSpacing: 2,
  },
  passOverlay: {
    position: 'absolute',
    top: 24,
    right: 24,
    borderWidth: 3,
    borderColor: Colors.danger,
    borderRadius: DS.radiusTag,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 10,
  },
  passText: {
    fontFamily: DS.fontUISemiBold,
    color: Colors.danger,
    fontSize: 20,
    letterSpacing: 2,
  },
  logoZone: {
    paddingTop: 30,
    paddingBottom: 22,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    position: 'relative',
  },
  matchChip: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.brandBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DS.radiusPill,
  },
  matchPip: { width: 5, height: 5, borderRadius: DS.radiusPill, backgroundColor: Colors.brand },
  matchText: { fontFamily: DS.fontUISemiBold, fontSize: 11, color: Colors.brand },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: DS.radiusPill,
    backgroundColor: Colors.pill,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoInitials: {
    fontFamily: DS.fontUISemiBold,
    fontSize: 24,
    color: Colors.brand,
  },
  companyName: {
    fontFamily: DS.fontDisplay,
    fontSize: 19,
    color: Colors.ink,
    marginBottom: 5,
    letterSpacing: -0.4,
  },
  companyTagline: {
    fontFamily: DS.fontUILight,
    fontSize: 12,
    color: Colors.inkMute,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 210,
  },
  stageRow: { flexDirection: 'row', gap: 6, marginTop: 12 },
  stageChip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: DS.radiusPill,
    backgroundColor: Colors.pill,
  },
  stageChipActive: { backgroundColor: Colors.brandMid },
  stageText: { fontFamily: DS.fontUIMedium, fontSize: 10, color: Colors.inkMute },
  stageTextActive: { color: Colors.brand },
  statsZone: { padding: 18 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statPill: {
    width: '47%',
    backgroundColor: Colors.pill,
    borderRadius: DS.radiusCard,
    padding: 12,
  },
  statLabel: {
    fontFamily: DS.fontUIMedium,
    fontSize: 10,
    color: Colors.inkMute,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 3,
  },
  statValue: {
    fontFamily: DS.fontMonoBold,
    fontSize: 15,
    color: Colors.ink,
    letterSpacing: -0.3,
  },
  industryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  indTag: {
    backgroundColor: Colors.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DS.radiusPill,
  },
  indTagText: { fontFamily: DS.fontUI, fontSize: 11, color: Colors.inkSoft },
  tapHint: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    alignItems: 'center',
  },
  tapHintText: { fontFamily: DS.fontUI, fontSize: 11, color: Colors.inkMute },
});

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../../constants/colors';
import { useDiscoverStore } from '../../../store/discoverStore';
import type { AnnualRevenuePoint } from '../../../constants/types';

export default function CompanyDetailScreen() {
  const router = useRouter();
  const company = useDiscoverStore((s) => s.selectedCompany);

  if (!company) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <Text style={styles.emptyText}>No company selected.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const infoRows: [string, string][] = [
    ['Founded', company.founded],
    ['CEO', company.ceo],
    ['HQ', company.hq],
    ['Team size', company.teamSize],
    ['Stage', company.stage],
    ['Raise target', company.raiseTarget],
    ['Capital raised', company.capitalRaised],
  ];

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{company.name}</Text>
          <Text style={styles.headerSub}>{company.stage} · {company.hq}</Text>
        </View>
        <View style={styles.matchChip}>
          <View style={styles.matchPip} />
          <Text style={styles.matchText}>{company.matchScore}%</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero row */}
        <View style={styles.hero}>
          <View style={styles.heroLogo}>
            <Text style={styles.heroInitials}>{company.initials}</Text>
          </View>
          <View style={styles.heroRight}>
            <Text style={styles.heroName}>{company.name}</Text>
            <View style={styles.heroTags}>
              <View style={[styles.htag, styles.htagBrand]}>
                <Text style={[styles.htagText, styles.htagTextBrand]}>{company.stage}</Text>
              </View>
              {company.tags.slice(0, 2).map((t) => (
                <View key={t} style={styles.htag}>
                  <Text style={styles.htagText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Match banner */}
        <View style={styles.matchBanner}>
          <View>
            <Text style={styles.mbLabel}>Match score</Text>
            <Text style={styles.mbValue}>{company.matchScore}%</Text>
          </View>
          <Text style={styles.mbReason}>{company.matchReason}</Text>
        </View>

        {/* 6 key metrics */}
        <Text style={styles.sectionLabel}>Key metrics</Text>
        <View style={styles.metricsGrid}>
          <MetricBox label="ARR" value={company.arr} />
          <MetricBox label="YoY Growth" value={company.yoyGrowth} />
          <MetricBox label="Churn" value={company.churn} />
          <MetricBox label="Gross Margin" value={company.grossMargin} />
          <MetricBox label="Burn Multiple" value={company.burnMultiple} />
          <MetricBox label="TAM" value={company.tam} />
        </View>

        {/* Company details */}
        <Text style={styles.sectionLabel}>Company details</Text>
        <View style={styles.infoBlock}>
          {infoRows.map(([key, val], i) => (
            <View
              key={key}
              style={[
                styles.infoRow,
                i === infoRows.length - 1 && styles.infoRowLast,
              ]}
            >
              <Text style={styles.infoKey}>{key}</Text>
              <Text style={styles.infoVal}>{val}</Text>
            </View>
          ))}
        </View>

        {/* Annual revenue chart */}
        {company.annualRevenue.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Annual revenue</Text>
            <AnnualRevenueChart data={company.annualRevenue} />
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.btn, styles.btnPass]} onPress={() => router.back()}>
          <Text style={styles.btnPassText}>Pass</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnConnect]}>
          <Text style={styles.btnConnectText}>Get CNNCTD</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Annual Revenue Chart (year-level only) ───────────────────────────────────

function AnnualRevenueChart({ data }: { data: AnnualRevenuePoint[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <View style={styles.chartWrap}>
      <View style={styles.chartBars}>
        {data.map((d, i) => (
          <View key={d.year} style={styles.barCol}>
            <Text style={styles.barVal}>{d.label}</Text>
            <View
              style={[
                styles.bar,
                { height: Math.max(4, Math.round((d.value / max) * 60)) },
                i === data.length - 1 && styles.barActive,
              ]}
            />
            <Text style={styles.barYear}>{d.year}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Metric Box ──────────────────────────────────────────────────────────────

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricBox}>
      <Text style={styles.metricVal}>{value}</Text>
      <Text style={styles.metricLbl}>{label}</Text>
    </View>
  );
}

// ─── Back chevron icon ───────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <Text style={{ fontSize: 18, color: Colors.ink, fontWeight: '500', lineHeight: 22 }}>‹</Text>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.cardBg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, color: Colors.inkMute },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    gap: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '600', color: Colors.ink, letterSpacing: -0.3 },
  headerSub: { fontSize: 11, color: Colors.inkMute, marginTop: 1 },
  matchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.brandBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  matchPip: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.brand },
  matchText: { fontSize: 11, fontWeight: '600', color: Colors.brand },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18 },
  // Hero
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    marginBottom: 18,
  },
  heroLogo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: Colors.pill,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroInitials: { fontSize: 22, fontWeight: '600', color: Colors.brand },
  heroRight: { flex: 1 },
  heroName: { fontSize: 17, fontWeight: '600', color: Colors.ink, letterSpacing: -0.3, marginBottom: 6 },
  heroTags: { flexDirection: 'row', gap: 5, flexWrap: 'wrap' },
  htag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: Colors.pill },
  htagBrand: { backgroundColor: Colors.brandBg },
  htagText: { fontSize: 10, color: Colors.inkSoft },
  htagTextBrand: { color: Colors.brand },
  // Match banner
  matchBanner: {
    backgroundColor: Colors.brandBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mbLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Colors.brand,
    marginBottom: 3,
  },
  mbValue: { fontSize: 26, fontWeight: '600', color: Colors.brand, letterSpacing: -0.5 },
  mbReason: { fontSize: 11, color: Colors.brand, opacity: 0.75, maxWidth: 160, lineHeight: 16, textAlign: 'right' },
  // Sections
  sectionLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Colors.inkMute,
    marginBottom: 10,
  },
  // 6-metric grid (3 per row)
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  metricBox: {
    width: '30.5%',
    backgroundColor: Colors.pill,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
  },
  metricVal: { fontSize: 14, fontWeight: '600', color: Colors.ink, letterSpacing: -0.3 },
  metricLbl: {
    fontSize: 9,
    color: Colors.inkMute,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 2,
  },
  // Info block
  infoBlock: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    marginBottom: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoKey: { fontSize: 12, color: Colors.inkMute },
  infoVal: { fontSize: 12, fontWeight: '500', color: Colors.ink },
  // Annual revenue chart
  chartWrap: { backgroundColor: Colors.pill, borderRadius: 16, padding: 16, marginBottom: 22 },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, height: 90 },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  barVal: { fontSize: 9, color: Colors.inkMute, fontWeight: '500' },
  bar: { width: '100%', borderRadius: 5, backgroundColor: 'rgba(26,122,94,0.15)' },
  barActive: { backgroundColor: Colors.brand },
  barYear: { fontSize: 10, color: Colors.inkMute },
  // Action row
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  btn: { height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  btnPass: { flex: 1, backgroundColor: Colors.pill },
  btnPassText: { fontSize: 13, fontWeight: '500', color: Colors.inkSoft },
  btnConnect: { flex: 2, backgroundColor: Colors.brand },
  btnConnectText: { fontSize: 13, fontWeight: '500', color: '#fff' },
});

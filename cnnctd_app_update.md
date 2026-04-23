# CNNCTD App Update — Claude Code Implementation Script

## Summary of Changes
- Swipe card: large logo box + 4 uniform stat pills + industry tags
- Tapping the card navigates to a full-screen detail page (slide-in transition)
- Detail page: match score banner, 6-metric grid, company info rows, annual revenue chart (yearly bars only)
- Pass/CNNCT actions live on both the swipe card view and the detail page
- Annual revenue only — no quarterly breakdown

---

## Component 1: SwipeCard.jsx

```jsx
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const BRAND = '#1a7a5e';
const BRAND_BG = 'rgba(26,122,94,0.09)';
const BRAND_MID = 'rgba(26,122,94,0.18)';

export function SwipeCard({ company, onPass, onConnect }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.96}
      onPress={() => navigation.navigate('CompanyDetail', { company })}
    >
      {/* Logo Zone */}
      <View style={styles.logoZone}>
        <View style={styles.matchChip}>
          <View style={styles.matchPip} />
          <Text style={styles.matchText}>{company.matchScore}% match</Text>
        </View>

        <View style={styles.logoBox}>
          {company.logo
            ? <Image source={{ uri: company.logo }} style={styles.logoImage} />
            : <Text style={styles.logoInitials}>{company.initials}</Text>
          }
        </View>

        <Text style={styles.companyName}>{company.name}</Text>
        <Text style={styles.companyTagline}>{company.tagline}</Text>

        <View style={styles.stageRow}>
          {['Seed', 'Series A', 'Series B'].map(stage => (
            <View
              key={stage}
              style={[styles.stageChip, company.stage === stage && styles.stageChipActive]}
            >
              <Text style={[styles.stageText, company.stage === stage && styles.stageTextActive]}>
                {stage}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Grid — 4 uniform pills */}
      <View style={styles.statsZone}>
        <View style={styles.statsGrid}>
          <StatPill label="ARR" value={company.arr} />
          <StatPill label="YoY Growth" value={company.yoyGrowth} />
          <StatPill label="Raise Target" value={company.raiseTarget} />
          <StatPill label="Churn" value={company.churn} />
        </View>
        <View style={styles.industryRow}>
          {company.tags.map(tag => (
            <View key={tag} style={styles.indTag}>
              <Text style={styles.indTagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Tap hint */}
      <View style={styles.tapHint}>
        <Text style={styles.tapHintText}>Tap to view full profile</Text>
      </View>
    </TouchableOpacity>
  );
}

function StatPill({ label, value }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
    flex: 1,
  },
  logoZone: {
    paddingTop: 30,
    paddingBottom: 22,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    position: 'relative',
  },
  matchChip: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: BRAND_BG,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  matchPip: { width: 5, height: 5, borderRadius: 3, backgroundColor: BRAND },
  matchText: { fontSize: 11, fontWeight: '600', color: BRAND },
  logoBox: {
    width: 84,
    height: 84,
    borderRadius: 22,
    backgroundColor: '#f5f6f8',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoImage: { width: 84, height: 84, borderRadius: 22 },
  logoInitials: { fontSize: 28, fontWeight: '600', color: BRAND },
  companyName: { fontSize: 19, fontWeight: '600', color: '#0d1117', marginBottom: 5, letterSpacing: -0.4 },
  companyTagline: { fontSize: 12, color: '#8a96a8', textAlign: 'center', lineHeight: 18, maxWidth: 210 },
  stageRow: { flexDirection: 'row', gap: 6, marginTop: 12 },
  stageChip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, backgroundColor: '#f5f6f8' },
  stageChipActive: { backgroundColor: BRAND_MID },
  stageText: { fontSize: 10, fontWeight: '500', color: '#8a96a8' },
  stageTextActive: { color: BRAND },
  statsZone: { padding: 18 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statPill: {
    width: '47%',
    backgroundColor: '#f5f6f8',
    borderRadius: 16,
    padding: 12,
  },
  statLabel: { fontSize: 10, color: '#8a96a8', fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 3 },
  statValue: { fontSize: 15, fontWeight: '600', color: '#0d1117', letterSpacing: -0.3 },
  industryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  indTag: { backgroundColor: '#f5f6f8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  indTagText: { fontSize: 11, color: '#4a5568' },
  tapHint: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
  },
  tapHintText: { fontSize: 11, color: '#8a96a8' },
});
```

---

## Component 2: CompanyDetailScreen.jsx

```jsx
import { useRoute, useNavigation } from '@react-navigation/native';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BRAND = '#1a7a5e';
const BRAND_BG = 'rgba(26,122,94,0.09)';

export function CompanyDetailScreen() {
  const navigation = useNavigation();
  const { params: { company } } = useRoute();

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
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

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
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
              {company.tags.slice(0, 2).map(t => (
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
          {[
            ['Founded', company.founded],
            ['CEO', company.ceo],
            ['HQ', company.hq],
            ['Team size', company.teamSize],
            ['Stage', company.stage],
            ['Raise target', company.raiseTarget],
            ['Capital raised', company.capitalRaised],
          ].map(([key, val]) => (
            <View key={key} style={styles.infoRow}>
              <Text style={styles.infoKey}>{key}</Text>
              <Text style={styles.infoVal}>{val}</Text>
            </View>
          ))}
        </View>

        {/* Annual revenue chart */}
        <Text style={styles.sectionLabel}>Annual revenue</Text>
        <AnnualRevenueChart data={company.annualRevenue} />

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.btn, styles.btnPass]} onPress={() => navigation.goBack()}>
          <Text style={styles.btnPassText}>Pass</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnConnect]}>
          <Text style={styles.btnConnectText}>Get CNNCTD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Annual bars only — no quarterly breakdown
function AnnualRevenueChart({ data }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <View style={styles.chartWrap}>
      <View style={styles.chartBars}>
        {data.map((d, i) => (
          <View key={d.year} style={styles.barCol}>
            <Text style={styles.barVal}>{d.label}</Text>
            <View style={[
              styles.bar,
              { height: Math.round((d.value / max) * 60) },
              i === data.length - 1 && styles.barActive
            ]} />
            <Text style={styles.barYear}>{d.year}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function MetricBox({ label, value }) {
  return (
    <View style={styles.metricBox}>
      <Text style={styles.metricVal}>{value}</Text>
      <Text style={styles.metricLbl}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    gap: 12,
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#f5f6f8',
    alignItems: 'center', justifyContent: 'center',
  },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '600', color: '#0d1117', letterSpacing: -0.3 },
  headerSub: { fontSize: 11, color: '#8a96a8', marginTop: 1 },
  matchChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: BRAND_BG, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  matchPip: { width: 5, height: 5, borderRadius: 3, backgroundColor: BRAND },
  matchText: { fontSize: 11, fontWeight: '600', color: BRAND },
  scroll: { flex: 1, paddingHorizontal: 18 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 22, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)', marginBottom: 18 },
  heroLogo: { width: 64, height: 64, borderRadius: 18, backgroundColor: '#f5f6f8', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center' },
  heroInitials: { fontSize: 22, fontWeight: '600', color: BRAND },
  heroName: { fontSize: 17, fontWeight: '600', color: '#0d1117', letterSpacing: -0.3, marginBottom: 6 },
  heroTags: { flexDirection: 'row', gap: 5, flexWrap: 'wrap' },
  htag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: '#f5f6f8' },
  htagBrand: { backgroundColor: BRAND_BG },
  htagText: { fontSize: 10, color: '#4a5568' },
  htagTextBrand: { color: BRAND },
  matchBanner: { backgroundColor: BRAND_BG, borderRadius: 16, padding: 14, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mbLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, color: BRAND, marginBottom: 3 },
  mbValue: { fontSize: 26, fontWeight: '600', color: BRAND, letterSpacing: -0.5 },
  mbReason: { fontSize: 11, color: BRAND, opacity: 0.75, maxWidth: 160, lineHeight: 16, textAlign: 'right' },
  sectionLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, color: '#8a96a8', marginBottom: 10 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  metricBox: { width: '30.5%', backgroundColor: '#f5f6f8', borderRadius: 14, padding: 10, alignItems: 'center' },
  metricVal: { fontSize: 14, fontWeight: '600', color: '#0d1117', letterSpacing: -0.3 },
  metricLbl: { fontSize: 9, color: '#8a96a8', textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 2 },
  infoBlock: { borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: 22 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' },
  infoKey: { fontSize: 12, color: '#8a96a8' },
  infoVal: { fontSize: 12, fontWeight: '500', color: '#0d1117' },
  chartWrap: { backgroundColor: '#f5f6f8', borderRadius: 16, padding: 16, marginBottom: 22 },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, height: 90 },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  barVal: { fontSize: 9, color: '#8a96a8', fontWeight: '500' },
  bar: { width: '100%', borderRadius: 5, backgroundColor: 'rgba(26,122,94,0.15)' },
  barActive: { backgroundColor: BRAND },
  barYear: { fontSize: 10, color: '#8a96a8' },
  actionRow: { flexDirection: 'row', gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.08)' },
  btn: { height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  btnPass: { flex: 1, backgroundColor: '#f5f6f8' },
  btnPassText: { fontSize: 13, fontWeight: '500', color: '#4a5568' },
  btnConnect: { flex: 2, backgroundColor: BRAND },
  btnConnectText: { fontSize: 13, fontWeight: '500', color: '#fff' },
});
```

---

## Sample Data Shape

```js
const exampleCompany = {
  name: 'Aurite',
  initials: 'AU',
  logo: null, // or image URI
  tagline: 'Creator monetization & content infrastructure',
  stage: 'Series A',
  matchScore: 94,
  matchReason: 'Matches your B2B SaaS thesis and $8–15M check range',
  tags: ['Creator Economy', 'SaaS', 'San Francisco'],
  arr: '$4.2M',
  yoyGrowth: '210%',
  raiseTarget: '$12M',
  churn: '2.1%',
  grossMargin: '71%',
  burnMultiple: '1.4×',
  tam: '$28B',
  founded: '2022',
  ceo: 'Jordan Mehta',
  hq: 'San Francisco, CA',
  teamSize: '28 FTE',
  capitalRaised: '$6.8M total',
  annualRevenue: [
    { year: '2022', label: '$0.6M', value: 600000 },
    { year: '2023', label: '$1.4M', value: 1400000 },
    { year: '2024', label: '$4.2M', value: 4200000 },
  ],
};
```

---

## Navigation Setup (React Navigation)

```jsx
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export function DiscoverStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiscoverFeed" component={DiscoverFeedScreen} />
      <Stack.Screen
        name="CompanyDetail"
        component={CompanyDetailScreen}
        options={{
          animation: 'slide_from_right', // native iOS-style push
        }}
      />
    </Stack.Navigator>
  );
}
```

---

## Key Design Notes for Developer

1. **All 4 stat pills must be identical dimensions** — use `width: '47%'` and fixed padding, never auto-size
2. **Logo box is always 84×84 with border-radius 22** — even when a real logo is present, clip it to this shape
3. **Annual revenue chart only** — `annualRevenue` array is year-level only, no quarters
4. **Transition** — use `slide_from_right` (React Navigation) or `UIViewAnimationTransitionCurlUp` equivalent; no fade, no modal
5. **Match score** persists in both views — top-right chip on card, banner on detail page
6. **Both Pass and CNNCT live on the detail page** — don't remove them just because user drilled in

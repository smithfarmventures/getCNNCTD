import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { DS } from '../../constants/DS';
import api from '../../lib/api';
import type { FundingStage, Industry, EmployeeRange } from '../../constants/types';

const TOTAL_STEPS = 9;

const STAGES: FundingStage[] = ['pre-seed', 'seed', 'series-a', 'series-b'];
const INDUSTRIES: Industry[] = [
  'fintech', 'saas', 'deeptech', 'consumer', 'health', 'climate', 'web3', 'other',
];
const EMPLOYEE_RANGES: EmployeeRange[] = ['1-10', '11-50', '51-200', '201+'];

interface FormData {
  company_name: string;
  year_founded: string;
  ceo_name: string;
  hq_location: string;
  industry: Industry | '';
  stage: FundingStage | '';
  employee_count: EmployeeRange | '';
  one_liner: string;
  round_target: string;
  capital_raised: string;
  revenue_ltm: string;
  growth_yoy: string;
  gross_margin: string;
  logo_url: string;
}

const initialForm: FormData = {
  company_name: '',
  year_founded: '',
  ceo_name: '',
  hq_location: '',
  industry: '',
  stage: '',
  employee_count: '',
  one_liner: '',
  round_target: '',
  capital_raised: '',
  revenue_ltm: '',
  growth_yoy: '',
  gross_margin: '',
  logo_url: '',
};

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressDots}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[styles.progressDot, i < step && styles.progressDotFilled]}
          />
        ))}
      </View>
      <Text style={styles.progressLabel}>{step} of {total}</Text>
    </View>
  );
}

function SingleChipSelect<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: T[];
  selected: T | '';
  onSelect: (val: T) => void;
}) {
  return (
    <View style={styles.chipGrid}>
      {options.map((opt) => {
        const active = selected === opt;
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function FounderOnboarding() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => {
    setError('');
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else handleSubmit();
  };

  const back = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await api.put('/profile', {
        company_name: form.company_name,
        year_founded: form.year_founded ? parseInt(form.year_founded, 10) : null,
        ceo_name: form.ceo_name,
        hq_location: form.hq_location,
        industry: form.industry || null,
        stage: form.stage || null,
        employee_count: form.employee_count || null,
        one_liner: form.one_liner,
        round_target: form.round_target ? parseFloat(form.round_target) : null,
        capital_raised: form.capital_raised ? parseFloat(form.capital_raised) : null,
        revenue_ltm: form.revenue_ltm ? parseFloat(form.revenue_ltm) : null,
        growth_yoy: form.growth_yoy ? parseFloat(form.growth_yoy) : null,
        gross_margin: form.gross_margin ? parseFloat(form.gross_margin) : null,
        logo_url: form.logo_url || null,
      });
      router.replace('/(main)/discover');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to save profile. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={styles.stepTitle}>About your company</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company Name *</Text>
              <TextInput
                style={styles.input}
                value={form.company_name}
                onChangeText={(v) => update('company_name', v)}
                placeholder="e.g. Acme Inc."
                placeholderTextColor={Colors.inkMute}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Year Founded</Text>
              <TextInput
                style={styles.input}
                value={form.year_founded}
                onChangeText={(v) => update('year_founded', v)}
                placeholder="e.g. 2022"
                placeholderTextColor={Colors.inkMute}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>
          </>
        );

      case 2:
        return (
          <>
            <Text style={styles.stepTitle}>Leadership & location</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CEO Name</Text>
              <TextInput
                style={styles.input}
                value={form.ceo_name}
                onChangeText={(v) => update('ceo_name', v)}
                placeholder="e.g. Jane Smith"
                placeholderTextColor={Colors.inkMute}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>HQ Location</Text>
              <TextInput
                style={styles.input}
                value={form.hq_location}
                onChangeText={(v) => update('hq_location', v)}
                placeholder="e.g. New York, NY"
                placeholderTextColor={Colors.inkMute}
              />
            </View>
          </>
        );

      case 3:
        return (
          <>
            <Text style={styles.stepTitle}>Industry & stage</Text>
            <Text style={styles.label}>Industry</Text>
            <SingleChipSelect<Industry>
              options={INDUSTRIES}
              selected={form.industry}
              onSelect={(v) => update('industry', v)}
            />
            <Text style={[styles.label, { marginTop: 24 }]}>Funding Stage</Text>
            <SingleChipSelect<FundingStage>
              options={STAGES}
              selected={form.stage}
              onSelect={(v) => update('stage', v)}
            />
          </>
        );

      case 4:
        return (
          <>
            <Text style={styles.stepTitle}>Team size</Text>
            <SingleChipSelect<EmployeeRange>
              options={EMPLOYEE_RANGES}
              selected={form.employee_count}
              onSelect={(v) => update('employee_count', v)}
            />
          </>
        );

      case 5:
        return (
          <>
            <Text style={styles.stepTitle}>Company one-liner</Text>
            <Text style={styles.stepHint}>
              What does your company do? (max 140 chars)
            </Text>
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={form.one_liner}
                onChangeText={(v) => {
                  if (v.length <= 140) update('one_liner', v);
                }}
                placeholder="We help X do Y by doing Z..."
                placeholderTextColor={Colors.inkMute}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{form.one_liner.length}/140</Text>
            </View>
          </>
        );

      case 6:
        return (
          <>
            <Text style={styles.stepTitle}>Fundraise target</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Round Target (USD)</Text>
              <TextInput
                style={styles.input}
                value={form.round_target}
                onChangeText={(v) => update('round_target', v)}
                placeholder="e.g. 2000000"
                placeholderTextColor={Colors.inkMute}
                keyboardType="number-pad"
              />
            </View>
          </>
        );

      case 7:
        return (
          <>
            <Text style={styles.stepTitle}>Capital raised to date</Text>
            <Text style={styles.stepHint}>Optional — skip if pre-revenue</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Raised (USD)</Text>
              <TextInput
                style={styles.input}
                value={form.capital_raised}
                onChangeText={(v) => update('capital_raised', v)}
                placeholder="e.g. 500000"
                placeholderTextColor={Colors.inkMute}
                keyboardType="number-pad"
              />
            </View>
          </>
        );

      case 8:
        return (
          <>
            <Text style={styles.stepTitle}>Key metrics</Text>
            <Text style={styles.stepHint}>All optional — share what's relevant</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Revenue LTM (USD)</Text>
              <TextInput
                style={styles.input}
                value={form.revenue_ltm}
                onChangeText={(v) => update('revenue_ltm', v)}
                placeholder="e.g. 1200000"
                placeholderTextColor={Colors.inkMute}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>YoY Growth (%)</Text>
              <TextInput
                style={styles.input}
                value={form.growth_yoy}
                onChangeText={(v) => update('growth_yoy', v)}
                placeholder="e.g. 150"
                placeholderTextColor={Colors.inkMute}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gross Margin (%)</Text>
              <TextInput
                style={styles.input}
                value={form.gross_margin}
                onChangeText={(v) => update('gross_margin', v)}
                placeholder="e.g. 72"
                placeholderTextColor={Colors.inkMute}
                keyboardType="decimal-pad"
              />
            </View>
          </>
        );

      case 9:
        return (
          <>
            <Text style={styles.stepTitle}>Company logo</Text>
            <Text style={styles.stepHint}>Add a logo URL (optional)</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Logo URL</Text>
              <TextInput
                style={styles.input}
                value={form.logo_url}
                onChangeText={(v) => update('logo_url', v)}
                placeholder="https://..."
                placeholderTextColor={Colors.inkMute}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </>
        );

      default:
        return null;
    }
  };

  const isLastStep = step === TOTAL_STEPS;
  const isOptionalStep = step === 7 || step === 8 || step === 9;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <ProgressBar step={step} total={TOTAL_STEPS} />

          <View style={styles.stepContent}>
            {renderStep()}
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          {step > 1 && (
            <TouchableOpacity style={styles.backFooterButton} onPress={back} activeOpacity={0.7}>
              <Text style={styles.backFooterText}>Back</Text>
            </TouchableOpacity>
          )}

          {isOptionalStep && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={isLastStep ? handleSubmit : next}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.nextButton, loading && styles.disabledButton]}
            onPress={next}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.nextButtonText}>
                {isLastStep ? 'Complete Profile' : 'Continue'}
              </Text>
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
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  progressContainer: {
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressDots: {
    flexDirection: 'row',
    gap: 5,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: DS.radiusPill,
    backgroundColor: Colors.creamDark,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  progressDotFilled: {
    backgroundColor: Colors.brand,
    borderColor: Colors.brand,
  },
  progressLabel: {
    fontFamily: DS.fontUI,
    fontSize: 12,
    color: Colors.inkMute,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: DS.fontDisplayItalic,
    fontSize: 30,
    color: Colors.ink,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  stepHint: {
    fontSize: 14,
    color: Colors.inkMute,
    marginBottom: 20,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    color: Colors.inkMute,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.ink,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  charCount: {
    fontSize: 12,
    color: Colors.inkMute,
    textAlign: 'right',
    marginTop: 6,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  chipActive: {
    backgroundColor: Colors.brandBg,
    borderColor: Colors.brand,
  },
  chipText: {
    fontSize: 14,
    color: Colors.inkSoft,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: Colors.brand,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: 'rgba(224,60,80,0.07)',
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(224,60,80,0.25)',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    backgroundColor: Colors.cream,
  },
  backFooterButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backFooterText: {
    color: Colors.inkSoft,
    fontSize: 15,
    fontWeight: '600',
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    color: Colors.inkMute,
    fontSize: 15,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    backgroundColor: Colors.ink,
    borderRadius: DS.radiusPill,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  nextButtonText: {
    fontFamily: DS.fontUISemiBold,
    color: '#ffffff',
    fontSize: 16,
  },
});

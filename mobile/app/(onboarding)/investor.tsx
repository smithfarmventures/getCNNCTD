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
import api from '../../lib/api';
import type { FundingStage, Industry } from '../../constants/types';

const TOTAL_STEPS = 7;

const STAGES: FundingStage[] = ['pre-seed', 'seed', 'series-a', 'series-b', 'growth'];
const INDUSTRIES: Industry[] = [
  'fintech', 'saas', 'deeptech', 'consumer', 'health', 'climate', 'web3', 'other',
];

interface FormData {
  firm_name: string;
  year_founded: string;
  hq_location: string;
  fund_size: string;
  check_size_min: string;
  check_size_max: string;
  stage_focus: FundingStage[];
  industry_focus: Industry[];
  investment_thesis: string;
  photo_url: string;
}

const initialForm: FormData = {
  firm_name: '',
  year_founded: '',
  hq_location: '',
  fund_size: '',
  check_size_min: '',
  check_size_max: '',
  stage_focus: [],
  industry_focus: [],
  investment_thesis: '',
  photo_url: '',
};

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <View
          style={[styles.progressFill, { width: `${((step) / total) * 100}%` }]}
        />
      </View>
      <Text style={styles.progressLabel}>
        Step {step} of {total}
      </Text>
    </View>
  );
}

function ChipSelect<T extends string>({
  options,
  selected,
  multi,
  onSelect,
}: {
  options: T[];
  selected: T[];
  multi: boolean;
  onSelect: (val: T[]) => void;
}) {
  const toggle = (val: T) => {
    if (multi) {
      if (selected.includes(val)) {
        onSelect(selected.filter((v) => v !== val));
      } else {
        onSelect([...selected, val]);
      }
    } else {
      onSelect([val]);
    }
  };

  return (
    <View style={styles.chipGrid}>
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => toggle(opt)}
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

export default function InvestorOnboarding() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof FormData, value: FormData[keyof FormData]) => {
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
        firm_name: form.firm_name,
        year_founded: form.year_founded ? parseInt(form.year_founded, 10) : null,
        hq_location: form.hq_location,
        fund_size: form.fund_size ? parseFloat(form.fund_size) : null,
        check_size_min: form.check_size_min ? parseFloat(form.check_size_min) : null,
        check_size_max: form.check_size_max ? parseFloat(form.check_size_max) : null,
        stage_focus: form.stage_focus,
        industry_focus: form.industry_focus,
        investment_thesis: form.investment_thesis,
        photo_url: form.photo_url || null,
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
            <Text style={styles.stepTitle}>Tell us about your firm</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Firm Name *</Text>
              <TextInput
                style={styles.input}
                value={form.firm_name}
                onChangeText={(v) => update('firm_name', v)}
                placeholder="e.g. Sequoia Capital"
                placeholderTextColor={Colors.inkMute}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Year Founded</Text>
              <TextInput
                style={styles.input}
                value={form.year_founded}
                onChangeText={(v) => update('year_founded', v)}
                placeholder="e.g. 2008"
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
            <Text style={styles.stepTitle}>Location & fund size</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>HQ Location</Text>
              <TextInput
                style={styles.input}
                value={form.hq_location}
                onChangeText={(v) => update('hq_location', v)}
                placeholder="e.g. San Francisco, CA"
                placeholderTextColor={Colors.inkMute}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fund Size (USD)</Text>
              <TextInput
                style={styles.input}
                value={form.fund_size}
                onChangeText={(v) => update('fund_size', v)}
                placeholder="e.g. 100000000"
                placeholderTextColor={Colors.inkMute}
                keyboardType="number-pad"
              />
            </View>
          </>
        );

      case 3:
        return (
          <>
            <Text style={styles.stepTitle}>Check size range</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Minimum Check (USD)</Text>
              <TextInput
                style={styles.input}
                value={form.check_size_min}
                onChangeText={(v) => update('check_size_min', v)}
                placeholder="e.g. 250000"
                placeholderTextColor={Colors.inkMute}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Maximum Check (USD)</Text>
              <TextInput
                style={styles.input}
                value={form.check_size_max}
                onChangeText={(v) => update('check_size_max', v)}
                placeholder="e.g. 2000000"
                placeholderTextColor={Colors.inkMute}
                keyboardType="number-pad"
              />
            </View>
          </>
        );

      case 4:
        return (
          <>
            <Text style={styles.stepTitle}>Stage focus</Text>
            <Text style={styles.stepHint}>Select all that apply</Text>
            <ChipSelect<FundingStage>
              options={STAGES}
              selected={form.stage_focus}
              multi
              onSelect={(v) => update('stage_focus', v)}
            />
          </>
        );

      case 5:
        return (
          <>
            <Text style={styles.stepTitle}>Industry focus</Text>
            <Text style={styles.stepHint}>Select all that apply</Text>
            <ChipSelect<Industry>
              options={INDUSTRIES}
              selected={form.industry_focus}
              multi
              onSelect={(v) => update('industry_focus', v)}
            />
          </>
        );

      case 6:
        return (
          <>
            <Text style={styles.stepTitle}>Investment thesis</Text>
            <Text style={styles.stepHint}>
              Describe what you look for in investments (max 280 chars)
            </Text>
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={form.investment_thesis}
                onChangeText={(v) => {
                  if (v.length <= 280) update('investment_thesis', v);
                }}
                placeholder="We invest in early-stage companies transforming..."
                placeholderTextColor={Colors.inkMute}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {form.investment_thesis.length}/280
              </Text>
            </View>
          </>
        );

      case 7:
        return (
          <>
            <Text style={styles.stepTitle}>Profile photo</Text>
            <Text style={styles.stepHint}>Add a photo URL (optional)</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Photo URL</Text>
              <TextInput
                style={styles.input}
                value={form.photo_url}
                onChangeText={(v) => update('photo_url', v)}
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
  const isOptionalStep = step === 7;

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
              onPress={handleSubmit}
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
  },
  progressTrack: {
    height: 3,
    backgroundColor: Colors.creamDark,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.brand,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.inkMute,
    textAlign: 'right',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '700',
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
    height: 120,
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
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

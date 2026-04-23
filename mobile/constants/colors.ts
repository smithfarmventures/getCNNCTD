// ── Brand / light-theme design tokens ────────────────────────────────────────
export const Colors = {
  // Core brand
  brand:        '#1a7a5e',
  brandLight:   '#22a87d',
  brandBg:      'rgba(26,122,94,0.09)',
  brandMid:     'rgba(26,122,94,0.18)',

  // Ink (text) scale
  ink:          '#0c0f0e',
  inkSoft:      '#3a3f3c',
  inkMute:      '#7a8480',

  // Backgrounds / surfaces
  cream:        '#f7f5f0',
  creamDark:    '#ede9e1',
  cardBg:       '#ffffff',
  cardBorder:   'rgba(0,0,0,0.08)',
  pill:         '#f5f6f8',

  // Status
  success:      '#1a7a5e',   // brand green
  danger:       '#e03c50',

  // ── Legacy aliases — all remapped to the light theme ─────────────────────
  // Screens that still reference these will now render with the correct palette.
  background:   '#f7f5f0',   // was dark navy
  surface:      '#ffffff',   // was dark surface card
  textPrimary:  '#0c0f0e',   // was white
  textSecondary:'#7a8480',   // was light blue-grey
  accentBlue:   '#1a7a5e',   // was blue → brand green
  primaryDark:  'rgba(26,122,94,0.09)',  // was dark teal → brandBg
  primaryMid:   '#1a7a5e',   // was mid teal → brand
  primaryLight: '#22a87d',   // was light teal → brandLight
} as const;

export type ColorKey = keyof typeof Colors;

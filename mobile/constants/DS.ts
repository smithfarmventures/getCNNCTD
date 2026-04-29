export const DS = {
  // Font families — loaded in _layout.tsx via useFonts
  fontDisplay:       'InstrumentSerif_400Regular',
  fontDisplayItalic: 'InstrumentSerif_400Regular_Italic',
  fontUI:            'DMSans_400Regular',
  fontUILight:       'DMSans_300Light',
  fontUIMedium:      'DMSans_500Medium',
  fontUISemiBold:    'DMSans_600SemiBold',
  fontMono:          'JetBrainsMono_400Regular',
  fontMonoBold:      'JetBrainsMono_600SemiBold',

  // Shadows
  shadowCard:   { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 32, elevation: 8 },
  shadowModal:  { shadowColor: '#000', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.1, shadowRadius: 48, elevation: 16 },
  shadowSwipe:  { shadowColor: '#000', shadowOffset: { width: 0, height: 40 }, shadowOpacity: 0.18, shadowRadius: 80, elevation: 24 },
  shadowBrand:  { shadowColor: '#1a7a5e', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 6 },

  // Radii
  radiusTag:     4,
  radiusInput:   8,
  radiusCard:    16,
  radiusCardLg:  20,
  radiusSheet:   24,
  radiusSwipe:   32,
  radiusPill:    9999,
} as const;

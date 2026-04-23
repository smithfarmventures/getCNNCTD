import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0c0f0e',
          soft: '#3a3f3c',
          mute: '#7a8480',
        },
        cream: {
          DEFAULT: '#f7f5f0',
          dark: '#ede9e1',
        },
        green: {
          DEFAULT: '#1a7a5e',
          light: '#22a87d',
        },
        // Dark-theme tokens used by WaitlistForm (and future app screens)
        'bg-base': '#0a0f0e',
        'bg-surface': '#111816',
        'text-secondary': '#9aa7a2',
        'brand-mid': '#1a7a5e',
        'brand-light': '#22a87d',
        success: '#00C48C',
        danger: '#ff5d5d',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        serif: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
      },
      animation: {
        ticker: 'ticker 22s linear infinite',
        floatA: 'floatA 4s ease-in-out infinite',
      },
      keyframes: {
        ticker: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        floatA: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config

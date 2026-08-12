// apps/dashboard/tailwind.config.js
// Brand theme inlined as plain JS (Tailwind config is loaded by Node/PostCSS, which can't
// require the TS token preset). Values mirror @sr/design-tokens — keep them in sync.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: { DEFAULT: '#FF5A2A', pressed: '#E8511F', light: '#FFB399', softer: '#FFC0AA' },
        navy: { DEFAULT: '#12233B', deep: '#1B365D' },
        cream: '#FEFBF5',
        splash: '#FEF6EE',
        grey: { mid: '#6B7280', light: '#9CA3AF' },
        border: { DEFAULT: '#E5E5E5', form: '#E5E7EB', divider: '#F3F4F6' },
        success: { DEFAULT: '#2E9E6F', transfer: '#5F9F62', wallet: '#16A34A' },
        processing: '#F59E0B',
        warning: '#FFC107',
        failed: '#E5533D',
        error: '#D64545',
      },
      borderRadius: { input: '12px', button: '15px', card: '20px', sheet: '24px' },
      fontFamily: { display: ['Sora', 'sans-serif'], sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
};

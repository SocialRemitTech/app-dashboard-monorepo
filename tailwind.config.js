const { tailwindPreset } = require('@sr/design-tokens/src/tailwind-preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset'), tailwindPreset],
};

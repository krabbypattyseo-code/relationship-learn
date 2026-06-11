import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rgp: {
          green: '#074836',
          'green-light': '#0a5c45',
          'green-dark': '#053628',
          yellow: '#FFD700',
          'yellow-soft': '#FFE566',
          cream: '#F9F7F2',
          charcoal: '#1a1a1a',
          muted: '#6b7280',
          harist: '#7C3AED',
          dian: '#0F766E',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;

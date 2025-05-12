import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-slate': '#2C3E50',
        'primary-text-on-slate': '#FFFFFF',
        'secondary-text-on-slate': '#B0BEC5',
        
        'banner-blue': '#87cde7',
        'banner-text': '#FFFFFF',
        
        'action-teal': '#00a4bd',
        'action-teal-hover': '#007a8c',
        
        'table-header-bg': '#f8f9fa',      // For tables on light backgrounds
        'table-row-even-bg': '#FFFFFF',   // For tables on light backgrounds
        'table-row-odd-bg': '#f1f3f5',    // For tables on light backgrounds
        'table-text-dark': '#212529',     // For tables on light backgrounds

        'chart-scope1': '#5DADE2',
        'chart-scope2': '#F39C12',
        'chart-scope3': '#AF7AC5',
        'chart-grid': '#e0e0e0',
        'chart-axis-text-light': '#B0BEC5', // For charts on dark backgrounds
        'chart-axis-text-dark': '#666666',   // For charts on light backgrounds

        'cookie-banner-bg': '#34495E',
        'cookie-banner-text': '#FFFFFF',

        // Neutral shades from previous palette, can be useful
        'neutral-dark': '#34495E', 
        'neutral-light': '#566573',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
        // If you decide to use a specific web font like Inter, you'd set it up via next/font
        // and potentially reference it here or directly in globals.css.
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
export default config

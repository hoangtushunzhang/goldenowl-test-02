// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-rubik)', 'sans-serif'],
      },
    },
  },
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  plugins: [],
};
export default config;

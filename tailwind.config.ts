import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens:{
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      colors:{
        primary: '#4E73DF',
        secondary: '#F8F9FC',
        nav: '#1E293B',
        gray: '#94A3B8',
        blue: '#38BDF8',
      }
    },
  },
  plugins: [],
};
export default config;

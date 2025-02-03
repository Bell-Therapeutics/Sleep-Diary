import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: {
          primary: "#333333",
          secondary: "#999999",
          loginInput: "#F9FAFB",
          loginInputBorder: "#DBDBDB",
          inputTextColor: "#AAAFBC",
        },
        blue: {
          primary: "#4880ED",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

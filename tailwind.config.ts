import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      mobleHeight: { raw: "(max-height: 770px)" },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: {
          primary: "#333333",
          secondary: "#999999",
          tertiary: "#777777",
          loginInput: "#F9FAFB",
          loginInputBorder: "#DBDBDB",
          inputTextColor: "#AAAFBC",
          date: "#A3A3A3",
        },
        calendar: {
          primary: "#AFAFAF",
        },
        day: {
          primary: "#EDF2FD",
          border: "#4880ED",
        },
        blue: {
          primary: "#4880ED",
          secondary: "#ABC4F7",
        },
        button: {
          disabled: "#E0E5EF",
        },
        toolTip: {
          primary: "#C8D9FA",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: { xs: "480px" },
      colors: {
        // add custom colors here if needed
      },
      transitionDuration: {
        DEFAULT: "250ms",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
    },
  },

  daisyui: {
    logs: false,
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          primary: "#1E6FBF",
          "tableHeaderbg": "#5E9CD9",
          "primary-content": "#71CBE0",
          secondary: "#010810",
          accent: "#C3DEC9",
          neutral: "#D9EBFD",
          "base-100": "#ffffff",
          "base-200": "#e5e7eb",
          "base-300": "#d1d5db",
          info: "#B6E0EA",
          success: "#22B843",
          warning: "#FABA17",
          error: "#E54D4D",
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          primary: "#4F46E5",
          "primary-content": "#D1D5DB",
          secondary: "#818CF8",
          accent: "#A78BFA",
          neutral: "#374151",
          "base-100": "#1F2937",
          "base-200": "#111827",
          "base-300": "#1C1F24",
          info: "#60A5FA",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
    ],
  },

  plugins: [require("daisyui")],
}

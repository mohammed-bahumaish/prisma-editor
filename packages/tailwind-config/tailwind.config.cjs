/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",

  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        edge: "#5c7194",
        modal: "#1A202C",
        "brand-darker": "#1A202C",
        "brand-dark": "#2D3748",
        "brand-indigo-1": "#5a67d8",
        "brand-indigo-2": "#4c51bf",
        "brand-teal-1": "#16A394",
        "brand-teal-2": "#187367",
        "brand-blue": "#2c7ad6",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
};

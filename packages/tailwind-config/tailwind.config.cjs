/** @type {import('tailwindcss').Config} */
module.exports = {
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
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        //primary: "#F4F4F4",
        primary: "#16423C",
        secondary: "#6A9C89",
        accent: "#C4DAD2",
        section: "#F9F9F9",
        titleText : "#16423C",
        text: "#626766",
        "text-primary": "#323635",
      },
      fontFamily: {
        geist: ["Geist", "system-ui", "sans-serif"],
      },
      fontSize: {
        "h1-desktop": "36px",
        "h2-desktop": "32px",
        "h1-tablet": "32px",
        "h2-tablet": "28px",
        "h1-mobile": "28px",
        "h2-mobile": "24px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
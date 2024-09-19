/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      fontSize: {
        36: "2.25rem", // Equivalent to 36px
        16: "1rem",
        14: "14px",
      },
      fontWeight: {
        semibold: 600,
        lightbold: 500,
        normal: 400,
      },
      lineHeight: {
        44: "2.75rem", // Equivalent to 44px
        24: "1.5rem", // Equivalent to 24px
        20: "20px",
      },
      letterSpacing: {
        "-02": "-0.02em",
      },
      textAlign: {
        left: "left",
      },
      colors: {
        "custom-gray": "#94969C",
        black: {
          1000: "#1F242F",
          950: "#0C111D",
        },
        white: {
          1000: "#FFFFFF",
          950: "#CECFD2",
        },
        primary: "#2C5364",
        "primary-hover": "#A397D6",
        "main-black": "#1f1f1f",
        purple: "#b987f3",
        blue: "#371c7b",
        parrot: "#acdb18",
        gray: "#d3d5d8",
      },
      animation: {
        "spin-slow": "spin 1s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
  corePlugins: {
    preflight: false, // <== disable this!
  },
};

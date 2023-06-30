/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
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

      typography: (theme) => ({
        DEFAULT: {
          css: {
            'p[class~="text-sm"]': {
              fontSize: '16px',
            },
            'h1, h2, h3': {
              marginTop: '0',
              marginBottom: '12px',
            },
            'h1': {
              fontSize: theme('fontSize.4xl'),
            },
            'h2': {
              fontSize: theme('fontSize.3xl'),
            },
            'h3': {
              fontSize: theme('fontSize.2xl'),
            },
            'p': {
              fontSize: '15px',
              marginBottom: '20px',
            },
            'h1 + p, h2 + p, h3 + p, hr + p': {
              marginTop: '0',
            },
            'ol, ul': {
              marginTop: '0',
              marginBottom: '20px',
            },
            'li:not(:last-child)': {
              marginBottom: '8px',
            },
            'li > p': {
              margin: '0',
            },
            'img': {
              marginTop: '0',
              marginBottom: '32px',
            },
            'blockquote': {
              marginBlock: '26px',
            },
            'hr': {
              marginBlock: '32px',
            },
            '.footer': {
              display: 'block',
              fontSize: '13px',
              marginBottom: '20px',
            },
            '.spacer + *': {
              marginTop: '0',
            },
            'p + .spacer': {
              marginTop: '-20px',
            },
            'h1 + .spacer, h2 + .spacer, h3 + .spacer': {
              marginTop: '-12px',
            },
            'ol + .spacer, ul + .spacer': {
              marginTop: '-20px',
            },
            'img + .spacer': {
              marginTop: '-32px',
            },
            '.node-button + .spacer, footer + .spacer': {
              marginTop: '-20px',
            },
            '.node-button': {
              marginTop: '0',
              marginBottom: '20px',
            },
          },
        },
      }),
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}

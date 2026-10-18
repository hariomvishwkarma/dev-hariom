/** @type {import('tailwindcss').Config} */
const path = require('path');

module.exports = {
  content: [path.resolve(__dirname, './**/*.liquid'), path.resolve(__dirname, './src/**/*.js')],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    strokeOpacity: {
      0: '0',
      5: '0.05',
      10: '0.1',
      15: '0.15',
      20: '0.2',
      25: '0.25',
      30: '0.3',
      35: '0.35',
      40: '0.4',
      45: '0.45',
      50: '0.5',
      55: '0.55',
      60: '0.6',
      65: '0.65',
      70: '0.7',
      75: '0.75',
      80: '0.8',
      85: '0.85',
      90: '0.9',
      95: '0.95',
      100: '1',
    },
    fontWeight: {
      thin: '100',
      extralight: '100',
      light: '200',
      normal: '300',
      medium: '400',
      semibold: '500',
      bold: '600',
      extrabold: '600',
      black: '700',
    },
    extend: {
      width: {
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        8.5: '2.125rem',
        9.5: '2.375rem',
      },
      height: {
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        8.5: '2.125rem',
        9.5: '2.375rem',
      },
      colors: {
        grey: {
          100: 'var(--color-grey-100)',
          200: 'var(--color-grey-200)',
          300: 'var(--color-grey-300)',
          400: 'var(--color-grey-400)',
          500: 'var(--color-grey-500)',
          600: 'var(--color-grey-600)',
          700: 'var(--color-grey-700)',
        },
        background: 'rgba(var(--color-background))',
        foreground: 'rgba(var(--color-foreground))',
        'secondary-background': 'rgba(var(--secondary-background))',
        'gradient-background': 'rgba(var(--color-gradient-background))',
        accent: 'rgba(var(--color-accent))',
        shadow: 'rgba(var(--color-shadow))',
        borders: 'rgba(var(--color-borders))',
        'light-sage': 'rgba(var(--color-light-sage))',
        'island-sea': 'rgba(var(--color-island-sea))',
        'dark-green': 'rgba(var(--color-dark-green))',
        violet: 'rgba(var(--color-violet))',
        'dark-violet': 'rgba(var(--color-dark-violet))',
        peri: 'rgba(var(--color-peri))',
        ivory: 'rgba(var(--color-ivory))',
        vanilla: 'rgba(var(--color-vanilla))',
        mocha: 'rgba(var(--color-mocha))',
        sunset: 'rgba(var(--color-sunset))',
        button: 'rgba(var(--color-button))',
        'button-text': 'rgba(var(--color-button-text))',
        'secondary-button': 'rgba(var(--color-secondary-button))',
        'secondary-button-text': 'rgba(var(--color-secondary-button-text))',
        link: 'rgba(var(--color-link))',
        'badge-foreground': 'rgba(var(--color-badge-foreground))',
        'badge-background': 'rgba(var(--color-badge-background))',
        'badge-border': 'rgba(var(--color-badge-border))',
        'shade-1': 'rgba(var(--color-shade-1))',
        'shade-2': 'rgba(var(--color-shade-2))',
        'shade-3': 'rgba(var(--color-shade-3))',
        alert: 'rgba(var(--color-alert))',
        error: 'rgba(var(--color-error))',
        success: 'rgba(var(--color-success))',
        pressed: '#96AEDE',
        form: '#B9B9B9',
        'bibs-night': 'var(--brand-night)',
      },
      fontSize: {
        xxs: '0.6875rem',
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.75rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '2.625rem',
        '7xl': '2.875rem',
        '7.5xl': '3rem',
        '8xl': '3.125rem',
        '9xl': '5rem',
      },
      lineHeight: {
        xxs: '0.6875rem',
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '1xl': '1.875rem',
        '2xl': '2.813rem',
        '3xl': '3.125rem',
        '4xl': '3.25rem',
        '5xl': '3.438rem',
        '6xl': '5rem',
        3.5: '0.875rem',
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        8.5: '2.125rem',
        9.5: '2.375rem',
      },
      borderRadius: {
        none: '0',
        xs: '0.1875rem',
        sm: '0.25rem',
        default: '0.3125rem',
        lg: '0.625rem',
        xl: '1rem',
        '2xl': '1.0625rem',
        '3xl': '1.125rem',
        '4xl': '1.9375rem',
        '5xl': '3.125rem',
      },
      screens: {
        xs: '450px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1636px',
      },
      maxWidth: {
        '8xl': '96rem',
      },
      spacing: {
        128: '32rem',
      },
      padding: {
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        8.5: '2.125rem',
        9.5: '2.375rem',
        full: '100%',
        half: '50%',
      },
      margin: {
        full: '100%',
        half: '50%',
      },
      inset: {
        half: '50%',
      },
      letterSpacing: {
        sm: '0.11px',
        base: '0.14px',
      },
      keyframes: {
        slide: {
          '0%': {
            transform: 'translateX(100%)',
          },
          '10%': {
            transform: 'translateX(0)',
          },
          '90%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-100%)',
          },
        },
        pulsing: {
          '100%': {
            transform: 'scale(1.5)',
            opacity: 0,
          },
        },
      },
      animation: {
        slide: 'slide linear infinite',
        'spin-slow': 'spin 1.2s linear infinite',
        pulsing: 'pulsing 1.2s infinite',
      },
      aspectRatio: {
        portrait: '3 / 4',
        rectangle: '5 / 4',
        '6/4': '6 / 4',
        '5/2': '5 / 2',
        2: '2 / 1',
        3: '3 / 1',
        4: '4 / 1',
      },
      zIndex: {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        15: '15',
        25: '25',
        35: '35',
        45: '45',
      },
      gridTemplateColumns: {
        '2_1': 'minmax(0, 2fr) minmax(0, 1fr)',
        '1_2': 'minmax(0, 1fr) minmax(0, 2fr)',
        '3_2': 'minmax(0, 3fr) minmax(0, 2fr)',
        '2_3': 'minmax(0, 2fr) minmax(0, 3fr)',
      },
      gridTemplateRows: {
        'auto/1': 'auto minmax(0, 1fr)',
      },
    },
    container: {
      center: true,
      padding: '1rem',
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      textColor: ['disabled'],
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('first-child', '& > *:first-child');
      addVariant('first-child-hover', '@media (hover: hover) { &:hover > *:first-child }');
      addVariant('last-child', '& > *:last-child');
      addVariant('last-child-hover', '@media (hover: hover) { &:hover > *:last-child }');
      addVariant('child', '& > *');
      addVariant('child-hover', '&:hover > *');
      addVariant('peer-placeholder-shown', '&:placeholder-shown ~ label');
      addVariant('peer-focus', '&:focus ~ label');
      addVariant('select-valid', '&:not([value=""]):valid ~ label');
    },
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'stroke-opacity': (value) => ({
            strokeOpacity: value,
          }),
        },
        {
          values: theme('strokeOpacity'),
        }
      );
    },
  ],
};

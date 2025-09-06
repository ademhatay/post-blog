export const COLORS = {
  main: '#1d3557',
  primary: '#457b9d',
  secondary: '#a8dadc',
  background: '#f1faee',
  error: '#e63946',

  ui: {
    background: '#f1faee',
    surface: '#ffffff',
    border: '#a8dadc',
    borderStrong: '#457b9d',
    inputBg: '#ffffff',
    inputText: '#1d3557',
    inputBorder: '#a8dadc',
    inputBorderFocus: '#457b9d',
    buttonPrimaryBg: '#1d3557',
    buttonPrimaryHover: '#457b9d',
    buttonPrimaryText: '#ffffff',
    buttonSecondaryBg: '#e63946',
    buttonSecondaryHover: '#c42f3b',
    buttonSecondaryText: '#ffffff',
    disabledBg: '#a8dadc',
    disabledText: '#457b9d',
  },
} as const

export type ColorPalette = typeof COLORS

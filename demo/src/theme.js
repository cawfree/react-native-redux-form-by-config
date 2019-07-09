import { createTheming } from '@callstack/react-theme-provider';

const marginExtraShort = 5;
const marginShort = 10;
const marginStandard = 15;

export const defaultTheme = {
  marginExtraShort,
  marginShort,
  marginStandard,
  backgroundColor: '#FFFFFFFF',
  thumbSize: 50,
  borderRadius: marginShort,
  linkStyle: {
    color: '#2980b9',
  },
  errorMessageStyle: {
    height: 25,
    color: '#FF0000FF',
  }
};

const theme = createTheming(
  defaultTheme,
);

const { ThemeProvider } = theme;

export const { withTheme, useTheme } = theme;

export default ThemeProvider;

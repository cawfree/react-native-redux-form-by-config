import { createTheming } from '@callstack/react-theme-provider';

const marginExtraShort = 5;
const marginShort = 10;
const marginStandard = 15;

const defaultTheme = {
  marginExtraShort,
  marginShort,
  marginStandard,
  backgroundColor: '#FFFFFFFF',
  thumbSize: 50,
  linkStyle: {
    color: '#2980b9',
  },
  errorMessageStyle: {
    height: 25,
    color: '#FF0000FF',
  }
};

const {
  ThemeProvider,
  withTheme,
  useTheme,
} = createTheming(
  defaultTheme,
);

module.exports = {
  ThemeProvider,
  withTheme,
  useTheme,
  defaultTheme,
};

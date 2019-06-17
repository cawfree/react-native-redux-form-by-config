import { createTheming } from '@callstack/react-theme-provider';

const marginExtraShort = 5;
const marginShort = 10;
const marginStandard = 15;

const theme = createTheming(
  {
    marginExtraShort,
    marginShort,
    marginStandard,
    backgroundColor: '#FFFFFFFF',
    thumbSize: 50,
    linkStyle: {
      color: '#2980b9',
    },
  },
);

const { ThemeProvider } = theme;

export const { withTheme, useTheme } = theme;

export default ThemeProvider;

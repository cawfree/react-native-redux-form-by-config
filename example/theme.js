import { createTheming } from '@callstack/react-theme-provider';

const marginExtraShort = 5;
const marginShort = 10;
const marginStandard = 15;

const {
  ThemeProvider,
  withTheme,
  useTheme,
} = createTheming(
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

module.exports = {
  ThemeProvider,
  withTheme,
  useTheme,
};

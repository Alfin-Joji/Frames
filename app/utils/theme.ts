import { normalize } from './responsive';

const theme = {
  colors: {
    primary: '#3498db',
    secondary: '#777',
    background: '#f2f2f2',
    text: '#000',
  },
  fontSizes: {
    small: normalize(12),
    medium: normalize(16),
    large: normalize(20),
  },
  spacing: {
    small: normalize(8),
    medium: normalize(16),
    large: normalize(24),
  },
};

export default theme;

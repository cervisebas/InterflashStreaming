import { MD3DarkTheme } from 'react-native-paper';

export const Theme = {
  ...MD3DarkTheme,
  //roundness: 2,
  version: 3,
  colors: {
    ...MD3DarkTheme.colors,
    background: '#000000',
    onBackground: '#000000',
    surface: '#3F70A2',
    // Primary
    primary: '#3F70A2',
    onPrimary: '#ffffff',
    primaryContainer: '#3F70A2',
    onPrimaryContainer: '#ffffff',
    // Secondary
    secondary: '#325981',
    onSecondary: '#91C1F2',
    secondaryContainer: '#325981',
    onSecondaryContainer: '#91C1F2',
    // Tertiary
    tertiary: '#f44336',
    onTertiary: '#ff7961',
    tertiaryContainer: '#f44336',
    onTertiaryContainer: '#ff7961',
    elevation: {
      level0: '#000000',
      level1: '#0d0d0d',
      level2: '#3F70A2',
      level3: '#1C1C1C',
      level4: '#1F1F1F',
      level5: '#242424'
    }
  }
};
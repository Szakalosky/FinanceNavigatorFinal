/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ColorSchemeName,
  Appearance,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider, useSelector } from 'react-redux';
import { store } from './src/redux/store';
import ThemeContext from './src/features/themes/themeContext';
import { MainStack } from './src/components/StackNavigator';
import { RootState } from './src/rootStates/rootState';

function App(): React.JSX.Element {
  const colorScheme: ColorSchemeName = useColorScheme();
  const [themeconfig, setThemeConfig] = useState<ColorSchemeName>(colorScheme || 'light');

  useEffect(() => {
    const getTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setThemeConfig(savedTheme as ColorSchemeName);
        }
      } catch (error) {
        console.log('Error loading theme', error);
      }
    };

    getTheme();
  }, []);

  const toggleTheme = (newTheme: any) => {
    setThemeConfig(newTheme);
    AsyncStorage.setItem('theme', newTheme);
  };

  const useSystemTheme = () => {
    const systemColorScheme = Appearance.getColorScheme();
    if (systemColorScheme) {
      setThemeConfig(colorScheme);
      AsyncStorage.setItem('theme', systemColorScheme);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeContext.Provider value={{ themeconfig, toggleTheme, useSystemTheme }}>
          <MainStack />
        </ThemeContext.Provider>
      </Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

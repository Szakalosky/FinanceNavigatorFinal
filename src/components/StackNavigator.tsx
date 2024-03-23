import React, { useContext, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../features/screens/HomeScreen';
import {
  WelcomeScreen,
  SecondGraphic,
  ThirdGraphic,
  FourthGraphic,
  FifthGraphic,
} from '../features/screens/WelcomeScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { NavigationContainer } from '@react-navigation/native';
import Category from '../features/screens/CategoryScreen';
import TransactionsScreen from '../features/screens/TransactionsScreen';
import SettingsScreen from '../features/screens/SettingsScreen';
import CameraScreen from '../features/screens/PhotoScreen';
import colors from '../features/themes/theme';
import ThemeContext from '../features/themes/themeContext';
import ExpensesScreen from '../features/screens/ExpensesScreen';
import IncomeScreen from '../features/screens/IncomeScreen';
import SavingsScreen from '../features/screens/SavingsScreen';
import InvestmentsScreen from '../features/screens/InvestmentsScreen';
import BudgetScreen from '../features/screens/BudgetScreen';
import { NavigatorList } from '../features/types/Navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeScreenProps } from './EmptyMainContent';
import MainContent from './MainContent';
import HomeScreenFinal from '../features/screens/HomeScreenFinal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../rootStates/rootState';
import ReceiptsScreen from '../features/screens/ReceiptsScreen';

const Stack = createNativeStackNavigator<NavigatorList>();
const Drawer = createDrawerNavigator();

const isAppFirstRunKey = '@MyApp:isFirstRunWelcome';
const isExpenseScreenEmptyAppFirstRunKey = '@MyApp:isExpenseScreenEmptyFirstRun';
const isIncomeScreenEmptyAppFirstRunKey = '@MyApp:isIncomeScreenEmptyFirstRun';
const setAppAsNotFirstRun = async () => {
  try {
    await AsyncStorage.setItem(isAppFirstRunKey, 'false');
  } catch (error) {
    console.error('Error saving isFirstRun data: ', error);
  }
};

const getAppFirstRunStatus = async () => {
  try {
    const value = await AsyncStorage.getItem(isAppFirstRunKey);
    return value === null;
  } catch (error) {
    console.error('Error getting isFirstRun data: ', error);
    return true;
  }
};

const setIncomeScreenEmptyAppAsNotFirstRun = async () => {
  try {
    await AsyncStorage.setItem(isIncomeScreenEmptyAppFirstRunKey, 'false');
  } catch (error) {
    console.error('Error saving isFirstRun data: ', error);
  }
};

const getIncomeScreenEmptyAppFirstRunStatus = async () => {
  try {
    const value = await AsyncStorage.getItem(isIncomeScreenEmptyAppFirstRunKey);
    return value === null;
  } catch (error) {
    console.error('Error getting isFirstRun data: ', error);
    return true;
  }
};

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeStack" component={HomeScreen} />
    </Stack.Navigator>
  );
};

const WelcomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeScreenGraphic" component={WelcomeScreen} />
      <Stack.Screen name="SecondWelcomeGraphic" component={SecondGraphic} />
      <Stack.Screen name="ThirdWelcomeGraphic" component={ThirdGraphic} />
      <Stack.Screen name="FourthWelcomeGraphic" component={FourthGraphic} />
      <Stack.Screen name="FifthWelcomeGraphic" component={FifthGraphic} />
    </Stack.Navigator>
  );
};

const TransactionsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TransactionsStack" component={TransactionsScreen} />
    </Stack.Navigator>
  );
};

const CategoryStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CategoryStack" component={Category} />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

const PhotoStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhotoScreen" component={CameraScreen} />
    </Stack.Navigator>
  );
};

const ExpensesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExpensesStack" component={ExpensesScreen} />
    </Stack.Navigator>
  );
};

const IncomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IncomeStack" component={IncomeScreen} />
    </Stack.Navigator>
  );
};

const SavingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SavingsStack" component={SavingsScreen} />
    </Stack.Navigator>
  );
};

const InvestmentsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InvestmentStack" component={InvestmentsScreen} />
    </Stack.Navigator>
  );
};

const ReceiptsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReceiptsStack" component={ReceiptsScreen} />
    </Stack.Navigator>
  );
};

const MainStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
        <Stack.Screen name="BudgetStack" component={BudgetScreen} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const DrawerNavigator: React.FC<HomeScreenProps> = ({ navigation }) => {
  const theme = { mode: 'dark' };
  let activeColors = colors.dark;
  let activeColors2 = colors.light;

  const { themeconfig }: any = useContext(ThemeContext);

  const isIncomeScreenCompleted = useSelector(
    (state: RootState) => state.name.isIncomeScreenFirstRun
  );

  const shouldINavigateToMainContent = useSelector(
    (state: RootState) => state.name.shouldIncomeScreenNavigateToMainContent
  );

  useEffect(() => {
    async function checkFirstRun() {
      const isAppFirstRun = await getAppFirstRunStatus();
      if (isAppFirstRun) {
        await setAppAsNotFirstRun();
        navigation.navigate('WelcomeScreen');
      }
    }
    checkFirstRun();
  }, []);

  useEffect(() => {
    async function checkIncomeScreenEmptyFirstRun() {
      const isIncomeScreenEmptyFirstRun = await getIncomeScreenEmptyAppFirstRunStatus();
      if (isIncomeScreenEmptyFirstRun && shouldINavigateToMainContent) {
        await setIncomeScreenEmptyAppAsNotFirstRun();
        navigation.navigate('HomeScreenFinal');
      }
    }
    checkIncomeScreenEmptyFirstRun();
  }, []);

  useEffect(() => {
    async function displayAllKeys() {
      try {
        const allkeys = await AsyncStorage.getAllKeys();
        console.log('All keys in AsyncStorage', allkeys);
      } catch (error) {
        console.error('Error retrieving keys from AsyncStorage:', error);
      }
    }
    displayAllKeys();
  }, []);
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor:
            themeconfig === theme.mode ? activeColors.primary : activeColors2.secondary,
        },
        drawerActiveTintColor: themeconfig === theme.mode ? activeColors.tint : activeColors2.tint,
        drawerLabelStyle: {
          color: themeconfig === theme.mode ? activeColors.tint : activeColors2.tint,
        },
      }}
    >
      <Drawer.Screen name="HomeScreenFinal" component={HomeScreenFinal} />
      <Drawer.Screen name="HomeScreen" component={HomeStack} />
      <Drawer.Screen name="WelcomeScreen" component={WelcomeStack} />
      <Drawer.Screen name="CategoryScreen" component={CategoryStack} />
      <Drawer.Screen name="TransactionsScreen" component={TransactionsStack} />
      <Drawer.Screen name="Settings" component={SettingsStack} />
      <Drawer.Screen name="MakeParagonsPhotos" component={PhotoStack} />
      <Drawer.Screen name="ExpensesScreen" component={ExpensesStack} />
      <Drawer.Screen name="IncomeScreen" component={IncomeStack} />
      <Drawer.Screen name="SavingsScreen" component={SavingsStack} />
      <Drawer.Screen name="InvestmentsScreen" component={InvestmentsStack} />
      <Drawer.Screen name="AllReceipts" component={ReceiptsStack} />
    </Drawer.Navigator>
  );
};

export { DrawerNavigator, ExpensesStack, MainStack };

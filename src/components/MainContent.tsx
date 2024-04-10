/* eslint-disable react-native/no-inline-styles */
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { NavigatorList } from '../features/types/Navigator';

import colors from '../features/themes/theme';
import ThemeContext from '../features/themes/themeContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../rootStates/rootState';
import GetAllExpensesDocs from './GetAllExpensesDocs';
import GetAllIncomeDocs from './GetAllIncomeDocs';
import ViewShot, { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import { Svg } from 'react-native-svg';
import {
  setCurrency,
  setKeepUserLoggedIn,
  setMainContentScreenExpensesArray,
  setMainContentScreenExportChart,
  setMainContentScreenIncomeArray,
  setMainContentScreenInvestmentsArray,
  setMainContentScreenSavingsArray,
  setOnlyOneMonthDocs,
  setOnlyOneYearDocs,
  setOnlySixMonthsDocs,
  setOnlyThreeMonthsDocs,
} from '../redux/actions';
import GetAllSavingsDocs from './GetAllSavingsDocs';
import GetAllInvestmentsDocs from './GetAllInvestmentsDocs';
import { useTranslation } from 'react-i18next';
import { BarChart } from 'react-native-gifted-charts';
import auth from '@react-native-firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from '../services/i18next';
import { Canvas, Circle, ImageShader, Rect, useImage } from '@shopify/react-native-skia';

const MainContent = () => {
  const themeContext = useContext(ThemeContext);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const expensesArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenExpensesArray
  );

  const incomeArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenIncomeArray
  );

  const savingsArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenSavingsArray
  );

  const investmentsArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenInvestmentsArray
  );

  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  const theme = { mode: 'dark' };
  let activeColorsDark = colors.dark;
  let activeColorsLight = colors.light;

  const { themeconfig, toggleTheme, useSystemTheme }: any = useContext(ThemeContext);

  const { initialBudgetValue } = useSelector((state: RootState) => state.name.initialBudget);
  const mainContentChoosenCurrencyName = useSelector(
    (state: RootState) => state.name.selectedCurrencyOptionRadioButton
  );

  const checkMainCurrencyFromWelcome = useCallback(async () => {
    try {
      const mainCurrencyFromWelcomeScreen = await AsyncStorage.getItem('welcomeMainCurrency');
      if (mainCurrencyFromWelcomeScreen !== null) {
        const parsedMainCurrencyFromWelcomeScreen = JSON.parse(mainCurrencyFromWelcomeScreen);
        if (
          parsedMainCurrencyFromWelcomeScreen.hasOwnProperty('selectedCurrencyOptionRadioButton') &&
          typeof parsedMainCurrencyFromWelcomeScreen.selectedCurrencyOptionRadioButton === 'string'
        ) {
          const selectedMainCurrency =
            parsedMainCurrencyFromWelcomeScreen.selectedCurrencyOptionRadioButton;
          dispatch(setCurrency(selectedMainCurrency));
        } else {
          console.log('Got currency object from welcome screen instead of value');
        }
      }
    } catch (error) {
      console.log('Error reading value', error);
    }
  }, [dispatch, mainContentChoosenCurrencyName]);

  useEffect(() => {
    checkMainCurrencyFromWelcome();
  }, [checkMainCurrencyFromWelcome]);

  const currencyFromSettings = useSelector(
    (state: RootState) => state.name.settingsScreenActualCurrency
  );

  const mainContentGoogleAccountName = useSelector(
    (state: RootState) => state.name.googleAccountName
  );

  const currencyAsMainOptionValue = useSelector(
    (state: RootState) => state.name.currencyAsMainOption
  );

  const checkLastChoosenCurrency = useCallback(async () => {
    try {
      const lastCurrencyFromSettings = await AsyncStorage.getItem('currencyAsMainOption');
      if (lastCurrencyFromSettings !== null) {
        const parsedLastCurrencyFromSettings = JSON.parse(lastCurrencyFromSettings);

        dispatch({
          type: 'SET_CURRENCY_AS_MAIN_FROM_SETTINGS_TO_ASYNC_STORAGE',
          payload: parsedLastCurrencyFromSettings,
        });
      }
    } catch (error) {
      console.log('Error reading value', error);
    }
  }, [dispatch, currencyAsMainOptionValue]);

  useEffect(() => {
    checkLastChoosenCurrency();
  }, [checkLastChoosenCurrency]);

  const [expenseTotalConvertedValue, setExpenseTotalConvertedValue] = useState<number>(0);

  const [incomeTotalConvertedValue, setIncomeTotalConvertedValue] = useState<number>(0);

  const [savingsTotalConvertedValue, setSavingsTotalConvertedValue] = useState<number>(0);

  const [investmentTotalConvertedValue, setInvestmentTotalConvertedValue] = useState<number>(0);

  const receiptTotalValuePhotoScreen = useSelector(
    (state: RootState) => state.name.receiptTotalValuePhotoScreen
  );

  const [receiptTotalValue, setReceiptTotalValue] = useState<number>(0);

  const newMainContentBudgetValue =
    initialBudgetValue - expenseTotalConvertedValue + incomeTotalConvertedValue - receiptTotalValue;

  const formattedFinalHomeBudget = newMainContentBudgetValue.toFixed(2);

  useEffect(() => {
    console.log('Expenses Documents from reduxx', expensesArrayOnlyValues);
    console.log('Income Documents from redux', incomeArrayOnlyValues);
    console.log('Savings Documents from redux', savingsArrayOnlyValues);
    console.log('Investments Documents from redux', investmentsArrayOnlyValues);
  }, [
    expensesArrayOnlyValues,
    incomeArrayOnlyValues,
    savingsArrayOnlyValues,
    investmentsArrayOnlyValues,
  ]);

  const currentOneMonthStatus = useSelector((state: RootState) => state.name.onlyOneMonthDocs);
  const currentThreeMonthsStatus = useSelector(
    (state: RootState) => state.name.onlyThreeMonthsDocs
  );
  const currentSixMonthsStatus = useSelector((state: RootState) => state.name.onlySixMonthsDocs);
  const currentOneYearStatus = useSelector((state: RootState) => state.name.onlyOneYearDocs);
  const onlyOneMonthDocuments = () => {
    const newStatus = !currentOneMonthStatus;
    dispatch(setOnlyOneMonthDocs(newStatus));
    dispatch(setOnlyThreeMonthsDocs(false));
    dispatch(setOnlySixMonthsDocs(false));
    dispatch(setOnlyOneYearDocs(false));
  };

  const onlyThreeMonthsDocuments = () => {
    const newStatus = !currentThreeMonthsStatus;
    dispatch(setOnlyThreeMonthsDocs(newStatus));
    dispatch(setOnlyOneMonthDocs(false));
    dispatch(setOnlySixMonthsDocs(false));
    dispatch(setOnlyOneYearDocs(false));
  };

  const onlySixMonthsDocuments = () => {
    const newStatus = !currentSixMonthsStatus;
    dispatch(setOnlySixMonthsDocs(newStatus));
    dispatch(setOnlyOneMonthDocs(false));
    dispatch(setOnlyThreeMonthsDocs(false));
    dispatch(setOnlyOneYearDocs(false));
  };

  const onlyOneYearDocuments = () => {
    const newStatus = !currentOneYearStatus;
    dispatch(setOnlyOneYearDocs(newStatus));
    dispatch(setOnlySixMonthsDocs(false));
    dispatch(setOnlyOneMonthDocs(false));
    dispatch(setOnlyThreeMonthsDocs(false));
  };

  const [errorConvertingReceiptTotalValue, setErrorConvertingReceiptTotalValue] = useState<
    string | undefined
  >(undefined);

  const fetchReceiptValueExchangeRate = useCallback(async () => {
    try {
      setErrorConvertingReceiptTotalValue(undefined);
      if (!receiptTotalValuePhotoScreen) {
        setReceiptTotalValue(0);
        return;
      }

      const response = await fetch(
        `https://open.er-api.com/v6/latest/${mainContentChoosenCurrencyName}`
      );
      const data = await response.json();

      const exchangesRates = data.rates;
      const conversionRate = exchangesRates[mainContentChoosenCurrencyName];

      if (conversionRate) {
        setExchangeRate(conversionRate);
        const result = receiptTotalValuePhotoScreen * conversionRate;
        setReceiptTotalValue(Number(result.toFixed(2)));
      } else {
        setReceiptTotalValue(0);
      }
    } catch (error) {
      console.log('Error converting currency', error);
      setErrorConvertingReceiptTotalValue('Error converting currency - check Network connection');
    }
  }, [receiptTotalValuePhotoScreen, mainContentChoosenCurrencyName]);

  //Convertion Budget Value
  useEffect(() => {
    fetchReceiptValueExchangeRate();
  }, [fetchReceiptValueExchangeRate]);

  //Exchange Rate API
  const [declaredBudgetAmount, setDeclaredBudgetAmount] = useState<string | null>();

  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  const [errorConvertingCurrency, setErrorConvertingCurrency] = useState<string | undefined>(
    undefined
  );

  //Convertion Budget Value
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setErrorConvertingCurrency(undefined);
        if (!formattedFinalHomeBudget) {
          setDeclaredBudgetAmount(null);
          return;
        }

        const response = await fetch(
          `https://open.er-api.com/v6/latest/${mainContentChoosenCurrencyName}`
        );
        const data = await response.json();

        const exchangesRates = data.rates;
        const conversionRate = exchangesRates[currencyAsMainOptionValue]; //currencyFromSettings

        if (conversionRate) {
          setExchangeRate(conversionRate);
          const result = parseFloat(formattedFinalHomeBudget) * conversionRate;
          setDeclaredBudgetAmount(result.toFixed(2));
        } else {
          setDeclaredBudgetAmount('In options');
        }
      } catch (error) {
        console.log('Error converting currency', error);
        setErrorConvertingCurrency('Error converting currency - check Network connection');
      }
    };

    fetchExchangeRate();
  }, [formattedFinalHomeBudget, mainContentChoosenCurrencyName, currencyAsMainOptionValue]);

  const [declaredSavingsAmount, setDeclaredSavingsAmount] = useState<string | null>();

  const [errorConvertingSavingsCurrency, setErrorConvertingSavingsCurrency] = useState<
    string | undefined
  >(undefined);

  const fetchSavingsExchangeRate = useCallback(async () => {
    try {
      setErrorConvertingSavingsCurrency(undefined);
      if (!savingsTotalConvertedValue) {
        setDeclaredSavingsAmount(null);
        return;
      }

      const response = await fetch(
        `https://open.er-api.com/v6/latest/${mainContentChoosenCurrencyName}`
      );
      const data = await response.json();

      const exchangesRates = data.rates;
      const conversionRate = exchangesRates[currencyAsMainOptionValue]; //currencyFromSettings

      if (conversionRate) {
        setExchangeRate(conversionRate);
        const result = savingsTotalConvertedValue * conversionRate;
        setDeclaredSavingsAmount(result.toFixed(2));
      } else {
        setDeclaredSavingsAmount('In options');
      }
    } catch (error) {
      console.log('Error converting currency', error);
      setErrorConvertingSavingsCurrency('Error converting currency - check Network connection');
    }
  }, [savingsTotalConvertedValue, mainContentChoosenCurrencyName, currencyAsMainOptionValue]);

  useEffect(() => {
    fetchSavingsExchangeRate();
  }, [fetchSavingsExchangeRate]);

  const [declaredInvestmentAmount, setDeclaredInvestmentAmount] = useState<string | null>();

  const [errorConvertingInvestmentCurrency, setErrorConvertingInvestmentCurrency] = useState<
    string | undefined
  >(undefined);

  const fetchInvestmentExchangeRate = useCallback(async () => {
    try {
      setErrorConvertingInvestmentCurrency(undefined);
      if (!investmentTotalConvertedValue) {
        setDeclaredInvestmentAmount(null);
        return;
      }

      const response = await fetch(
        `https://open.er-api.com/v6/latest/${mainContentChoosenCurrencyName}`
      );
      const data = await response.json();

      const exchangesRates = data.rates;
      const conversionRate = exchangesRates[currencyAsMainOptionValue]; //currencyFromSettings

      if (conversionRate) {
        setExchangeRate(conversionRate);
        const result = investmentTotalConvertedValue * conversionRate;
        setDeclaredInvestmentAmount(result.toFixed(2));
      } else {
        setDeclaredInvestmentAmount('In options');
      }
    } catch (error) {
      console.log('Error converting currency', error);
      setErrorConvertingInvestmentCurrency('Error converting currency - check Network connection');
      Alert.alert('Error', errorConvertingInvestmentCurrency);
    }
  }, [investmentTotalConvertedValue, mainContentChoosenCurrencyName, currencyAsMainOptionValue]);

  useEffect(() => {
    fetchInvestmentExchangeRate();
  }, [fetchInvestmentExchangeRate]);

  const [declaredExpenseAmount, setDeclaredFinalAmount] = useState<string | null>();

  const [errorConvertingFinalCurrencyAmount, setErrorConvertingFinalCurrencyAmount] = useState<
    string | undefined
  >(undefined);

  const [finalExchangeRate, setFinalExchangeRate] = useState<number | null>(null);

  const fetchEachExchangeRate = useCallback(
    async (
      currencyFromDatabase: string,
      currencyFromWelcomeScreen: string,
      totalEachValue: string
    ) => {
      try {
        setErrorConvertingFinalCurrencyAmount(undefined);
        if (!totalEachValue) {
          setDeclaredFinalAmount(null);
          return;
        }

        const response = await fetch(`https://open.er-api.com/v6/latest/${currencyFromDatabase}`);
        const data = await response.json();

        const exchangesRates = data.rates;
        const conversionRate = exchangesRates[currencyFromWelcomeScreen];

        if (conversionRate) {
          setFinalExchangeRate(conversionRate);
          const result = parseFloat(totalEachValue) * conversionRate;
          setDeclaredFinalAmount(result.toFixed(2));
          return result;
        } else {
          setDeclaredFinalAmount('In options');
        }
      } catch (error) {
        console.log('Error converting currency', error);
        setErrorConvertingFinalCurrencyAmount(
          'Error converting currency - check Network connection'
        );
        Alert.alert(`Error converting currency - check Network connection, ${error}`);
      }
    },
    [finalExchangeRate, declaredExpenseAmount, errorConvertingFinalCurrencyAmount]
  );

  // Proper Exchange Rate for Budget

  const convertAndSumExpense = async () => {
    try {
      let convertedExpensesValues = [];
      await Promise.all(
        expensesArrayOnlyValues.map(async (expense) => {
          const expenseCurrency = expense.expenseCurrency;
          const expenseValue = expense.expenseValue;

          switch (expenseCurrency) {
            case 'PLN':
            case 'EUR':
            case 'USD':
            case 'GBP': {
              const result = await fetchEachExchangeRate(
                expenseCurrency,
                mainContentChoosenCurrencyName,
                expenseValue
              );

              const convertedValue = result || 0;
              convertedExpensesValues.push(convertedValue);
              break;
            }
            default:
              break;
          }
        })
      );

      const total = convertedExpensesValues.reduce((acc, value) => acc + value, 0);
      const properDecimalResult = Number(total.toFixed(2));
      setExpenseTotalConvertedValue(properDecimalResult);
    } catch (error) {
      console.log('Error converting and summing each expenses', error);
    }
  };

  const convertAndSumIncome = async () => {
    try {
      let convertedIncomeValues = [];

      await Promise.all(
        incomeArrayOnlyValues.map(async (income) => {
          const incomeCurrency = income.incomeCurrency;
          const incomeValue = income.incomeValue;

          switch (incomeCurrency) {
            case 'PLN':
            case 'EUR':
            case 'USD':
            case 'GBP': {
              const result = await fetchEachExchangeRate(
                incomeCurrency,
                mainContentChoosenCurrencyName,
                incomeValue
              );

              const convertedIncomeValue = result || 0;
              convertedIncomeValues.push(convertedIncomeValue);
              break;
            }
            default:
              break;
          }
        })
      );

      const total = convertedIncomeValues.reduce((acc, value) => acc + value, 0);
      const properDecimalResult = Number(total.toFixed(2));
      setIncomeTotalConvertedValue(properDecimalResult);
    } catch (error) {
      console.log('Error converting and summing each income', error);
    }
  };

  const convertAndSumSavings = async () => {
    try {
      let convertedSavingsValues = [];

      await Promise.all(
        savingsArrayOnlyValues.map(async (savings) => {
          const savingsCurrency = savings.savingsCurrency;
          const savingsValue = savings.savingsValue;

          switch (savingsCurrency) {
            case 'PLN':
            case 'EUR':
            case 'USD':
            case 'GBP': {
              const result = await fetchEachExchangeRate(
                savingsCurrency,
                mainContentChoosenCurrencyName,
                savingsValue
              );

              const convertedValue = result || 0;
              convertedSavingsValues.push(convertedValue);
              break;
            }
            default:
              break;
          }
        })
      );

      const total = convertedSavingsValues.reduce((acc, value) => acc + value, 0);
      const properDecimalResult = Number(total.toFixed(2));
      setSavingsTotalConvertedValue(properDecimalResult);
    } catch (error) {
      console.log('Error converting and summing each savings', error);
    }
  };

  const convertAndSumInvestments = async () => {
    try {
      let convertedInvestmentsValues = [];

      await Promise.all(
        investmentsArrayOnlyValues.map(async (investment) => {
          const investmentCurrency = investment.investmentCurrency;
          const investmentValue = investment.investmentValue;

          switch (investmentCurrency) {
            case 'PLN':
            case 'EUR':
            case 'USD':
            case 'GBP': {
              const result = await fetchEachExchangeRate(
                investmentCurrency,
                mainContentChoosenCurrencyName,
                investmentValue
              );

              const convertedValue = result || 0;
              convertedInvestmentsValues.push(convertedValue);
              break;
            }
            default:
              break;
          }
        })
      );

      const total = convertedInvestmentsValues.reduce((acc, value) => acc + value, 0);
      const properDecimalResult = Number(total.toFixed(2));
      setInvestmentTotalConvertedValue(properDecimalResult);
    } catch (error) {
      console.log('Error converting and summing each investment', error);
    }
  };

  //Calculate FinalBudget = mainContentBudgetValue(welcomeScreen) - totalExpensesValue + totalIncomeValue

  const barChartExpensesIncomeData = [
    {
      value: expenseTotalConvertedValue + receiptTotalValue,
      label: t('MainContentScreenInChartExpensesText'),
      frontColor: 'red',
      labelTextStyle: {
        color: themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
      },
    },
    {
      value: incomeTotalConvertedValue,
      label: t('MainContentScreenInChartIncomeText'),
      frontColor: 'green',
      labelTextStyle: {
        color: themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
      },
    },
  ];

  const barChartSavingsInvestmentData = [
    {
      value: savingsTotalConvertedValue,
      label: t('MainContentScreenInChartSavingsText'),
      frontColor: 'yellow',
      labelTextStyle: {
        color: themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
      },
    },
    {
      value: investmentTotalConvertedValue,
      label: t('MainContentScreenInChartInvestmentsText'),
      frontColor: 'blue',
      labelTextStyle: {
        color: themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
      },
    },
  ];

  const [isGiftedFirstBarChartReady, setIsGiftedFirstBarChartReady] = useState(false);
  const [isGiftedSecondBarChartReady, setIsGiftedSecondBarChartReady] = useState(false);

  useEffect(() => {
    const fetchDataAndCalculate = async () => {
      await convertAndSumExpense();
      await convertAndSumIncome();
      await convertAndSumSavings();
      await convertAndSumInvestments();

      setIsGiftedFirstBarChartReady(true);
      setIsGiftedSecondBarChartReady(true);
    };

    fetchDataAndCalculate();
  }, [
    expensesArrayOnlyValues,
    incomeArrayOnlyValues,
    savingsArrayOnlyValues,
    investmentsArrayOnlyValues,
    expenseTotalConvertedValue,
    incomeTotalConvertedValue,
    savingsTotalConvertedValue,
    investmentTotalConvertedValue,
    mainContentChoosenCurrencyName,
    currencyAsMainOptionValue,
  ]);

  const { isGoogleUserLoggedIn, userGoogleUId } = useSelector(
    (state: RootState) => state.name.isGoogleUser
  );

  const handleKeepUserLoggedIn = (isLoggedIn: boolean, uid: string | null) => {
    dispatch(setKeepUserLoggedIn(isLoggedIn, uid));
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        console.log('User is still logged in', user.displayName);
        handleKeepUserLoggedIn(true, user.displayName);
      } else {
        console.log('not logged in', user);
        handleKeepUserLoggedIn(false, '');
      }
    });
    return () => unsubscribe();
  }, [mainContentGoogleAccountName, userGoogleUId, isGoogleUserLoggedIn]);

  const loadExpenseCategoryDataFromRedux = async () => {
    try {
      const initialBudgetValue = await AsyncStorage.getItem('initialBudgetValue');

      if (initialBudgetValue !== null) {
        const parsedInitialBudgetValueData = JSON.parse(initialBudgetValue);
        dispatch({
          type: 'SET_BUDGET_VALUE',
          payload: parsedInitialBudgetValueData,
        });
      }
    } catch (error) {
      console.error('Error reading data food from AsyncStorage', error);
    }

    return null;
  };

  useEffect(() => {
    loadExpenseCategoryDataFromRedux();
  }, [initialBudgetValue]);

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

  const loadReceiptValueFromAsyncStorage = async () => {
    try {
      const receiptValue = await AsyncStorage.getItem('receiptValue');

      if (receiptValue !== null) {
        const parsedReceiptValueFromImage = JSON.parse(receiptValue);
        dispatch({
          type: 'SET_RECEIPT_TOTAL_VALUE_PHOTO_SCREEN',
          payload: parsedReceiptValueFromImage,
        });
      }
    } catch (error) {
      console.error('Error reading receipt data from AsyncStorage', error);
    }
  };

  useEffect(() => {
    loadReceiptValueFromAsyncStorage();
  }, [receiptTotalValuePhotoScreen, receiptTotalValue]);

  const choosenLanguageFromSettings = useSelector((state: RootState) => state.name.languageOption);

  useEffect(() => {
    async function checkLastChoosenLanguage() {
      try {
        const lastLanguage = await AsyncStorage.getItem('languageFromSettings');
        if (lastLanguage !== null) {
          const parsedLastLanguageData = JSON.parse(lastLanguage);
          console.log('JEZYK', parsedLastLanguageData.languageOption);
          i18next.changeLanguage(parsedLastLanguageData.languageOption);
        }
      } catch (error) {
        console.error('Error retrieving keyss from AsyncStorage:', error);
      }
    }
    checkLastChoosenLanguage();
  }, [choosenLanguageFromSettings]);

  return (
    <ScrollView style={{ height: screenHeight - 600 }}>
      <View
        style={{
          ...styles.mainContainer,
          backgroundColor:
            themeconfig === theme.mode ? activeColorsDark.primary : activeColorsLight.accent,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: themeconfig === theme.mode ? activeColorsDark.tint : activeColorsLight.tint,
            left: 10,
          }}
        >
          {t('MainContentScreenWelcomeUserText')} {userGoogleUId}
        </Text>
        <View
          style={{
            ...styles.budgetContainer,
            backgroundColor:
              themeconfig === theme.mode ? activeColorsDark.primary : activeColorsLight.secondary,
            borderColor:
              themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontSize: 28,
                letterSpacing: 3,
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
              }}
            >
              {t('MainContentScreenBudgetText')}
            </Text>
            <Text
              style={{
                fontSize: 28,
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
              }}
            >
              {formattedFinalHomeBudget} {mainContentChoosenCurrencyName}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <TextInput
              style={{
                width: '50%',
                fontSize: 18,
                borderRadius: 4,
                color: 'lawngreen',
                textAlign: 'right',
                textAlignVertical: 'center',
              }}
              editable={false}
              selectTextOnFocus={false}
              value={declaredBudgetAmount !== null ? declaredBudgetAmount?.toString() : ''}
            />
            <Text
              style={{
                fontSize: 16,
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
              }}
            >
              {currencyAsMainOptionValue}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'flex-end',
              margin: 5,
            }}
          >
            <View
              style={{
                backgroundColor: themeconfig === theme.mode ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.2)',
                width: '100%',
                justifyContent: 'space-between',
                flexDirection: 'row',
                padding: '3%',
                borderRadius: 30,
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'column', width: '30%' }}>
                <Text
                  style={{
                    color:
                      themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                    fontSize: 16,
                  }}
                >
                  {t('MainContentScreenInChartSavingsText')}
                  {': '}
                </Text>
                <Text
                  style={{
                    color:
                      themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                    fontSize: 16,
                  }}
                >
                  {savingsTotalConvertedValue} {mainContentChoosenCurrencyName}
                </Text>
              </View>

              <TextInput
                style={{
                  width: '50%',
                  fontSize: 18,
                  borderRadius: 4,
                  color:
                    themeconfig === theme.mode ? activeColorsDark.orange : activeColorsLight.orange,
                  textAlign: 'right',
                  textAlignVertical: 'center',
                  left: '35%',
                }}
                editable={false}
                selectTextOnFocus={false}
                value={declaredSavingsAmount !== null ? declaredSavingsAmount?.toString() : ''}
              />
              <Text
                style={{
                  fontSize: 16,
                  color:
                    themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.tint,
                  width: 'auto',
                }}
              >
                {currencyAsMainOptionValue}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'flex-end',
              margin: 5,
            }}
          >
            <View
              style={{
                backgroundColor: themeconfig === theme.mode ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.2)',
                width: '100%',
                justifyContent: 'space-between',
                flexDirection: 'row',
                padding: '3%',
                borderRadius: 30,
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'column', width: '30%' }}>
                <Text
                  style={{
                    color:
                      themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                    fontSize: 16,
                  }}
                >
                  {t('MainContentScreenInChartInvestmentsText')}
                  {': '}
                </Text>
                <Text
                  style={{
                    color:
                      themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                    fontSize: 16,
                  }}
                >
                  {investmentTotalConvertedValue} {mainContentChoosenCurrencyName}
                </Text>
              </View>

              <TextInput
                style={{
                  width: '50%',
                  fontSize: 18,
                  borderRadius: 4,
                  color:
                    themeconfig === theme.mode
                      ? activeColorsDark.mediumblue
                      : activeColorsLight.mediumblue,
                  textAlign: 'right',
                  textAlignVertical: 'center',
                  left: '35%',
                }}
                editable={false}
                selectTextOnFocus={false}
                value={
                  declaredInvestmentAmount !== null ? declaredInvestmentAmount?.toString() : ''
                }
              />
              <Text
                style={{
                  fontSize: 16,
                  color:
                    themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.tint,
                  width: 'auto',
                }}
              >
                {currencyAsMainOptionValue}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'column', width: '100%' }}>
          {isGiftedFirstBarChartReady ? (
            <View
              style={{
                width: '98%',
                backgroundColor:
                  themeconfig === theme.mode
                    ? activeColorsDark.primary
                    : activeColorsLight.lightgray,
                left: '2.5%',
                right: '2.5%',
                padding: 10,
                marginBottom: 10,
              }}
            >
              <BarChart
                data={barChartExpensesIncomeData}
                spacing={screenWidth / 4 - 15}
                noOfSections={6}
                yAxisTextStyle={{
                  color:
                    themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                }}
                yAxisColor={
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black
                }
                xAxisColor={
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black
                }
              />
            </View>
          ) : null}
          {isGiftedSecondBarChartReady ? (
            <View
              style={{
                width: '98%',
                backgroundColor:
                  themeconfig === theme.mode
                    ? activeColorsDark.primary
                    : activeColorsLight.lightgray,
                left: '2.5%',
                right: '2.5%',
                padding: 10,
                marginBottom: 10,
              }}
            >
              <BarChart
                data={barChartSavingsInvestmentData}
                spacing={screenWidth / 4 - 15}
                noOfSections={6}
                yAxisTextStyle={{
                  color:
                    themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                }}
                yAxisColor={
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black
                }
                xAxisColor={
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black
                }
              />
            </View>
          ) : null}
        </View>

        <View
          style={{
            ...styles.externalContainer,
            backgroundColor:
              themeconfig === theme.mode ? activeColorsDark.accent : activeColorsLight.green,
          }}
        >
          <View style={styles.transactionsTitle}>
            <Text
              style={{
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.secondary,
              }}
            >
              {t('MainContentScreenTransactionsText')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <TouchableOpacity
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  margin: 2,
                  padding: 5,
                  borderRadius: 10,
                  backgroundColor: 'skyblue',
                  width: '23%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 60,
                }}
                onPress={onlyOneMonthDocuments}
              >
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  {t('MainContentOneMonthTextButton')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  margin: 2,
                  padding: 5,
                  borderRadius: 10,
                  backgroundColor: 'skyblue',
                  width: '23%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 60,
                }}
                onPress={onlyThreeMonthsDocuments}
              >
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  {t('MainContentThreeMonthsTextButton')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  margin: 2,
                  padding: 5,
                  borderRadius: 10,
                  backgroundColor: 'skyblue',
                  width: '23%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 60,
                }}
                onPress={onlySixMonthsDocuments}
              >
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  {t('MainContentSixMonthTextButton')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  margin: 2,
                  padding: 5,
                  borderRadius: 10,
                  backgroundColor: 'skyblue',
                  width: '23%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 60,
                }}
                onPress={onlyOneYearDocuments}
              >
                <Text
                  style={{
                    color: 'black',
                    fontSize: 14,
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  {t('MainContentOneYearTextButton')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              ...styles.contentContainer,
              backgroundColor:
                themeconfig === theme.mode ? activeColorsDark.black : activeColorsLight.primary,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: 5,
                width: '100%',
              }}
            >
              <View
                style={{
                  flexDirection: 'column',
                  backgroundColor:
                    themeconfig === theme.mode
                      ? activeColorsDark.primary
                      : activeColorsLight.primary,
                  width: '49%',
                  margin: 2,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderColor:
                      themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.tint,
                    width: '99%',
                    padding: 2,
                    margin: 1,
                    borderRadius: 5,
                    flex: 1,
                  }}
                >
                  <GetAllExpensesDocs />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  backgroundColor:
                    themeconfig === theme.mode
                      ? activeColorsDark.primary
                      : activeColorsLight.primary,
                  width: '49%',
                  margin: 2,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderColor:
                      themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.tint,
                    width: '99%',
                    padding: 2,
                    margin: 1,
                    borderRadius: 5,
                    flex: 1,
                  }}
                >
                  <GetAllIncomeDocs />
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: 5,
                width: '100%',
              }}
            >
              <View
                style={{
                  flexDirection: 'column',
                  backgroundColor:
                    themeconfig === theme.mode
                      ? activeColorsDark.primary
                      : activeColorsLight.primary,
                  width: '49%',
                  margin: 2,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderColor:
                      themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.tint,
                    width: '99%',
                    padding: 2,
                    margin: 1,
                    borderRadius: 5,
                    flex: 1,
                  }}
                >
                  <GetAllSavingsDocs />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  backgroundColor:
                    themeconfig === theme.mode
                      ? activeColorsDark.primary
                      : activeColorsLight.primary,
                  width: '49%',
                  margin: 2,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderColor:
                      themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.tint,
                    width: '99%',
                    padding: 2,
                    margin: 1,
                    borderRadius: 5,
                    flex: 1,
                  }}
                >
                  <GetAllInvestmentsDocs />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          height: screenHeight - 600,
          backgroundColor:
            themeconfig === theme.mode ? activeColorsDark.primary : activeColorsLight.accent,
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingRight: 10,
    flex: 1,
  },
  budgetContainer: {
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
  },
  chartContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    padding: 5,
    borderRadius: 10,
  },
  buttonMove: {
    width: '60%',
    height: 50,
  },
  container: {
    height: 'auto',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    margin: 20,
  },
  externalContainer: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    margin: 5,
    padding: 2,
    borderRadius: 5,
  },
  innerContainer: {
    height: 'auto',
    width: '95%',
    backgroundColor: 'gray',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    padding: 5,
  },
  innerContainerTransactions: {
    flex: 1,
    height: 'auto',
    width: 'auto',
    backgroundColor: 'gray',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  contentContainer: {
    backgroundColor: 'orange',
    width: '100%',
    height: 'auto',
    flexDirection: 'column',
    borderRadius: 5,
  },
  transactionsTitle: {
    paddingBottom: 5,
  },
});

export default MainContent;

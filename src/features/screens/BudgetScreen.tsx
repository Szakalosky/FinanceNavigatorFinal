import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorList } from '../types/Navigator';
import { Item } from './ExpensesScreen';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../rootStates/rootState';
import { useDispatch, useSelector } from 'react-redux';
import { PieChart } from 'react-native-chart-kit';
import RNFS from 'react-native-fs';
import colors from '../themes/theme';
import ThemeContext from '../themes/themeContext';
import { BarChart } from 'react-native-gifted-charts';
import {
  limitCarBudgetScreenSchema,
  limitEducationBudgetScreenSchema,
  limitElectronicsBudgetScreenSchema,
  limitEntertainmentBudgetScreenSchema,
  limitFoodBudgetScreenSchema,
  limitGiftsBudgetScreenSchema,
  limitHealthBudgetScreenSchema,
  limitHolidaysBudgetScreenSchema,
  limitHomeBudgetScreenSchema,
  limitLoanBudgetScreenSchema,
  limitPublicTransportBudgetScreenSchema,
  limitShoppingBudgetScreenSchema,
  limitTrainingBudgetScreenSchema,
} from '../../schemas/limitBudgetScreenSchema';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectDropdown from 'react-native-select-dropdown';
import {
  setBudgetDataInBudgetScreen,
  setLimitCarBudgetInBudgetScreen,
  setLimitEducationBudgetInBudgetScreen,
  setLimitElectronicsBudgetInBudgetScreen,
  setLimitEntertainmentBudgetInBudgetScreen,
  setLimitFoodBudgetInBudgetScreen,
  setLimitGiftsBudgetInBudgetScreen,
  setLimitHealthBudgetInBudgetScreen,
  setLimitHolidaysBudgetInBudgetScreen,
  setLimitHomeBudgetInBudgetScreen,
  setLimitLoanBudgetInBudgetScreen,
  setLimitShoppingBudgetInBudgetScreen,
  setLimitTrainingBudgetInBudgetScreen,
  setLimitTransportBudgetInBudgetScreen,
} from '../../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<NavigatorList, 'HomeScreen'>;

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export type ItemBudget = {
  id: number;
  label: string;
  value: string;
  icon: () => React.ReactElement<IconProps> | null;
};

export type LimitFoodBudgetFormValues = {
  limitFoodBudgetValue: number;
  limitBudgetCurrency: string;
};

export type LimitShoppingBudgetFormValues = {
  limitShoppingBudgetValue: number;
  limitShoppingBudgetCurrency: string;
};

export type LimitHomeBudgetFormValues = {
  limitHomeBudgetValue: number;
  limitHomeBudgetCurrency: string;
};

export type LimitTransportBudgetFormValues = {
  limitPublicTransportBudgetValue: number;
  limitPublicTransportBudgetCurrency: string;
};

export type LimitCarBudgetFormValues = {
  limitCarBudgetValue: number;
  limitCarBudgetCurrency: string;
};

export type LimitLoanBudgetFormValues = {
  limitLoanBudgetValue: number;
  limitLoanBudgetCurrency: string;
};

export type LimitEntertainmentBudgetFormValues = {
  limitEntertainmentBudgetValue: number;
  limitEntertainmentBudgetCurrency: string;
};

export type LimitElectronicsBudgetFormValues = {
  limitElectronicsBudgetValue: number;
  limitElectronicsBudgetCurrency: string;
};

export type LimitEducationBudgetFormValues = {
  limitEducationBudgetValue: number;
  limitEducationBudgetCurrency: string;
};

export type LimitGiftsBudgetFormValues = {
  limitGiftsBudgetValue: number;
  limitGiftsBudgetCurrency: string;
};

export type LimitTrainingBudgetFormValues = {
  limitTrainingBudgetValue: number;
  limitTrainingBudgetCurrency: string;
};

export type LimitHealthBudgetFormValues = {
  limitHealthBudgetValue: number;
  limitHealthBudgetCurrency: string;
};

export type LimitHolidaysBudgetFormValues = {
  limitHolidaysBudgetValue: number;
  limitHolidaysBudgetCurrency: string;
};

const BudgetScreen: React.FC<Props> = ({ navigation }) => {
  const [itemsAccount, setItemsAccount] = useState<ItemBudget[]>([]);

  //Translation
  const { t } = useTranslation();

  const dispatch = useDispatch();

  useEffect(() => {
    setItemsAccount([
      {
        id: 0,
        label: t('ExpensesScreenAccountDropDownFamilyText'),
        value: 'Family account',
        icon: () => <MaterialIcons name="family-restroom" size={25} color={'black'} />,
      },
      {
        id: 1,
        label: t('ExpensesScreenAccountDropDownPrivateText'),
        value: 'Private account',
        icon: () => <MaterialIcons name="private-connectivity" size={25} color={'black'} />,
      },
      {
        id: 2,
        label: t('ExpensesScreenAccountDropDownSavingsText'),
        value: 'Savings account',
        icon: () => <MaterialIcons name="savings" size={25} color={'black'} />,
      },
    ]);
  }, [t]);

  const [declaredExpenseAmount, setDeclaredFinalAmount] = useState<string | null>();

  const [errorConvertingFinalCurrencyAmount, setErrorConvertingFinalCurrencyAmount] = useState<
    string | undefined
  >(undefined);

  const [finalExchangeRate, setFinalExchangeRate] = useState<number | null>(null);

  const fetchEachExchangeRate = async (
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
      setErrorConvertingFinalCurrencyAmount('Error converting currency - check Network connection');
      Alert.alert(`Error converting currency - check Network connection, ${error}`);
    }
  };

  const convertAndSumExpense = async (accountName: string): Promise<number> => {
    try {
      let convertedExpensesValues = [];

      await Promise.all(
        expensesArrayOnlyValues
          .filter((expense) => {
            return expense.expenseAccountUniversalValue.toLowerCase() === accountName.toLowerCase();
          })
          .map(async (expense) => {
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
      return properDecimalResult;
    } catch (error) {
      console.log('Error converting and summing each expenses', error);
      return 0;
    }
  };

  const convertAndSumIncome = async (accountName: string): Promise<number> => {
    try {
      let convertedIncomeValues = [];

      await Promise.all(
        incomeArrayOnlyValues
          .filter((income) => {
            return income.incomeAccountUniversalValue.toLowerCase() === accountName.toLowerCase();
          })

          .map(async (income) => {
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
      return properDecimalResult;
    } catch (error) {
      console.log('Error converting and summing each income', error);
      return 0;
    }
  };

  const convertAndSumSavings = async (accountName: string): Promise<number> => {
    try {
      let convertedSavingsValues = [];

      await Promise.all(
        savingsArrayOnlyValues
          .filter((savings) => {
            return savings.savingsAccountUniversalValue.toLowerCase() === accountName.toLowerCase();
          })
          .map(async (savings) => {
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
      return properDecimalResult;
    } catch (error) {
      console.log('Error converting and summing each savings', error);
      return 0;
    }
  };

  const convertAndSumInvestments = async (accountName: string): Promise<number> => {
    try {
      let convertedInvestmentsValues = [];

      await Promise.all(
        investmentsArrayOnlyValues
          .filter((investment) => {
            return (
              investment.investmentAccountUniversalValue.toLowerCase() === accountName.toLowerCase()
            );
          })
          .map(async (investment) => {
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
      return properDecimalResult;
    } catch (error) {
      console.log('Error converting and summing each investment', error);
      return 0;
    }
  };

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

  const currencyFromSettings = useSelector(
    (state: RootState) => state.name.settingsScreenActualCurrency
  );

  const mainContentChoosenCurrencyName = useSelector(
    (state: RootState) => state.name.selectedCurrencyOptionRadioButton
  );

  const [isBudgetPerAccountCalculated, setIsBudgetPerAccountCalculated] = useState(false);

  const calculateTotalsForAccounts = async (accountName: string) => {
    try {
      const expenseTotal = await convertAndSumExpense(accountName);
      const incomeTotal = await convertAndSumIncome(accountName);
      const savingsTotal = await convertAndSumSavings(accountName);
      const investmentsTotal = await convertAndSumInvestments(accountName);

      const summedUp = expenseTotal + incomeTotal + savingsTotal + investmentsTotal;
      const summedUpFamily = expenseTotal + incomeTotal + savingsTotal + investmentsTotal;
      const summedUpPrivate = expenseTotal + incomeTotal + savingsTotal + investmentsTotal;
      const summedUpSavings = expenseTotal + incomeTotal + savingsTotal + investmentsTotal;
      return {
        summedUp,
        summedUpFamily,
        summedUpPrivate,
        summedUpSavings,
      };
    } catch (error) {
      console.log('Error calculating totals for accounts', error);
      return {
        summedUp: 0,
        summedUpFamily: 0,
        summedUpPrivate: 0,
        summedUpSavings: 0,
      };
    }
  };

  const [totals, setTotals] = useState<{ [key: string]: number } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const totalsData: { [key: string]: number } = {};

      await Promise.all(
        itemsAccount.map(async (item) => {
          const result = await calculateTotalsForAccounts(item.value);
          totalsData[item.value] = result.summedUp;
        })
      );

      setTotals(totalsData);
    } catch (error) {
      console.error('Error fetching totals:', error);
    }
  }, [itemsAccount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const RenderAccountItem = ({ item }: { item: ItemBudget }) => {
    const totalForItem = totals ? Number(totals[item.value]?.toFixed(2)) : null;

    return (
      <View style={{ flexDirection: 'column', width: '100%' }}>
        <View
          style={{
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: 'lightgray',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 20,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {item.icon()}
              <Text style={{ marginLeft: 5 }}>{item.label}</Text>
            </View>
            {totalForItem !== null && isBudgetPerAccountCalculated ? (
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <Text>{totalForItem}</Text>
                <Text>{mainContentChoosenCurrencyName}</Text>
              </View>
            ) : (
              <ActivityIndicator />
            )}
          </View>
        </View>
      </View>
    );
  };

  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#fff',
    backgroundGradientToOpacity: 0.5,

    fillShadowGradientOpacity: 0,
    color: (opacity = 1) => '#023047',
    labelColor: (opacity = 1) => '#333',
    strokeWidth: 2,

    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const PieChartComponent = ({ summedUpFamily, summedUpPrivate, summedUpSavings }: any) => {
    const convertedSummedUpFamily = parseFloat(summedUpFamily.toFixed(2));
    const convertedSummedUpPrivate = parseFloat(summedUpPrivate.toFixed(4));
    const convertedSummedUpSavings = parseFloat(summedUpSavings.toFixed(2));
    const pieChartData = [
      {
        name: t('BudgetScreenLineChartFamilyAccountText'),
        value: convertedSummedUpFamily,
        color: 'red',
        legendFontColor: 'black',
        legendFontSize: 10,
      },
      {
        name: t('BudgetScreenLineChartPrivateAccountText'),
        value: convertedSummedUpPrivate,
        color: 'yellow',
        legendFontColor: 'black',
        legendFontSize: 10,
      },
      {
        name: t('BudgetScreenLineChartSavingsAccountText'),
        value: convertedSummedUpSavings,
        color: 'blue',
        legendFontColor: 'black',
        legendFontSize: 10,
      },
    ];

    return (
      <View collapsable={false} style={{ width: '100%', backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', left: '5%' }}>
          {mainContentChoosenCurrencyName}
        </Text>
        <PieChart
          data={pieChartData}
          width={screenWidth - 20}
          height={250}
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="lightsteelblue"
          paddingLeft="9"
          absolute
        />
      </View>
    );
  };

  const PieChartComponentWithData = () => {
    if (
      !isBudgetPerAccountCalculated ||
      summedUpFamily === null ||
      summedUpPrivate === null ||
      summedUpSavings === null
    ) {
      // loading spinner when data is loading
      return <ActivityIndicator />;
    }

    // Data is ready, render the LineChartComponent with the fetched data
    return (
      <PieChartComponent
        summedUpFamily={summedUpFamily}
        summedUpPrivate={summedUpPrivate}
        summedUpSavings={summedUpSavings}
      />
    );
  };

  const [summedUpFamily, setSummedUpFamily] = useState<number>(0);
  const [summedUpPrivate, setSummedUpPrivate] = useState<number>(0);
  const [summedUpSavings, setSummedUpSavings] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const resultFamily = await calculateTotalsForAccounts('Family account');
      const resultPrivate = await calculateTotalsForAccounts('Private account');
      const resultSavings = await calculateTotalsForAccounts('Savings account');

      setSummedUpFamily(resultFamily.summedUpFamily);
      setSummedUpPrivate(resultPrivate.summedUpPrivate);
      setSummedUpSavings(resultSavings.summedUpSavings);
      setIsBudgetPerAccountCalculated(true);
    };

    fetchData();
  }, [summedUpFamily, summedUpPrivate, summedUpSavings]);

  const theme = { mode: 'dark' };
  let activeColorsDark = colors.dark;
  let activeColorsLight = colors.light;

  const { themeconfig, toggleTheme, useSystemTheme }: any = useContext(ThemeContext);

  // Limit Food budget

  const {
    control: controlLimitFoodBudget,
    handleSubmit: handleSubmitLimitFoodBudget,
    formState: { errors: formStateLimitFoodBudget },
  } = useForm<LimitFoodBudgetFormValues>({
    defaultValues: {
      limitFoodBudgetValue: 0,
      limitBudgetCurrency: '',
    },
    resolver: yupResolver(limitFoodBudgetScreenSchema) as Resolver<LimitFoodBudgetFormValues, any>,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const addLimitFoodBudget = (data: LimitFoodBudgetFormValues) => {
    dispatch(setLimitFoodBudgetInBudgetScreen(data.limitFoodBudgetValue, data.limitBudgetCurrency));
  };

  const onSubmitLimitFoodBudget = (data: LimitFoodBudgetFormValues) => {
    addLimitFoodBudget(data);
  };

  const { limitFoodBudgetValue, limitBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitFoodBudget
  );

  // Limit Shopping budget

  const {
    control: controlLimitShoppingBudget,
    handleSubmit: handleSubmitLimitShoppingBudget,
    formState: { errors: formStateLimitShoppingBudget },
  } = useForm<LimitShoppingBudgetFormValues>({
    defaultValues: {
      limitShoppingBudgetValue: 0,
      limitShoppingBudgetCurrency: '',
    },
    resolver: yupResolver(limitShoppingBudgetScreenSchema) as Resolver<
      LimitShoppingBudgetFormValues,
      any
    >,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const addLimitShoppingBudget = (data: LimitShoppingBudgetFormValues) => {
    dispatch(
      setLimitShoppingBudgetInBudgetScreen(
        data.limitShoppingBudgetValue,
        data.limitShoppingBudgetCurrency
      )
    );
  };

  const onSubmitLimitShoppingBudget = (data: LimitShoppingBudgetFormValues) => {
    addLimitShoppingBudget(data);
  };

  const { limitShoppingBudgetValue, limitShoppingBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitShoppingBudget
  );

  // Limit Home budget

  const {
    control: controlLimitHomeBudget,
    handleSubmit: handleSubmitLimitHomeBudget,
    formState: { errors: formStateLimitHomeBudget },
  } = useForm<LimitHomeBudgetFormValues>({
    defaultValues: {
      limitHomeBudgetValue: 0,
      limitHomeBudgetCurrency: '',
    },
    resolver: yupResolver(limitHomeBudgetScreenSchema) as Resolver<LimitHomeBudgetFormValues, any>,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const addLimitHomeBudget = (data: LimitHomeBudgetFormValues) => {
    dispatch(
      setLimitHomeBudgetInBudgetScreen(data.limitHomeBudgetValue, data.limitHomeBudgetCurrency)
    );
  };

  const onSubmitLimitHomeBudget = (data: LimitHomeBudgetFormValues) => {
    addLimitHomeBudget(data);
  };

  const { limitHomeBudgetValue, limitHomeBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitHomeBudget
  );

  // Limit Public transport budget

  const {
    control: controlLimitTransportBudget,
    handleSubmit: handleSubmitLimitTransportBudget,
    formState: { errors: formStateLimitTransportBudget },
  } = useForm<LimitTransportBudgetFormValues>({
    defaultValues: {
      limitPublicTransportBudgetValue: 0,
      limitPublicTransportBudgetCurrency: '',
    },
    resolver: yupResolver(limitPublicTransportBudgetScreenSchema) as Resolver<
      LimitTransportBudgetFormValues,
      any
    >,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const addLimitTransportBudget = (data: LimitTransportBudgetFormValues) => {
    dispatch(
      setLimitTransportBudgetInBudgetScreen(
        data.limitPublicTransportBudgetValue,
        data.limitPublicTransportBudgetCurrency
      )
    );
  };

  const onSubmitLimitTransportBudget = (data: LimitTransportBudgetFormValues) => {
    addLimitTransportBudget(data);
  };

  const { limitPublicTransportBudgetValue, limitPublicTransportBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitPublicTransportBudget
  );

  // Limit Car budget

  const {
    control: controlLimitCarBudget,
    handleSubmit: handleSubmitLimitCarBudget,
    formState: { errors: formStateLimitCarBudget },
  } = useForm<LimitCarBudgetFormValues>({
    defaultValues: {
      limitCarBudgetValue: 0,
      limitCarBudgetCurrency: '',
    },
    resolver: yupResolver(limitCarBudgetScreenSchema) as Resolver<LimitCarBudgetFormValues, any>,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const addLimitCarBudget = (data: LimitCarBudgetFormValues) => {
    dispatch(
      setLimitCarBudgetInBudgetScreen(data.limitCarBudgetValue, data.limitCarBudgetCurrency)
    );
  };

  const onSubmitLimitCarBudget = (data: LimitCarBudgetFormValues) => {
    addLimitCarBudget(data);
  };

  const { limitCarBudgetValue, limitCarBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitCarBudget
  );

  // Limit Loan budget

  const {
    control: controlLimitLoanBudget,
    handleSubmit: handleSubmitLimitLoanBudget,
    formState: { errors: formStateLimitLoanBudget },
  } = useForm<LimitLoanBudgetFormValues>({
    defaultValues: {
      limitLoanBudgetValue: 0,
      limitLoanBudgetCurrency: '',
    },
    resolver: yupResolver(limitLoanBudgetScreenSchema) as Resolver<LimitLoanBudgetFormValues, any>,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const addLimitLoanBudget = (data: LimitLoanBudgetFormValues) => {
    dispatch(
      setLimitLoanBudgetInBudgetScreen(data.limitLoanBudgetValue, data.limitLoanBudgetCurrency)
    );
  };

  const onSubmitLimitLoanBudget = (data: LimitLoanBudgetFormValues) => {
    addLimitLoanBudget(data);
  };

  const { limitLoanBudgetValue, limitLoanBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitLoanBudget
  );

  // Limit Entertainment budget

  const {
    control: controlLimitEntertainmentBudget,
    handleSubmit: handleSubmitLimitEntertainmentBudget,
    formState: { errors: formStateLimitEntertainmentBudget },
  } = useForm<LimitEntertainmentBudgetFormValues>({
    defaultValues: {
      limitEntertainmentBudgetValue: 0,
      limitEntertainmentBudgetCurrency: '',
    },
    resolver: yupResolver(limitEntertainmentBudgetScreenSchema) as Resolver<
      LimitEntertainmentBudgetFormValues,
      any
    >,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const addLimitEntertainmentBudget = (data: LimitEntertainmentBudgetFormValues) => {
    dispatch(
      setLimitEntertainmentBudgetInBudgetScreen(
        data.limitEntertainmentBudgetValue,
        data.limitEntertainmentBudgetCurrency
      )
    );
  };

  const onSubmitLimitEntertainmentBudget = (data: LimitEntertainmentBudgetFormValues) => {
    addLimitEntertainmentBudget(data);
  };

  const { limitEntertainmentBudgetValue, limitEntertainmentBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitEntertainmentBudget
  );

  // Limit Electronics budget

  const {
    control: controlLimitElectronicsBudget,
    handleSubmit: handleSubmitLimitElectronicsBudget,
    formState: { errors: formStateLimitElectronicsBudget },
  } = useForm<LimitElectronicsBudgetFormValues>({
    defaultValues: {
      limitElectronicsBudgetValue: 0,
      limitElectronicsBudgetCurrency: '',
    },
    resolver: yupResolver(limitElectronicsBudgetScreenSchema) as Resolver<
      LimitElectronicsBudgetFormValues,
      any
    >,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const addLimitElectronicsBudget = (data: LimitElectronicsBudgetFormValues) => {
    dispatch(
      setLimitElectronicsBudgetInBudgetScreen(
        data.limitElectronicsBudgetValue,
        data.limitElectronicsBudgetCurrency
      )
    );
  };

  const onSubmitLimitElectronicsBudget = (data: LimitElectronicsBudgetFormValues) => {
    addLimitElectronicsBudget(data);
  };

  const { limitElectronicsBudgetValue, limitElectronicsBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitElectronicsBudget
  );

  // Limit Education budget

  const {
    control: controlLimitEducationBudget,
    handleSubmit: handleSubmitLimitEducationBudget,
    formState: { errors: formStateLimitEducationBudget },
  } = useForm<LimitEducationBudgetFormValues>({
    defaultValues: {
      limitEducationBudgetValue: 0,
      limitEducationBudgetCurrency: '',
    },
    resolver: yupResolver(limitEducationBudgetScreenSchema) as Resolver<
      LimitEducationBudgetFormValues,
      any
    >,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const addLimitEducationBudget = (data: LimitEducationBudgetFormValues) => {
    dispatch(
      setLimitEducationBudgetInBudgetScreen(
        data.limitEducationBudgetValue,
        data.limitEducationBudgetCurrency
      )
    );
  };

  const onSubmitLimitEducationBudget = (data: LimitEducationBudgetFormValues) => {
    addLimitEducationBudget(data);
  };

  const { limitEducationBudgetValue, limitEducationBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitEducationBudget
  );

  // Limit Gifts budget

  const {
    control: controlLimitGiftsBudget,
    handleSubmit: handleSubmitLimitGiftsBudget,
    formState: { errors: formStateLimitGiftsBudget },
  } = useForm<LimitGiftsBudgetFormValues>({
    defaultValues: {
      limitGiftsBudgetValue: 0,
      limitGiftsBudgetCurrency: '',
    },
    resolver: yupResolver(limitGiftsBudgetScreenSchema) as Resolver<
      LimitGiftsBudgetFormValues,
      any
    >,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const addLimitGiftsBudget = (data: LimitGiftsBudgetFormValues) => {
    dispatch(
      setLimitGiftsBudgetInBudgetScreen(data.limitGiftsBudgetValue, data.limitGiftsBudgetCurrency)
    );
  };

  const onSubmitLimitGiftsBudget = (data: LimitGiftsBudgetFormValues) => {
    addLimitGiftsBudget(data);
  };

  const { limitGiftsBudgetValue, limitGiftsBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitGiftsBudget
  );

  // Limit Training budget

  const {
    control: controlLimitTrainingBudget,
    handleSubmit: handleSubmitLimitTrainingBudget,
    formState: { errors: formStateLimitTrainingBudget },
  } = useForm<LimitTrainingBudgetFormValues>({
    defaultValues: {
      limitTrainingBudgetValue: 0,
      limitTrainingBudgetCurrency: '',
    },
    resolver: yupResolver(limitTrainingBudgetScreenSchema) as Resolver<
      LimitTrainingBudgetFormValues,
      any
    >,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const addLimitTrainingBudget = (data: LimitTrainingBudgetFormValues) => {
    dispatch(
      setLimitTrainingBudgetInBudgetScreen(
        data.limitTrainingBudgetValue,
        data.limitTrainingBudgetCurrency
      )
    );
  };

  const onSubmitLimitTrainingBudget = (data: LimitTrainingBudgetFormValues) => {
    addLimitTrainingBudget(data);
  };

  const { limitTrainingBudgetValue, limitTrainingBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitTrainingBudget
  );

  // Limit Health budget

  const {
    control: controlLimitHealthBudget,
    handleSubmit: handleSubmitLimitHealthBudget,
    formState: { errors: formStateLimitHealthBudget },
  } = useForm<LimitHealthBudgetFormValues>({
    defaultValues: {
      limitHealthBudgetValue: 0,
      limitHealthBudgetCurrency: '',
    },
    resolver: yupResolver(limitHealthBudgetScreenSchema) as Resolver<
      LimitHealthBudgetFormValues,
      any
    >,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const addLimitHealthBudget = (data: LimitHealthBudgetFormValues) => {
    dispatch(
      setLimitHealthBudgetInBudgetScreen(
        data.limitHealthBudgetValue,
        data.limitHealthBudgetCurrency
      )
    );
  };

  const onSubmitLimitHealthBudget = (data: LimitHealthBudgetFormValues) => {
    addLimitHealthBudget(data);
  };

  const { limitHealthBudgetValue, limitHealthBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitHealthBudget
  );

  // Limit Holidays budget

  const {
    control: controlLimitHolidaysBudget,
    handleSubmit: handleSubmitLimitHolidaysBudget,
    formState: { errors: formStateLimitHolidaysBudget },
  } = useForm<LimitHolidaysBudgetFormValues>({
    defaultValues: {
      limitHolidaysBudgetValue: 0,
      limitHolidaysBudgetCurrency: '',
    },
    resolver: yupResolver(limitHolidaysBudgetScreenSchema) as Resolver<
      LimitHolidaysBudgetFormValues,
      any
    >,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const addLimitHolidaysBudget = (data: LimitHolidaysBudgetFormValues) => {
    dispatch(
      setLimitHolidaysBudgetInBudgetScreen(
        data.limitHolidaysBudgetValue,
        data.limitHolidaysBudgetCurrency
      )
    );
  };

  const onSubmitLimitHolidaysBudget = (data: LimitHolidaysBudgetFormValues) => {
    addLimitHolidaysBudget(data);
  };

  const { limitHolidaysBudgetValue, limitHolidaysBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitHolidaysBudget
  );

  const numericValue = 0.0;

  type LimitBudgetCurrencyProps = {
    name: string;
    IconSymbol: string;
  };

  const limitBudgetCurrencies: LimitBudgetCurrencyProps[] = [
    { name: 'PLN', IconSymbol: 'zł' },
    { name: 'EUR', IconSymbol: '€' },
    { name: 'USD', IconSymbol: '$' },
    { name: 'GBP', IconSymbol: '£' },
  ];

  const loadExpenseCategoryDataFromRedux = useCallback(async () => {
    try {
      const limitFoodBudget = await AsyncStorage.getItem('limitFoodBudget');
      const limitShoppingBudget = await AsyncStorage.getItem('limitShoppingBudget');
      const limitHomeBudget = await AsyncStorage.getItem('limitHomeBudget');
      const limitTransportBudget = await AsyncStorage.getItem('limitTransportBudget');
      const limitCarBudget = await AsyncStorage.getItem('limitCarBudget');
      const limitLoanBudget = await AsyncStorage.getItem('limitLoanBudget');
      const limitEntertainmentBudget = await AsyncStorage.getItem('limitEntertainmentBudget');
      const limitElectronicsBudget = await AsyncStorage.getItem('limitElectronicsBudget');
      const limitEducationBudget = await AsyncStorage.getItem('limitEducationBudget');
      const limitGiftsBudget = await AsyncStorage.getItem('limitGiftsBudget');
      const limitTrainingBudget = await AsyncStorage.getItem('limitTrainingBudget');
      const limitHealthBudget = await AsyncStorage.getItem('limitHealthBudget');
      const limitHolidaysBudget = await AsyncStorage.getItem('limitHolidaysBudget');

      if (limitFoodBudget !== null) {
        const parsedFoodData = JSON.parse(limitFoodBudget);
        dispatch({ type: 'SET_LIMIT_FOOD_BUDGET_IN_BUDGET_SCREEN', payload: parsedFoodData });
      }

      if (limitShoppingBudget !== null) {
        const parsedShoppingData = JSON.parse(limitShoppingBudget);
        dispatch({
          type: 'SET_LIMIT_SHOPPING_BUDGET_IN_BUDGET_SCREEN',
          payload: parsedShoppingData,
        });
      }

      if (limitHomeBudget !== null) {
        const parsedHomeData = JSON.parse(limitHomeBudget);
        dispatch({ type: 'SET_LIMIT_HOME_BUDGET_IN_BUDGET_SCREEN', payload: parsedHomeData });
      }

      if (limitTransportBudget !== null) {
        const parsedTransportData = JSON.parse(limitTransportBudget);
        dispatch({
          type: 'SET_LIMIT_PUBLIC_TRANSPORT_BUDGET_IN_BUDGET_SCREEN',
          payload: parsedTransportData,
        });
      }

      if (limitCarBudget !== null) {
        const parsedCarData = JSON.parse(limitCarBudget);
        dispatch({ type: 'SET_LIMIT_CAR_BUDGET_IN_BUDGET_SCREEN', payload: parsedCarData });
      }

      if (limitLoanBudget !== null) {
        const parsedLoanData = JSON.parse(limitLoanBudget);
        dispatch({ type: 'SET_LIMIT_LOAN_BUDGET_IN_BUDGET_SCREEN', payload: parsedLoanData });
      }

      if (limitEntertainmentBudget !== null) {
        const parsedEntertainmentData = JSON.parse(limitEntertainmentBudget);
        dispatch({
          type: 'SET_LIMIT_ENTERTAINMENT_BUDGET_IN_BUDGET_SCREEN',
          payload: parsedEntertainmentData,
        });
      }

      if (limitElectronicsBudget !== null) {
        const parsedElectronicsData = JSON.parse(limitElectronicsBudget);
        dispatch({
          type: 'SET_LIMIT_ELECTRONICS_BUDGET_IN_BUDGET_SCREEN',
          payload: parsedElectronicsData,
        });
      }

      if (limitEducationBudget !== null) {
        const parsedEducationData = JSON.parse(limitEducationBudget);
        dispatch({
          type: 'SET_LIMIT_EDUCATION_BUDGET_IN_BUDGET_SCREEN',
          payload: parsedEducationData,
        });
      }

      if (limitGiftsBudget !== null) {
        const parsedGiftsData = JSON.parse(limitGiftsBudget);
        dispatch({
          type: 'SET_LIMIT_GIFTS_BUDGET_IN_BUDGET_SCREEN',
          payload: parsedGiftsData,
        });
      }

      if (limitTrainingBudget !== null) {
        const parsedTrainingData = JSON.parse(limitTrainingBudget);
        dispatch({
          type: 'SET_LIMIT_TRAINING_BUDGET_IN_BUDGET_SCREEN',
          payload: parsedTrainingData,
        });
      }

      if (limitHealthBudget !== null) {
        const parsedHealthData = JSON.parse(limitHealthBudget);
        dispatch({
          type: 'SET_LIMIT_HEALTH_BUDGET_IN_BUDGET_SCREEN',
          payload: parsedHealthData,
        });
      }

      if (limitHolidaysBudget !== null) {
        const parsedHolidaysData = JSON.parse(limitHolidaysBudget);
        dispatch({
          type: 'SET_LIMIT_HOLIDAYS_BUDGET_IN_BUDGET_SCREEN',
          payload: parsedHolidaysData,
        });
      }
    } catch (error) {
      console.error('Error reading data food from AsyncStorage', error);
    }

    return null;
  }, [
    limitFoodBudgetValue,
    limitBudgetCurrency,
    limitShoppingBudgetValue,
    limitShoppingBudgetCurrency,
    limitHomeBudgetValue,
    limitHomeBudgetCurrency,
    limitPublicTransportBudgetValue,
    limitPublicTransportBudgetCurrency,
    limitCarBudgetValue,
    limitCarBudgetCurrency,
    limitLoanBudgetValue,
    limitLoanBudgetCurrency,
    limitEntertainmentBudgetValue,
    limitEntertainmentBudgetCurrency,
    limitElectronicsBudgetValue,
    limitElectronicsBudgetCurrency,
    limitEducationBudgetValue,
    limitEducationBudgetCurrency,
    limitGiftsBudgetValue,
    limitGiftsBudgetCurrency,
    limitTrainingBudgetValue,
    limitTrainingBudgetCurrency,
    limitHealthBudgetValue,
    limitHealthBudgetCurrency,
    limitHolidaysBudgetValue,
    limitHolidaysBudgetCurrency,
  ]);

  useEffect(() => {
    loadExpenseCategoryDataFromRedux();
  }, [loadExpenseCategoryDataFromRedux]);

  useEffect(() => {
    async function displayAllKeys() {
      try {
        const allkeys = await AsyncStorage.getAllKeys();
        console.log('All keys in AsyncStorage', allkeys);
      } catch (error) {
        console.error('Error retrieving keyss from AsyncStorage:', error);
      }
    }
    displayAllKeys();
  }, []);

  return (
    <ScrollView>
      <View
        style={{
          ...styles.categoryMainContainer,
          backgroundColor:
            themeconfig === theme.mode ? activeColorsDark.primary : activeColorsLight.accent,
        }}
      >
        <View style={styles.categoryTitleContainer}>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              width: 30,
              height: 30,
              borderRadius: 15,
            }}
            onPress={() => navigation.navigate('HomeScreen')}
          >
            <AntDesign name="arrowleft" size={30} color={'black'} />
          </TouchableOpacity>
          <Text style={styles.titleText}>{t('BudgetScreenAppBarText')}</Text>
        </View>

        <View style={styles.eachAccountContainer}>
          <FlatList
            data={itemsAccount}
            renderItem={({ item }) => <RenderAccountItem item={item} />}
            keyExtractor={(item) => item.label}
            style={{ backgroundColor: 'lightsteelblue', borderRadius: 20 }}
            scrollEnabled={false}
          />
        </View>
        <View style={{ ...styles.chartContainer, height: 350, marginBottom: 20 }}>
          <PieChartComponentWithData />
        </View>
        <View
          style={{
            flexDirection: 'column',
            width: '80%',
            alignItems: 'center',
            marginTop: '5%',
            alignSelf: 'center',
            height: 310,
          }}
        >
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: 'cornflowerblue',
              alignItems: 'center',
              height: 330,
              borderRadius: 10,
              marginBottom: '5%',
              padding: '2%',
              borderColor: 'white',
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                fontSize: 16,
              }}
            >
              {t('BudgetScreenLimitBudgetFoodTitleText')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingTop: '5%',
              }}
            >
              <Controller
                control={controlLimitFoodBudget}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    cursorColor={'black'}
                    placeholderTextColor={'black'}
                    style={{
                      backgroundColor: 'seashell',
                      textAlign: 'center',
                      marginBottom: '1%',
                      height: '100%',
                      color: 'blue',
                      fontSize: 18,
                      width: '70%',
                      borderColor: 'black',
                      borderWidth: 1,
                    }}
                    placeholder={t('BudgetScreenLimitBudgetPlaceholderText')}
                    keyboardType="decimal-pad"
                    onChangeText={(text: string) => {
                      const formattedText = text.replace(',', '.');
                      const dotCount = formattedText.split('.').length - 1;
                      const dotArray = formattedText.split('.')[1] || '';
                      onChange(numericValue);
                      if (dotCount <= 1 && dotArray[2] === '0') {
                      } else {
                        onChange(formattedText);
                      }
                      onBlur();
                    }}
                    value={value ? value.toString() : ''}
                  />
                )}
                name="limitFoodBudgetValue"
              />
              <Controller
                control={controlLimitFoodBudget}
                render={({ field: { onChange, value } }) => (
                  <SelectDropdown
                    defaultButtonText={t('currencyText')}
                    buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                    defaultValue={value}
                    data={limitBudgetCurrencies}
                    onSelect={(selectedItem: LimitBudgetCurrencyProps) => {
                      // setChoosenExpensesCurrencyMenuOption([selectedItem.name]);
                      onChange(selectedItem.name);
                    }}
                    buttonTextAfterSelection={(selectedItem: LimitBudgetCurrencyProps) => {
                      return selectedItem.IconSymbol;
                    }}
                    dropdownStyle={{ borderRadius: 10 }}
                    buttonStyle={{
                      borderRadius: 10,
                      width: '25%',
                      height: 60,
                      backgroundColor: '#fff',
                      borderColor: 'lime',
                      borderWidth: 1,
                    }}
                    rowStyle={{ height: 90, padding: 3 }}
                    rowTextForSelection={(item: LimitBudgetCurrencyProps) => item.name}
                    renderCustomizedRowChild={(item: LimitBudgetCurrencyProps) => (
                      <View style={styles.dropdownItem}>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                      </View>
                    )}
                  />
                )}
                name="limitBudgetCurrency"
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: '5%',
                height: 80,
              }}
            >
              {formStateLimitFoodBudget.limitFoodBudgetValue && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitFoodBudget.limitFoodBudgetValue.message}
                </Text>
              )}

              {formStateLimitFoodBudget.limitBudgetCurrency && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitFoodBudget.limitBudgetCurrency.message}
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 20,
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                alignSelf: 'center',
              }}
            >
              {limitFoodBudgetValue} {limitBudgetCurrency}
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'blue',
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                testID="submitButton"
                style={styles.submitButton}
                onPress={handleSubmitLimitFoodBudget(onSubmitLimitFoodBudget)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'serif',
                    color: 'black',
                  }}
                >
                  {t('FormsScreenSubmitText')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: 'olivedrab',
              alignItems: 'center',
              height: 330,
              borderRadius: 10,
              marginBottom: '5%',
              padding: '2%',
              borderColor: 'white',
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                fontSize: 16,
              }}
            >
              {t('BudgetScreenLimitBudgetShoppingTitleText')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingTop: '5%',
              }}
            >
              <Controller
                control={controlLimitShoppingBudget}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    cursorColor={'black'}
                    placeholderTextColor={'black'}
                    style={{
                      backgroundColor: 'seashell',
                      textAlign: 'center',
                      marginBottom: '1%',
                      height: '100%',
                      color: 'blue',
                      fontSize: 18,
                      width: '70%',
                      borderColor: 'black',
                      borderWidth: 1,
                    }}
                    placeholder={t('BudgetScreenLimitBudgetPlaceholderText')}
                    keyboardType="decimal-pad"
                    onChangeText={(text: string) => {
                      const formattedText = text.replace(',', '.');
                      const dotCount = formattedText.split('.').length - 1;
                      const dotArray = formattedText.split('.')[1] || '';
                      onChange(numericValue);
                      if (dotCount <= 1 && dotArray[2] === '0') {
                      } else {
                        onChange(formattedText);
                      }
                      onBlur();
                    }}
                    value={value ? value.toString() : ''}
                  />
                )}
                name="limitShoppingBudgetValue"
              />
              <Controller
                control={controlLimitShoppingBudget}
                render={({ field: { onChange, value } }) => (
                  <SelectDropdown
                    defaultButtonText={t('currencyText')}
                    buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                    defaultValue={value}
                    data={limitBudgetCurrencies}
                    onSelect={(selectedItem: LimitBudgetCurrencyProps) => {
                      // setChoosenExpensesCurrencyMenuOption([selectedItem.name]);
                      onChange(selectedItem.name);
                    }}
                    buttonTextAfterSelection={(selectedItem: LimitBudgetCurrencyProps) => {
                      return selectedItem.IconSymbol;
                    }}
                    dropdownStyle={{ borderRadius: 10 }}
                    buttonStyle={{
                      borderRadius: 10,
                      width: '25%',
                      height: 60,
                      backgroundColor: '#fff',
                      borderColor: 'lime',
                      borderWidth: 1,
                    }}
                    rowStyle={{ height: 90, padding: 3 }}
                    rowTextForSelection={(item: LimitBudgetCurrencyProps) => item.name}
                    renderCustomizedRowChild={(item: LimitBudgetCurrencyProps) => (
                      <View style={styles.dropdownItem}>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                      </View>
                    )}
                  />
                )}
                name="limitShoppingBudgetCurrency"
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: '5%',
                height: 80,
              }}
            >
              {formStateLimitShoppingBudget.limitShoppingBudgetValue && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitShoppingBudget.limitShoppingBudgetValue.message}
                </Text>
              )}

              {formStateLimitShoppingBudget.limitShoppingBudgetCurrency && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitShoppingBudget.limitShoppingBudgetCurrency.message}
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 20,
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                alignSelf: 'center',
              }}
            >
              {limitShoppingBudgetValue} {limitShoppingBudgetCurrency}
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'blue',
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                testID="submitButton"
                style={styles.submitButton}
                onPress={handleSubmitLimitShoppingBudget(onSubmitLimitShoppingBudget)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'serif',
                    color: 'black',
                  }}
                >
                  {t('FormsScreenSubmitText')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: 'indianred',
              alignItems: 'center',
              height: 330,
              borderRadius: 10,
              marginBottom: '5%',
              padding: '2%',
              borderColor: 'white',
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                fontSize: 16,
              }}
            >
              {t('BudgetScreenLimitBudgetHomeTitleText')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingTop: '5%',
              }}
            >
              <Controller
                control={controlLimitHomeBudget}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    cursorColor={'black'}
                    placeholderTextColor={'black'}
                    style={{
                      backgroundColor: 'seashell',
                      textAlign: 'center',
                      marginBottom: '1%',
                      height: '100%',
                      color: 'blue',
                      fontSize: 18,
                      width: '70%',
                      borderColor: 'black',
                      borderWidth: 1,
                    }}
                    placeholder={t('BudgetScreenLimitBudgetPlaceholderText')}
                    keyboardType="decimal-pad"
                    onChangeText={(text: string) => {
                      const formattedText = text.replace(',', '.');
                      const dotCount = formattedText.split('.').length - 1;
                      const dotArray = formattedText.split('.')[1] || '';
                      onChange(numericValue);
                      if (dotCount <= 1 && dotArray[2] === '0') {
                      } else {
                        onChange(formattedText);
                      }
                      onBlur();
                    }}
                    value={value ? value.toString() : ''}
                  />
                )}
                name="limitHomeBudgetValue"
              />
              <Controller
                control={controlLimitHomeBudget}
                render={({ field: { onChange, value } }) => (
                  <SelectDropdown
                    defaultButtonText={t('currencyText')}
                    buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                    defaultValue={value}
                    data={limitBudgetCurrencies}
                    onSelect={(selectedItem: LimitBudgetCurrencyProps) => {
                      // setChoosenExpensesCurrencyMenuOption([selectedItem.name]);
                      onChange(selectedItem.name);
                    }}
                    buttonTextAfterSelection={(selectedItem: LimitBudgetCurrencyProps) => {
                      return selectedItem.IconSymbol;
                    }}
                    dropdownStyle={{ borderRadius: 10 }}
                    buttonStyle={{
                      borderRadius: 10,
                      width: '25%',
                      height: 60,
                      backgroundColor: '#fff',
                      borderColor: 'lime',
                      borderWidth: 1,
                    }}
                    rowStyle={{ height: 90, padding: 3 }}
                    rowTextForSelection={(item: LimitBudgetCurrencyProps) => item.name}
                    renderCustomizedRowChild={(item: LimitBudgetCurrencyProps) => (
                      <View style={styles.dropdownItem}>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                      </View>
                    )}
                  />
                )}
                name="limitHomeBudgetCurrency"
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: '5%',
                height: 80,
              }}
            >
              {formStateLimitHomeBudget.limitHomeBudgetValue && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitHomeBudget.limitHomeBudgetValue.message}
                </Text>
              )}

              {formStateLimitHomeBudget.limitHomeBudgetCurrency && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitHomeBudget.limitHomeBudgetCurrency.message}
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 20,
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                alignSelf: 'center',
              }}
            >
              {limitHomeBudgetValue} {limitHomeBudgetCurrency}
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'blue',
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                testID="submitButton"
                style={styles.submitButton}
                onPress={handleSubmitLimitHomeBudget(onSubmitLimitHomeBudget)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'serif',
                    color: 'black',
                  }}
                >
                  {t('FormsScreenSubmitText')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: 'tan',
              alignItems: 'center',
              height: 330,
              borderRadius: 10,
              marginBottom: '5%',
              padding: '2%',
              borderColor: 'white',
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                fontSize: 16,
              }}
            >
              {t('BudgetScreenLimitBudgetTransportTitleText')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingTop: '5%',
              }}
            >
              <Controller
                control={controlLimitTransportBudget}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    cursorColor={'black'}
                    placeholderTextColor={'black'}
                    style={{
                      backgroundColor: 'seashell',
                      textAlign: 'center',
                      marginBottom: '1%',
                      height: '100%',
                      color: 'blue',
                      fontSize: 18,
                      width: '70%',
                      borderColor: 'black',
                      borderWidth: 1,
                    }}
                    placeholder={t('BudgetScreenLimitBudgetPlaceholderText')}
                    keyboardType="decimal-pad"
                    onChangeText={(text: string) => {
                      const formattedText = text.replace(',', '.');
                      const dotCount = formattedText.split('.').length - 1;
                      const dotArray = formattedText.split('.')[1] || '';
                      onChange(numericValue);
                      if (dotCount <= 1 && dotArray[2] === '0') {
                      } else {
                        onChange(formattedText);
                      }
                      onBlur();
                    }}
                    value={value ? value.toString() : ''}
                  />
                )}
                name="limitPublicTransportBudgetValue"
              />
              <Controller
                control={controlLimitTransportBudget}
                render={({ field: { onChange, value } }) => (
                  <SelectDropdown
                    defaultButtonText={t('currencyText')}
                    buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                    defaultValue={value}
                    data={limitBudgetCurrencies}
                    onSelect={(selectedItem: LimitBudgetCurrencyProps) => {
                      // setChoosenExpensesCurrencyMenuOption([selectedItem.name]);
                      onChange(selectedItem.name);
                    }}
                    buttonTextAfterSelection={(selectedItem: LimitBudgetCurrencyProps) => {
                      return selectedItem.IconSymbol;
                    }}
                    dropdownStyle={{ borderRadius: 10 }}
                    buttonStyle={{
                      borderRadius: 10,
                      width: '25%',
                      height: 60,
                      backgroundColor: '#fff',
                      borderColor: 'lime',
                      borderWidth: 1,
                    }}
                    rowStyle={{ height: 90, padding: 3 }}
                    rowTextForSelection={(item: LimitBudgetCurrencyProps) => item.name}
                    renderCustomizedRowChild={(item: LimitBudgetCurrencyProps) => (
                      <View style={styles.dropdownItem}>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                      </View>
                    )}
                  />
                )}
                name="limitPublicTransportBudgetCurrency"
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: '5%',
                height: 80,
              }}
            >
              {formStateLimitTransportBudget.limitPublicTransportBudgetValue && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitTransportBudget.limitPublicTransportBudgetValue.message}
                </Text>
              )}

              {formStateLimitTransportBudget.limitPublicTransportBudgetCurrency && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitTransportBudget.limitPublicTransportBudgetCurrency.message}
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 20,
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                alignSelf: 'center',
              }}
            >
              {limitPublicTransportBudgetValue} {limitPublicTransportBudgetCurrency}
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'blue',
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                testID="submitButton"
                style={styles.submitButton}
                onPress={handleSubmitLimitTransportBudget(onSubmitLimitTransportBudget)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'serif',
                    color: 'black',
                  }}
                >
                  {t('FormsScreenSubmitText')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: 'tomato',
              alignItems: 'center',
              height: 330,
              borderRadius: 10,
              marginBottom: '5%',
              padding: '2%',
              borderColor: 'white',
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                fontSize: 16,
              }}
            >
              {t('BudgetScreenLimitBudgetCarTitleText')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingTop: '5%',
              }}
            >
              <Controller
                control={controlLimitCarBudget}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    cursorColor={'black'}
                    placeholderTextColor={'black'}
                    style={{
                      backgroundColor: 'seashell',
                      textAlign: 'center',
                      marginBottom: '1%',
                      height: '100%',
                      color: 'blue',
                      fontSize: 18,
                      width: '70%',
                      borderColor: 'black',
                      borderWidth: 1,
                    }}
                    placeholder={t('BudgetScreenLimitBudgetPlaceholderText')}
                    keyboardType="decimal-pad"
                    onChangeText={(text: string) => {
                      const formattedText = text.replace(',', '.');
                      const dotCount = formattedText.split('.').length - 1;
                      const dotArray = formattedText.split('.')[1] || '';
                      onChange(numericValue);
                      if (dotCount <= 1 && dotArray[2] === '0') {
                      } else {
                        onChange(formattedText);
                      }
                      onBlur();
                    }}
                    value={value ? value.toString() : ''}
                  />
                )}
                name="limitCarBudgetValue"
              />
              <Controller
                control={controlLimitCarBudget}
                render={({ field: { onChange, value } }) => (
                  <SelectDropdown
                    defaultButtonText={t('currencyText')}
                    buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                    defaultValue={value}
                    data={limitBudgetCurrencies}
                    onSelect={(selectedItem: LimitBudgetCurrencyProps) => {
                      // setChoosenExpensesCurrencyMenuOption([selectedItem.name]);
                      onChange(selectedItem.name);
                    }}
                    buttonTextAfterSelection={(selectedItem: LimitBudgetCurrencyProps) => {
                      return selectedItem.IconSymbol;
                    }}
                    dropdownStyle={{ borderRadius: 10 }}
                    buttonStyle={{
                      borderRadius: 10,
                      width: '25%',
                      height: 60,
                      backgroundColor: '#fff',
                      borderColor: 'lime',
                      borderWidth: 1,
                    }}
                    rowStyle={{ height: 90, padding: 3 }}
                    rowTextForSelection={(item: LimitBudgetCurrencyProps) => item.name}
                    renderCustomizedRowChild={(item: LimitBudgetCurrencyProps) => (
                      <View style={styles.dropdownItem}>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                      </View>
                    )}
                  />
                )}
                name="limitCarBudgetCurrency"
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: '5%',
                height: 80,
              }}
            >
              {formStateLimitCarBudget.limitCarBudgetValue && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitCarBudget.limitCarBudgetValue.message}
                </Text>
              )}

              {formStateLimitCarBudget.limitCarBudgetCurrency && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitCarBudget.limitCarBudgetCurrency.message}
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 20,
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                alignSelf: 'center',
              }}
            >
              {limitCarBudgetValue} {limitCarBudgetCurrency}
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'blue',
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                testID="submitButton"
                style={styles.submitButton}
                onPress={handleSubmitLimitCarBudget(onSubmitLimitCarBudget)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'serif',
                    color: 'black',
                  }}
                >
                  {t('FormsScreenSubmitText')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: 'mediumturquoise',
              alignItems: 'center',
              height: 330,
              borderRadius: 10,
              marginBottom: '5%',
              padding: '2%',
              borderColor: 'white',
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                fontSize: 16,
              }}
            >
              {t('BudgetScreenLimitBudgetLoanTitleText')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingTop: '5%',
              }}
            >
              <Controller
                control={controlLimitLoanBudget}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    cursorColor={'black'}
                    placeholderTextColor={'black'}
                    style={{
                      backgroundColor: 'seashell',
                      textAlign: 'center',
                      marginBottom: '1%',
                      height: '100%',
                      color: 'blue',
                      fontSize: 18,
                      width: '70%',
                      borderColor: 'black',
                      borderWidth: 1,
                    }}
                    placeholder={t('BudgetScreenLimitBudgetPlaceholderText')}
                    keyboardType="decimal-pad"
                    onChangeText={(text: string) => {
                      const formattedText = text.replace(',', '.');
                      const dotCount = formattedText.split('.').length - 1;
                      const dotArray = formattedText.split('.')[1] || '';
                      onChange(numericValue);
                      if (dotCount <= 1 && dotArray[2] === '0') {
                      } else {
                        onChange(formattedText);
                      }
                      onBlur();
                    }}
                    value={value ? value.toString() : ''}
                  />
                )}
                name="limitLoanBudgetValue"
              />
              <Controller
                control={controlLimitLoanBudget}
                render={({ field: { onChange, value } }) => (
                  <SelectDropdown
                    defaultButtonText={t('currencyText')}
                    buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                    defaultValue={value}
                    data={limitBudgetCurrencies}
                    onSelect={(selectedItem: LimitBudgetCurrencyProps) => {
                      // setChoosenExpensesCurrencyMenuOption([selectedItem.name]);
                      onChange(selectedItem.name);
                    }}
                    buttonTextAfterSelection={(selectedItem: LimitBudgetCurrencyProps) => {
                      return selectedItem.IconSymbol;
                    }}
                    dropdownStyle={{ borderRadius: 10 }}
                    buttonStyle={{
                      borderRadius: 10,
                      width: '25%',
                      height: 60,
                      backgroundColor: '#fff',
                      borderColor: 'lime',
                      borderWidth: 1,
                    }}
                    rowStyle={{ height: 90, padding: 3 }}
                    rowTextForSelection={(item: LimitBudgetCurrencyProps) => item.name}
                    renderCustomizedRowChild={(item: LimitBudgetCurrencyProps) => (
                      <View style={styles.dropdownItem}>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                      </View>
                    )}
                  />
                )}
                name="limitLoanBudgetCurrency"
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: '5%',
                height: 80,
              }}
            >
              {formStateLimitLoanBudget.limitLoanBudgetValue && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitLoanBudget.limitLoanBudgetValue.message}
                </Text>
              )}

              {formStateLimitLoanBudget.limitLoanBudgetCurrency && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitLoanBudget.limitLoanBudgetCurrency.message}
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 20,
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                alignSelf: 'center',
              }}
            >
              {limitLoanBudgetValue} {limitLoanBudgetCurrency}
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'blue',
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                testID="submitButton"
                style={styles.submitButton}
                onPress={handleSubmitLimitLoanBudget(onSubmitLimitLoanBudget)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'serif',
                    color: 'black',
                  }}
                >
                  {t('FormsScreenSubmitText')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: 'lightcoral',
              alignItems: 'center',
              height: 330,
              borderRadius: 10,
              marginBottom: '5%',
              padding: '2%',
              borderColor: 'white',
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                fontSize: 16,
              }}
            >
              {t('BudgetScreenLimitBudgetEntertainmentTitleText')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingTop: '5%',
              }}
            >
              <Controller
                control={controlLimitEntertainmentBudget}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    cursorColor={'black'}
                    placeholderTextColor={'black'}
                    style={{
                      backgroundColor: 'seashell',
                      textAlign: 'center',
                      marginBottom: '1%',
                      height: '100%',
                      color: 'blue',
                      fontSize: 18,
                      width: '70%',
                      borderColor: 'black',
                      borderWidth: 1,
                    }}
                    placeholder={t('BudgetScreenLimitBudgetPlaceholderText')}
                    keyboardType="decimal-pad"
                    onChangeText={(text: string) => {
                      const formattedText = text.replace(',', '.');
                      const dotCount = formattedText.split('.').length - 1;
                      const dotArray = formattedText.split('.')[1] || '';
                      onChange(numericValue);
                      if (dotCount <= 1 && dotArray[2] === '0') {
                      } else {
                        onChange(formattedText);
                      }
                      onBlur();
                    }}
                    value={value ? value.toString() : ''}
                  />
                )}
                name="limitEntertainmentBudgetValue"
              />
              <Controller
                control={controlLimitEntertainmentBudget}
                render={({ field: { onChange, value } }) => (
                  <SelectDropdown
                    defaultButtonText={t('currencyText')}
                    buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                    defaultValue={value}
                    data={limitBudgetCurrencies}
                    onSelect={(selectedItem: LimitBudgetCurrencyProps) => {
                      // setChoosenExpensesCurrencyMenuOption([selectedItem.name]);
                      onChange(selectedItem.name);
                    }}
                    buttonTextAfterSelection={(selectedItem: LimitBudgetCurrencyProps) => {
                      return selectedItem.IconSymbol;
                    }}
                    dropdownStyle={{ borderRadius: 10 }}
                    buttonStyle={{
                      borderRadius: 10,
                      width: '25%',
                      height: 60,
                      backgroundColor: '#fff',
                      borderColor: 'lime',
                      borderWidth: 1,
                    }}
                    rowStyle={{ height: 90, padding: 3 }}
                    rowTextForSelection={(item: LimitBudgetCurrencyProps) => item.name}
                    renderCustomizedRowChild={(item: LimitBudgetCurrencyProps) => (
                      <View style={styles.dropdownItem}>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                      </View>
                    )}
                  />
                )}
                name="limitEntertainmentBudgetCurrency"
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: '5%',
                height: 80,
              }}
            >
              {formStateLimitEntertainmentBudget.limitEntertainmentBudgetValue && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitEntertainmentBudget.limitEntertainmentBudgetValue.message}
                </Text>
              )}

              {formStateLimitEntertainmentBudget.limitEntertainmentBudgetCurrency && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitEntertainmentBudget.limitEntertainmentBudgetCurrency.message}
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 20,
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                alignSelf: 'center',
              }}
            >
              {limitEntertainmentBudgetValue} {limitEntertainmentBudgetCurrency}
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'blue',
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                testID="submitButton"
                style={styles.submitButton}
                onPress={handleSubmitLimitEntertainmentBudget(onSubmitLimitEntertainmentBudget)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'serif',
                    color: 'black',
                  }}
                >
                  {t('FormsScreenSubmitText')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: 'goldenrod',
              alignItems: 'center',
              height: 330,
              borderRadius: 10,
              marginBottom: '5%',
              padding: '2%',
              borderColor: 'white',
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                fontSize: 16,
              }}
            >
              {t('BudgetScreenLimitBudgetElectronicsTitleText')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingTop: '5%',
              }}
            >
              <Controller
                control={controlLimitElectronicsBudget}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    cursorColor={'black'}
                    placeholderTextColor={'black'}
                    style={{
                      backgroundColor: 'seashell',
                      textAlign: 'center',
                      marginBottom: '1%',
                      height: '100%',
                      color: 'blue',
                      fontSize: 18,
                      width: '70%',
                      borderColor: 'black',
                      borderWidth: 1,
                    }}
                    placeholder={t('BudgetScreenLimitBudgetPlaceholderText')}
                    keyboardType="decimal-pad"
                    onChangeText={(text: string) => {
                      const formattedText = text.replace(',', '.');
                      const dotCount = formattedText.split('.').length - 1;
                      const dotArray = formattedText.split('.')[1] || '';
                      onChange(numericValue);
                      if (dotCount <= 1 && dotArray[2] === '0') {
                      } else {
                        onChange(formattedText);
                      }
                      onBlur();
                    }}
                    value={value ? value.toString() : ''}
                  />
                )}
                name="limitElectronicsBudgetValue"
              />
              <Controller
                control={controlLimitElectronicsBudget}
                render={({ field: { onChange, value } }) => (
                  <SelectDropdown
                    defaultButtonText={t('currencyText')}
                    buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                    defaultValue={value}
                    data={limitBudgetCurrencies}
                    onSelect={(selectedItem: LimitBudgetCurrencyProps) => {
                      // setChoosenExpensesCurrencyMenuOption([selectedItem.name]);
                      onChange(selectedItem.name);
                    }}
                    buttonTextAfterSelection={(selectedItem: LimitBudgetCurrencyProps) => {
                      return selectedItem.IconSymbol;
                    }}
                    dropdownStyle={{ borderRadius: 10 }}
                    buttonStyle={{
                      borderRadius: 10,
                      width: '25%',
                      height: 60,
                      backgroundColor: '#fff',
                      borderColor: 'lime',
                      borderWidth: 1,
                    }}
                    rowStyle={{ height: 90, padding: 3 }}
                    rowTextForSelection={(item: LimitBudgetCurrencyProps) => item.name}
                    renderCustomizedRowChild={(item: LimitBudgetCurrencyProps) => (
                      <View style={styles.dropdownItem}>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                      </View>
                    )}
                  />
                )}
                name="limitElectronicsBudgetCurrency"
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: '5%',
                height: 80,
              }}
            >
              {formStateLimitElectronicsBudget.limitElectronicsBudgetValue && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitElectronicsBudget.limitElectronicsBudgetValue.message}
                </Text>
              )}

              {formStateLimitElectronicsBudget.limitElectronicsBudgetCurrency && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitElectronicsBudget.limitElectronicsBudgetCurrency.message}
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 20,
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                alignSelf: 'center',
              }}
            >
              {limitElectronicsBudgetValue} {limitElectronicsBudgetCurrency}
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'blue',
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                testID="submitButton"
                style={styles.submitButton}
                onPress={handleSubmitLimitElectronicsBudget(onSubmitLimitElectronicsBudget)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'serif',
                    color: 'black',
                  }}
                >
                  {t('FormsScreenSubmitText')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: 'firebrick',
              alignItems: 'center',
              height: 330,
              borderRadius: 10,
              marginBottom: '5%',
              padding: '2%',
              borderColor: 'white',
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                fontSize: 16,
              }}
            >
              {t('BudgetScreenLimitBudgetEducationTitleText')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingTop: '5%',
              }}
            >
              <Controller
                control={controlLimitEducationBudget}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    cursorColor={'black'}
                    placeholderTextColor={'black'}
                    style={{
                      backgroundColor: 'seashell',
                      textAlign: 'center',
                      marginBottom: '1%',
                      height: '100%',
                      color: 'blue',
                      fontSize: 18,
                      width: '70%',
                      borderColor: 'black',
                      borderWidth: 1,
                    }}
                    placeholder={t('BudgetScreenLimitBudgetPlaceholderText')}
                    keyboardType="decimal-pad"
                    onChangeText={(text: string) => {
                      const formattedText = text.replace(',', '.');
                      const dotCount = formattedText.split('.').length - 1;
                      const dotArray = formattedText.split('.')[1] || '';
                      onChange(numericValue);
                      if (dotCount <= 1 && dotArray[2] === '0') {
                      } else {
                        onChange(formattedText);
                      }
                      onBlur();
                    }}
                    value={value ? value.toString() : ''}
                  />
                )}
                name="limitEducationBudgetValue"
              />
              <Controller
                control={controlLimitEducationBudget}
                render={({ field: { onChange, value } }) => (
                  <SelectDropdown
                    defaultButtonText={t('currencyText')}
                    buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                    defaultValue={value}
                    data={limitBudgetCurrencies}
                    onSelect={(selectedItem: LimitBudgetCurrencyProps) => {
                      // setChoosenExpensesCurrencyMenuOption([selectedItem.name]);
                      onChange(selectedItem.name);
                    }}
                    buttonTextAfterSelection={(selectedItem: LimitBudgetCurrencyProps) => {
                      return selectedItem.IconSymbol;
                    }}
                    dropdownStyle={{ borderRadius: 10 }}
                    buttonStyle={{
                      borderRadius: 10,
                      width: '25%',
                      height: 60,
                      backgroundColor: '#fff',
                      borderColor: 'lime',
                      borderWidth: 1,
                    }}
                    rowStyle={{ height: 90, padding: 3 }}
                    rowTextForSelection={(item: LimitBudgetCurrencyProps) => item.name}
                    renderCustomizedRowChild={(item: LimitBudgetCurrencyProps) => (
                      <View style={styles.dropdownItem}>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                      </View>
                    )}
                  />
                )}
                name="limitEducationBudgetCurrency"
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: '5%',
                height: 80,
              }}
            >
              {formStateLimitEducationBudget.limitEducationBudgetValue && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitEducationBudget.limitEducationBudgetValue.message}
                </Text>
              )}

              {formStateLimitEducationBudget.limitEducationBudgetCurrency && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitEducationBudget.limitEducationBudgetCurrency.message}
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 20,
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                alignSelf: 'center',
              }}
            >
              {limitEducationBudgetValue} {limitEducationBudgetCurrency}
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'blue',
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                testID="submitButton"
                style={styles.submitButton}
                onPress={handleSubmitLimitEducationBudget(onSubmitLimitEducationBudget)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'serif',
                    color: 'black',
                  }}
                >
                  {t('FormsScreenSubmitText')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: 'slategray',
              alignItems: 'center',
              height: 330,
              borderRadius: 10,
              marginBottom: '5%',
              padding: '2%',
              borderColor: 'white',
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                fontSize: 16,
              }}
            >
              {t('BudgetScreenLimitBudgetGiftsTitleText')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingTop: '5%',
              }}
            >
              <Controller
                control={controlLimitGiftsBudget}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    cursorColor={'black'}
                    placeholderTextColor={'black'}
                    style={{
                      backgroundColor: 'seashell',
                      textAlign: 'center',
                      marginBottom: '1%',
                      height: '100%',
                      color: 'blue',
                      fontSize: 18,
                      width: '70%',
                      borderColor: 'black',
                      borderWidth: 1,
                    }}
                    placeholder={t('BudgetScreenLimitBudgetPlaceholderText')}
                    keyboardType="decimal-pad"
                    onChangeText={(text: string) => {
                      const formattedText = text.replace(',', '.');
                      const dotCount = formattedText.split('.').length - 1;
                      const dotArray = formattedText.split('.')[1] || '';
                      onChange(numericValue);
                      if (dotCount <= 1 && dotArray[2] === '0') {
                      } else {
                        onChange(formattedText);
                      }
                      onBlur();
                    }}
                    value={value ? value.toString() : ''}
                  />
                )}
                name="limitGiftsBudgetValue"
              />
              <Controller
                control={controlLimitGiftsBudget}
                render={({ field: { onChange, value } }) => (
                  <SelectDropdown
                    defaultButtonText={t('currencyText')}
                    buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                    defaultValue={value}
                    data={limitBudgetCurrencies}
                    onSelect={(selectedItem: LimitBudgetCurrencyProps) => {
                      // setChoosenExpensesCurrencyMenuOption([selectedItem.name]);
                      onChange(selectedItem.name);
                    }}
                    buttonTextAfterSelection={(selectedItem: LimitBudgetCurrencyProps) => {
                      return selectedItem.IconSymbol;
                    }}
                    dropdownStyle={{ borderRadius: 10 }}
                    buttonStyle={{
                      borderRadius: 10,
                      width: '25%',
                      height: 60,
                      backgroundColor: '#fff',
                      borderColor: 'lime',
                      borderWidth: 1,
                    }}
                    rowStyle={{ height: 90, padding: 3 }}
                    rowTextForSelection={(item: LimitBudgetCurrencyProps) => item.name}
                    renderCustomizedRowChild={(item: LimitBudgetCurrencyProps) => (
                      <View style={styles.dropdownItem}>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                      </View>
                    )}
                  />
                )}
                name="limitGiftsBudgetCurrency"
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: '5%',
                height: 80,
              }}
            >
              {formStateLimitGiftsBudget.limitGiftsBudgetValue && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitGiftsBudget.limitGiftsBudgetValue.message}
                </Text>
              )}

              {formStateLimitGiftsBudget.limitGiftsBudgetCurrency && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitGiftsBudget.limitGiftsBudgetCurrency.message}
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 20,
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                alignSelf: 'center',
              }}
            >
              {limitGiftsBudgetValue} {limitGiftsBudgetCurrency}
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'blue',
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                testID="submitButton"
                style={styles.submitButton}
                onPress={handleSubmitLimitGiftsBudget(onSubmitLimitGiftsBudget)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'serif',
                    color: 'black',
                  }}
                >
                  {t('FormsScreenSubmitText')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: 'rosybrown',
              alignItems: 'center',
              height: 330,
              borderRadius: 10,
              marginBottom: '5%',
              padding: '2%',
              borderColor: 'white',
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                fontSize: 16,
              }}
            >
              {t('BudgetScreenLimitBudgetTrainingTitleText')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingTop: '5%',
              }}
            >
              <Controller
                control={controlLimitTrainingBudget}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    cursorColor={'black'}
                    placeholderTextColor={'black'}
                    style={{
                      backgroundColor: 'seashell',
                      textAlign: 'center',
                      marginBottom: '1%',
                      height: '100%',
                      color: 'blue',
                      fontSize: 18,
                      width: '70%',
                      borderColor: 'black',
                      borderWidth: 1,
                    }}
                    placeholder={t('BudgetScreenLimitBudgetPlaceholderText')}
                    keyboardType="decimal-pad"
                    onChangeText={(text: string) => {
                      const formattedText = text.replace(',', '.');
                      const dotCount = formattedText.split('.').length - 1;
                      const dotArray = formattedText.split('.')[1] || '';
                      onChange(numericValue);
                      if (dotCount <= 1 && dotArray[2] === '0') {
                      } else {
                        onChange(formattedText);
                      }
                      onBlur();
                    }}
                    value={value ? value.toString() : ''}
                  />
                )}
                name="limitTrainingBudgetValue"
              />
              <Controller
                control={controlLimitTrainingBudget}
                render={({ field: { onChange, value } }) => (
                  <SelectDropdown
                    defaultButtonText={t('currencyText')}
                    buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                    defaultValue={value}
                    data={limitBudgetCurrencies}
                    onSelect={(selectedItem: LimitBudgetCurrencyProps) => {
                      onChange(selectedItem.name);
                    }}
                    buttonTextAfterSelection={(selectedItem: LimitBudgetCurrencyProps) => {
                      return selectedItem.IconSymbol;
                    }}
                    dropdownStyle={{ borderRadius: 10 }}
                    buttonStyle={{
                      borderRadius: 10,
                      width: '25%',
                      height: 60,
                      backgroundColor: '#fff',
                      borderColor: 'lime',
                      borderWidth: 1,
                    }}
                    rowStyle={{ height: 90, padding: 3 }}
                    rowTextForSelection={(item: LimitBudgetCurrencyProps) => item.name}
                    renderCustomizedRowChild={(item: LimitBudgetCurrencyProps) => (
                      <View style={styles.dropdownItem}>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                      </View>
                    )}
                  />
                )}
                name="limitTrainingBudgetCurrency"
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: '5%',
                height: 80,
              }}
            >
              {formStateLimitTrainingBudget.limitTrainingBudgetValue && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitTrainingBudget.limitTrainingBudgetValue.message}
                </Text>
              )}

              {formStateLimitTrainingBudget.limitTrainingBudgetCurrency && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitTrainingBudget.limitTrainingBudgetCurrency.message}
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 20,
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                alignSelf: 'center',
              }}
            >
              {limitTrainingBudgetValue} {limitTrainingBudgetCurrency}
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'blue',
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                testID="submitButton"
                style={styles.submitButton}
                onPress={handleSubmitLimitTrainingBudget(onSubmitLimitTrainingBudget)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'serif',
                    color: 'black',
                  }}
                >
                  {t('FormsScreenSubmitText')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: 'cadetblue',
              alignItems: 'center',
              height: 330,
              borderRadius: 10,
              marginBottom: '5%',
              padding: '2%',
              borderColor: 'white',
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                fontSize: 16,
              }}
            >
              {t('BudgetScreenLimitBudgetHealthTitleText')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingTop: '5%',
              }}
            >
              <Controller
                control={controlLimitHealthBudget}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    cursorColor={'black'}
                    placeholderTextColor={'black'}
                    style={{
                      backgroundColor: 'seashell',
                      textAlign: 'center',
                      marginBottom: '1%',
                      height: '100%',
                      color: 'blue',
                      fontSize: 18,
                      width: '70%',
                      borderColor: 'black',
                      borderWidth: 1,
                    }}
                    placeholder={t('BudgetScreenLimitBudgetPlaceholderText')}
                    keyboardType="decimal-pad"
                    onChangeText={(text: string) => {
                      const formattedText = text.replace(',', '.');
                      const dotCount = formattedText.split('.').length - 1;
                      const dotArray = formattedText.split('.')[1] || '';
                      onChange(numericValue);
                      if (dotCount <= 1 && dotArray[2] === '0') {
                      } else {
                        onChange(formattedText);
                      }
                      onBlur();
                    }}
                    value={value ? value.toString() : ''}
                  />
                )}
                name="limitHealthBudgetValue"
              />
              <Controller
                control={controlLimitHealthBudget}
                render={({ field: { onChange, value } }) => (
                  <SelectDropdown
                    defaultButtonText={t('currencyText')}
                    buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                    defaultValue={value}
                    data={limitBudgetCurrencies}
                    onSelect={(selectedItem: LimitBudgetCurrencyProps) => {
                      // setChoosenExpensesCurrencyMenuOption([selectedItem.name]);
                      onChange(selectedItem.name);
                    }}
                    buttonTextAfterSelection={(selectedItem: LimitBudgetCurrencyProps) => {
                      return selectedItem.IconSymbol;
                    }}
                    dropdownStyle={{ borderRadius: 10 }}
                    buttonStyle={{
                      borderRadius: 10,
                      width: '25%',
                      height: 60,
                      backgroundColor: '#fff',
                      borderColor: 'lime',
                      borderWidth: 1,
                    }}
                    rowStyle={{ height: 90, padding: 3 }}
                    rowTextForSelection={(item: LimitBudgetCurrencyProps) => item.name}
                    renderCustomizedRowChild={(item: LimitBudgetCurrencyProps) => (
                      <View style={styles.dropdownItem}>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                      </View>
                    )}
                  />
                )}
                name="limitHealthBudgetCurrency"
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: '5%',
                height: 80,
              }}
            >
              {formStateLimitHealthBudget.limitHealthBudgetValue && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitHealthBudget.limitHealthBudgetValue.message}
                </Text>
              )}

              {formStateLimitHealthBudget.limitHealthBudgetCurrency && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitHealthBudget.limitHealthBudgetCurrency.message}
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 20,
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                alignSelf: 'center',
              }}
            >
              {limitHealthBudgetValue} {limitHealthBudgetCurrency}
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'blue',
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                testID="submitButton"
                style={styles.submitButton}
                onPress={handleSubmitLimitHealthBudget(onSubmitLimitHealthBudget)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'serif',
                    color: 'black',
                  }}
                >
                  {t('FormsScreenSubmitText')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: 'darkolivegreen',
              alignItems: 'center',
              height: 330,
              borderRadius: 10,
              marginBottom: '5%',
              padding: '2%',
              borderColor: 'white',
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                fontSize: 16,
              }}
            >
              {t('BudgetScreenLimitBudgetHolidaysTitleText')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingTop: '5%',
              }}
            >
              <Controller
                control={controlLimitHolidaysBudget}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    cursorColor={'black'}
                    placeholderTextColor={'black'}
                    style={{
                      backgroundColor: 'seashell',
                      textAlign: 'center',
                      marginBottom: '1%',
                      height: '100%',
                      color: 'blue',
                      fontSize: 18,
                      width: '70%',
                      borderColor: 'black',
                      borderWidth: 1,
                    }}
                    placeholder={t('BudgetScreenLimitBudgetPlaceholderText')}
                    keyboardType="decimal-pad"
                    onChangeText={(text: string) => {
                      const formattedText = text.replace(',', '.');
                      const dotCount = formattedText.split('.').length - 1;
                      const dotArray = formattedText.split('.')[1] || '';
                      onChange(numericValue);
                      if (dotCount <= 1 && dotArray[2] === '0') {
                      } else {
                        onChange(formattedText);
                      }
                      onBlur();
                    }}
                    value={value ? value.toString() : ''}
                  />
                )}
                name="limitHolidaysBudgetValue"
              />
              <Controller
                control={controlLimitHolidaysBudget}
                render={({ field: { onChange, value } }) => (
                  <SelectDropdown
                    defaultButtonText={t('currencyText')}
                    buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                    defaultValue={value}
                    data={limitBudgetCurrencies}
                    onSelect={(selectedItem: LimitBudgetCurrencyProps) => {
                      // setChoosenExpensesCurrencyMenuOption([selectedItem.name]);
                      onChange(selectedItem.name);
                    }}
                    buttonTextAfterSelection={(selectedItem: LimitBudgetCurrencyProps) => {
                      return selectedItem.IconSymbol;
                    }}
                    dropdownStyle={{ borderRadius: 10 }}
                    buttonStyle={{
                      borderRadius: 10,
                      width: '25%',
                      height: 60,
                      backgroundColor: '#fff',
                      borderColor: 'lime',
                      borderWidth: 1,
                    }}
                    rowStyle={{ height: 90, padding: 3 }}
                    rowTextForSelection={(item: LimitBudgetCurrencyProps) => item.name}
                    renderCustomizedRowChild={(item: LimitBudgetCurrencyProps) => (
                      <View style={styles.dropdownItem}>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                      </View>
                    )}
                  />
                )}
                name="limitHolidaysBudgetCurrency"
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: '5%',
                height: 80,
              }}
            >
              {formStateLimitHolidaysBudget.limitHolidaysBudgetValue && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitHolidaysBudget.limitHolidaysBudgetValue.message}
                </Text>
              )}

              {formStateLimitHolidaysBudget.limitHolidaysBudgetCurrency && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)', fontSize: 16 }}>
                  {formStateLimitHolidaysBudget.limitHolidaysBudgetCurrency.message}
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 20,
                color:
                  themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
                alignSelf: 'center',
              }}
            >
              {limitHolidaysBudgetValue} {limitHolidaysBudgetCurrency}
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'blue',
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                testID="submitButton"
                style={styles.submitButton}
                onPress={handleSubmitLimitHolidaysBudget(onSubmitLimitHolidaysBudget)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'serif',
                    color: 'black',
                  }}
                >
                  {t('FormsScreenSubmitText')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={{ flex: 1, height: 4300 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  eachAccountContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'indigo',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitleContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: 'indigo',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  categoryMainContainer: {
    height: '100%',
  },
  titleText: {
    color: 'white',
    fontSize: 16,
  },
  chartContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    width: 100,
  },
  submitButton: {
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    width: 120,
    height: 70,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default BudgetScreen;

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../themes/theme';
import ThemeContext from '../themes/themeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorList } from '../types/Navigator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../rootStates/rootState';
import { useTranslation } from 'react-i18next';
import { Item } from './ExpensesScreen';
import { setMainContentScreenExpensesArray } from '../../redux/actions';
import GaugeSpeedometer from '../../components/GaugeSpeedometer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';

type Props = NativeStackScreenProps<NavigatorList, 'HomeScreen'>;

export type ValueCategory = {
  id: number;
  value: string;
};

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

const ModalPopUpCategory = ({ visible, children }: any) => {
  const [showModal, setShowModal] = useState(visible);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        delay: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => setShowModal(false), 100);
      });
    }
  };

  useEffect(() => {
    toggleModal();
  }, [visible]);
  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackground}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const Category: React.FC<Props> = ({ navigation }) => {
  const [actualData, setActualData] = useState('');
  const currentDate = moment().format('DD.MM.YYYY');
  useEffect(() => {
    setActualData(currentDate);
  }, [currentDate]);

  const theme = { mode: 'dark' };
  let activeColorsDark = colors.dark;
  let activeColorsLight = colors.light;

  const { themeconfig, toggleTheme, useSystemTheme }: any = useContext(ThemeContext);

  const dispatch = useDispatch();
  const expensesArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenExpensesArray
  );

  const mainContentChoosenCurrencyName = useSelector(
    (state: RootState) => state.name.selectedCurrencyOptionRadioButton
  );

  const currencyFromSettings = useSelector(
    (state: RootState) => state.name.settingsScreenActualCurrency
  );

  const currencyAsMainOptionValue = useSelector(
    (state: RootState) => state.name.currencyAsMainOption
  );

  const [isBudgetPerAccountCalculated, setIsBudgetPerAccountCalculated] = useState(false);
  const [isCurrentMonthCalculated, setIsCurrentMonthCalculated] = useState(false);
  const { t } = useTranslation();

  const [itemsCategory, setItemsCategory] = useState<ItemBudget[]>([]);

  useEffect(() => {
    setItemsCategory([
      {
        id: 0,
        label: t('ExpensesScreenCategoryDropDownFoodText'),
        value: 'food',
        icon: () => <Ionicons name="fast-food-sharp" size={25} color={'black'} />,
      },
      {
        id: 1,
        label: t('ExpensesScreenCategoryDropDownShoppingText'),
        value: 'shopping',
        icon: () => <FontAwesome name="shopping-basket" size={25} color={'black'} />,
      },
      {
        id: 2,
        label: t('ExpensesScreenCategoryDropDownHomeText'),
        value: 'home',
        icon: () => <Ionicons name="home" size={25} color={'black'} />,
      },
      {
        id: 3,
        label: t('ExpensesScreenCategoryDropDownTransportText'),
        value: 'transport',
        icon: () => <FontAwesome6 name="train-subway" size={25} color={'black'} />,
      },
      {
        id: 4,
        label: t('ExpensesScreenCategoryDropDownCarText'),
        value: 'car',
        icon: () => <Ionicons name="car-sport" size={25} color={'black'} />,
      },
      {
        id: 5,
        label: t('ExpensesScreenCategoryDropDownLoanText'),
        value: 'loan',
        icon: () => <MCI name="bank-transfer" size={25} color={'black'} />,
      },
      {
        id: 6,
        label: t('ExpensesScreenCategoryDropDownEntertainmentText'),
        value: 'entertainment',
        icon: () => <MCI name="cards-club" size={25} color={'black'} />,
      },
      {
        id: 7,
        label: t('ExpensesScreenCategoryDropDownElectronicsText'),
        value: 'electronics',
        icon: () => <Ionicons name="game-controller" size={25} color={'black'} />,
      },
      {
        id: 8,
        label: t('ExpensesScreenCategoryDropDownEducationText'),
        value: 'education',
        icon: () => <FontAwesome5 name="book" size={25} color={'black'} />,
      },
      {
        id: 9,
        label: t('ExpensesScreenCategoryDropDownGiftsText'),
        value: 'gifts',
        icon: () => <FontAwesome6 name="gift" size={25} color={'black'} />,
      },
      {
        id: 10,
        label: t('ExpensesScreenCategoryDropDownTrainingText'),
        value: 'training',
        icon: () => <MaterialIcons name="sports-tennis" size={25} color={'black'} />,
      },
      {
        id: 11,
        label: t('ExpensesScreenCategoryDropDownHealthText'),
        value: 'health',
        icon: () => <FontAwesome5 name="hand-holding-medical" size={25} color={'black'} />,
      },
      {
        id: 12,
        label: t('ExpensesScreenCategoryDropDownHolidaysText'),
        value: 'holidays',
        icon: () => <Fontisto name="holiday-village" size={25} color={'black'} />,
      },
    ]);
  }, [t]);

  const RenderEachCategoryInCurrentMonthItem = ({
    item,
    maxValue,
    limit,
    currency,
  }: {
    item: ItemBudget;
    maxValue: number | null;
    limit: number | null;
    currency: string;
  }) => {
    const totalCurrentMonthForItem = categoryCurrentMonthTotals
      ? Number(categoryCurrentMonthTotals[item.value]?.toFixed(2))
      : null;

    moment.tz.setDefault('Europe/Warsaw');
    const currentMonthDay = moment().date(); // current day
    const daysInMonth = moment().daysInMonth();
    const daysInMonthAsNumber = daysInMonth.valueOf(); // days number

    const maxLimitToTheDay =
      typeof limit === 'number' ? (currentMonthDay / daysInMonthAsNumber) * limit : null;
    return (
      <View style={{ flexDirection: 'column', width: '100%' }}>
        <View
          style={{
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: 'lightgray',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 21,
          }}
        >
          <View style={{ flexDirection: 'column' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {item.icon() && (
                  <View
                    style={{
                      marginRight: 10,
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {item.icon()}
                  </View>
                )}
                <Text style={{ marginLeft: 5, color: 'white' }}>{item.label}</Text>
              </View>
              {totalCurrentMonthForItem !== null && isCurrentMonthCalculated ? (
                <View style={{ flexDirection: 'row', gap: 5 }}>
                  <Text style={{ color: 'white', fontSize: 16 }}>
                    {t('CategoryScreenSummedUpText')}
                  </Text>
                  {totalCurrentMonthForItem > Number(limit) && maxValue !== 0 ? (
                    <Text style={{ color: 'orangered', fontSize: 16 }}>
                      {totalCurrentMonthForItem}
                    </Text>
                  ) : (
                    <Text style={{ color: 'white', fontSize: 16 }}>{totalCurrentMonthForItem}</Text>
                  )}
                  <Text style={{ color: 'white', fontSize: 16 }}>{currencyAsMainOptionValue}</Text>
                </View>
              ) : (
                <ActivityIndicator />
              )}
            </View>
            {totalCurrentMonthForItem !== 0 && isCurrentMonthCalculated && maxValue !== 0 ? (
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <GaugeSpeedometer
                  value={totalCurrentMonthForItem}
                  minValue={limit / 2}
                  maxValue={limit}
                />
                <View style={{ flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <Text style={{ color: 'white', fontSize: 18, padding: 10 }}>
                    {`${t('CategoryScreenMaxLimitToTheDayText')} ${currentMonthDay}`}
                  </Text>
                  <Text style={{ color: 'white', fontSize: 18, padding: 10 }}>
                    {` ${maxLimitToTheDay?.toFixed(2)} ${currency}`}
                  </Text>
                  <Text style={{ color: 'white', fontSize: 18 }}>{`${t(
                    'CategoryScreenLimitText'
                  )} ${limit} ${currency}`}</Text>
                  <Text style={{ color: 'white', fontSize: 18 }}>
                    {t('CategoryScreenPeriodText')}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  const RenderEachCategoryItem = ({
    item,
    maxValue,
    limit,
    currency,
  }: {
    item: ItemBudget;
    maxValue: number | null;
    limit: number | null;
    currency: string;
  }) => {
    const totalForItem = categoryTotals ? Number(categoryTotals[item.value]?.toFixed(2)) : null;

    moment.tz.setDefault('Europe/Warsaw');
    const currentMonthDay = moment().date(); // current day
    const daysInMonth = moment().daysInMonth();
    const daysInMonthAsNumber = daysInMonth.valueOf(); // days number

    const maxLimitToTheDay =
      typeof limit === 'number' ? (currentMonthDay / daysInMonthAsNumber) * limit : null;
    return (
      <View style={{ flexDirection: 'column', width: '100%' }}>
        <View
          style={{
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: 'lightgray',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 21,
          }}
        >
          <View style={{ flexDirection: 'column' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {item.icon() && (
                  <View
                    style={{
                      marginRight: 10,
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {item.icon()}
                  </View>
                )}
                <Text style={{ marginLeft: 5, color: 'white' }}>{item.label}</Text>
              </View>
              {totalForItem !== null && isBudgetPerAccountCalculated ? (
                <View style={{ flexDirection: 'row', gap: 5 }}>
                  <Text style={{ color: 'white', fontSize: 16 }}>
                    {t('CategoryScreenSummedUpText')}
                  </Text>
                  {totalForItem > Number(limit) && maxValue !== 0 ? (
                    <Text style={{ color: 'orangered', fontSize: 16 }}>{totalForItem}</Text>
                  ) : (
                    <Text style={{ color: 'white', fontSize: 16 }}>{totalForItem}</Text>
                  )}
                  <Text style={{ color: 'white', fontSize: 16 }}>{currencyAsMainOptionValue}</Text>
                </View>
              ) : (
                <ActivityIndicator />
              )}
            </View>
            {totalForItem !== 0 && isBudgetPerAccountCalculated && maxValue !== 0 ? (
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <GaugeSpeedometer value={totalForItem} minValue={limit / 2} maxValue={limit} />
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 18, padding: 10 }}>
                    {`${t('CategoryScreenMaxLimitToTheDayText')} ${currentMonthDay}`}
                  </Text>
                  <Text style={{ color: 'white', fontSize: 18, padding: 10 }}>
                    {` ${maxLimitToTheDay?.toFixed(2)} ${currency}`}
                  </Text>
                  <Text style={{ color: 'white', fontSize: 18 }}>{`${t(
                    'CategoryScreenLimitText'
                  )} ${limit} ${currency}`}</Text>
                  <Text style={{ color: 'white', fontSize: 18 }}>
                    {t('CategoryScreenPeriodText')}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  // Function for each currency name

  const [declaredExpenseAmount, setDeclaredFinalAmount] = useState<number | null>(null);

  const [errorConvertingFinalCurrencyAmount, setErrorConvertingFinalCurrencyAmount] = useState<
    string | undefined
  >(undefined);

  const [finalExchangeRate, setFinalExchangeRate] = useState<number | null>(null);

  const fetchEachExchangeRate = async (
    currencyFromDatabase: string,
    currencyFromSettings: string,
    totalEachValue: number
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
      const conversionRate = exchangesRates[currencyFromSettings];

      if (conversionRate) {
        setFinalExchangeRate(conversionRate);
        const result = totalEachValue * conversionRate;
        setDeclaredFinalAmount(Number(result.toFixed(2)));
        return result;
      } else {
        setDeclaredFinalAmount(null);
      }
    } catch (error) {
      console.log('Error converting currency', error);
      setErrorConvertingFinalCurrencyAmount('Error converting currency - check Network connection');
      Alert.alert(`Error converting currency - check Network connection, ${error}`);
    }
  };

  const convertAndSumExpenseForEachMonth = async (expenseCategory: string): Promise<number> => {
    try {
      moment.tz.setDefault('Europe/Warsaw');
      const currentDate = moment();

      const firstDayOfMonth = currentDate.clone().startOf('month').format();
      const lastDayOfMonth = currentDate.clone().endOf('month').format();

      let convertedExpensesValues = [];

      await Promise.all(
        expensesArrayOnlyValues
          .filter((expense) => {
            const expenseCurrentMonthDate = moment(expense.expenseDate, 'YYYY-MM-DD');
            return (
              expense.expenseCategoryUniversalValue.toLowerCase() ===
                expenseCategory.toLowerCase() &&
              expenseCurrentMonthDate.isSameOrAfter(firstDayOfMonth) &&
              expenseCurrentMonthDate.isSameOrBefore(lastDayOfMonth)
            );
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
                  currencyAsMainOptionValue,
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

  // Proper Exchange Rate for Budget

  const convertAndSumExpense = async (expenseCategory: string): Promise<number> => {
    try {
      //const currentDate = new Date();
      //const lastMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      //lastMonthStartDate.setDate(15);

      const currentDate = moment().tz('Europe/warsaw');
      //const lastMonthStartDate = currentDate.clone().subtract(1, 'month').endOf('month').date(15);
      const startDate = currentDate.clone().subtract(1, 'months').startOf('month');
      const endDate = currentDate.clone().subtract(1, 'months').endOf('month');

      let convertedExpensesValues = [];

      await Promise.all(
        expensesArrayOnlyValues
          .filter((expense) => {
            //const expenseDate = new Date(expense.expenseDate);
            const expenseDate = moment(expense.expenseDate).tz('Europe/Warsaw');
            return (
              expense.expenseCategoryUniversalValue.toLowerCase() ===
                expenseCategory.toLowerCase() &&
              expenseDate.isSameOrAfter(startDate) &&
              expenseDate.isSameOrBefore(endDate)
            );
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
                  currencyAsMainOptionValue,
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

  const calculateTotalsForCategoryCurrentMonth = async (categoryName: string) => {
    try {
      const expenseTotalCurrentMonth = await convertAndSumExpenseForEachMonth(categoryName);

      const summedUpCurrentMonth = expenseTotalCurrentMonth;

      return {
        summedUpCurrentMonth,
      };
    } catch (error) {
      console.log('Error calculating totals for accounts', error);
      return {
        summedUpCurrentMonth: 0,
      };
    }
  };

  const calculateTotalsForCategory = async (categoryName: string) => {
    try {
      const expenseTotal = await convertAndSumExpense(categoryName);

      const summedUp = expenseTotal;

      return {
        summedUp,
      };
    } catch (error) {
      console.log('Error calculating totals for accounts', error);
      return {
        summedUp: 0,
      };
    }
  };

  const [categoryTotals, setCategoryTotals] = useState<{ [key: string]: number } | null>(null);
  const [categoryCurrentMonthTotals, setCategoryCurrentMonthTotals] = useState<{
    [key: string]: number;
  } | null>(null);

  const fetchDataCurrentMonth = useCallback(async () => {
    try {
      const totalsCategoryCurrentMonthData: { [key: string]: number } = {};
      await Promise.all(
        itemsCategory.map(async (item) => {
          const resultCurrentMonth = await calculateTotalsForCategoryCurrentMonth(item.value);
          totalsCategoryCurrentMonthData[item.value] = resultCurrentMonth.summedUpCurrentMonth;
        })
      );

      setCategoryCurrentMonthTotals(totalsCategoryCurrentMonthData);
    } catch (error) {
      console.error('Error fetching category totals:', error);
    }
  }, [itemsCategory, expensesArrayOnlyValues, currencyAsMainOptionValue]);

  useEffect(() => {
    fetchDataCurrentMonth();
  }, [fetchDataCurrentMonth]);

  const fetchData = useCallback(async () => {
    try {
      const totalsCategoryData: { [key: string]: number } = {};
      await Promise.all(
        itemsCategory.map(async (item) => {
          const result = await calculateTotalsForCategory(item.value);
          totalsCategoryData[item.value] = result.summedUp;
        })
      );

      setCategoryTotals(totalsCategoryData);
    } catch (error) {
      console.error('Error fetching category totals:', error);
    }
  }, [itemsCategory, expensesArrayOnlyValues, currencyAsMainOptionValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [summedUpFood, setSummedUpFood] = useState<number | null>(null);
  const [summedUpShopping, setSummedUpShopping] = useState<number | null>(null);
  const [summedUpHome, setSummedUpHome] = useState<number | null>(null);
  const [summedUpTransport, setSummedUpTransport] = useState<number | null>(null);
  const [summedUpCar, setSummedUpCar] = useState<number | null>(null);
  const [summedUpEntertainment, setSummedUpEntertainment] = useState<number | null>(null);
  const [summedUpElectronics, setSummedUpElectronics] = useState<number | null>(null);
  const [summedUpEducation, setSummedUpEducation] = useState<number | null>(null);
  const [summedUpGifts, setSummedUpGifts] = useState<number | null>(null);
  const [summedUpTraining, setSummedUpTraining] = useState<number | null>(null);
  const [summedUpHealth, setSummedUpHealth] = useState<number | null>(null);
  const [summedUpHolidays, setSummedUpHolidays] = useState<number | null>(null);

  const fetchCategoryData = useCallback(async () => {
    const resultFood = await calculateTotalsForCategory('food');
    const resultShopping = await calculateTotalsForCategory('shopping');
    const resultHome = await calculateTotalsForCategory('home');
    const resultTransport = await calculateTotalsForCategory('transport');
    const resultCar = await calculateTotalsForCategory('car');
    const resultEntertainment = await calculateTotalsForCategory('entertainment');
    const resultElectronics = await calculateTotalsForCategory('electronics');
    const resultEducation = await calculateTotalsForCategory('education');
    const resultGifts = await calculateTotalsForCategory('gifts');
    const resultTraining = await calculateTotalsForCategory('training');
    const resultHealth = await calculateTotalsForCategory('health');
    const resultHolidays = await calculateTotalsForCategory('holidays');

    setSummedUpFood(resultFood.summedUp);
    setSummedUpShopping(resultShopping.summedUp);
    setSummedUpHome(resultHome.summedUp);
    setSummedUpTransport(resultTransport.summedUp);
    setSummedUpCar(resultCar.summedUp);
    setSummedUpEntertainment(resultEntertainment.summedUp);
    setSummedUpElectronics(resultElectronics.summedUp);
    setSummedUpEducation(resultEducation.summedUp);
    setSummedUpGifts(resultGifts.summedUp);
    setSummedUpTraining(resultTraining.summedUp);
    setSummedUpHealth(resultHealth.summedUp);
    setSummedUpHolidays(resultHolidays.summedUp);
    setIsBudgetPerAccountCalculated(true);
    setIsCurrentMonthCalculated(true);
  }, [
    summedUpFood,
    summedUpShopping,
    summedUpHome,
    summedUpTransport,
    summedUpCar,
    summedUpEntertainment,
    summedUpElectronics,
    summedUpEducation,
    summedUpGifts,
    summedUpTraining,
    summedUpHealth,
    summedUpHolidays,
    currencyAsMainOptionValue,
  ]);

  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  const { limitFoodBudgetValue, limitBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitFoodBudget
  );

  const { limitShoppingBudgetValue, limitShoppingBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitShoppingBudget
  );

  const { limitHomeBudgetValue, limitHomeBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitHomeBudget
  );

  const { limitPublicTransportBudgetValue, limitPublicTransportBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitPublicTransportBudget
  );

  const { limitCarBudgetValue, limitCarBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitCarBudget
  );

  const { limitLoanBudgetValue, limitLoanBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitLoanBudget
  );

  const { limitEntertainmentBudgetValue, limitEntertainmentBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitEntertainmentBudget
  );

  const { limitElectronicsBudgetValue, limitElectronicsBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitElectronicsBudget
  );

  const { limitEducationBudgetValue, limitEducationBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitEducationBudget
  );

  const { limitGiftsBudgetValue, limitGiftsBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitGiftsBudget
  );

  const { limitTrainingBudgetValue, limitTrainingBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitTrainingBudget
  );

  const { limitHealthBudgetValue, limitHealthBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitHealthBudget
  );

  const { limitHolidaysBudgetValue, limitHolidaysBudgetCurrency } = useSelector(
    (state: RootState) => state.name.limitHolidaysBudget
  );

  const useConvertedBudgetForChart = (budgetValue, budgetCurrency, currencyFromSettings) => {
    const [limitConvertedBudgetForChart, setLimitConvertedBudgetForChart] = useState<number | null>(
      null
    );
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    const [errorConvertingBudgetCurrency, setErrorConvertingBudgetCurrency] = useState<
      string | undefined
    >(undefined);

    useEffect(() => {
      const fetchExchangeRate = async () => {
        try {
          setErrorConvertingBudgetCurrency(undefined);
          if (!budgetValue) {
            setLimitConvertedBudgetForChart(null);
            return;
          }

          const response = await fetch(`https://open.er-api.com/v6/latest/${budgetCurrency}`);
          const data = await response.json();

          const exchangesRates = data.rates;
          const conversionRate = exchangesRates[currencyFromSettings];

          if (conversionRate) {
            setExchangeRate(conversionRate);
            const result = budgetValue * conversionRate;
            setLimitConvertedBudgetForChart(Number(result.toFixed(2)));
          } else {
            setLimitConvertedBudgetForChart(null);
          }
        } catch (error) {
          console.log('Error converting currency', error);
          setErrorConvertingBudgetCurrency('Error converting currency - check Network connection');
        }
      };

      fetchExchangeRate();
    }, [budgetValue, currencyFromSettings, budgetCurrency]);

    return { limitConvertedBudgetForChart, errorConvertingBudgetCurrency };
  };

  const {
    limitConvertedBudgetForChart: foodBudget,
    errorConvertingBudgetCurrency: errorConvertingFoodBudget,
  } = useConvertedBudgetForChart(
    limitFoodBudgetValue,
    limitBudgetCurrency,
    currencyAsMainOptionValue
  );

  const {
    limitConvertedBudgetForChart: shoppingBudget,
    errorConvertingBudgetCurrency: errorConvertingShoppingBudget,
  } = useConvertedBudgetForChart(
    limitShoppingBudgetValue,
    limitShoppingBudgetCurrency,
    currencyAsMainOptionValue
  );

  const {
    limitConvertedBudgetForChart: homeBudget,
    errorConvertingBudgetCurrency: errorConvertingHomeBudget,
  } = useConvertedBudgetForChart(
    limitHomeBudgetValue,
    limitHomeBudgetCurrency,
    currencyAsMainOptionValue
  );

  const {
    limitConvertedBudgetForChart: transportBudget,
    errorConvertingBudgetCurrency: errorConvertingTransportBudget,
  } = useConvertedBudgetForChart(
    limitPublicTransportBudgetValue,
    limitPublicTransportBudgetCurrency,
    currencyAsMainOptionValue
  );

  const {
    limitConvertedBudgetForChart: carBudget,
    errorConvertingBudgetCurrency: errorConvertingCarBudget,
  } = useConvertedBudgetForChart(
    limitCarBudgetValue,
    limitCarBudgetCurrency,
    currencyAsMainOptionValue
  );

  const {
    limitConvertedBudgetForChart: loanBudget,
    errorConvertingBudgetCurrency: errorConvertingLoanBudget,
  } = useConvertedBudgetForChart(
    limitLoanBudgetValue,
    limitLoanBudgetCurrency,
    currencyAsMainOptionValue
  );

  const {
    limitConvertedBudgetForChart: entertainmentBudget,
    errorConvertingBudgetCurrency: errorConvertingEntertainmentBudget,
  } = useConvertedBudgetForChart(
    limitEntertainmentBudgetValue,
    limitEntertainmentBudgetCurrency,
    currencyAsMainOptionValue
  );

  const {
    limitConvertedBudgetForChart: electronicsBudget,
    errorConvertingBudgetCurrency: errorConvertingElectronicsBudget,
  } = useConvertedBudgetForChart(
    limitElectronicsBudgetValue,
    limitElectronicsBudgetCurrency,
    currencyAsMainOptionValue
  );

  const {
    limitConvertedBudgetForChart: educationBudget,
    errorConvertingBudgetCurrency: errorConvertingEducationBudget,
  } = useConvertedBudgetForChart(
    limitEducationBudgetValue,
    limitEducationBudgetCurrency,
    currencyAsMainOptionValue
  );

  const {
    limitConvertedBudgetForChart: giftsBudget,
    errorConvertingBudgetCurrency: errorConvertingGiftsBudget,
  } = useConvertedBudgetForChart(
    limitGiftsBudgetValue,
    limitGiftsBudgetCurrency,
    currencyAsMainOptionValue
  );

  const {
    limitConvertedBudgetForChart: trainingBudget,
    errorConvertingBudgetCurrency: errorConvertingTrainingBudget,
  } = useConvertedBudgetForChart(
    limitTrainingBudgetValue,
    limitTrainingBudgetCurrency,
    currencyAsMainOptionValue
  );

  const {
    limitConvertedBudgetForChart: healthBudget,
    errorConvertingBudgetCurrency: errorConvertingHealthBudget,
  } = useConvertedBudgetForChart(
    limitHealthBudgetValue,
    limitHealthBudgetCurrency,
    currencyAsMainOptionValue
  );

  const {
    limitConvertedBudgetForChart: holidaysBudget,
    errorConvertingBudgetCurrency: errorConvertingHolidaysBudget,
  } = useConvertedBudgetForChart(
    limitHolidaysBudgetValue,
    limitHolidaysBudgetCurrency,
    currencyAsMainOptionValue
  );

  const budgetData = [
    {
      name: t('BudgetScreenLimitBudgetFoodTitleText'),
      budgetValue: foodBudget,
      budgetCurrency: currencyAsMainOptionValue,
      id: 0,
      icon: () => <Ionicons name="fast-food-sharp" size={25} color={'black'} />,
    },
    {
      name: t('BudgetScreenLimitBudgetShoppingTitleText'),
      budgetValue: shoppingBudget,
      budgetCurrency: currencyAsMainOptionValue,
      id: 1,
      icon: () => <FontAwesome name="shopping-basket" size={25} color={'black'} />,
    },
    {
      name: t('BudgetScreenLimitBudgetHomeTitleText'),
      budgetValue: homeBudget,
      budgetCurrency: currencyAsMainOptionValue,
      id: 2,
      icon: () => <Ionicons name="home" size={25} color={'black'} />,
    },
    {
      name: t('BudgetScreenLimitBudgetTransportTitleText'),
      budgetValue: transportBudget,
      budgetCurrency: currencyAsMainOptionValue,
      id: 3,
      icon: () => <FontAwesome6 name="train-subway" size={25} color={'black'} />,
    },
    {
      name: t('BudgetScreenLimitBudgetCarTitleText'),
      budgetValue: carBudget,
      budgetCurrency: currencyAsMainOptionValue,
      id: 4,
      icon: () => <Ionicons name="car-sport" size={25} color={'black'} />,
    },
    {
      name: t('BudgetScreenLimitBudgetLoanTitleText'),
      budgetValue: loanBudget,
      budgetCurrency: currencyAsMainOptionValue,
      id: 5,
      icon: () => <MCI name="bank-transfer" size={25} color={'black'} />,
    },
    {
      name: t('BudgetScreenLimitBudgetEntertainmentTitleText'),
      budgetValue: entertainmentBudget,
      budgetCurrency: currencyAsMainOptionValue,
      id: 6,
      icon: () => <MCI name="cards-club" size={25} color={'black'} />,
    },
    {
      name: t('BudgetScreenLimitBudgetElectronicsTitleText'),
      budgetValue: electronicsBudget,
      budgetCurrency: currencyAsMainOptionValue,
      id: 7,
      icon: () => <Ionicons name="game-controller" size={25} color={'black'} />,
    },
    {
      name: t('BudgetScreenLimitBudgetEducationTitleText'),
      budgetValue: educationBudget,
      budgetCurrency: currencyAsMainOptionValue,
      id: 8,
      icon: () => <FontAwesome5 name="book" size={25} color={'black'} />,
    },
    {
      name: t('BudgetScreenLimitBudgetGiftsTitleText'),
      budgetValue: giftsBudget,
      budgetCurrency: currencyAsMainOptionValue,
      id: 9,
      icon: () => <FontAwesome6 name="gift" size={25} color={'black'} />,
    },
    {
      name: t('BudgetScreenLimitBudgetTrainingTitleText'),
      budgetValue: trainingBudget,
      budgetCurrency: currencyAsMainOptionValue,
      id: 10,
      icon: () => <MaterialIcons name="sports-tennis" size={25} color={'black'} />,
    },
    {
      name: t('BudgetScreenLimitBudgetHealthTitleText'),
      budgetValue: healthBudget,
      budgetCurrency: currencyAsMainOptionValue,
      id: 11,
      icon: () => <FontAwesome5 name="hand-holding-medical" size={25} color={'black'} />,
    },
    {
      name: t('BudgetScreenLimitBudgetHolidaysTitleText'),
      budgetValue: holidaysBudget,
      budgetCurrency: currencyAsMainOptionValue,
      id: 12,
      icon: () => <Fontisto name="holiday-village" size={25} color={'black'} />,
    },
  ];

  const loadExpenseCategoryDataFromRedux = async () => {
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
  };

  useEffect(() => {
    const interval = setInterval(loadExpenseCategoryDataFromRedux, 5000);

    return () => {
      clearInterval(interval);
    };
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
    currencyAsMainOptionValue,
  ]);

  return (
    <Animated.ScrollView>
      <View
        style={{
          ...styles.categoryMainContainer,
          backgroundColor:
            themeconfig === theme.mode ? activeColorsDark.primary : activeColorsLight.bisque,
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
          <Text style={styles.titleText}>{t('CategoryScreenAppBarText')}</Text>

          <MaterialCommunityIcons name="information" color="white" size={30} />
        </View>
        <View style={styles.dataContainer}>
          <Text style={{ color: 'white', fontSize: 16 }}>
            {t('CategoryScreenData')}: {actualData}
          </Text>
        </View>
        <View
          style={{
            backgroundColor:
              themeconfig === theme.mode ? activeColorsDark.primary : activeColorsLight.bisque,
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {budgetData.map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor:
                  themeconfig === theme.mode ? activeColorsDark.primary : activeColorsLight.bisque,
                width: '100%',
                padding: '5%',
              }}
            >
              {item.budgetValue === null && item.budgetCurrency ? (
                <View
                  style={{
                    flexDirection: 'column',
                    backgroundColor: 'darkseagreen',
                    padding: '3%',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        themeconfig === theme.mode
                          ? activeColorsDark.white
                          : activeColorsLight.black,
                    }}
                  >
                    {t('CategoryScreenLimitNameText')} {item.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        themeconfig === theme.mode
                          ? activeColorsDark.white
                          : activeColorsLight.black,
                    }}
                  >
                    {t('CategoryScreenLimitBudgetValueText')} 0{' '}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        themeconfig === theme.mode
                          ? activeColorsDark.white
                          : activeColorsLight.black,
                    }}
                  >
                    {t('CategoryScreenLimitBudgetCurrencyText')} {item.budgetCurrency}
                  </Text>
                </View>
              ) : (
                <View
                  style={{ flexDirection: 'column', backgroundColor: 'crimson', padding: '3%' }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        themeconfig === theme.mode
                          ? activeColorsDark.white
                          : activeColorsLight.black,
                    }}
                  >
                    {t('CategoryScreenLimitNameText')} {item.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        themeconfig === theme.mode
                          ? activeColorsDark.white
                          : activeColorsLight.black,
                    }}
                  >
                    {t('CategoryScreenLimitBudgetValueText')} {item.budgetValue}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        themeconfig === theme.mode
                          ? activeColorsDark.white
                          : activeColorsLight.black,
                    }}
                  >
                    {t('CategoryScreenLimitBudgetCurrencyText')} {item.budgetCurrency}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
        <Text
          style={{
            color: 'white',
            fontSize: 23,
            backgroundColor: 'dodgerblue',
            margin: 10,
            padding: 5,
            borderRadius: 10,
            textAlign: 'center',
          }}
        >
          {t('CategoryScreenLastMonthOverall')}
        </Text>
        <View style={styles.eachCategoryContainer}>
          <View style={styles.eachCategoryContainerIndividual}>
            <FlatList
              data={itemsCategory}
              renderItem={({ item, index }) => (
                <RenderEachCategoryInCurrentMonthItem
                  item={item}
                  maxValue={
                    typeof budgetData[index]?.budgetValue === 'number'
                      ? budgetData[index]?.budgetValue
                      : 0
                  }
                  limit={
                    typeof budgetData[index]?.budgetValue === 'number'
                      ? budgetData[index]?.budgetValue
                      : 0
                  }
                  currency={
                    typeof budgetData[index]?.budgetCurrency === 'string'
                      ? budgetData[index]?.budgetCurrency
                      : ''
                  }
                />
              )}
              keyExtractor={(item) => item.value}
              style={{ backgroundColor: 'transparent', borderRadius: 20 }}
              scrollEnabled={false}
            />
          </View>
        </View>
        <Text
          style={{
            color: 'white',
            fontSize: 23,
            backgroundColor: 'dodgerblue',
            margin: 10,
            padding: 5,
            borderRadius: 10,
            textAlign: 'center',
          }}
        >
          {t('CategoryScreenLastMonthIncluded15ThDay')}
        </Text>
        <View style={styles.eachCategoryContainer}>
          <View style={styles.eachCategoryContainerIndividual}>
            <FlatList
              data={itemsCategory}
              renderItem={({ item, index }) => (
                <RenderEachCategoryItem
                  item={item}
                  maxValue={
                    typeof budgetData[index]?.budgetValue === 'number'
                      ? budgetData[index]?.budgetValue
                      : 0
                  }
                  limit={
                    typeof budgetData[index]?.budgetValue === 'number'
                      ? budgetData[index]?.budgetValue
                      : 0
                  }
                  currency={
                    typeof budgetData[index]?.budgetCurrency === 'string'
                      ? budgetData[index]?.budgetCurrency
                      : ''
                  }
                />
              )}
              keyExtractor={(item) => item.value}
              style={{ backgroundColor: 'transparent', borderRadius: 20 }}
              scrollEnabled={false}
            />
          </View>
        </View>
      </View>
      <View style={{ flex: 1 }} />
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  categoryMainContainer: {
    height: '100%',
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
  dataContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    backgroundColor: 'goldenrod',
  },
  titleText: {
    color: 'white',
    fontSize: 16,
  },
  eachCategoryContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eachCategoryContainerIndividual: {
    paddingHorizontal: 5,
    alignItems: 'flex-start',
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  valueContainer: {
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
  },
  valueText: {
    color: 'white',
  },
  radioContainer: {
    marginBottom: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioCircleButton: {
    height: 35,
    width: 35,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 20,
    elevation: 20,
  },
  containerForRadioButton: {
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  containerForRadioButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  radioButton: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  radioButtonSelected: {
    backgroundColor: 'blue',
  },
  modalHeader: {
    width: '100%',
    height: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default Category;

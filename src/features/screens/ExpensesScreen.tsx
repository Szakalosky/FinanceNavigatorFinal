import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Pressable,
  Animated,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorList } from '../types/Navigator';
import LinearGradient from 'react-native-linear-gradient';
import CalendarPicker from 'react-native-calendar-picker';
import SelectDropdown from 'react-native-select-dropdown';
import i18next, { languageResources } from '../../../src/services/i18next';
import languagesList from '../../../src/services/languagesList.json';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../rootStates/rootState';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { expensesScreenSchema } from '../../schemas/expensesScreenSchema';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  navigateToMainContent,
  setExpenseScreenNotFirstRun,
  setIncomeScreenNotFirstRun,
  setMainContentScreenExpensesArray,
} from '../../redux/actions';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import auth from '@react-native-firebase/auth';
import { User as FirebaseUser } from '@react-native-firebase/auth';

export type Props = NativeStackScreenProps<NavigatorList, 'HomeScreen'>;

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export type Item = {
  id: number;
  label: string;
  value: string;
  icon: () => React.ReactElement<IconProps> | null;
};

export type ExpensesFormValues = {
  expenseValue: number;
  expenseTitle: string;
  expenseNotes: string;
  expenseDate: string;
  expenseCategory: string;
  expenseAccount: string;
  expenseCurrency: string;
};

const isExpenseScreenFirstRunKey = '@MyApp:isExpenseScreenFirstRun';

const ExpensesScreen: React.FC<Props> = ({ navigation }) => {
  const [nowDate, setNowDate] = useState(new Date());

  const dt = new Date(nowDate);

  const changeDate = (date: any) => {
    setNowDate(date);
  };

  const dispatch = useDispatch();

  //Translation
  const { t } = useTranslation();

  const [itemsCategory, setItemsCategory] = useState<Item[]>([]);

  const [itemsAccount, setItemsAccount] = useState<Item[]>([]);

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

  type ExpenseCurrencyProps = {
    name: string;
    IconSymbol: string;
  };

  const expensesCurrencies: ExpenseCurrencyProps[] = [
    { name: 'PLN', IconSymbol: 'zł' },
    { name: 'EUR', IconSymbol: '€' },
    { name: 'USD', IconSymbol: '$' },
    { name: 'GBP', IconSymbol: '£' },
  ];

  const [choosenExpensesCategoryMenuOption, setChoosenExpensesCategoryMenuOption] = useState<
    string[] | null
  >([]);

  const [choosenExpensesAccountMenuOption, setChoosenExpensesAccountMenuOption] = useState<
    string[] | null
  >([]);

  //Expense form validation

  const expenseForm = useForm<ExpensesFormValues>({
    defaultValues: {
      expenseValue: 0,
      expenseTitle: '',
      expenseNotes: '',
      expenseDate: '',
      expenseCategory: '',
      expenseAccount: '',
      expenseCurrency: '',
    },
    resolver: yupResolver(expensesScreenSchema) as Resolver<ExpensesFormValues, any>,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const { register, control, handleSubmit, formState } = expenseForm;
  const { errors } = formState;

  const { isGoogleUserLoggedIn, userGoogleUId } = useSelector(
    (state: RootState) => state.name.isGoogleUser
  );

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user: FirebaseUser | null) => {
      if (user) {
        console.log('Użytkownik jest zalogowany:');
        Alert.alert('User is logged in');
      } else {
        console.log('Użytkownik jest wylogowany');
        Alert.alert('User is not logged in');
      }
    });

    return () => unsubscribe();
  }, [userGoogleUId, isGoogleUserLoggedIn]);

  const [universalCategoryValue, setUniversalCategoryValue] = useState<string | null>(null);

  const universalExpenseCategoryDependsOnLanguage = (item: string, selectedOption: string) => {
    switch (item) {
      case t('ExpensesScreenCategoryDropDownFoodText'): {
        setUniversalCategoryValue(selectedOption);
        break;
      }
      case t('ExpensesScreenCategoryDropDownShoppingText'): {
        setUniversalCategoryValue(selectedOption);
        break;
      }
      case t('ExpensesScreenCategoryDropDownHomeText'): {
        setUniversalCategoryValue(selectedOption);
        break;
      }
      case t('ExpensesScreenCategoryDropDownTransportText'): {
        setUniversalCategoryValue(selectedOption);
        break;
      }
      case t('ExpensesScreenCategoryDropDownCarText'): {
        setUniversalCategoryValue(selectedOption);
        break;
      }
      case t('ExpensesScreenCategoryDropDownLoanText'): {
        setUniversalCategoryValue(selectedOption);
        break;
      }
      case t('ExpensesScreenCategoryDropDownEntertainmentText'): {
        setUniversalCategoryValue(selectedOption);
        break;
      }
      case t('ExpensesScreenCategoryDropDownElectronicsText'): {
        setUniversalCategoryValue(selectedOption);
        break;
      }
      case t('ExpensesScreenCategoryDropDownEducationText'): {
        setUniversalCategoryValue(selectedOption);
        break;
      }
      case t('ExpensesScreenCategoryDropDownGiftsText'): {
        setUniversalCategoryValue(selectedOption);
        break;
      }
      case t('ExpensesScreenCategoryDropDownTrainingText'): {
        setUniversalCategoryValue(selectedOption);
        break;
      }
      case t('ExpensesScreenCategoryDropDownHealthText'): {
        setUniversalCategoryValue(selectedOption);
        break;
      }
      case t('ExpensesScreenCategoryDropDownHolidaysText'): {
        setUniversalCategoryValue(selectedOption);
        break;
      }
      default:
        break;
    }
  };

  const [universalExpensesAccountValue, setUniversalExpensesAccountValue] = useState<string | null>(
    null
  );

  const universalExpenseAccountDependsOnLanguage = (item: string, selectedOption: string) => {
    switch (item) {
      case t('ExpensesScreenAccountDropDownFamilyText'): {
        setUniversalExpensesAccountValue(selectedOption);
        break;
      }
      case t('ExpensesScreenAccountDropDownPrivateText'): {
        setUniversalExpensesAccountValue(selectedOption);
        break;
      }
      case t('ExpensesScreenAccountDropDownSavingsText'): {
        setUniversalExpensesAccountValue(selectedOption);
        break;
      }
      default:
        break;
    }
  };

  const addDocument = async (data: ExpensesFormValues) => {
    //add data to firestore database
    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.log('User is not logged in');
        Alert.alert('User is not logged in');
      }

      const expensesCollectionRef = firebase.firestore().collection('expensesCollection');

      await expensesCollectionRef
        .add({
          expenseValue: data.expenseValue,
          expenseTitle: data.expenseTitle,
          expenseNotes: data.expenseNotes,
          expenseDate: data.expenseDate,
          expenseCategory: data.expenseCategory,
          expenseAccount: data.expenseAccount,
          expenseCurrency: data.expenseCurrency,
          userId: currentUser?.uid,
          expenseCategoryUniversalValue: universalCategoryValue,
          expenseAccountUniversalValue: universalExpensesAccountValue,
        })
        .then(() => {
          console.log('Google data were added to firestore');
          Alert.alert('Expense was added');
          dispatch(
            setMainContentScreenExpensesArray([
              {
                expenseValue: data.expenseValue,
                expenseTitle: data.expenseTitle,
                expenseNotes: data.expenseNotes,
                expenseDate: data.expenseDate,
                expenseCategory: data.expenseCategory,
                expenseAccount: data.expenseAccount,
                expenseCurrency: data.expenseCurrency,
                userId: currentUser?.uid,
                expenseCategoryUniversalValue: universalCategoryValue,
                expenseAccountUniversalValue: universalExpensesAccountValue,
              },
            ])
          );
          setAppAsNotFirstRun();

          checkFirstRunAndNavigatoeToMainContent();
          dispatch(setExpenseScreenNotFirstRun());
          console.log('Data added to firestore database');
        })
        .catch((error) => {
          console.error('Error adding Google data to Firestore', error);
        });
    } catch (error) {
      console.log('Error while adding new document', error);
    }
  };

  const onSubmit = (data: ExpensesFormValues) => {
    console.log(data);
    console.log(typeof data.expenseValue);
    console.log(typeof data.expenseCategory);
    console.log(typeof data.expenseAccount);
    console.log(typeof data.expenseTitle);
    console.log(typeof data.expenseNotes);
    console.log(typeof data.expenseDate);
    console.log(typeof data.expenseCurrency);
    console.log(data.expenseValue);
    console.log(data.expenseCategory);
    console.log(data.expenseAccount);
    console.log(data.expenseTitle);
    console.log(data.expenseNotes);
    console.log(data.expenseDate);
    console.log(data.expenseCurrency);
    addDocument(data);
  };

  const numericValue = 0.0;

  const currencyFromSettings = useSelector(
    (state: RootState) => state.name.settingsScreenActualCurrency
  );

  //state from redux for asyncStorage

  let isExpenseScreenFirstRun = useSelector(
    (state: RootState) => state.name.isExpenseScreenFirstRun
  );

  //AsyncStorage and firstRun ExpenseScreen

  const setAppAsNotFirstRun = async () => {
    try {
      await AsyncStorage.setItem(isExpenseScreenFirstRunKey, 'false');
    } catch (error) {
      console.error('Error saving in ExpenseScreen isFirstRun data: ', error);
    }
  };

  const getAppFirstRunStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(isExpenseScreenFirstRunKey);
      return value === null;
    } catch (error) {
      console.error('Error getting in ExpenseScreen isFirstRun data: ', error);
      return true;
    }
  };

  const checkFirstRunAndNavigatoeToMainContent = async () => {
    isExpenseScreenFirstRun = await getAppFirstRunStatus();

    if (!isExpenseScreenFirstRun) {
      navigation.navigate('HomeScreenFinal');
      dispatch(navigateToMainContent());
      dispatch(setIncomeScreenNotFirstRun());
    }
  };

  useEffect(() => {
    console.log('CATEGORY', universalCategoryValue);
  }, [universalCategoryValue]);

  useEffect(() => {
    console.log('ACCOUNT', universalExpensesAccountValue);
  }, [universalExpensesAccountValue]);

  return (
    <LinearGradient
      start={{ x: 0.3, y: 0.9 }}
      end={{ x: 1, y: 0.2 }}
      colors={['lightblue', 'indianred', 'tomato', 'orangered']}
      locations={[0, 0.1, 0.5, 0.9]}
      style={styles.gradient}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.innerHeaderContainer}>
          <Pressable
            style={{
              backgroundColor: 'white',
              width: 30,
              height: 30,
              borderRadius: 15,
            }}
            onPress={() => navigation.navigate('HomeScreenFinal')}
          >
            <AntDesign name="arrowleft" size={30} color={'black'} />
          </Pressable>
          <Text style={{ fontSize: 18, fontWeight: '600', fontFamily: 'serif' }}>
            {t('ExpensesScreenHeader')}
          </Text>
        </View>
        <ScrollView>
          <View style={styles.outerColumnContainer}>
            <View style={styles.innerRowContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '900',
                    fontFamily: 'serif',
                    color: 'black',
                  }}
                >
                  {t('ExpensesScreenCategoryText')}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '900',
                    fontFamily: 'serif',
                    color: 'black',
                  }}
                >
                  {t('ExpensesScreenAccountText')}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  width: '100%',
                  justifyContent: 'space-between',
                  padding: 10,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <SelectDropdown
                        defaultButtonText={t('ExpensesScreenCategoryDropDownText')}
                        defaultValue={value}
                        data={itemsCategory}
                        onSelect={(selectedItem: Item) => {
                          setChoosenExpensesCategoryMenuOption([selectedItem.label]);
                          onChange(selectedItem.label);
                          universalExpenseCategoryDependsOnLanguage(
                            selectedItem.label,
                            selectedItem.value
                          );
                        }}
                        buttonTextAfterSelection={(selectedItem: Item) => {
                          return selectedItem.label;
                        }}
                        dropdownStyle={{ borderRadius: 10 }}
                        buttonStyle={{
                          borderRadius: 10,
                          width: '45%',
                          height: 60,
                          backgroundColor: '#fff',
                          borderColor: 'red',
                          borderWidth: 1,
                        }}
                        rowStyle={{ height: 80 }}
                        rowTextForSelection={(item: Item) => item.label}
                        renderCustomizedRowChild={(item: Item) => (
                          <View style={styles.dropdownItem}>
                            {item.icon && item.icon()}
                            <Text style={{ marginLeft: 10, color: 'black' }}>{item.label}</Text>
                          </View>
                        )}
                      />
                    )}
                    name="expenseCategory"
                  />
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <SelectDropdown
                        defaultButtonText={t('ExpensesScreenAccountDropDownText')}
                        defaultValue={value}
                        data={itemsAccount}
                        onSelect={(selectedItem: Item) => {
                          setChoosenExpensesAccountMenuOption([selectedItem.label]);
                          onChange(selectedItem.label);
                          universalExpenseAccountDependsOnLanguage(
                            selectedItem.label,
                            selectedItem.value
                          );
                        }}
                        buttonTextAfterSelection={(selectedItem: Item) => {
                          return selectedItem.value;
                        }}
                        dropdownStyle={{ borderRadius: 10 }}
                        buttonStyle={{
                          borderRadius: 10,
                          width: '45%',
                          height: 60,
                          backgroundColor: '#fff',
                          borderColor: 'red',
                          borderWidth: 1,
                        }}
                        rowStyle={{ height: 90, padding: 7 }}
                        rowTextForSelection={(item: Item) => item.label}
                        renderCustomizedRowChild={(item: Item) => (
                          <View style={styles.dropdownItem}>
                            {item.icon && item.icon()}
                            <Text style={{ marginLeft: 10, color: 'black' }}>{item.label}</Text>
                          </View>
                        )}
                      />
                    )}
                    name="expenseAccount"
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 16 }}>
                    {choosenExpensesCategoryMenuOption}
                  </Text>
                  {errors.expenseCategory && (
                    <Text
                      style={{
                        color: 'red',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                      }}
                    >
                      {errors.expenseCategory.message}
                    </Text>
                  )}
                  <Text style={{ color: 'white', fontSize: 16 }}>
                    {choosenExpensesAccountMenuOption}
                  </Text>
                  {errors.expenseAccount && (
                    <Text
                      style={{
                        color: 'red',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                      }}
                    >
                      {errors.expenseAccount.message}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'column',
                height: 300,
                marginTop: '15%',
                marginLeft: '1%',
                marginRight: '1%',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
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
                        width: '75%',
                        borderColor: 'black',
                        borderWidth: 1,
                        marginHorizontal: 1,
                      }}
                      placeholder={t('ExpensesScreenTextInputFirst')}
                      keyboardType="numeric"
                      onChangeText={(text: string) => {
                        //const numericValue = text.replace(/[^0-9.,]/g, '');
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
                  name="expenseValue"
                />
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SelectDropdown
                      defaultButtonText="currency"
                      buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                      defaultValue={value}
                      data={expensesCurrencies}
                      onSelect={(selectedItem: ExpenseCurrencyProps) => {
                        onChange(selectedItem.name);
                      }}
                      buttonTextAfterSelection={(selectedItem: ExpenseCurrencyProps) => {
                        return selectedItem.IconSymbol;
                      }}
                      dropdownStyle={{ borderRadius: 10 }}
                      buttonStyle={{
                        borderRadius: 10,
                        width: '25%',
                        height: 60,
                        backgroundColor: '#fff',
                        borderColor: 'red',
                        borderWidth: 1,
                      }}
                      rowStyle={{ height: 90, padding: 7 }}
                      rowTextForSelection={(item: ExpenseCurrencyProps) => item.name}
                      renderCustomizedRowChild={(item: ExpenseCurrencyProps) => (
                        <View style={styles.dropdownItem}>
                          <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                          <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                        </View>
                      )}
                    />
                  )}
                  name="expenseCurrency"
                />
              </View>

              <View style={{ flexDirection: 'column' }}>
                {errors.expenseValue && (
                  <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    {errors.expenseValue.message}
                  </Text>
                )}

                {errors.expenseCurrency && (
                  <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    {errors.expenseCurrency.message}
                  </Text>
                )}
              </View>

              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange } }) => (
                  <TextInput
                    cursorColor={'black'}
                    placeholderTextColor={'black'}
                    style={styles.expenseInput}
                    placeholder={t('ExpensesScreenTextInputSecond')}
                    keyboardType="ascii-capable"
                    onChangeText={onChange}
                  />
                )}
                name="expenseTitle"
              />
              {errors.expenseTitle && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.expenseTitle.message}
                </Text>
              )}

              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange } }) => (
                  <TextInput
                    cursorColor={'black'}
                    placeholderTextColor={'black'}
                    style={styles.expenseInput}
                    placeholder={t('ExpensesScreenTextInputThird')}
                    keyboardType="default"
                    onChangeText={onChange}
                  />
                )}
                name="expenseNotes"
              />
              {errors.expenseNotes && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.expenseNotes.message}
                </Text>
              )}
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: '5%',
                marginLeft: '1%',
                marginRight: '1%',
                justifyContent: 'space-between',
              }}
            >
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange } }) => (
                  <CalendarPicker
                    height={600}
                    previousTitleStyle={{ color: 'black' }}
                    nextTitleStyle={{ color: 'black' }}
                    selectedStartDate={nowDate}
                    onDateChange={(date) => {
                      const isoDate = date.toISOString().slice(0, 10);
                      onChange(isoDate);
                      changeDate(date);
                    }}
                  />
                )}
                name="expenseDate"
              />
              {errors.expenseDate && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.expenseDate.message}
                </Text>
              )}
            </View>

            <View
              style={{
                flexDirection: 'column',
                marginTop: '5%',
                marginLeft: '1%',
                marginRight: '1%',
                justifyContent: 'space-between',
                padding: '3%',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: '10%',
                }}
              >
                <Text style={{ color: 'black' }}>
                  {t('ExpensesScreenPickedDateText')} {dt.toISOString().slice(0, 10)}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'deepskyblue',
                    alignItems: 'center',
                    width: '30%',
                    height: 40,
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: 'black',
                  }}
                  onPress={() => navigation.navigate('MakeParagonsPhotos')}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      fontFamily: 'serif',
                      color: 'black',
                    }}
                  >
                    Make Receipts photo
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  marginVertical: 10,
                }}
              >
                <TouchableOpacity
                  testID="submitButton"
                  style={styles.submitButton}
                  onPress={handleSubmit(onSubmit)}
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
          <View style={{ flex: 1 }} />
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  outerColumnContainer: {
    flexDirection: 'column',
    marginTop: 10,
    padding: 10,
  },
  innerRowContainer: {
    flexDirection: 'column',
    marginLeft: '1%',
    marginRight: '1%',
    marginBottom: '10%',
    height: '10%',
    justifyContent: 'space-between',
    zIndex: 1,
    width: 'auto',
  },
  innerHeaderContainer: {
    flexDirection: 'row',
    padding: '1%',
    width: '100%',
    gap: 10,
    alignItems: 'center',
    height: 60,
  },
  upperButtons: {
    backgroundColor: 'lightskyblue',
  },
  expenseInput: {
    backgroundColor: 'seashell',
    textAlign: 'center',
    marginBottom: '1%',
    height: '20%',
    color: 'blue',
    fontSize: 18,
    borderColor: 'black',
    borderWidth: 1,
  },
  gradient: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    width: '50%',
    height: 70,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    justifyContent: 'flex-start',
  },
});

export default ExpensesScreen;

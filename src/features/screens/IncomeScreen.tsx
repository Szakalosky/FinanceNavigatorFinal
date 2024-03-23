import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Pressable,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import CalendarPicker from 'react-native-calendar-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorList } from '../types/Navigator';
import { useTranslation } from 'react-i18next';
import { Item } from './ExpensesScreen';
import { IconProps } from './ExpensesScreen';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { incomeScreenSchema } from '../../schemas/incomeScreenSchema';
import SelectDropdown from 'react-native-select-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../rootStates/rootState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  navigateToMainContent,
  setIncomeScreenNotFirstRun,
  setMainContentScreenIncomeArray,
} from '../../redux/actions';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { User as FirebaseUser } from '@react-native-firebase/auth';
type Props = NativeStackScreenProps<NavigatorList, 'HomeScreen'>;

export type IncomeFormValues = {
  incomeValue: number;
  incomeTitle: string;
  incomeNotes: string;
  incomeDate: string;
  incomeCategory: string;
  incomeAccount: string;
  incomeCurrency: string;
};

const isIncomeScreenFirstRunKey = '@MyApp:isIncomeScreenFirstRun';

const IncomeScreen: React.FC<Props> = ({ navigation }) => {
  const [nowDate, setNowDate] = useState(new Date());

  const dt = new Date(nowDate);

  const changeDate = (date: any) => {
    setNowDate(date);
  };

  //Translation
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [itemsCategoryIncome, setItemsCategoryIncome] = useState<Item[]>([]);

  const [itemsAccountIncome, setItemsAccountIncome] = useState<Item[]>([]);

  useEffect(() => {
    setItemsCategoryIncome([
      {
        id: 0,
        label: t('IncomeScreenCategoryDropDownSalaryText'),
        value: 'salary',
        icon: () => <MCI name="cash-plus" size={25} color={'black'} />,
      },
      {
        id: 1,
        label: t('IncomeScreenCategoryDropDownPensionText'),
        value: 'pension',
        icon: () => <FontAwesome6 name="person-shelter" size={25} color={'black'} />,
      },
      {
        id: 2,
        label: t('IncomeScreenCategoryDropDownCryptoText'),
        value: 'crypto',
        icon: () => <MCI name="bitcoin" size={25} color={'black'} />,
      },
      {
        id: 3,
        label: t('IncomeScreenCategoryDropDownServicesText'),
        value: 'services',
        icon: () => <MaterialIcons name="design-services" size={25} color={'black'} />,
      },
      {
        id: 4,
        label: t('IncomeScreenCategoryDropDownOtherText'),
        value: 'other',
        icon: () => <Foundation name="clipboard-notes" size={25} color={'black'} />,
      },
    ]);
    setItemsAccountIncome([
      {
        id: 0,
        label: t('IncomeScreenAccountDropDownFamilyText'),
        value: 'Family account',
        icon: () => <MaterialIcons name="family-restroom" size={25} color={'black'} />,
      },
      {
        id: 1,
        label: t('IncomeScreenAccountDropDownPrivateText'),
        value: 'Private account',
        icon: () => <MaterialIcons name="private-connectivity" size={25} color={'black'} />,
      },
      {
        id: 2,
        label: t('IncomeScreenAccountDropDownSavingsText'),
        value: 'Savings account',
        icon: () => <MaterialIcons name="savings" size={25} color={'black'} />,
      },
    ]);
  }, [t]);

  type IncomeCurrencyProps = {
    name: string;
    IconSymbol: string;
  };

  const incomeCurrencies: IncomeCurrencyProps[] = [
    { name: 'PLN', IconSymbol: 'zł' },
    { name: 'EUR', IconSymbol: '€' },
    { name: 'USD', IconSymbol: '$' },
    { name: 'GBP', IconSymbol: '£' },
  ];

  const [choosenIncomeCategoryMenuOption, setChoosenIncomeCategoryMenuOption] = useState<
    string[] | undefined
  >([]);

  const [choosenIncomeAccountMenuOption, setChoosenIncomeAccountMenuOption] = useState<
    string[] | undefined
  >([]);

  const incomeForm = useForm<IncomeFormValues>({
    defaultValues: {
      incomeValue: 0,
      incomeTitle: '',
      incomeNotes: '',
      incomeDate: '',
      incomeCategory: '',
      incomeAccount: '',
      incomeCurrency: '',
    },
    resolver: yupResolver(incomeScreenSchema) as Resolver<IncomeFormValues, any>,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const { register, control, handleSubmit, formState } = incomeForm;
  const { errors } = formState;

  const [universalIncomeCategoryValue, setUniversalIncomeCategoryValue] = useState<string | null>(
    null
  );

  const universalIncomeCategoryDependsOnLanguage = (item: string, selectedOption: string) => {
    switch (item) {
      case t('IncomeScreenCategoryDropDownSalaryText'): {
        setUniversalIncomeCategoryValue(selectedOption);
        break;
      }
      case t('IncomeScreenCategoryDropDownPensionText'): {
        setUniversalIncomeCategoryValue(selectedOption);
        break;
      }
      case t('IncomeScreenCategoryDropDownCryptoText'): {
        setUniversalIncomeCategoryValue(selectedOption);
        break;
      }
      case t('IncomeScreenCategoryDropDownServicesText'): {
        setUniversalIncomeCategoryValue(selectedOption);
        break;
      }
      case t('IncomeScreenCategoryDropDownOtherText'): {
        setUniversalIncomeCategoryValue(selectedOption);
        break;
      }
      default:
        break;
    }
  };

  const [universalIncomeAccountValue, setUniversalIncomeAccountValue] = useState<string | null>(
    null
  );

  const universalIncomeAccountDependsOnLanguage = (item: string, selectedOption: string) => {
    switch (item) {
      case t('IncomeScreenAccountDropDownFamilyText'): {
        setUniversalIncomeAccountValue(selectedOption);
        break;
      }
      case t('IncomeScreenAccountDropDownPrivateText'): {
        setUniversalIncomeAccountValue(selectedOption);
        break;
      }
      case t('IncomeScreenAccountDropDownSavingsText'): {
        setUniversalIncomeAccountValue(selectedOption);
        break;
      }
      default:
        break;
    }
  };

  const addDocument = async (data: IncomeFormValues) => {
    //add data to firestore database
    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.log('User is not logged in');
        Alert.alert('User is not logged in');
      }

      const incomeCollectionRef = firebase.firestore().collection('incomeCollection');

      await incomeCollectionRef
        .add({
          incomeCategory: data.incomeCategory,
          incomeAccount: data.incomeAccount,
          incomeValue: data.incomeValue,
          incomeTitle: data.incomeTitle,
          incomeNotes: data.incomeNotes,
          incomeDate: data.incomeDate,
          incomeCurrency: data.incomeCurrency,
          userId: currentUser?.uid,
          incomeCategoryUniversalValue: universalIncomeCategoryValue,
          incomeAccountUniversalValue: universalIncomeAccountValue,
        })
        .then(() => {
          console.log('Google data were added to firestore');
          Alert.alert('Income was added');
          dispatch(
            setMainContentScreenIncomeArray([
              {
                incomeCategory: data.incomeCategory,
                incomeAccount: data.incomeAccount,
                incomeValue: data.incomeValue,
                incomeTitle: data.incomeTitle,
                incomeNotes: data.incomeNotes,
                incomeDate: data.incomeDate,
                incomeCurrency: data.incomeCurrency,
                userId: currentUser?.uid,
                incomeCategoryUniversalValue: universalIncomeCategoryValue,
                incomeAccountUniversalValue: universalIncomeAccountValue,
              },
            ])
          );
          setAppAsNotFirstRun();

          checkFirstRunAndNavigateToMainContent();
          dispatch(setIncomeScreenNotFirstRun());
          console.log('Data added to firestore database');
        })
        .catch((error) => {
          console.error('Error adding Google data to Firestore', error);
        });
    } catch (error) {
      console.log('Error while adding new document', error);
    }
  };

  const onSubmit = (data: IncomeFormValues) => {
    console.log(data);
    console.log(typeof data.incomeValue);
    console.log(typeof data.incomeCategory);
    console.log(typeof data.incomeAccount);
    console.log(typeof data.incomeTitle);
    console.log(typeof data.incomeNotes);
    console.log(typeof data.incomeDate);
    console.log(typeof data.incomeCurrency);
    console.log(data.incomeValue);
    console.log(data.incomeCategory);
    console.log(data.incomeAccount);
    console.log(data.incomeTitle);
    console.log(data.incomeNotes);
    console.log(data.incomeDate);
    console.log(data.incomeCurrency);
    addDocument(data);
  };

  const numericValue = 0.0;

  let isIncomeScreenFirstRun = useSelector((state: RootState) => state.name.isIncomeScreenFirstRun);

  //AsyncStorage and firstRun ExpenseScreen

  const setAppAsNotFirstRun = async () => {
    try {
      await AsyncStorage.setItem(isIncomeScreenFirstRunKey, 'false');
    } catch (error) {
      console.error('Error saving in IncomeScreen isFirstRun data: ', error);
    }
  };

  const getAppFirstRunStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(isIncomeScreenFirstRunKey);
      return value === 'false';
    } catch (error) {
      console.error('Error getting in IncomeScreen isFirstRun data: ', error);
      return true;
    }
  };

  const checkFirstRunAndNavigateToMainContent = async () => {
    isIncomeScreenFirstRun = await getAppFirstRunStatus();

    if (isIncomeScreenFirstRun) {
      navigation.navigate('HomeScreenFinal');
      dispatch(navigateToMainContent());
      dispatch(setIncomeScreenNotFirstRun());
    }
  };

  useEffect(() => {
    async function displayAllKeys() {
      try {
        const allkeys = await AsyncStorage.getAllKeys();
        console.log('All keyss  Income Screen in AsyncStorage', allkeys);
      } catch (error) {
        console.error('Error retrieving keys from AsyncStorage:', error);
      }
    }
    displayAllKeys();
  }, []);

  useEffect(() => {
    console.log('Kategoria', universalIncomeCategoryValue);
  }, [universalIncomeCategoryValue]);

  useEffect(() => {
    console.log('KONTO', universalIncomeAccountValue);
  }, [universalIncomeAccountValue]);

  const { isGoogleUserLoggedIn, userGoogleUId } = useSelector(
    (state: RootState) => state.name.isGoogleUser
  );

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user: FirebaseUser | null) => {
      if (user) {
        Alert.alert('User is logged in');
      } else {
        console.log('Użytkownik jest wylogowany');
        Alert.alert('User is not logged in');
      }
    });

    return () => unsubscribe();
  }, [userGoogleUId, isGoogleUserLoggedIn]);

  return (
    <LinearGradient
      start={{ x: 0.3, y: 0.9 }}
      end={{ x: 1, y: 0.2 }}
      colors={['lightblue', 'springgreen', 'seagreen', 'lightslategrey']}
      locations={[0, 0.1, 0.5, 0.9]}
      style={styles.gradient}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.innerHeaderContainer}>
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
          <Text style={{ fontSize: 18, fontWeight: '600', fontFamily: 'serif' }}>
            {t('IncomeScreenHeader')}
          </Text>
        </View>
        <Animated.ScrollView>
          <View style={styles.outerColumnContainer}>
            <View style={styles.innerRowContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'serif',
                  }}
                >
                  {t('IncomeScreenCategoryText')}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'serif',
                  }}
                >
                  {t('IncomeScreenAccountText')}
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
                        defaultButtonText={t('IncomeScreenCategoryDropDownText')}
                        defaultValue={value}
                        data={itemsCategoryIncome}
                        onSelect={(selectedItem: Item) => {
                          setChoosenIncomeCategoryMenuOption([selectedItem.label]);
                          onChange(selectedItem.label);
                          universalIncomeCategoryDependsOnLanguage(
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
                          borderColor: 'lime',
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
                    name="incomeCategory"
                  />
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <SelectDropdown
                        defaultButtonText={t('IncomeScreenAccountDropDownText')}
                        defaultValue={value}
                        data={itemsAccountIncome}
                        onSelect={(selectedItem: Item) => {
                          setChoosenIncomeAccountMenuOption([selectedItem.label]);
                          onChange(selectedItem.label);
                          universalIncomeAccountDependsOnLanguage(
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
                          borderColor: 'lime',
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
                    name="incomeAccount"
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
                    {choosenIncomeCategoryMenuOption}
                  </Text>
                  {errors.incomeCategory && (
                    <Text
                      style={{
                        color: 'red',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                      }}
                    >
                      {errors.incomeCategory.message}
                    </Text>
                  )}
                  <Text style={{ color: 'white', fontSize: 16 }}>
                    {choosenIncomeAccountMenuOption}
                  </Text>
                  {errors.incomeAccount && (
                    <Text
                      style={{
                        color: 'red',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                      }}
                    >
                      {errors.incomeAccount.message}
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
                        width: '75%',
                        borderColor: 'black',
                        borderWidth: 1,
                        marginHorizontal: 1,
                      }}
                      placeholder={t('IncomeScreenTextInputFirst')}
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
                  name="incomeValue"
                />
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SelectDropdown
                      defaultButtonText="currency"
                      buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                      defaultValue={value}
                      data={incomeCurrencies}
                      onSelect={(selectedItem: IncomeCurrencyProps) => {
                        onChange(selectedItem.name);
                      }}
                      buttonTextAfterSelection={(selectedItem: IncomeCurrencyProps) => {
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
                      rowStyle={{ height: 90, padding: 7 }}
                      rowTextForSelection={(item: IncomeCurrencyProps) => item.name}
                      renderCustomizedRowChild={(item: IncomeCurrencyProps) => (
                        <View style={styles.dropdownItem}>
                          <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                          <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                        </View>
                      )}
                    />
                  )}
                  name="incomeCurrency"
                />
              </View>

              <View style={{ flexDirection: 'column' }}>
                {errors.incomeValue && (
                  <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    {errors.incomeValue.message}
                  </Text>
                )}
                {errors.incomeCurrency && (
                  <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    {errors.incomeCurrency.message}
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
                    placeholder={t('IncomeScreenTextInputSecond')}
                    keyboardType="ascii-capable"
                    onChangeText={onChange}
                  />
                )}
                name="incomeTitle"
              />
              {errors.incomeTitle && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.incomeTitle.message}
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
                    placeholder={t('IncomeScreenTextInputThird')}
                    keyboardType="ascii-capable"
                    onChangeText={onChange}
                  />
                )}
                name="incomeNotes"
              />
              {errors.incomeNotes && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.incomeNotes.message}
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
                name="incomeDate"
              />
              {errors.incomeDate && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.incomeDate.message}
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
              <Text style={{ color: 'black' }}>
                {t('IncomeScreenPickedDateText')}
                {dt.toISOString().slice(0, 10)}
              </Text>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  marginVertical: 10,
                }}
              >
                <Pressable style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
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
                </Pressable>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }} />
        </Animated.ScrollView>
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
  },
});

export default IncomeScreen;

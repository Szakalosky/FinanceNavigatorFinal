import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ModalPopUpExpensesUpdate } from '../features/screens/TransactionsScreen';
import { ExpensesFormValues, Item } from '../features/screens/ExpensesScreen';
import { Controller, Resolver, SubmitHandler, useForm } from 'react-hook-form';
import SelectDropdown from 'react-native-select-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import colors from '../features/themes/theme';
import ThemeContext from '../features/themes/themeContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { expensesScreenSchema } from '../schemas/expensesScreenSchema';
import CalendarPicker from 'react-native-calendar-picker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../rootStates/rootState';
import {
  setMainContentScreenExpensesArray,
  setTransactionsScreenExpenseUpdateModal,
} from '../redux/actions';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { User as FirebaseUser } from '@react-native-firebase/auth';

const ExpenseUpdateModal = () => {
  const theme = { mode: 'dark' };
  let activeColors = colors.dark;
  let activeColors2 = colors.light;

  const expensesArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenExpensesArray
  );

  const dispatch = useDispatch();

  const { isOpen, documentId } = useSelector(
    (state: RootState) => state.name.transactionsScreenExpenseUpdateModal
  );

  const toggleExpensesUpdateModal = () => {
    dispatch(setTransactionsScreenExpenseUpdateModal(!isOpen));
  };

  const [nowDate, setNowDate] = useState(new Date());

  const dt = new Date(nowDate);

  const changeDate = (date: any) => {
    setNowDate(date);
  };

  //Translation
  const { t } = useTranslation();

  const [itemsCategory, setItemsCategory] = useState<Item[]>([]);

  const [itemsAccount, setItemsAccount] = useState<Item[]>([]);

  useLayoutEffect(() => {
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
        label: t('ExpensesScreenCategoryDropDownEntertainmentText'),
        value: 'entertainment',
        icon: () => <MCI name="cards-club" size={25} color={'black'} />,
      },
      {
        id: 6,
        label: t('ExpensesScreenCategoryDropDownElectronicsText'),
        value: 'electronics',
        icon: () => <Ionicons name="game-controller" size={25} color={'black'} />,
      },
      {
        id: 7,
        label: t('ExpensesScreenCategoryDropDownEducationText'),
        value: 'education',
        icon: () => <FontAwesome5 name="book" size={25} color={'black'} />,
      },
      {
        id: 8,
        label: t('ExpensesScreenCategoryDropDownGiftsText'),
        value: 'gifts',
        icon: () => <FontAwesome6 name="gift" size={25} color={'black'} />,
      },
      {
        id: 9,
        label: t('ExpensesScreenCategoryDropDownTrainingText'),
        value: 'training',
        icon: () => <MaterialIcons name="sports-tennis" size={25} color={'black'} />,
      },
      {
        id: 10,
        label: t('ExpensesScreenCategoryDropDownHealthText'),
        value: 'health',
        icon: () => <FontAwesome5 name="hand-holding-medical" size={25} color={'black'} />,
      },
      {
        id: 11,
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

  const [choosenExpensesCategoryMenuOption, setChoosenExpensesCategoryMenuOption] = useState<
    string[] | null
  >([]);

  const [choosenExpensesAccountMenuOption, setChoosenExpensesAccountMenuOption] = useState<
    string[] | null
  >([]);

  //Update Expense Form validation

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

  const updateExpenseDocumentById = async (data: ExpensesFormValues) => {
    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.log('User is not logged in');
        Alert.alert('User is not logged in');
      }

      const db = firebase.firestore();
      const expenseDocRef = db.collection('expensesCollection').doc(documentId);
      await expenseDocRef.set(
        {
          expenseValue: data.expenseValue,
          expenseTitle: data.expenseTitle,
          expenseNotes: data.expenseNotes,
          expenseDate: data.expenseDate,
          expenseCategory: data.expenseCategory,
          expenseAccount: data.expenseAccount,
          expenseCurrency: data.expenseCurrency,
          expenseCategoryUniversalValue: universalCategoryValue,
          expenseAccountUniversalValue: universalExpensesAccountValue,
        },
        { merge: true }
      );
      console.log('Expense document updated successfully');
      Alert.alert('Expense was updated');
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
      setTimeout(() => {
        console.log('Checkingg again after 3 seconds');
        ReadUpdatedExpensesDocs(currentUser);
      }, 3000);
    } catch (error) {
      console.error('Error while updating expense document ', error);
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
    updateExpenseDocumentById(data);
  };

  const numericValue = 0.0;

  useEffect(() => {
    console.log('WYRZUCIL', universalCategoryValue);
  }, [universalCategoryValue]);

  useEffect(() => {
    console.log('KONTO', universalExpensesAccountValue);
  }, [universalExpensesAccountValue]);

  const [choosenExpensesCurrencyMenuOption, setChoosenExpensesCurrencyMenuOption] = useState<
    string[] | null
  >([]);

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

  useEffect(() => {
    console.log('Checking expensesArrayOnlyValues,', expensesArrayOnlyValues);
  }, [expensesArrayOnlyValues]);

  const ReadUpdatedExpensesDocs = useCallback(
    async (user) => {
      const expensesCollectionRef = firebase.firestore().collection('expensesCollection');

      const q = await expensesCollectionRef.where('userId', '==', user.uid).get();

      dispatch(
        setMainContentScreenExpensesArray(q.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );
    },
    [dispatch, expensesArrayOnlyValues]
  );

  return (
    <View>
      <ModalPopUpExpensesUpdate visible={isOpen}>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={toggleExpensesUpdateModal}>
              <MaterialIcons name="close" size={40} color={'black'} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
            <View>
              <Text
                style={{
                  width: 100,
                  textAlign: 'center',
                  color: theme.mode ? activeColors.primary : activeColors2.tint,
                }}
              >
                {t('ExpenseUpdateModalHeaderText')} {documentId}
              </Text>
            </View>
            <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
          </View>
        </View>
        <ScrollView>
          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              backgroundColor: 'lightslategrey',
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
                      width: '50%',
                      height: 60,
                      backgroundColor: '#fff',
                      borderColor: 'red',
                      borderWidth: 1,
                    }}
                    rowStyle={{ height: 110 }}
                    rowTextForSelection={(item: Item) => item.label}
                    renderCustomizedRowChild={(item: Item) => (
                      <View style={styles.dropdownItem}>
                        {item.icon && item.icon()}
                        <Text style={{ marginLeft: 5, color: 'black' }}>{item.label}</Text>
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
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.expenseCategory.message}
                </Text>
              )}
              <Text style={{ color: 'white', fontSize: 16 }}>
                {choosenExpensesAccountMenuOption}
              </Text>
              {errors.expenseAccount && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.expenseAccount.message}
                </Text>
              )}
            </View>
            <View
              style={{
                flexDirection: 'column',
                height: 300,
                marginTop: '15%',
                marginLeft: '1%',
                marginRight: '1%',
                justifyContent: 'space-between',
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
                      keyboardType="decimal-pad"
                      onChangeText={(text) => {
                        const formattedText = text.replace(',', '.');
                        const dotCount = formattedText.split('.').length - 1;
                        const dotArray = formattedText.split('.')[1] || '';
                        onChange(numericValue);
                        if (dotCount <= 1 && dotArray[2] === '0') {
                        } else {
                          onChange(formattedText);
                        }
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
                        setChoosenExpensesCurrencyMenuOption([selectedItem.name]);
                        onChange(selectedItem.name);
                      }}
                      buttonTextAfterSelection={(selectedItem: ExpenseCurrencyProps) => {
                        return selectedItem.IconSymbol;
                      }}
                      dropdownStyle={{ borderRadius: 10, flexDirection: 'row' }}
                      buttonStyle={{
                        borderRadius: 10,
                        width: '25%',
                        height: 60,
                        backgroundColor: '#fff',
                        borderColor: 'red',
                        borderWidth: 1,
                      }}
                      rowStyle={{ height: 90, padding: 1 }}
                      rowTextForSelection={(item: ExpenseCurrencyProps) => item.name}
                      renderCustomizedRowChild={(item: ExpenseCurrencyProps) => (
                        <View style={styles.horizontalDropdownItem}>
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
            <View style={{ flexDirection: 'column' }}>
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange } }) => (
                  <CalendarPicker
                    width={320}
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
              <Text style={{ color: 'black' }}>
                {t('ExpensesScreenPickedDateText')} {dt.toISOString().slice(0, 10)}
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
                    {t('ExpenseUpdateButtonText')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ flex: 1, height: 200 }} />
        </ScrollView>
      </ModalPopUpExpensesUpdate>
    </View>
  );
};

export default ExpenseUpdateModal;

const styles = StyleSheet.create({
  modalHeader: {
    width: '100%',
    height: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    justifyContent: 'flex-start',
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
  submitButton: {
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    width: '50%',
    height: 70,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  horizontalDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
});

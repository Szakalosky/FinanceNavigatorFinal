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
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import colors from '../features/themes/theme';
import ThemeContext from '../features/themes/themeContext';
import { yupResolver } from '@hookform/resolvers/yup';
import CalendarPicker from 'react-native-calendar-picker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../rootStates/rootState';
import {
  setMainContentScreenIncomeArray,
  setTransactionsScreenIncomeUpdateModal,
} from '../redux/actions';
import { IncomeFormValues } from '../features/screens/IncomeScreen';
import { incomeScreenSchema } from '../schemas/incomeScreenSchema';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const IncomeUpdateModal = () => {
  const theme = { mode: 'dark' };
  let activeColors = colors.dark;
  let activeColors2 = colors.light;

  const incomeArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenIncomeArray
  );

  const dispatch = useDispatch();

  const { isOpen, documentId } = useSelector(
    (state: RootState) => state.name.transactionsScreenIncomeUpdateModal
  );

  const toggleIncomeUpdateModal = () => {
    dispatch(setTransactionsScreenIncomeUpdateModal(!isOpen));
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

  const [choosenIncomeCategoryMenuOption, setChoosenIncomeCategoryMenuOption] = useState<
    string[] | null
  >([]);

  const [choosenIncomeAccountMenuOption, setChoosenIncomeAccountMenuOption] = useState<
    string[] | null
  >([]);

  //Update Income Form validation

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

  const updateIncomeDocumentById = async (data: IncomeFormValues) => {
    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.log('User is not logged in');
        Alert.alert('User is not logged in');
      }

      const db = firebase.firestore();
      const incomeDocRef = db.collection('incomeCollection').doc(documentId);
      await incomeDocRef.set(
        {
          incomeCategory: data.incomeCategory,
          incomeAccount: data.incomeAccount,
          incomeValue: data.incomeValue,
          incomeTitle: data.incomeTitle,
          incomeNotes: data.incomeNotes,
          incomeDate: data.incomeDate,
          incomeCurrency: data.incomeCurrency,
          incomeCategoryUniversalValue: universalIncomeCategoryValue,
          incomeAccountUniversalValue: universalIncomeAccountValue,
        },
        { merge: true }
      );
      console.log('Income document updated successfully');
      Alert.alert('Income was updated');
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
      setTimeout(() => {
        console.log('Checkingg again after 3 seconds');
        ReadUpdatedIncomeDocs(currentUser);
      }, 3000);
    } catch (error) {
      console.error('Error while updating income document ', error);
    }
  };

  const onSubmit = (data: IncomeFormValues) => {
    updateIncomeDocumentById(data);
  };

  const numericValue = 0.0;

  const [choosenIncomeCurrencyMenuOption, setChoosenIncomeCurrencyMenuOption] = useState<
    string[] | null
  >([]);

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

  useEffect(() => {
    console.log('Checking incomeArrayOnlyValues,', incomeArrayOnlyValues);
  }, [incomeArrayOnlyValues]);

  const ReadUpdatedIncomeDocs = useCallback(
    async (user) => {
      const incomeCollectionRef = firebase.firestore().collection('incomeCollection');

      const q = await incomeCollectionRef.where('userId', '==', user.uid).get();

      dispatch(
        setMainContentScreenIncomeArray(q.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );
    },
    [dispatch, incomeArrayOnlyValues]
  );

  return (
    <View>
      <ModalPopUpExpensesUpdate visible={isOpen}>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={toggleIncomeUpdateModal}>
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
                {t('IncomeUpdateModalHeaderText')} {documentId}
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
                    defaultButtonText={t('IncomeScreenCategoryDropDownText')}
                    defaultValue={value}
                    data={itemsCategory}
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
                name="incomeCategory"
              />
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SelectDropdown
                    defaultButtonText={t('IncomeScreenAccountDropDownText')}
                    defaultValue={value}
                    data={itemsAccount}
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
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.incomeCategory.message}
                </Text>
              )}
              <Text style={{ color: 'white', fontSize: 16 }}>{choosenIncomeAccountMenuOption}</Text>
              {errors.incomeAccount && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.incomeAccount.message}
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
                      placeholder={t('IncomeScreenTextInputFirst')}
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
                        setChoosenIncomeCurrencyMenuOption([selectedItem.name]);
                        onChange(selectedItem.name);
                      }}
                      buttonTextAfterSelection={(selectedItem: IncomeCurrencyProps) => {
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
                      rowTextForSelection={(item: IncomeCurrencyProps) => item.name}
                      renderCustomizedRowChild={(item: IncomeCurrencyProps) => (
                        <View style={styles.horizontalDropdownItem}>
                          <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                          <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                        </View>
                      )}
                    />
                  )}
                  name="incomeCurrency"
                />
              </View>

              <View>
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
                    keyboardType="default"
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
                {t('IncomeScreenPickedDateText')} {dt.toISOString().slice(0, 10)}
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
                    {t('IncomeUpdateButtonText')}
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

export default IncomeUpdateModal;

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

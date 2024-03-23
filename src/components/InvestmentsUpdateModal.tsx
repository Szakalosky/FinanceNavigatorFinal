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
  setMainContentScreenInvestmentsArray,
  setTransactionsScreenInvestmentsUpdateModal,
} from '../redux/actions';
import { InvestmentsFormValues } from '../features/screens/InvestmentsScreen';
import { investmentsScreenSchema } from '../schemas/investmentsScreenSchema';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const InvestmentsUpdateModal = () => {
  const theme = { mode: 'dark' };
  let activeColors = colors.dark;
  let activeColors2 = colors.light;

  const investmentsArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenInvestmentsArray
  );

  const dispatch = useDispatch();

  const { isOpen, documentId } = useSelector(
    (state: RootState) => state.name.transactionsScreenInvestmentsUpdateModal
  );

  const toggleInvestmentsUpdateModal = () => {
    dispatch(setTransactionsScreenInvestmentsUpdateModal(!isOpen));
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
        label: t('InvestmentsScreenCategoryDropDownEducationText'),
        value: 'education',
        icon: () => <MCI name="book-education-outline" size={25} color={'black'} />,
      },
      {
        id: 1,
        label: t('InvestmentsScreenCategoryDropDownSelfText'),
        value: 'self',
        icon: () => <MaterialIcons name="self-improvement" size={25} color={'black'} />,
      },
      {
        id: 2,
        label: t('InvestmentsScreenCategoryDropDownCryptoText'),
        value: 'crypto',
        icon: () => <MCI name="bitcoin" size={25} color={'black'} />,
      },
      {
        id: 3,
        label: t('InvestmentsScreenCategoryDropDownOtherText'),
        value: 'other',
        icon: () => <Foundation name="clipboard-notes" size={25} color={'black'} />,
      },
    ]);
    setItemsAccount([
      {
        id: 0,
        label: t('InvestmentsScreenAccountDropDownFamilyText'),
        value: 'Family account',
        icon: () => <MaterialIcons name="family-restroom" size={25} color={'black'} />,
      },
      {
        id: 1,
        label: t('InvestmentsScreenAccountDropDownPrivateText'),
        value: 'Private account',
        icon: () => <MaterialIcons name="private-connectivity" size={25} color={'black'} />,
      },
      {
        id: 2,
        label: t('InvestmentsScreenAccountDropDownSavingsText'),
        value: 'Savings account',
        icon: () => <MaterialIcons name="savings" size={25} color={'black'} />,
      },
    ]);
  }, [t]);

  const [choosenInvestmentsCategoryMenuOption, setChoosenInvestmentsCategoryMenuOption] = useState<
    string[] | null
  >([]);

  const [choosenInvestmentsAccountMenuOption, setChoosenInvestmentsAccountMenuOption] = useState<
    string[] | null
  >([]);

  //Update Investments Form validation

  const investmentForm = useForm<InvestmentsFormValues>({
    defaultValues: {
      investmentValue: 0,
      investmentTitle: '',
      investmentNotes: '',
      investmentDate: '',
      investmentCategory: '',
      investmentAccount: '',
      investmentCurrency: '',
    },
    resolver: yupResolver(investmentsScreenSchema) as Resolver<InvestmentsFormValues, any>,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const { register, control, handleSubmit, formState } = investmentForm;
  const { errors } = formState;

  const [universalInvestmentCategoryValue, setUniversalInvestmentCategoryValue] = useState<
    string | null
  >(null);

  const universalInvestmentCategoryDependsOnLanguage = (item: string, selectedOption: string) => {
    switch (item) {
      case t('InvestmentsScreenCategoryDropDownEducationText'): {
        setUniversalInvestmentCategoryValue(selectedOption);
        break;
      }
      case t('InvestmentsScreenCategoryDropDownSelfText'): {
        setUniversalInvestmentCategoryValue(selectedOption);
        break;
      }
      case t('InvestmentsScreenCategoryDropDownCryptoText'): {
        setUniversalInvestmentCategoryValue(selectedOption);
        break;
      }
      case t('InvestmentsScreenCategoryDropDownOtherText'): {
        setUniversalInvestmentCategoryValue(selectedOption);
        break;
      }
      default:
        break;
    }
  };

  const [universalInvestmentAccountValue, setUniversalInvestmentAccountValue] = useState<
    string | null
  >(null);

  const universalInvestmentAccountDependsOnLanguage = (item: string, selectedOption: string) => {
    switch (item) {
      case t('InvestmentsScreenAccountDropDownFamilyText'): {
        setUniversalInvestmentAccountValue(selectedOption);
        break;
      }
      case t('InvestmentsScreenAccountDropDownPrivateText'): {
        setUniversalInvestmentAccountValue(selectedOption);
        break;
      }
      case t('InvestmentsScreenAccountDropDownSavingsText'): {
        setUniversalInvestmentAccountValue(selectedOption);
        break;
      }
      default:
        break;
    }
  };

  const updateInvestmentsDocumentById = async (data: InvestmentsFormValues) => {
    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.log('User is not logged in');
        Alert.alert('User is not logged in');
      }

      const db = firebase.firestore();
      const investmentsDocRef = db.collection('investmentsCollection').doc(documentId);
      await investmentsDocRef.set(
        {
          investmentCategory: data.investmentCategory,
          investmentAccount: data.investmentAccount,
          investmentValue: data.investmentValue,
          investmentTitle: data.investmentTitle,
          investmentNotes: data.investmentNotes,
          investmentDate: data.investmentDate,
          investmentCurrency: data.investmentCurrency,
          investmentCategoryUniversalValue: universalInvestmentCategoryValue,
          investmentAccountUniversalValue: universalInvestmentAccountValue,
        },
        { merge: true }
      );
      console.log('Investments document updated successfully');
      Alert.alert('Investments was updated');
      dispatch(
        setMainContentScreenInvestmentsArray([
          {
            investmentCategory: data.investmentCategory,
            investmentAccount: data.investmentAccount,
            investmentValue: data.investmentValue,
            investmentTitle: data.investmentTitle,
            investmentNotes: data.investmentNotes,
            investmentDate: data.investmentDate,
            investmentCurrency: data.investmentCurrency,
            userId: currentUser?.uid,
            investmentCategoryUniversalValue: universalInvestmentCategoryValue,
            investmentAccountUniversalValue: universalInvestmentAccountValue,
          },
        ])
      );
      setTimeout(() => {
        console.log('Checking again after 3 seconds');
        ReadUpdatedInvestmentDocs(currentUser);
      }, 3000);
    } catch (error) {
      console.error('Error while updating investments document ', error);
    }
  };

  const onSubmit = (data: InvestmentsFormValues) => {
    updateInvestmentsDocumentById(data);
  };

  const numericValue = 0.0;

  const [choosenInvestmentsCurrencyMenuOption, setChoosenInvestmentsCurrencyMenuOption] = useState<
    string[] | null
  >([]);

  type InvestmentsCurrencyProps = {
    name: string;
    IconSymbol: string;
  };

  const investmentsCurrencies: InvestmentsCurrencyProps[] = [
    { name: 'PLN', IconSymbol: 'zł' },
    { name: 'EUR', IconSymbol: '€' },
    { name: 'USD', IconSymbol: '$' },
    { name: 'GBP', IconSymbol: '£' },
  ];

  useEffect(() => {
    console.log('Checking investmentsArrayOnlyValues,', investmentsArrayOnlyValues);
  }, [investmentsArrayOnlyValues]);

  const ReadUpdatedInvestmentDocs = useCallback(
    async (user) => {
      const investmentCollectionRef = firebase.firestore().collection('investmentsCollection');

      const q = await investmentCollectionRef.where('userId', '==', user.uid).get();

      dispatch(
        setMainContentScreenInvestmentsArray(q.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );
    },
    [dispatch, investmentsArrayOnlyValues]
  );

  return (
    <View>
      <ModalPopUpExpensesUpdate visible={isOpen}>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={toggleInvestmentsUpdateModal}>
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
                {t('InvestmentUpdateModalHeaderText')} {documentId}
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
                    defaultButtonText={t('InvestmentsScreenCategoryDropDownText')}
                    defaultValue={value}
                    data={itemsCategory}
                    onSelect={(selectedItem: Item) => {
                      setChoosenInvestmentsCategoryMenuOption([selectedItem.label]);
                      onChange(selectedItem.label);
                      universalInvestmentCategoryDependsOnLanguage(
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
                name="investmentCategory"
              />
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SelectDropdown
                    defaultButtonText={t('InvestmentsScreenAccountDropDownText')}
                    defaultValue={value}
                    data={itemsAccount}
                    onSelect={(selectedItem: Item) => {
                      setChoosenInvestmentsAccountMenuOption([selectedItem.label]);
                      onChange(selectedItem.label);
                      universalInvestmentAccountDependsOnLanguage(
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
                name="investmentAccount"
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
                {choosenInvestmentsCategoryMenuOption}
              </Text>
              {errors.investmentCategory && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.investmentCategory.message}
                </Text>
              )}
              <Text style={{ color: 'white', fontSize: 16 }}>
                {choosenInvestmentsAccountMenuOption}
              </Text>
              {errors.investmentAccount && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.investmentAccount.message}
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
                      placeholder={t('InvestmentsScreenTextInputFirst')}
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
                  name="investmentValue"
                />

                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SelectDropdown
                      defaultButtonText="currency"
                      buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                      defaultValue={value}
                      data={investmentsCurrencies}
                      onSelect={(selectedItem: InvestmentsCurrencyProps) => {
                        setChoosenInvestmentsCurrencyMenuOption([selectedItem.name]);
                        onChange(selectedItem.name);
                      }}
                      buttonTextAfterSelection={(selectedItem: InvestmentsCurrencyProps) => {
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
                      rowTextForSelection={(item: InvestmentsCurrencyProps) => item.name}
                      renderCustomizedRowChild={(item: InvestmentsCurrencyProps) => (
                        <View style={styles.horizontalDropdownItem}>
                          <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                          <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                        </View>
                      )}
                    />
                  )}
                  name="investmentCurrency"
                />
              </View>

              <View style={{ flexDirection: 'column' }}>
                {errors.investmentValue && (
                  <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    {errors.investmentValue.message}
                  </Text>
                )}
                {errors.investmentCurrency && (
                  <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    {errors.investmentCurrency.message}
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
                    placeholder={t('InvestmentsScreenTextInputSecond')}
                    keyboardType="ascii-capable"
                    onChangeText={onChange}
                  />
                )}
                name="investmentTitle"
              />
              {errors.investmentTitle && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.investmentTitle.message}
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
                    placeholder={t('InvestmentsScreenTextInputThird')}
                    keyboardType="default"
                    onChangeText={onChange}
                  />
                )}
                name="investmentNotes"
              />
              {errors.investmentNotes && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.investmentNotes.message}
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
                name="investmentDate"
              />
              {errors.investmentDate && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.investmentDate.message}
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
                {t('InvestmentsScreenPickedDateText')} {dt.toISOString().slice(0, 10)}
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
                    {t('InvestmentUpdateButonText')}
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

export default InvestmentsUpdateModal;

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
    borderWidth: 1,
    marginHorizontal: 1,
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

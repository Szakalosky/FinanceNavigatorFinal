import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ModalPopUpExpensesUpdate } from '../features/screens/TransactionsScreen';
import { ExpensesFormValues, Item } from '../features/screens/ExpensesScreen';
import { Controller, Resolver, useForm } from 'react-hook-form';
import SelectDropdown from 'react-native-select-dropdown';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import colors from '../features/themes/theme';
import { yupResolver } from '@hookform/resolvers/yup';
import CalendarPicker from 'react-native-calendar-picker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../rootStates/rootState';
import {
  setMainContentScreenSavingsArray,
  setTransactionsScreenSavingsUpdateModal,
} from '../redux/actions';
import { SavingsFormValues } from '../features/screens/SavingsScreen';
import { savingsScreenSchema } from '../schemas/savingsScreenSchema';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const SavingsUpdateModal = () => {
  const theme = { mode: 'dark' };
  let activeColors = colors.dark;
  let activeColors2 = colors.light;

  const savingsArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenSavingsArray
  );

  const dispatch = useDispatch();

  const { isOpen, documentId } = useSelector(
    (state: RootState) => state.name.transactionsScreenSavingsUpdateModal
  );

  const toggleSavingsUpdateModal = () => {
    dispatch(setTransactionsScreenSavingsUpdateModal(!isOpen));
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
        label: t('SavingsScreenCategoryDropDownCashbackText'),
        value: 'cashback',
        icon: () => <MCI name="cash-refund" size={25} color={'black'} />,
      },
      {
        id: 1,
        label: t('SavingsScreenCategoryDropDownSTPurposesText'),
        value: 'st-purposes',
        icon: () => <MCI name="clipboard-text" size={25} color={'black'} />,
      },
      {
        id: 2,
        label: t('SavingsScreenCategoryDropDownLTPurposesText'),
        value: 'lt-purposes',
        icon: () => <MCI name="clipboard-text-clock" size={25} color={'black'} />,
      },
      {
        id: 3,
        label: t('SavingsScreenCategoryDropDownCryptoText'),
        value: 'crypto',
        icon: () => <MCI name="bitcoin" size={25} color={'black'} />,
      },
      {
        id: 4,
        label: t('SavingsScreenCategoryDropDownOtherText'),
        value: 'other',
        icon: () => <Foundation name="clipboard-notes" size={25} color={'black'} />,
      },
    ]);
    setItemsAccount([
      {
        id: 0,
        label: t('SavingsScreenAccountDropDownFamilyText'),
        value: 'Family account',
        icon: () => <MaterialIcons name="family-restroom" size={25} color={'black'} />,
      },
      {
        id: 1,
        label: t('SavingsScreenAccountDropDownPrivateText'),
        value: 'Private account',
        icon: () => <MaterialIcons name="private-connectivity" size={25} color={'black'} />,
      },
      {
        id: 2,
        label: t('SavingsScreenAccountDropDownSavingsText'),
        value: 'Savings account',
        icon: () => <MaterialIcons name="savings" size={25} color={'black'} />,
      },
    ]);
  }, [t]);

  const [choosenSavingsCategoryMenuOption, setChoosenSavingsCategoryMenuOption] = useState<
    string[] | null
  >([]);

  const [choosenSavingsAccountMenuOption, setChoosenSavingsAccountMenuOption] = useState<
    string[] | null
  >([]);

  //Update Savings Form validation

  const savingsForm = useForm<SavingsFormValues>({
    defaultValues: {
      savingsValue: 0,
      savingsTitle: '',
      savingsNotes: '',
      savingsDate: '',
      savingsCategory: '',
      savingsAccount: '',
      savingsCurrency: '',
    },
    resolver: yupResolver(savingsScreenSchema) as Resolver<SavingsFormValues, any>,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const { register, control, handleSubmit, formState } = savingsForm;
  const { errors } = formState;

  const [universalSavingsCategoryValue, setUniversalSavingsCategoryValue] = useState<string | null>(
    null
  );

  const universalSavingsCategoryDependsOnLanguage = (item: string, selectedOption: string) => {
    switch (item) {
      case t('SavingsScreenCategoryDropDownCashbackText'): {
        setUniversalSavingsCategoryValue(selectedOption);
        break;
      }
      case t('SavingsScreenCategoryDropDownSTPurposesText'): {
        setUniversalSavingsCategoryValue(selectedOption);
        break;
      }
      case t('SavingsScreenCategoryDropDownLTPurposesText'): {
        setUniversalSavingsCategoryValue(selectedOption);
        break;
      }
      case t('SavingsScreenCategoryDropDownCryptoText'): {
        setUniversalSavingsCategoryValue(selectedOption);
        break;
      }
      case t('SavingsScreenCategoryDropDownOtherText'): {
        setUniversalSavingsCategoryValue(selectedOption);
        break;
      }
      default:
        break;
    }
  };

  const [universalSavingsAccountValue, setUniversalSavingsAccountValue] = useState<string | null>(
    null
  );

  const universalSavingsAccountDependsOnLanguage = (item: string, selectedOption: string) => {
    switch (item) {
      case t('SavingsScreenAccountDropDownFamilyText'): {
        setUniversalSavingsAccountValue(selectedOption);
        break;
      }
      case t('SavingsScreenAccountDropDownPrivateText'): {
        setUniversalSavingsAccountValue(selectedOption);
        break;
      }
      case t('SavingsScreenAccountDropDownSavingsText'): {
        setUniversalSavingsAccountValue(selectedOption);
        break;
      }
      default:
        break;
    }
  };

  const updateSavingsDocumentById = async (data: SavingsFormValues) => {
    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.log('User is not logged in');
        Alert.alert('User is not logged in');
      }

      const db = firebase.firestore();
      const savingsDocRef = db.collection('savingsCollection').doc(documentId);
      await savingsDocRef.set(
        {
          savingsCategory: data.savingsCategory,
          savingsAccount: data.savingsAccount,
          savingsValue: data.savingsValue,
          savingsTitle: data.savingsTitle,
          savingsNotes: data.savingsNotes,
          savingsDate: data.savingsDate,
          savingsCurrency: data.savingsCurrency,
          savingsCategoryUniversalValue: universalSavingsCategoryValue,
          savingsAccountUniversalValue: universalSavingsAccountValue,
        },
        { merge: true }
      );
      console.log('Savings document updated successfully');
      Alert.alert('Savings were updated');
      dispatch(
        setMainContentScreenSavingsArray([
          {
            savingsCategory: data.savingsCategory,
            savingsAccount: data.savingsAccount,
            savingsValue: data.savingsValue,
            savingsTitle: data.savingsTitle,
            savingsNotes: data.savingsNotes,
            savingsDate: data.savingsDate,
            savingsCurrency: data.savingsCurrency,
            userId: currentUser?.uid,
            savingsCategoryUniversalValue: universalSavingsCategoryValue,
            savingsAccountUniversalValue: universalSavingsAccountValue,
          },
        ])
      );
      setTimeout(() => {
        console.log('Checking again after 3 seconds');
        ReadUpdatedSavingsDocs(currentUser);
      }, 3000);
    } catch (error) {
      console.error('Error while updating savings document ', error);
    }
  };

  const onSubmit = (data: SavingsFormValues) => {
    updateSavingsDocumentById(data);
  };

  const numericValue = 0.0;

  const [choosenSavingsCurrencyMenuOption, setChoosenSavingsCurrencyMenuOption] = useState<
    string[] | null
  >([]);

  type SavingsCurrencyProps = {
    name: string;
    IconSymbol: string;
  };

  const savingsCurrencies: SavingsCurrencyProps[] = [
    { name: 'PLN', IconSymbol: 'zł' },
    { name: 'EUR', IconSymbol: '€' },
    { name: 'USD', IconSymbol: '$' },
    { name: 'GBP', IconSymbol: '£' },
  ];

  useEffect(() => {
    console.log('Checking savingsArrayOnlyValues,', savingsArrayOnlyValues);
  }, [savingsArrayOnlyValues]);

  const ReadUpdatedSavingsDocs = useCallback(
    async (user) => {
      const savingsCollectionRef = firebase.firestore().collection('savingsCollection');

      const q = await savingsCollectionRef.where('userId', '==', user.uid).get();

      dispatch(
        setMainContentScreenSavingsArray(q.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );
    },
    [dispatch, savingsArrayOnlyValues]
  );

  return (
    <View>
      <ModalPopUpExpensesUpdate visible={isOpen}>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={toggleSavingsUpdateModal}>
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
                {t('SavingsUpdateModalHeaderText')} {documentId}
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
                    defaultButtonText={t('SavingsScreenCategoryDropDownText')}
                    defaultValue={value}
                    data={itemsCategory}
                    onSelect={(selectedItem: Item) => {
                      setChoosenSavingsCategoryMenuOption([selectedItem.label]);
                      onChange(selectedItem.label);
                      universalSavingsCategoryDependsOnLanguage(
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
                name="savingsCategory"
              />
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SelectDropdown
                    defaultButtonText={t('SavingsScreenAccountDropDownText')}
                    defaultValue={value}
                    data={itemsAccount}
                    onSelect={(selectedItem: Item) => {
                      setChoosenSavingsAccountMenuOption([selectedItem.label]);
                      onChange(selectedItem.label);
                      universalSavingsAccountDependsOnLanguage(
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
                name="savingsAccount"
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
                {choosenSavingsCategoryMenuOption}
              </Text>
              {errors.savingsCategory && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.savingsCategory.message}
                </Text>
              )}
              <Text style={{ color: 'white', fontSize: 16 }}>
                {choosenSavingsAccountMenuOption}
              </Text>
              {errors.savingsAccount && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.savingsAccount.message}
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
                      placeholder={t('SavingsScreenTextInputFirst')}
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
                  name="savingsValue"
                />
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SelectDropdown
                      defaultButtonText="currency"
                      buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                      defaultValue={value}
                      data={savingsCurrencies}
                      onSelect={(selectedItem: SavingsCurrencyProps) => {
                        setChoosenSavingsCurrencyMenuOption([selectedItem.name]);
                        onChange(selectedItem.name);
                      }}
                      buttonTextAfterSelection={(selectedItem: SavingsCurrencyProps) => {
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
                      rowTextForSelection={(item: SavingsCurrencyProps) => item.name}
                      renderCustomizedRowChild={(item: SavingsCurrencyProps) => (
                        <View style={styles.horizontalDropdownItem}>
                          <Text style={{ marginLeft: 10, color: 'black' }}>{item.IconSymbol}</Text>
                          <Text style={{ marginLeft: 10, color: 'black' }}>{item.name}</Text>
                        </View>
                      )}
                    />
                  )}
                  name="savingsCurrency"
                />
              </View>

              <View style={{ flexDirection: 'column' }}>
                {errors.savingsValue && (
                  <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    {errors.savingsValue.message}
                  </Text>
                )}
                {errors.savingsCurrency && (
                  <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    {errors.savingsCurrency.message}
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
                    placeholder={t('SavingsScreenTextInputSecond')}
                    keyboardType="ascii-capable"
                    onChangeText={onChange}
                  />
                )}
                name="savingsTitle"
              />
              {errors.savingsTitle && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.savingsTitle.message}
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
                    placeholder={t('SavingsScreenTextInputThird')}
                    keyboardType="default"
                    onChangeText={onChange}
                  />
                )}
                name="savingsNotes"
              />
              {errors.savingsNotes && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.savingsNotes.message}
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
                name="savingsDate"
              />
              {errors.savingsDate && (
                <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                  {errors.savingsDate.message}
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
                {t('SavingsScreenPickedDateText')} {dt.toISOString().slice(0, 10)}
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
                    {t('SavingsUpdateButtonText')}
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

export default SavingsUpdateModal;

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

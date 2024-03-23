import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import CalendarPicker from 'react-native-calendar-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorList } from '../types/Navigator';
import { useTranslation } from 'react-i18next';
import { Item } from './ExpensesScreen';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { investmentsScreenSchema } from '../../schemas/investmentsScreenSchema';
import SelectDropdown from 'react-native-select-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import {
  navigateToMainContent,
  setInvestmentScreenNotFirstRun,
  setMainContentScreenInvestmentsArray,
} from '../../redux/actions';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { RootState } from '../../rootStates/rootState';
import { User as FirebaseUser } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<NavigatorList, 'HomeScreen'>;

export type InvestmentsFormValues = {
  investmentValue: number;
  investmentTitle: string;
  investmentNotes: string;
  investmentDate: string;
  investmentCategory: string;
  investmentAccount: string;
  investmentCurrency: string;
};

const isInvestmentScreenFirstRunKey = '@MyApp:isInvestmentScreenFirstRun';

const InvestmentsScreen: React.FC<Props> = ({ navigation }) => {
  const [nowDate, setNowDate] = useState(new Date());

  const dt = new Date(nowDate);
  const changeDate = (date: any) => {
    setNowDate(date);
  };

  //Translation
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [itemsCategoryInvestment, setItemsCategoryInvestment] = useState<Item[]>([]);

  const [itemsAccountInvestment, setItemsAccountInvestment] = useState<Item[]>([]);

  useEffect(() => {
    setItemsCategoryInvestment([
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
    setItemsAccountInvestment([
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

  type InvestmentCurrencyProps = {
    name: string;
    IconSymbol: string;
  };

  const savingsCurrencies: InvestmentCurrencyProps[] = [
    { name: 'PLN', IconSymbol: 'zł' },
    { name: 'EUR', IconSymbol: '€' },
    { name: 'USD', IconSymbol: '$' },
    { name: 'GBP', IconSymbol: '£' },
  ];

  const [choosenInvestmentsCategoryMenuOption, setChoosenInvestmentsCategoryMenuOption] = useState<
    string[] | undefined
  >([]);

  const [choosenInvestmentsAccountMenuOption, setChoosenInvestmentsAccountMenuOption] = useState<
    string[] | undefined
  >([]);

  const investmentsForm = useForm<InvestmentsFormValues>({
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

  const { register, control, handleSubmit, formState } = investmentsForm;
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

  const addDocument = async (data: InvestmentsFormValues) => {
    //add data to firestore database
    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.log('User is not logged in');
        Alert.alert('User is not logged in');
      }

      const investmentsCollectionRef = firebase.firestore().collection('investmentsCollection');

      await investmentsCollectionRef
        .add({
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
        })
        .then(() => {
          console.log('Data were added to firestore');
          Alert.alert('Investment was added');
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
          setAppAsNotFirstRun();

          checkFirstRunAndNavigatoeToMainContent();
          dispatch(setInvestmentScreenNotFirstRun());
          console.log('Data added to firestore database');
        })
        .catch((error) => {
          console.error('Error adding Google data to Firestore', error);
        });
    } catch (error) {
      console.log('Error while adding new document', error);
    }
  };

  const onSubmit = (data: InvestmentsFormValues) => {
    console.log(data);
    console.log(typeof data.investmentValue);
    console.log(typeof data.investmentCategory);
    console.log(typeof data.investmentAccount);
    console.log(typeof data.investmentTitle);
    console.log(typeof data.investmentNotes);
    console.log(typeof data.investmentDate);
    console.log(typeof data.investmentCurrency);
    console.log(data.investmentValue);
    console.log(data.investmentCategory);
    console.log(data.investmentAccount);
    console.log(data.investmentTitle);
    console.log(data.investmentNotes);
    console.log(data.investmentDate);
    console.log(data.investmentCurrency);
    addDocument(data);
  };

  const numericValue = 0.0;

  let isInvestmentScreenFirstRun = useSelector(
    (state: RootState) => state.name.isInvestmentScreenFirstRun
  );

  const setAppAsNotFirstRun = async () => {
    try {
      await AsyncStorage.setItem(isInvestmentScreenFirstRunKey, 'false');
    } catch (error) {
      console.error('Error saving in InvestmentScreen isFirstRun data: ', error);
    }
  };

  const getAppFirstRunStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(isInvestmentScreenFirstRunKey);
      return value === null;
    } catch (error) {
      console.error('Error getting in InvestmentScreen isFirstRun data: ', error);
      return true;
    }
  };

  const checkFirstRunAndNavigatoeToMainContent = async () => {
    isInvestmentScreenFirstRun = await getAppFirstRunStatus();

    if (!isInvestmentScreenFirstRun) {
      navigation.navigate('HomeScreenFinal');
      dispatch(navigateToMainContent());
      dispatch(setInvestmentScreenNotFirstRun());
    }
  };

  useEffect(() => {
    console.log('KATE', universalInvestmentCategoryValue);
  }, [universalInvestmentCategoryValue]);

  useEffect(() => {
    console.log('KONTO', universalInvestmentAccountValue);
  }, [universalInvestmentAccountValue]);

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

  return (
    <LinearGradient
      start={{ x: 0.3, y: 0.9 }}
      end={{ x: 1, y: 0.2 }}
      colors={['aquamarine', 'deepskyblue', 'royalblue', 'dimgrey']}
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
            onPress={() => navigation.navigate('HomeScreenFinal')}
          >
            <AntDesign name="arrowleft" size={30} color={'black'} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600', fontFamily: 'serif' }}>
            {t('InvestmentsScreenHeader')}
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
                  {t('InvestmentsScreenCategoryText')}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'serif',
                  }}
                >
                  {t('InvestmentsScreenAccountText')}
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
                        defaultButtonText={t('InvestmentsScreenCategoryDropDownText')}
                        defaultValue={value}
                        data={itemsCategoryInvestment}
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
                          width: '45%',
                          height: 60,
                          backgroundColor: '#fff',
                          borderColor: 'blue',
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
                    name="investmentCategory"
                  />
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <SelectDropdown
                        defaultButtonText={t('InvestmentsScreenAccountDropDownText')}
                        defaultValue={value}
                        data={itemsAccountInvestment}
                        onSelect={(selectedItem: Item) => {
                          setChoosenInvestmentsAccountMenuOption([selectedItem.label]);
                          onChange(selectedItem.label);
                          universalInvestmentAccountDependsOnLanguage(
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
                          borderColor: 'blue',
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
                    <Text
                      style={{
                        color: 'red',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                      }}
                    >
                      {errors.investmentCategory.message}
                    </Text>
                  )}
                  <Text style={{ color: 'white', fontSize: 16 }}>
                    {choosenInvestmentsAccountMenuOption}
                  </Text>
                  {errors.investmentAccount && (
                    <Text
                      style={{
                        color: 'red',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                      }}
                    >
                      {errors.investmentAccount.message}
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
                      placeholder={t('InvestmentsScreenTextInputFirst')}
                      keyboardType="number-pad"
                      onChangeText={(text: string) => {
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
                      data={savingsCurrencies}
                      onSelect={(selectedItem: InvestmentCurrencyProps) => {
                        onChange(selectedItem.name);
                      }}
                      buttonTextAfterSelection={(selectedItem: InvestmentCurrencyProps) => {
                        return selectedItem.IconSymbol;
                      }}
                      dropdownStyle={{ borderRadius: 10 }}
                      buttonStyle={{
                        borderRadius: 10,
                        width: '25%',
                        height: 60,
                        backgroundColor: '#fff',
                        borderColor: 'blue',
                        borderWidth: 1,
                      }}
                      rowStyle={{ height: 90, padding: 7 }}
                      rowTextForSelection={(item: InvestmentCurrencyProps) => item.name}
                      renderCustomizedRowChild={(item: InvestmentCurrencyProps) => (
                        <View style={styles.dropdownItem}>
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
                    keyboardType="ascii-capable"
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
                {t('InvestmentsScreenPickedDateText')}
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
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
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

export default InvestmentsScreen;

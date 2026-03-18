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
import React, { useCallback, useEffect, useState } from 'react';
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
import { savingsScreenSchema } from '../../schemas/savingsScreenSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectDropdown from 'react-native-select-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import {
  navigateToMainContent,
  setConnectedState,
  setIncomeScreenNotFirstRun,
  setMainContentScreenSavingsArray,
  setSavingsScreenNotFirstRun,
} from '../../redux/actions';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { RootState } from '../../rootStates/rootState';
import { User as FirebaseUser } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

type Props = NativeStackScreenProps<NavigatorList, 'HomeScreen'>;

const isSavingsScreenFirstRunKey = '@MyApp:isSavingsScreenFirstRun';

export type SavingsFormValues = {
  savingsValue: number;
  savingsTitle: string;
  savingsNotes: string;
  savingsDate: string;
  savingsCategory: string;
  savingsAccount: string;
  savingsCurrency: string;
};

const SavingsScreen: React.FC<Props> = ({ navigation }) => {
  const [nowDate, setNowDate] = useState(new Date());

  const dt = new Date(nowDate);

  const changeDate = (date: any) => {
    setNowDate(date);
  };

  //Translation
  const { t } = useTranslation();

  const savingsArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenSavingsArray
  );

  const dispatch = useDispatch();

  const [itemsCategorySavings, setItemsCategorySavings] = useState<Item[]>([]);

  const [itemsAccountSavings, setItemsAccountSavings] = useState<Item[]>([]);

  useEffect(() => {
    setItemsCategorySavings([
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
    setItemsAccountSavings([
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

  const [choosenSavingsCategoryMenuOption, setChoosenSavingsCategoryMenuOption] = useState<
    string[] | undefined
  >([]);

  const [choosenSavingsAccountMenuOption, setChoosenSavingsAccountMenuOption] = useState<
    string[] | undefined
  >([]);

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

  const addDocument = async (data: SavingsFormValues) => {
    //add data to firestore database
    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.log('User is not logged in');
        Alert.alert('User is not logged in');
      }

      const savingsCollectionRef = firebase.firestore().collection('savingsCollection');

      await savingsCollectionRef
        .add({
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
        })
        .then(() => {
          console.log('Google data were added to firestore');
          Alert.alert('Savings were added');
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
          setAppAsNotFirstRun();

          checkFirstRunAndNavigatoeToMainContent();
          dispatch(setSavingsScreenNotFirstRun());
          console.log('Data added to firestore database');
        })
        .catch((error) => {
          console.error('Error adding Google data to Firestore', error);
        });
    } catch (error) {
      console.log('Error while adding new document', error);
    }
  };

  const onSubmit = (data: SavingsFormValues) => {
    console.log(data);
    console.log(typeof data.savingsValue);
    console.log(typeof data.savingsCategory);
    console.log(typeof data.savingsAccount);
    console.log(typeof data.savingsTitle);
    console.log(typeof data.savingsNotes);
    console.log(typeof data.savingsDate);
    console.log(typeof data.savingsCurrency);
    console.log(data.savingsValue);
    console.log(data.savingsCategory);
    console.log(data.savingsAccount);
    console.log(data.savingsTitle);
    console.log(data.savingsNotes);
    console.log(data.savingsDate);
    console.log(data.savingsCurrency);
    addDocument(data);
  };

  const numericValue = 0.0;

  let isSavingsScreenFirstRun = useSelector(
    (state: RootState) => state.name.isSavingsScreenFirstRun
  );

  const setAppAsNotFirstRun = async () => {
    try {
      await AsyncStorage.setItem(isSavingsScreenFirstRunKey, 'false');
    } catch (error) {
      console.error('Error saving in SavingsScreen isFirstRun data: ', error);
    }
  };

  const getAppFirstRunStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(isSavingsScreenFirstRunKey);
      return value === null;
    } catch (error) {
      console.error('Error getting in SavingsScreen isFirstRun data: ', error);
      return true;
    }
  };

  const checkFirstRunAndNavigatoeToMainContent = async () => {
    isSavingsScreenFirstRun = await getAppFirstRunStatus();

    if (!isSavingsScreenFirstRun) {
      navigation.navigate('HomeScreenFinal');
      dispatch(navigateToMainContent());
      dispatch(setSavingsScreenNotFirstRun());
    }
  };

  useEffect(() => {
    console.log('CATEGORY', universalSavingsCategoryValue);
  }, [universalSavingsCategoryValue]);

  useEffect(() => {
    console.log('ACCOUNT', universalSavingsAccountValue);
  }, [universalSavingsAccountValue]);

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

  const [isConnected, setIsConnected] = useState<boolean | null>(false);
  const [hasConnectionForFiveSecs, setHasConnectionForFiveSecs] = useState<boolean>(false);

  const checkNetworkConn = useSelector((state: RootState) => state.name.isConnectedToNetwork);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      dispatch(setConnectedState(state.isConnected));

      if (state.isConnected) {
        const onlineTimeout = setTimeout(() => {
          setHasConnectionForFiveSecs(true);
        }, 5000);

        return () => clearTimeout(onlineTimeout);
      } else {
        setHasConnectionForFiveSecs(false);
        Alert.alert('Turn on mobile data or Wi-Fi');
      }
    });

    return () => unsubscribe();
  }, [isConnected, checkNetworkConn]);

  return (
    <LinearGradient
      start={{ x: 0.3, y: 0.9 }}
      end={{ x: 1, y: 0.2 }}
      colors={['lightblue', 'gold', 'yellow', 'slategray']}
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
            {t('SavingsScreenHeader')}
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
                  {t('SavingsScreenCategoryText')}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'serif',
                  }}
                >
                  {t('SavingsScreenAccountText')}
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
                        defaultButtonText={t('SavingsScreenCategoryDropDownText')}
                        defaultValue={value}
                        data={itemsCategorySavings}
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
                          width: '45%',
                          height: 60,
                          backgroundColor: '#fff',
                          borderColor: 'yellow',
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
                    name="savingsCategory"
                  />
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <SelectDropdown
                        defaultButtonText={t('SavingsScreenAccountDropDownText')}
                        defaultValue={value}
                        data={itemsAccountSavings}
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
                          borderColor: 'yellow',
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
                    <Text
                      style={{
                        color: 'red',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                      }}
                    >
                      {errors.savingsCategory.message}
                    </Text>
                  )}
                  <Text style={{ color: 'white', fontSize: 16 }}>
                    {choosenSavingsAccountMenuOption}
                  </Text>
                  {errors.savingsAccount && (
                    <Text
                      style={{
                        color: 'red',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                      }}
                    >
                      {errors.savingsAccount.message}
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
                      placeholder={t('SavingsScreenTextInputFirst')}
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
                      defaultButtonText={t('currencyText')}
                      buttonTextStyle={{ fontSize: 14, flexWrap: 'wrap' }}
                      defaultValue={value}
                      data={savingsCurrencies}
                      onSelect={(selectedItem: SavingsCurrencyProps) => {
                        onChange(selectedItem.name);
                      }}
                      buttonTextAfterSelection={(selectedItem: SavingsCurrencyProps) => {
                        return selectedItem.IconSymbol;
                      }}
                      dropdownStyle={{ borderRadius: 10 }}
                      buttonStyle={{
                        borderRadius: 10,
                        width: '25%',
                        height: 60,
                        backgroundColor: '#fff',
                        borderColor: 'yellow',
                        borderWidth: 1,
                      }}
                      rowStyle={{ height: 90, padding: 7 }}
                      rowTextForSelection={(item: SavingsCurrencyProps) => item.name}
                      renderCustomizedRowChild={(item: SavingsCurrencyProps) => (
                        <View style={styles.dropdownItem}>
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
                    keyboardType="ascii-capable"
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

export default SavingsScreen;

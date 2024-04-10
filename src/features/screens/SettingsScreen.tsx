import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Switch,
  Linking,
} from 'react-native';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import SelectDropdown from 'react-native-select-dropdown';
import ModalPopUp from '../../components/ModalPopUp';
import ThemeContext from '../themes/themeContext';
import colors from '../themes/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorList } from '../types/Navigator';
import { useTranslation } from 'react-i18next';
import i18next, { languageResources } from '../../../src/services/i18next';
import languagesList from '../../../src/services/languagesList.json';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../rootStates/rootState';
import {
  getGoogleAccountName,
  setCurrency,
  setCurrencyAsMainFromSettingsToAsyncStorage,
  setGoogleUserFromSettingsScreen,
  setKeepUserLoggedIn,
  setLanguageFromSettingsToAsyncStorage,
  setResetAllDataFromAsyncStorage,
  setSettingsScreenActualCurrency,
  setSettingsScreenExpenseNotifications,
} from '../../redux/actions';
import { version } from '../../../package.json';
import DatePicker from 'react-native-date-picker';
import NotifService from '../../notifications/NotifService';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../../database/firebase.config';
import { ScrollView } from 'react-native';
import RNFS from 'react-native-fs';
import ModalPopUpPrivacyPolicy from '../../components/ModalPopUpPrivacyPolicy';
import PrivacyPolicyEN from '../../privacyPolicy/PrivacyPolicyEN';
import { User as FirebaseUser } from '@react-native-firebase/auth';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { reviewStarScreenSchema } from '../../schemas/customStarSchema';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import Questions from '../../faqQuestions/Questions';

type Props = NativeStackScreenProps<NavigatorList, 'HomeScreen'>;

export type ReviewStarFormValues = {
  reviewStarValue: number;
};

export type ReviewStarProps = {
  starValue: number;
  reviewOnChange: (a: number) => void;
};

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  //Choose language
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const toggleCurrencyModal = () => {
    setShowCurrencyModal(!showCurrencyModal);
  };

  const toggleLanguageModal = () => {
    setShowLanguageModal(!showLanguageModal);
  };

  const toggleNotificationsModal = () => {
    setShowNotificationsModal(!showNotificationsModal);
  };

  //Change currencies
  const currencies = [
    { name: 'PLN', IconSymbol: 'zł' },
    { name: 'EUR', IconSymbol: '€' },
    { name: 'USD', IconSymbol: '$' },
    { name: 'GBP', IconSymbol: '£' },
  ];
  const polishZloty = [{ name: 'PLN', IconSymbol: 'zł' }];

  const currencySymbols1 = [{ name: 'GBP', IconSymbol: 'pound' }];
  const currencySymbols2 = [{ name: 'USD', IconSymbol: 'dollar' }];
  const currencySymbols3 = [{ name: 'EUR', IconSymbol: 'euro' }];

  //Exchange Rate
  const [showExchangeRate, setShowExchangeRate] = useState(false);
  const toggleExchangeModal = () => {
    setShowExchangeRate(!showExchangeRate);
  };

  const [mainCurrency, setMainCurrency] = useState('PLN');
  const [secondCurrency, setSecondCurrency] = useState('EUR');

  const currenciesOptions = currencies.map((currency) => currency.name);

  const nextFlags = [
    {
      currency: 'polish',
      image: require('../../assets/images/Poland_flag1.png'),
    },
    { currency: 'euro', image: require('../../assets/images/euro_flag1.png') },
    { currency: 'america', image: require('../../assets/images/us_flag1.jpg') },
    { currency: 'british', image: require('../../assets/images/gb_flag1.jpg') },
  ];

  const initialCurrency = currencies[0].name;
  const [selectedCurrencyOptionRadioButton, setSelectedCurrencyOptionRadioButton] =
    useState(initialCurrency);

  const activateCurrencyRadioButton = useCallback((option: string) => {
    setSelectedCurrencyOptionRadioButton(option);
    dispatch(setCurrencyAsMainFromSettingsToAsyncStorage(option));
  }, []);

  const [selectedLanguageOptionRadioButton, setSelectedLanguageOptionRadioButton] = useState('en');

  const activateLanguageRadioButton = (option: string) => {
    i18next.changeLanguage(option);
    setSelectedLanguageOptionRadioButton(option);
    dispatch(setLanguageFromSettingsToAsyncStorage(option));
  };

  const theme = { mode: 'dark' };
  let activeColors = colors.dark;
  let activeColors2 = colors.light;

  const [currentFlagMainCurrency, setCurrentFlagMainCurrency] = useState(
    nextFlags.find((flag) => flag.currency === 'polish')
  );

  const [currentFlagSecondCurrency, setCurrentFlagSecondCurrency] = useState(
    nextFlags.find((flag) => flag.currency === 'euro')
  );

  const changeMainCurrency = () => {
    const polishCurrency = polishZloty.find((symbol) => symbol.name === mainCurrency);
    const euroCurrency = currencySymbols3.find((symbol) => symbol.name === mainCurrency);
    const usCurrency = currencySymbols2.find((symbol) => symbol.name === mainCurrency);
    const ukCurrency = currencySymbols1.find((symbol) => symbol.name === mainCurrency);

    if (polishCurrency) {
      setCurrentFlagMainCurrency(nextFlags.find((flag) => flag.currency === 'polish'));
    }

    if (euroCurrency) {
      setCurrentFlagMainCurrency(nextFlags.find((flag) => flag.currency === 'euro'));
    }

    if (usCurrency) {
      setCurrentFlagMainCurrency(nextFlags.find((flag) => flag.currency === 'america'));
    }

    if (ukCurrency) {
      setCurrentFlagMainCurrency(nextFlags.find((flag) => flag.currency === 'british'));
    }
  };

  const changeSecondCurrency = () => {
    const polishCurrency = polishZloty.find((symbol) => symbol.name === secondCurrency);
    const euroCurrency = currencySymbols3.find((symbol) => symbol.name === secondCurrency);
    const usCurrency = currencySymbols2.find((symbol) => symbol.name === secondCurrency);
    const ukCurrency = currencySymbols1.find((symbol) => symbol.name === secondCurrency);

    if (polishCurrency) {
      setCurrentFlagSecondCurrency(nextFlags.find((flag) => flag.currency === 'polish'));
    }

    if (euroCurrency) {
      setCurrentFlagSecondCurrency(nextFlags.find((flag) => flag.currency === 'euro'));
    }

    if (usCurrency) {
      setCurrentFlagSecondCurrency(nextFlags.find((flag) => flag.currency === 'america'));
    }

    if (ukCurrency) {
      setCurrentFlagSecondCurrency(nextFlags.find((flag) => flag.currency === 'british'));
    }
  };

  const newCurrency = mainCurrency;
  const newFlag = currentFlagMainCurrency;

  const reverseRate = () => {
    setMainCurrency(secondCurrency);

    setSecondCurrency(newCurrency);

    setCurrentFlagMainCurrency(currentFlagSecondCurrency);
    console.log(currentFlagSecondCurrency);
    setCurrentFlagSecondCurrency(newFlag);
    console.log(newFlag);
    console.log(secondCurrency);
    console.log(newCurrency);
  };

  useEffect(() => {
    changeMainCurrency();
    changeSecondCurrency();
  }, [mainCurrency, secondCurrency]);

  //Rate us modal
  const [showRateUsModal, setShowRateUsModal] = useState(false);
  const toggleRateUsModal = () => {
    setShowRateUsModal(!showRateUsModal);
  };

  const [selectedStarOptionButton, setSelectedStarOptionButton] = useState(3);

  const [maxStarRating, setMaxStarRating] = useState([1, 2, 3, 4, 5]);

  const reviewStarForm = useForm<ReviewStarFormValues>({
    defaultValues: {
      reviewStarValue: 0,
    },
    resolver: yupResolver(reviewStarScreenSchema) as Resolver<ReviewStarFormValues, any>,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const addReviewDocument = async (reviewStar: number) => {
    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.log('User is not logged in');
        Alert.alert('User is not logged in');
      }

      if (currentUser) {
        await firebase.firestore().collection('reviewStarCollection').doc(currentUser.uid).set(
          {
            reviewStarValue: reviewStar,
            userId: currentUser?.uid,
          },
          { merge: true }
        );
        Alert.alert('Review was added');
        console.log('Data added to firestore database');
      }
    } catch (error) {
      console.log('Error while adding new document', error);
      Alert.alert(`Error while adding new document: ${error}`);
    }
  };

  const onSubmit = () => {
    addReviewDocument(selectedStarOptionButton);
  };

  const { register, control, handleSubmit, formState } = reviewStarForm;
  const { errors } = formState;

  const CustomChoosingStars = () => {
    const activateStarRadioButton = (option: any, bool: boolean) => {
      const selectedOption = bool ? option - 0.5 : option;
      setSelectedStarOptionButton(selectedOption);
    };
    return (
      <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
        <View style={styles.ratingBarStyle}>
          {maxStarRating.map((item, key) => {
            return (
              <View key={key}>
                <FontAwesome
                  style={styles.imageStyle}
                  name={
                    item <= selectedStarOptionButton
                      ? 'star'
                      : item >= selectedStarOptionButton && item < selectedStarOptionButton + 1
                      ? 'star-half-full'
                      : 'star-o'
                  }
                  size={50}
                  color={'black'}
                />
                <View style={{ flex: 1, flexDirection: 'row', position: 'absolute' }}>
                  <TouchableOpacity
                    key={`empty_${key}`}
                    activeOpacity={0.7}
                    style={{ width: 20, height: 40 }}
                    onPress={() => activateStarRadioButton(item, true)}
                  />
                  <TouchableOpacity
                    key={`filled_${key}`}
                    activeOpacity={0.7}
                    style={{ width: 20, height: 40 }}
                    onPress={() => activateStarRadioButton(item, false)}
                  />
                </View>
              </View>
            );
          })}
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>
            {selectedStarOptionButton} / {Math.max(...maxStarRating)}
          </Text>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={{
                  backgroundColor: 'seashell',
                  textAlign: 'center',
                  marginBottom: '1%',
                  color: 'blue',
                  fontSize: 18,
                  borderRadius: 15,
                  width: '25%',
                }}
                keyboardType="numeric"
                onChangeText={(text: string) => {
                  onChange(parseFloat(text));
                }}
                editable={true}
                value={selectedStarOptionButton.toString()}
              />
            )}
            name="reviewStarValue"
          />
          {errors.reviewStarValue && (
            <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              {errors.reviewStarValue.message}
            </Text>
          )}

          <TouchableOpacity
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              marginTop: 30,
              padding: 15,
              backgroundColor: 'lime',
            }}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={{ color: 'black' }}>{t('rateAppStarsButton')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //Translation
  const { t } = useTranslation();

  const hugeLanguagesArray = Object.entries(languagesList);

  //Exchange Rate API
  const [mainCurrencyAmount, setMainCurrencyAmount] = useState('');
  const [declaredAmount, setDeclaredAmount] = useState<string | null>();

  const initialCurrencies = currencies.map((currency) => currency.name);

  const [myCurrencies, setMyCurrencies] = useState(initialCurrencies);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  const [errorConvertingCurrency, setErrorConvertingCurrency] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setErrorConvertingCurrency(undefined);
        if (!mainCurrencyAmount) {
          setDeclaredAmount(null);
          return;
        }

        const response = await fetch(`https://open.er-api.com/v6/latest/${mainCurrency}`);
        const data = await response.json();

        const exchangesRates = data.rates;
        const conversionRate = exchangesRates[secondCurrency];

        if (conversionRate) {
          setExchangeRate(conversionRate);
          const result = parseFloat(mainCurrencyAmount) * conversionRate;
          setDeclaredAmount(result.toFixed(2));
        } else {
          setDeclaredAmount('Invalid');
        }
      } catch (error) {
        console.log('Error converting currency', error);
        setErrorConvertingCurrency('Error converting currency - check Network connection');
      }
    };

    fetchExchangeRate();
  }, [mainCurrencyAmount, mainCurrency, secondCurrency]);

  useEffect(() => {
    setSecondCurrency(myCurrencies.find((currency) => currency !== mainCurrency) || '');
  }, [mainCurrency, myCurrencies]);

  const actualCurrency = useSelector((state: RootState) => state.name.settingsScreenActualCurrency);

  const dispatch = useDispatch();

  const handleActivateReduxCurrencyRadioButton = (option: string) => {
    dispatch(setSettingsScreenActualCurrency(option));
  };

  //For Expanse Notifications
  const [isExpansesNotifSwitchEnabled, setIsExpansesNotifSwitchEnabled] = useState(false);

  const toggleExpanseNotificationsSwitch = () => {
    setIsExpansesNotifSwitchEnabled(!isExpansesNotifSwitchEnabled);
  };

  //For Income Notifications
  const [isIncomeNotifSwitchEnabled, setIsIncomeNotifSwitchEnabled] = useState(false);

  const toggleIncomeNotificationsSwitch = () => {
    setIsIncomeNotifSwitchEnabled(!isIncomeNotifSwitchEnabled);
  };

  //For Savings Notifications
  const [isSavingsNotifSwitchEnabled, setIsSavingsNotifSwitchEnabled] = useState(false);

  const toggleSavingsNotificationsSwitch = () => {
    setIsSavingsNotifSwitchEnabled(!isSavingsNotifSwitchEnabled);
  };

  //For Investment Notifications
  const [isInvestmentNotifSwitchEnabled, setIsInvestmentNotifSwitchEnabled] = useState(false);

  const toggleInvestmentNotificationsSwitch = () => {
    setIsInvestmentNotifSwitchEnabled(!isInvestmentNotifSwitchEnabled);
  };

  const [dateTimeCETExpense, setDateTimeCETExpense] = useState<Date>();

  const DateTimePickerForExpense = () => {
    const [expenseDate, setExpenseDate] = useState(new Date(Date.now() + 3600000));
    const [openExpense, setOpenExpense] = useState(false);

    return (
      <View
        style={{
          flexDirection: 'column',
          padding: 5,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: 'skyblue',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'black',
          }}
          onPress={() => {
            if (isExpansesNotifSwitchEnabled) {
              setOpenExpense(!openExpense);
            }
          }}
        >
          <Text>plan</Text>
        </TouchableOpacity>
        <DatePicker
          androidVariant="nativeAndroid"
          modal
          mode="datetime"
          open={openExpense}
          date={expenseDate}
          onConfirm={(date) => {
            console.log('Coś,', date);
            setExpenseDate(date);
            const formattedTime = new Date(date);
            const actualExpenseTime = new Date(date);
            const currentHour = actualExpenseTime.getUTCHours();
            actualExpenseTime.setUTCHours(currentHour + 2);
            console.log('Coś 2,', actualExpenseTime.toUTCString());

            if (formattedTime && actualExpenseTime) {
              setDateTimeCETExpense(actualExpenseTime);
              dispatch(setSettingsScreenExpenseNotifications(formattedTime.toUTCString()));

              setTimeout(() => {
                notif.createOrUpdateChannel();
                console.log('Przekazana data', new Date(formattedTime));
                notif.scheduleExpenseNotif('', formattedTime);
              }, 1000);
            }
          }}
          onCancel={() => setOpenExpense(false)}
        />
        <Text style={{ color: 'black', fontSize: 16 }}>{dateTimeCETExpense?.toUTCString()}</Text>
      </View>
    );
  };

  const [dateTimeCETIncome, setDateTimeCETIncome] = useState<Date>();

  const DateTimePickerForIncome = () => {
    const [date, setDate] = useState(new Date(Date.now() + 3600000));
    const [open, setOpen] = useState(false);
    return (
      <View
        style={{
          flexDirection: 'column',
          padding: 5,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: 'skyblue',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'black',
          }}
          onPress={() => {
            if (isIncomeNotifSwitchEnabled) {
              setOpen(!open);
            }
          }}
        >
          <Text>plan</Text>
        </TouchableOpacity>
        <DatePicker
          androidVariant="nativeAndroid"
          modal
          mode="datetime"
          open={open}
          date={date}
          onConfirm={(date) => {
            setDate(date);
            const formattedTime = new Date(date);
            console.log(formattedTime);
            const actualExpenseTime = new Date(date);
            const currentHour = actualExpenseTime.getUTCHours();
            actualExpenseTime.setUTCHours(currentHour + 2);
            if (formattedTime && actualExpenseTime) {
              setDateTimeCETIncome(actualExpenseTime);
              setTimeout(() => {
                notif.createOrUpdateChannel();
                console.log('Przekazana data', new Date(formattedTime));
                notif.scheduleIncomeNotif('', formattedTime);
              }, 1000);
            }
          }}
          onCancel={() => setOpen(false)}
        />
        <Text style={{ color: 'black', paddingTop: 10 }}>{dateTimeCETIncome?.toUTCString()}</Text>
      </View>
    );
  };

  const [dateTimeCETSavings, setDateTimeCETSavings] = useState<Date>();

  const DateTimePickerForSavings = () => {
    const [incomeDate, setIncomeDate] = useState(new Date(Date.now() + 3600000));
    const [openIncome, setOpenIncome] = useState(false);

    return (
      <View
        style={{
          flexDirection: 'column',
          padding: 5,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: 'skyblue',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'black',
          }}
          onPress={() => {
            if (isSavingsNotifSwitchEnabled) {
              setOpenIncome(!openIncome);
            }
          }}
        >
          <Text>plan</Text>
        </TouchableOpacity>
        <DatePicker
          androidVariant="nativeAndroid"
          modal
          mode="datetime"
          open={openIncome}
          date={incomeDate}
          onConfirm={(date) => {
            setIncomeDate(date);
            const formattedTime = new Date(date);
            const actualExpenseTime = new Date(date);
            const currentHour = actualExpenseTime.getUTCHours();
            actualExpenseTime.setUTCHours(currentHour + 2);
            if (formattedTime) {
              setDateTimeCETSavings(actualExpenseTime);
              dispatch(setSettingsScreenExpenseNotifications(formattedTime.toUTCString()));
              setTimeout(() => {
                console.log('Przekazana data', new Date(formattedTime));
                notif.scheduleSavingsNotif('', formattedTime);
              }, 1000);
            }
          }}
          onCancel={() => setOpenIncome(false)}
        />
        <Text style={{ color: 'black' }}>{dateTimeCETSavings?.toUTCString()}</Text>
      </View>
    );
  };

  const [dateTimeCETInvestment, setDateTimeCETInvestment] = useState<Date>();

  const DateTimePickerForInvestments = () => {
    const [investmentDate, setInvestmentDate] = useState(new Date(Date.now() + 3600000));
    const [openInvestment, setOpenInvestment] = useState(false);

    return (
      <View
        style={{
          flexDirection: 'column',
          padding: 5,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: 'skyblue',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'black',
          }}
          onPress={() => {
            if (isInvestmentNotifSwitchEnabled) {
              setOpenInvestment(!openInvestment);
            }
          }}
        >
          <Text>plan</Text>
        </TouchableOpacity>
        <DatePicker
          androidVariant="nativeAndroid"
          modal
          mode="datetime"
          open={openInvestment}
          date={investmentDate}
          onConfirm={(date) => {
            setInvestmentDate(date);
            const formattedTime = new Date(date);
            const actualInvestmentTime = new Date(date);
            const currentHour = actualInvestmentTime.getUTCHours();
            actualInvestmentTime.setUTCHours(currentHour + 2);
            if (formattedTime && actualInvestmentTime) {
              setDateTimeCETInvestment(actualInvestmentTime);
              setTimeout(() => {
                notif.createOrUpdateChannel();
                console.log('Przekazana data', new Date(formattedTime));
                notif.scheduleInvestmentNotif('', formattedTime);
              }, 1000);
            }
          }}
          onCancel={() => setOpenInvestment(false)}
        />
        <Text style={{ color: 'black', paddingTop: 10 }}>
          {dateTimeCETInvestment?.toUTCString()}
        </Text>
      </View>
    );
  };

  //NOTIFICATIONS
  const [registerToken, setRegisterToken] = useState('');
  const [fcmRegistered, setFcmRegistered] = useState(false);

  const onRegister = (token: any) => {
    setRegisterToken(token.token);
    setFcmRegistered(true);
  };

  const onNotif = (notif: any) => {
    Alert.alert(notif.title, notif.message);
  };

  const notif = new NotifService(onRegister, onNotif);

  const mainContentGoogleAccountName = useSelector(
    (state: RootState) => state.name.googleAccountName
  );

  const { isGoogleUserLoggedIn, userGoogleUId } = useSelector(
    (state: RootState) => state.name.isGoogleUser
  );

  const googleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      await firebase
        .auth()
        .signOut()
        .then(() => {
          console.log('User signed out');
        })
        .catch((error) => {
          console.error('Error', error);
        });
      handleGoogleAccountName('');
      setIsLoggedIn(false);
      handleKeepUserLoggedIn(false, '');
      return (
        <>
          <TouchableOpacity
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={googleSignIn}
          >
            <Ionicons name="logo-google" color={'white'} size={35} style={{ paddingBottom: 10 }} />
            <Text>{t('SignInAccountSettingsWindow')}</Text>
          </TouchableOpacity>
        </>
      );
    } catch (error) {
      Alert.alert('You have been signed out');
      console.error('Error occured, ', error);
    }
  };

  const handleGoogleAccountName = (name: string | null) => {
    dispatch(getGoogleAccountName(name));
  };

  const handleKeepUserLoggedIn = (isLoggedIn: boolean, uid: string | null) => {
    dispatch(setKeepUserLoggedIn(isLoggedIn, uid));
  };

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: '333948556331-0psqckb5nkj16h7h6s9gh9maone65a6a.apps.googleusercontent.com',
    });
  }, [userGoogleUId, isGoogleUserLoggedIn]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  const googleSignIn = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const user_sign_in = firebase.auth().signInWithCredential(googleCredential);

      user_sign_in
        .then(async (userCredential) => {
          console.log('Signed in with Google', userCredential.user?.emailVerified);
          const userInfo = await GoogleSignin.signInSilently();
          //setGivenName(userInfo?.user.givenName);
          handleGoogleAccountName(userInfo?.user.givenName);
          setIsLoggedIn(true);

          const currentUser = firebase.auth().currentUser;
          if (currentUser) {
            handleKeepUserLoggedIn(true, currentUser?.displayName);
            firebase
              .firestore()
              .collection('usersCollection')
              .doc(currentUser.uid)
              .set({
                displayName: userCredential.user?.displayName,
                email: userCredential.user?.email,
                emailVerified: userCredential.user?.emailVerified || false,
                userId: userCredential.user?.uid || '',
                createdAt: serverTimestamp(),
              })
              .then(() => {
                console.log('Google data were added to firestore');
                Alert.alert('User data successfully connected to database');
              })
              .catch((error) => {
                console.error('Error adding Google data to Firestore', error);
                Alert.alert(`User data successfully to database: ${error}`);
              });
          } else {
            console.error('Current user is null. Unable to update Firestore.');
          }
        })
        .catch((error: any) => {
          console.log('Signed in failed', error);
          console.log('Google data were not added to firestore', error);
          Alert.alert(`Google user data were not added to firestore: ${error}`);
          setIsLoggedIn(false);
          handleKeepUserLoggedIn(false, '');
        });
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        Alert.alert('User cancelled login modal');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  //Privacy Policy modal
  const [isPrivacyPolicyModalOn, setIsPrivacyPolicyModalOn] = useState(false);

  const togglePrivacyPolicyModal = () => {
    setIsPrivacyPolicyModalOn(!isPrivacyPolicyModalOn);
  };

  //Faq questions modal
  const [isFaqQuestionsModalOn, setIsFaqQuestionsModalOn] = useState(false);

  const toggleFAQModal = () => {
    setIsFaqQuestionsModalOn(!isFaqQuestionsModalOn);
  };

  //Linking to icon website

  const urlIconsWebsite = 'https://icons8.com';

  const openIconsWebsite = useCallback(async (url: string) => {
    try {
      const isSupported = await Linking.canOpenURL(url);

      if (isSupported) {
        await Linking.openURL(url);
      } else {
        console.log(`Cannot open URL: ${url}. URL is not supported.`);
        Alert.alert('Error', 'Cannot open this URL. The URL is not supported.');
      }
    } catch (error) {
      console.error('Error while opening URL:', error);
      Alert.alert('Error', `Cannot open this URL: ${url}`);
    }
  }, []);

  const [isCleared, setIsCleared] = useState<boolean>(false);

  const resetAllDataFromAsyncStorage = () => {
    dispatch(setResetAllDataFromAsyncStorage(true));

    AsyncStorage.getAllKeys()
      .then((allkeys) => AsyncStorage.multiRemove(allkeys))
      .then(() => {
        setIsCleared(true);
        Alert.alert('All data saved offline were deleted successfully');
        return AsyncStorage.getAllKeys();
      })
      .then(() => {
        if (isCleared) {
          Alert.alert('Everything is now cleared');
        }
      })
      .catch((error) => {
        console.error('Error deleting data from AsyncStorage:', error);
      });
  };

  useEffect(() => {
    async function displayAllKeys() {
      try {
        const allkeys = await AsyncStorage.getAllKeys();
        console.log('Checking keys in AsyncStorage', allkeys);
      } catch (error) {
        console.error('Error retrievings keys from AsyncStorage:', error);
      }
    }
    displayAllKeys();
  }, []);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (authUser: FirebaseUser) => {
      if (authUser) {
        console.log('User is still logged in', authUser.email);
        setIsLoggedIn(true);
      } else {
        console.log('not logged in', authUser);

        setIsLoggedIn(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [mainContentGoogleAccountName, userGoogleUId, isGoogleUserLoggedIn]);

  return (
    <SafeAreaView style={styles.settingBar}>
      <View
        style={{
          width: '100%',
          height: 'auto',
          justifyContent: 'space-between',
          padding: 10,
          backgroundColor: 'royalblue',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{ width: '15%' }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              width: 40,
              height: 40,
              borderRadius: 20,
            }}
            onPress={() => navigation.navigate('HomeScreen')}
          >
            <AntDesign name="arrowleft" size={40} color={'black'} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '85%',
          }}
        >
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ fontSize: 16 }}>{t('setting-header-text')}</Text>
            {userGoogleUId?.trim().length !== 0 ? (
              <Text style={{ fontSize: 14 }}>{isGoogleUserLoggedIn ? userGoogleUId : ''}</Text>
            ) : null}
          </View>

          <Text style={{ fontSize: 16 }}>
            {t('appVersion')} {version}
          </Text>
        </View>
      </View>
      <LinearGradient
        start={{ x: 0.1, y: 0.95 }}
        end={{ x: 0.1, y: 0.3 }}
        colors={['orange', 'lightsteelblue', 'gray']}
        locations={[0.1, 0.5, 0.9]}
        style={styles.gradient}
      >
        <View>
          <View style={styles.VstackContainer}>
            <View style={styles.HstackContainer}>
              <TouchableOpacity
                style={styles.buttons}
                onPress={() => setShowNotificationsModal(true)}
              >
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 30,
                    width: '100%',
                    flexDirection: 'column',
                  }}
                >
                  <Ionicons
                    name="settings-outline"
                    color={'white'}
                    size={35}
                    style={{ paddingBottom: 10 }}
                  />
                  <Text style={{ fontSize: 13 }}>{t('allSettingsGearWindow')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttons} onPress={toggleFAQModal}>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 30,
                    width: '100%',
                    flex: 1,
                    flexDirection: 'column',
                  }}
                >
                  <MCI
                    name="chat-question"
                    color={'white'}
                    size={35}
                    style={{ paddingBottom: 10 }}
                  />
                  <Text style={{ fontSize: 13 }}>{t('FAQSettingsWindow')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttons} onPress={() => setShowCurrencyModal(true)}>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 30,
                    width: '100%',
                    flex: 1,
                    flexDirection: 'column',
                  }}
                >
                  <MaterialIcons
                    name="currency-exchange"
                    color={'white'}
                    size={35}
                    style={{ paddingBottom: 10 }}
                  />
                  <Text style={{ fontSize: 13 }}>{t('ExchangeCurrencySettingsWindow')}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.HstackContainer}>
              <TouchableOpacity style={styles.buttons} onPress={() => setShowLanguageModal(true)}>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 30,
                    width: '100%',
                    flexDirection: 'column',
                  }}
                >
                  <Ionicons
                    name="language"
                    color={'white'}
                    size={35}
                    style={{ paddingBottom: 10 }}
                  />
                  <Text style={{ fontSize: 13 }}>{t('change-languageSettingsWindow')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttons} onPress={() => setShowExchangeRate(true)}>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 30,
                    width: '100%',
                    flex: 1,
                    flexDirection: 'column',
                  }}
                >
                  <FontAwesome
                    name="exchange"
                    color={'white'}
                    size={35}
                    style={{ paddingBottom: 10 }}
                  />
                  <Text style={{ fontSize: 13 }}>{t('exchange-rateSettingsWindow')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttons} onPress={togglePrivacyPolicyModal}>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 30,
                    width: '100%',
                    flex: 1,
                    flexDirection: 'column',
                  }}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    color={'white'}
                    size={35}
                    style={{ paddingBottom: 10 }}
                  />
                  <Text style={{ fontSize: 13 }}>{t('PrivacyPolicySettingsWindow')}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.HstackContainer}>
              <TouchableOpacity style={styles.buttons} onPress={() => setShowRateUsModal(true)}>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 30,
                    width: '100%',
                    flex: 1,
                    flexDirection: 'column',
                  }}
                >
                  <Ionicons
                    name="star-outline"
                    color={'white'}
                    size={35}
                    style={{ paddingBottom: 10 }}
                  />
                  <Text style={{ fontSize: 13 }}>{t('RateUsSettingsWindow')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttons} onPress={resetAllDataFromAsyncStorage}>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 30,
                    width: '100%',
                    flex: 1,
                    flexDirection: 'column',
                  }}
                >
                  <Ionicons
                    name="trash-bin-outline"
                    color={'white'}
                    size={35}
                    style={{ paddingBottom: 10 }}
                  />
                  <Text style={{ fontSize: 13 }}>{t('ResetAllDataSettingsWindow')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttons}>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 30,
                    width: '100%',
                    flexDirection: 'column',
                  }}
                >
                  {userGoogleUId && userGoogleUId.trim().length !== 0 ? (
                    <>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={googleSignOut}
                      >
                        <MaterialIcons
                          name="logout"
                          color={'white'}
                          size={35}
                          style={{ paddingBottom: 10 }}
                        />
                        <Text style={{ fontSize: 13 }}>{t('SignOutAccountSettingsWindow')}</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={googleSignIn}
                      >
                        <Ionicons
                          name="logo-google"
                          color={'white'}
                          size={35}
                          style={{ paddingBottom: 10 }}
                        />
                        <Text style={{ fontSize: 13 }}>{t('SignInAccountSettingsWindow')}</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: 60,
            }}
          >
            <Text style={{ color: 'black', fontSize: 16 }}>
              {t('SettingsScreenCopyrightFirstText')}
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}
            >
              <Text style={{ color: 'black', fontSize: 16 }}>
                {t('SettingsScreenCopyrightSecondText')}{' '}
              </Text>
              <View>
                <TouchableOpacity onPress={() => openIconsWebsite(urlIconsWebsite)}>
                  <Text style={{ color: 'white', fontSize: 16 }}>Icons8</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          maxHeight: 400,
          maxWidth: 300,
        }}
      >
        <ModalPopUp visible={showLanguageModal}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.modalHeader}>
              <Text style={{ fontWeight: 'bold', color: 'black' }}>
                {t('language')}:{selectedLanguageOptionRadioButton}
              </Text>
              <TouchableOpacity onPress={toggleLanguageModal}>
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
                  {t('languagesModalHeader')}
                </Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
            </View>
          </View>
          <View style={styles.containerForRadioButton}>
            <View style={styles.containerForRadioButtonInner}>
              {hugeLanguagesArray.map(([languageCode, languageDetails]) => (
                <View style={{ flexDirection: 'row', gap: 20 }} key={languageCode}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      selectedLanguageOptionRadioButton === languageCode &&
                        styles.radioButtonSelected,
                    ]}
                    onPress={() => activateLanguageRadioButton(languageCode)}
                  />
                  <View style={styles.radioButtons}>
                    <Text style={{ fontWeight: 'bold', color: 'black' }}>
                      {languageDetails.nativeName}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ModalPopUp>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ModalPopUp visible={showNotificationsModal}>
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'flex-end',
              }}
            >
              {/* <Text style={{ color: 'black' }}>{expTimeFromRedux}</Text> */}
              <TouchableOpacity onPress={toggleNotificationsModal}>
                <MaterialIcons name="close" size={40} color={'black'} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
              <View>
                <Text
                  style={{
                    width: 140,
                    textAlign: 'center',
                    color: theme.mode ? activeColors.primary : activeColors2.tint,
                  }}
                >
                  {t('notificationsHeader')}
                </Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: 'rgba(0,0,0,0.3)',
              width: '100%',
              height: 550,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 5,
              }}
            >
              <View
                style={{
                  width: '35%',
                  height: '100%',
                }}
              >
                <Text style={{ color: 'black', fontSize: 16 }}>
                  {t('SettingsScreenLocalNotificationsExpenseText')}
                </Text>
              </View>
              <View style={{ width: '50%' }}>
                <DateTimePickerForExpense />
              </View>
              <View
                style={{
                  width: '15%',
                  height: '100%',
                }}
              >
                <Switch
                  value={isExpansesNotifSwitchEnabled}
                  onValueChange={(value) => {
                    toggleExpanseNotificationsSwitch();
                    if (value) {
                      notif.requestPermissions();
                    } else {
                      notif.abandonPermissions();
                    }
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 5,
              }}
            >
              <View
                style={{
                  width: '35%',
                  height: '100%',
                }}
              >
                <Text style={{ color: 'black', fontSize: 16 }}>
                  {t('SettingsScreenLocalNotificationsIncomeText')}
                </Text>
              </View>
              <View style={{ width: '50%' }}>
                <DateTimePickerForIncome />
              </View>
              <View
                style={{
                  width: '15%',
                  height: '100%',
                }}
              >
                <Switch
                  value={isIncomeNotifSwitchEnabled}
                  onValueChange={(value) => {
                    toggleIncomeNotificationsSwitch();
                    if (value) {
                      notif.requestPermissions();
                    } else {
                      notif.abandonPermissions();
                    }
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 5,
              }}
            >
              <View
                style={{
                  width: '35%',
                  height: '100%',
                }}
              >
                <Text style={{ color: 'black', fontSize: 16 }}>
                  {t('SettingsScreenLocalNotificationsSavingsText')}
                </Text>
              </View>
              <View style={{ width: '50%' }}>
                <DateTimePickerForSavings />
              </View>
              <View
                style={{
                  width: '15%',
                  height: '100%',
                }}
              >
                <Switch
                  value={isSavingsNotifSwitchEnabled}
                  onValueChange={(value) => {
                    toggleSavingsNotificationsSwitch();
                    if (value) {
                      notif.requestPermissions();
                    } else {
                      notif.abandonPermissions();
                    }
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 5,
              }}
            >
              <View
                style={{
                  width: '35%',
                  height: '100%',
                }}
              >
                <Text style={{ color: 'black', fontSize: 16 }}>
                  {t('SettingsScreenLocalNotificationsInvestmentText')}
                </Text>
              </View>
              <View style={{ width: '50%' }}>
                <DateTimePickerForInvestments />
              </View>
              <View
                style={{
                  width: '15%',
                  height: '100%',
                }}
              >
                <Switch
                  value={isInvestmentNotifSwitchEnabled}
                  onValueChange={(value) => {
                    toggleInvestmentNotificationsSwitch();
                    if (value) {
                      notif.requestPermissions();
                    } else {
                      notif.abandonPermissions();
                    }
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'green',
                width: '35%',
              }}
            />
          </View>
        </ModalPopUp>
      </View>

      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ModalPopUp visible={showCurrencyModal}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.modalHeader}>
              <Text style={{ fontWeight: 'bold', color: 'black' }}>
                {t('currencyText')}:{selectedCurrencyOptionRadioButton}
              </Text>
              <TouchableOpacity onPress={toggleCurrencyModal}>
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
                  {t('currencyModalHeader')}
                </Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
            </View>
          </View>
          <View style={styles.containerForRadioButton}>
            <View style={styles.containerForRadioButtonInner}>
              {currencies.map((currency, index) => (
                <View style={{ flexDirection: 'row', gap: 20 }} key={index}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      selectedCurrencyOptionRadioButton === currency.name &&
                        styles.radioButtonSelected,
                    ]}
                    onPress={() => {
                      activateCurrencyRadioButton(currency.name);
                      handleActivateReduxCurrencyRadioButton(currency.name);
                    }}
                  />
                  <View style={styles.radioButtons}>
                    {/* <Icon name={currency.IconSymbol} color={'black'} size={25} /> */}
                    <Text style={{ fontWeight: 'bold', color: 'black' }}>
                      {currency.IconSymbol}
                    </Text>
                    <Text style={{ fontWeight: 'bold', color: 'black' }} key={index}>
                      {currency.name}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ModalPopUp>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ModalPopUp visible={showExchangeRate}>
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'flex-end',
              }}
            >
              <TouchableOpacity onPress={toggleExchangeModal}>
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
                  {t('exchangeRateModalHeader')}
                </Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
            </View>
          </View>

          <View style={styles.FirstExternalBoxExchangeCalculator}>
            <View style={{ flexDirection: 'column' }}>
              <View style={styles.VStackForCalculator}>
                <View style={styles.HstackContainerSecond}>
                  <View style={styles.VStackFlag}>
                    <Image source={currentFlagMainCurrency?.image} alt="mainflag" />
                  </View>
                  <View style={{ gap: 10 }}>
                    <SelectDropdown
                      data={currenciesOptions}
                      defaultValue={mainCurrency}
                      onSelect={(nextValue) => setMainCurrency(nextValue)}
                      defaultButtonText="Main Currency"
                      dropdownStyle={{ backgroundColor: 'royalblue' }}
                      rowStyle={{ width: '100%' }}
                    />
                    <TextInput
                      placeholder="You have"
                      style={styles.textInput}
                      keyboardType="numeric"
                      placeholderTextColor={'white'}
                      onChangeText={(text) => setMainCurrencyAmount(text)}
                    />
                    <Text>{mainCurrency}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.VStackForCalculator}>
                <View style={styles.HstackContainerSecond}>
                  <View style={styles.VStackFlag}>
                    <Image source={currentFlagSecondCurrency?.image} alt="secondflag" />
                  </View>
                  <View style={{ gap: 10 }}>
                    <SelectDropdown
                      data={currenciesOptions}
                      defaultValue={secondCurrency}
                      onSelect={(nextValue) => setSecondCurrency(nextValue)}
                      defaultButtonText="Second Currency"
                      dropdownStyle={{ backgroundColor: 'royalblue' }}
                      rowStyle={{ width: '100%' }}
                    />
                    <TextInput
                      placeholder="You got"
                      style={styles.textInput}
                      placeholderTextColor={'green'}
                      editable={false}
                      selectTextOnFocus={false}
                      value={declaredAmount !== null ? declaredAmount?.toString() : ''}
                    />
                    <Text>{secondCurrency}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.BoxForReverseSymbol}>
              <TouchableOpacity onPress={reverseRate}>
                <View
                  style={{
                    borderColor: 'lawngreen',
                    borderWidth: 1,
                    borderRadius: 3,
                    padding: 3,
                  }}
                >
                  <Entypo name="select-arrows" size={30} color={'white'} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{ color: 'black' }}>{errorConvertingCurrency}</Text>
        </ModalPopUp>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ModalPopUpPrivacyPolicy visible={isPrivacyPolicyModalOn}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={togglePrivacyPolicyModal}>
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
                  {t('PrivacyPolicySettingsWindow')}
                </Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
            </View>
            <ScrollView>
              <View
                style={{
                  flexDirection: 'column',
                  borderRadius: 10,
                  backgroundColor: 'lightslategrey',
                  padding: '3%',
                  marginBottom: '20%',
                  flex: 1,
                }}
              >
                <PrivacyPolicyEN />
              </View>
              <View style={{ flex: 1 }} />
            </ScrollView>
          </View>
        </ModalPopUpPrivacyPolicy>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ModalPopUpPrivacyPolicy visible={isFaqQuestionsModalOn}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={toggleFAQModal}>
                <MaterialIcons name="close" size={40} color={'black'} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
              <View>
                <Text
                  style={{
                    width: 200,
                    textAlign: 'center',
                    color: theme.mode ? activeColors.primary : activeColors2.tint,
                  }}
                >
                  {t('FAQSettingsWindow')}
                </Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
            </View>
            <ScrollView>
              <View
                style={{
                  flexDirection: 'column',
                  borderRadius: 10,
                  backgroundColor: 'lightslategrey',
                  padding: '3%',
                  marginBottom: '20%',
                  flex: 1,
                }}
              >
                <Questions />
              </View>
              <View style={{ flex: 1 }} />
            </ScrollView>
          </View>
        </ModalPopUpPrivacyPolicy>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ModalPopUp visible={showRateUsModal}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.modalHeader}>
              <Text style={{ fontWeight: 'bold', color: 'black' }}>
                {t('rateAppQuestionModalHeader')}
              </Text>
              <TouchableOpacity onPress={toggleRateUsModal}>
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
                  {t('rateAppStarsModalHeader')}
                </Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
            </View>
          </View>
          <View style={{ ...styles.containerForRadioButton, width: screenWidth / 1.2 }}>
            <View style={styles.containerForRadioButtonInner}>
              <CustomChoosingStars />
            </View>
          </View>
        </ModalPopUp>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  settingBar: {
    flex: 1,
  },
  containerSettingBar: {
    width: '100%',
    height: 'auto',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'royalblue',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttons: {
    width: '30%',
    height: 'auto',
    backgroundColor: 'royalblue',
    padding: 3,
    margin: 5,
  },
  HstackContainer: {
    width: '100%',
    height: 'auto',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  HstackContainerSecond: {
    flexDirection: 'row',
  },
  VstackContainer: {
    margin: 1,
    height: '100%',
  },
  innerContainer: {
    alignItems: 'center',
    padding: 7,
    margin: 15,
    backgroundColor: 'red',
  },
  gradient: {
    flex: 1,
  },
  radioButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  inputMainCurrency: {
    width: '100%',
  },
  VStackForCalculator: {
    backgroundColor: 'lightslategrey',
    padding: 10,
    margin: 2,
    alignItems: 'center',
    width: 'auto',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    flexDirection: 'column',
  },
  VStackFlag: {
    padding: 10,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  FirstExternalBoxExchangeCalculator: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  BoxForReverseSymbol: {
    backgroundColor: 'lightslategrey',
    flexDirection: 'row',
    width: '12%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  },
  textInput: {
    width: '100%',
    marginTop: 2,
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    color: 'purple',
  },
  modalHeader: {
    width: '100%',
    height: 50,
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerForRadioButton: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'silver',
    padding: '2%',
    borderRadius: 10,
  },
  containerForRadioButtonInner: {
    flexDirection: 'column',
    width: '100%',
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
  ratingBarStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
    gap: 15,
    width: '100%',
  },
  imageStyle: {
    width: 50,
    height: 50,
  },
  textField: {
    borderWidth: 1,
    borderColor: '#AAAAAA',
    margin: 5,
    padding: 5,
    width: '70%',
  },
  button: {
    borderWidth: 1,
    borderColor: '#000000',
    margin: 5,
    padding: 5,
    width: '70%',
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
  },
});

export default SettingsScreen;

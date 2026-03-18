import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import GoogleSignInButton from '../auth/api/GoogleSignInButton';
import { useDispatch, useSelector } from 'react-redux';
import { setBudgetValue, setCurrency } from '../../redux/actions';
import { Item } from './ExpensesScreen';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { initialBudgetSchema } from '../../schemas/initialBudgetSchema';
import { RootState } from '../../rootStates/rootState';
import { mainLanguageSchema } from '../../schemas/mainLanguageSchema';
import SelectDropdown from 'react-native-select-dropdown';
import i18next, { languageResources } from '../../../src/services/i18next';
import { useTranslation } from 'react-i18next';

type WelcomeScreenParamList = {
  WelcomeScreenGraphic: undefined;
  SecondWelcomeGraphic: undefined;
  ThirdWelcomeGraphic: undefined;
  FourthWelcomeGraphic: undefined;
  FifthWelcomeGraphic: undefined;
  HomeScreen: undefined;
};

type WelcomeScreenNavigationProp = StackNavigationProp<
  WelcomeScreenParamList,
  'WelcomeScreenGraphic'
>;
type WelcomeScreenRouteProp = RouteProp<WelcomeScreenParamList, 'SecondWelcomeGraphic'>;

type WelcomeScreenProps = {
  navigation: WelcomeScreenNavigationProp;
  route: RouteProp<WelcomeScreenParamList, 'WelcomeScreenGraphic'>;
};

type SecondScreenProps = {
  navigation: WelcomeScreenNavigationProp;
  route: RouteProp<WelcomeScreenParamList, 'SecondWelcomeGraphic'>;
};

type ThirdScreenProps = {
  navigation: WelcomeScreenNavigationProp;
  route: RouteProp<WelcomeScreenParamList, 'ThirdWelcomeGraphic'>;
};

type FourthScreenProps = {
  navigation: WelcomeScreenNavigationProp;
  route: RouteProp<WelcomeScreenParamList, 'FourthWelcomeGraphic'>;
};

type FifthScreenProps = {
  navigation: WelcomeScreenNavigationProp;
  route: RouteProp<WelcomeScreenParamList, 'HomeScreen'>;
};

type BudgetFormValues = {
  initialBudgetValue: number;
  initialCurrency: string;
};

type MainLanguageFormValues = {
  mainLanguage: '';
};

type LanguageValues = {
  label: string;
  value: string;
};

//const numericValue = 0.0;

const screenHeight = Dimensions.get('window').height;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation, route }) => {
  const navigateToSecond = () => {
    navigation.navigate('SecondWelcomeGraphic');
  };

  return (
    <LinearGradient
      start={{ x: 0.3, y: 0.9 }}
      end={{ x: 1, y: 0.2 }}
      colors={['lightblue', 'orange', 'yellow', 'gray']}
      locations={[0, 0.1, 0.5, 0.9]}
      style={styles.gradient}
    >
      <ScrollView>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.description}>Let's get it started !</Text>
        </View>
        <View style={styles.firstHint}>
          <View style={styles.boxContainer}>
            <Image
              source={require('../../assets/images/home_budget_management_list.png')}
              style={styles.defaultPhoto}
              alt="mainPhoto"
            />
            <View style={styles.VstackContainer}>
              <Text style={styles.textCustom}>Safe money</Text>
              <Text style={styles.textCustom}>Clever Management</Text>
              <Text style={styles.textCustom}>Think ahead</Text>
              <Text style={styles.textCustom}>Future is becoming now</Text>
              <Text style={styles.textCustom}>Your finances, our care</Text>
              <Text style={styles.textCustom}>Plan logically, live peacefully</Text>
            </View>
            <Image
              source={require('../../assets/images/homemadefromcashOG2.png')}
              style={{ height: 150, marginTop: '2%', width: 250 }}
              alt="cashHouse"
            />
          </View>

          <View
            style={{
              margin: 20,
              padding: 10,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity style={styles.nextButton} onPress={navigateToSecond}>
              <Text style={{ color: 'black' }}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1, height: screenHeight / 4 }}></View>
      </ScrollView>
    </LinearGradient>
  );
};

const SecondGraphic: React.FC<SecondScreenProps> = ({ navigation, route }) => {
  const navigateToFirst = () => {
    navigation.navigate('WelcomeScreenGraphic');
  };

  const navigateToThird = () => {
    navigation.navigate('ThirdWelcomeGraphic');
  };

  const [itemsLanguage, setItemsLanguage] = useState<LanguageValues[]>([]);

  const [choosenMainLangugageWelcomeScreen, setChoosenMainLangugageWelcomeScreen] = useState<
    string[] | null
  >([]);

  useEffect(() => {
    setItemsLanguage([
      { label: 'English', value: 'en' },
      { label: 'Polish', value: 'pl' },
      { label: 'Deutsch', value: 'de' },
    ]);
  }, []);

  const dispatch = useDispatch();

  //Welcome Screen form validation

  const mainLanguageForm = useForm<MainLanguageFormValues>({
    defaultValues: {
      mainLanguage: '',
    },
    resolver: yupResolver(mainLanguageSchema) as Resolver<MainLanguageFormValues, any>,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const { register, control, handleSubmit, formState } = mainLanguageForm;
  const { errors } = formState;

  const onSubmit = (data: MainLanguageFormValues) => {
    console.log(data.mainLanguage);
    navigateToThird();
  };

  return (
    <LinearGradient
      start={{ x: 0.3, y: 0.9 }}
      end={{ x: 1, y: 0.2 }}
      colors={['lightblue', 'orange', 'yellow', 'gray']}
      locations={[0, 0.1, 0.5, 0.9]}
      style={styles.gradient}
    >
      <ScrollView>
        <View style={styles.firstHint}>
          <View style={styles.boxContainer2}>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <Image source={require('../../assets/images/gb_flag1.jpg')} alt="mainPhoto" />
              <Image source={require('../../assets/images/Poland_flag1.png')} alt="mainPhoto" />
              <Image source={require('../../assets/images/de_flag.jpg')} alt="mainPhoto" />
            </View>
            <View style={styles.VstackContainer}>
              <Text style={styles.textCustom}>Available in these languages</Text>
            </View>
            <View
              style={{
                marginTop: 2,
                paddingHorizontal: 3,
                paddingVertical: 5,
                gap: 5,
                width: '100%',
              }}
            >
              <Image
                source={require('../../assets/images/homeWelcomePromo.png')}
                alt="promoPhotoHouse"
                style={{ width: '100%', height: 200 }}
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  fontFamily: 'serif',
                  color: 'black',
                }}
              >
                Set main language
              </Text>
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <SelectDropdown
                    defaultButtonText="Language"
                    defaultValue={value}
                    data={itemsLanguage}
                    onSelect={(selected: LanguageValues) => {
                      setChoosenMainLangugageWelcomeScreen([selected.value]);
                      onChange(selected.value);
                      i18next.changeLanguage(selected.value);
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
                        <Text style={{ marginLeft: 10, color: 'black' }}>{item.label}</Text>
                      </View>
                    )}
                  />
                )}
                name="mainLanguage"
              />
            </View>
            <View style={{ paddingTop: 10 }}>
              <Text style={{ color: 'white' }}>{choosenMainLangugageWelcomeScreen}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
                marginTop: '2%',
              }}
            >
              {errors.mainLanguage && (
                <Text
                  style={{
                    color: 'red',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}
                >
                  {errors.mainLanguage.message}
                </Text>
              )}
            </View>
          </View>

          <View
            style={{
              marginTop: 20,
              padding: 5,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity style={styles.nextButton} onPress={navigateToFirst}>
              <Text style={{ color: 'black' }}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={handleSubmit(onSubmit)}>
              <Text style={{ color: 'black' }}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1, height: screenHeight / 4 }}></View>
      </ScrollView>
    </LinearGradient>
  );
};

const ThirdGraphic: React.FC<ThirdScreenProps> = ({ navigation, route }) => {
  const navigateToPrevious = () => {
    navigation.navigate('SecondWelcomeGraphic');
  };

  const navigateToNext = () => {
    navigation.navigate('FourthWelcomeGraphic');
  };

  const { t } = useTranslation();

  return (
    <LinearGradient
      start={{ x: 0.3, y: 0.9 }}
      end={{ x: 1, y: 0.2 }}
      colors={['lightblue', 'orange', 'yellow', 'gray']}
      locations={[0, 0.1, 0.5, 0.9]}
      style={styles.gradient}
    >
      <ScrollView>
        <View style={styles.firstHint}>
          <View style={[styles.boxContainer2, { justifyContent: 'center' }]}>
            <Text style={{ color: 'black', fontSize: 18, padding: 10 }}>
              {t('WelcomeScreenThirdGraphicFirstPromoText')}
            </Text>
            <Text style={{ color: 'black', fontSize: 18, padding: 10 }}>
              {t('WelcomeScreenThirdGraphicSecondPromoText')}
            </Text>
            <Text style={{ color: 'black', fontSize: 18, padding: 10 }}>
              {t('WelcomeScreenThirdGraphicThirdPromoText')}
            </Text>
            <Text style={{ color: 'black', fontSize: 18, padding: 10 }}>
              {t('WelcomeScreenThirdGraphicFourthPromoText')}
            </Text>
            <Text style={{ color: 'black', fontSize: 18, padding: 10 }}>
              {t('WelcomeScreenThirdGraphicFifthPromoText')}
            </Text>
            <View
              style={{ flexDirection: 'row', position: 'absolute', bottom: 0, marginBottom: '1%' }}
            >
              <Image
                style={{ width: 48, height: 48 }}
                source={require('../../assets/images/icons8-firebase-48.png')}
                alt="firebase"
              />
              <Image
                style={{ width: 48, height: 48 }}
                source={require('../../assets/images/icons8-google-48.png')}
                alt="firebase"
              />
            </View>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.nextButton} onPress={navigateToPrevious}>
              <Text style={{ color: 'black' }}>{t('WelcomeScreenPreviousButtonText')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={navigateToNext}>
              <Text style={{ color: 'black' }}>{t('WelcomeScreenNextButtonText')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1, height: screenHeight / 4 }}></View>
      </ScrollView>
    </LinearGradient>
  );
};

const FourthGraphic: React.FC<FourthScreenProps> = ({ navigation, route }) => {
  const currencies = [
    { name: 'PLN', IconSymbol: 'zł' },
    { name: 'EUR', IconSymbol: '€' },
    { name: 'USD', IconSymbol: '$' },
    { name: 'GBP', IconSymbol: '£' },
  ];

  // Budget value
  const [inputBudgetValue, setInputBudgetValue] = useState('');
  const automaticChoosenCurrency = currencies[0].name;
  const [initialCurrency, setInitialCurrency] = useState(automaticChoosenCurrency);

  const dispatch = useDispatch();

  //Welcome Screen form validation

  const initialBudgetForm = useForm<BudgetFormValues>({
    defaultValues: {
      initialBudgetValue: 0,
      initialCurrency: '',
    },
    resolver: yupResolver(initialBudgetSchema) as Resolver<BudgetFormValues, any>,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const { register, control, handleSubmit, formState } = initialBudgetForm;
  const { errors } = formState;

  // Choosen currency name
  const currencyName = useSelector(
    (state: RootState) => state.name.selectedCurrencyOptionRadioButton
  );

  const handleActivateCurrencyRadioButton = (option: string) => {
    dispatch(setCurrency(option));
  };

  const navigateToPrevious = () => {
    navigation.navigate('ThirdWelcomeGraphic');
  };

  const navigateToNext = () => {
    navigation.navigate('FifthWelcomeGraphic');
  };

  const onSubmit = (data: BudgetFormValues) => {
    try {
      console.log('Parameters passed further', data);
      console.log(typeof data.initialBudgetValue);
      console.log(typeof data.initialCurrency);
      navigateToNext();
    } catch (error) {
      console.error('Error in this screen', error);
    }
  };

  const { t } = useTranslation();

  return (
    <LinearGradient
      start={{ x: 0.3, y: 0.9 }}
      end={{ x: 1, y: 0.2 }}
      colors={['lightblue', 'orange', 'yellow', 'gray']}
      locations={[0, 0.1, 0.5, 0.9]}
      style={styles.gradient}
    >
      <ScrollView>
        <View style={styles.firstHint}>
          <View style={[styles.boxContainer3, { justifyContent: 'center' }]}>
            <Text style={{ color: 'black', marginBottom: 20 }}>
              {t('WelcomeScreenFourthGraphicBudgetText')}
            </Text>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  cursorColor={'black'}
                  placeholderTextColor={'black'}
                  placeholder={t('WelcomeScreenFourthGraphicInputBudgetText')}
                  keyboardType="numeric"
                  style={styles.budgetInput}
                  onChangeText={(text: string) => {
                    const formattedText = text.replace(',', '.');
                    const dotCount = formattedText.split('.').length - 1;
                    const dotArray = formattedText.split('.')[1] || '';
                    const numericValue = parseFloat(formattedText);
                    onChange(numericValue);
                    if (dotCount <= 1 && dotArray[2] === '0') {
                    } else {
                      onChange(formattedText);
                      setInputBudgetValue(formattedText);
                      dispatch(setBudgetValue(numericValue));
                    }
                    onBlur();
                  }}
                  value={value ? value.toString() : ''}
                />
              )}
              name="initialBudgetValue"
            />
            {errors.initialBudgetValue && (
              <Text style={{ color: 'red', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                {errors.initialBudgetValue.message}
              </Text>
            )}
            <View style={styles.containerForRadioButton}>
              <View style={styles.containerForRadioButtonInner}>
                {currencies.map((currency, index) => (
                  <View style={{ flexDirection: 'row', gap: 10 }} key={index}>
                    <Controller
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { onChange } }) => (
                        <TouchableOpacity
                          style={[
                            styles.radioButton,
                            currencyName === currency.name && styles.radioButtonSelected,
                          ]}
                          onPress={() => {
                            handleActivateCurrencyRadioButton(currency.name);
                            onChange(currency.name);
                            setInitialCurrency(currency.name);
                          }}
                        />
                      )}
                      name="initialCurrency"
                    />
                    <View style={styles.radioButtons}>
                      <Text style={{ fontWeight: 'bold', color: 'black' }}>
                        {currency.IconSymbol}
                      </Text>
                      <Text style={{ fontWeight: 'bold', color: 'black' }}>{currency.name}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: '2%',
                }}
              >
                {errors.initialCurrency && (
                  <Text
                    style={{
                      color: 'red',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                  >
                    {errors.initialCurrency.message}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.nextButton} onPress={navigateToPrevious}>
              <Text style={{ color: 'black' }}>{t('WelcomeScreenPreviousButtonText')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={handleSubmit(onSubmit)}>
              <Text style={{ color: 'black' }}>{t('WelcomeScreenNextButtonText')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1, height: screenHeight / 4 }}></View>
      </ScrollView>
    </LinearGradient>
  );
};

const FifthGraphic: React.FC<FifthScreenProps> = ({ navigation, route }) => {
  const navigateToPrevious = () => {
    navigation.navigate('FourthWelcomeGraphic');
  };

  const navigateToHome = () => {
    navigation.navigate('HomeScreen');
  };

  const { t } = useTranslation();

  return (
    <LinearGradient
      start={{ x: 0.3, y: 0.9 }}
      end={{ x: 1, y: 0.2 }}
      colors={['lightblue', 'orange', 'yellow', 'gray']}
      locations={[0, 0.1, 0.5, 0.9]}
      style={styles.gradient}
    >
      <ScrollView>
        <View style={styles.firstHint}>
          <View
            style={{
              borderWidth: 2,
              borderColor: 'black',
              flex: 1,
              width: '95%',
              top: '5%',
              alignItems: 'center',
              flexDirection: 'column',
              padding: 10,
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ color: 'black' }}>{t('WelcomeScreenFifthGraphicLoginText')}</Text>
            <GoogleSignInButton />
            <TouchableOpacity
              style={{
                borderColor: 'black',
                borderWidth: 2,
                padding: 8,
                backgroundColor: 'yellow',
                borderRadius: 15,
              }}
            >
              <Text style={{ color: 'black', fontSize: 16 }} onPress={navigateToHome}>
                {t('WelcomeScreenFifthGraphicNextButtonText')}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              top: '10%',
              margin: 30,
              padding: 10,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity style={styles.nextButton} onPress={navigateToPrevious}>
              <Text style={{ color: 'black' }}>{t('WelcomeScreenPreviousButtonText')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1, height: screenHeight / 4 }}></View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  description: {
    justifyContent: 'center',
    top: '10%',
    alignItems: 'center',
    fontSize: 24,
    color: 'black',
  },
  boxContainer: {
    width: '90%',
    alignItems: 'center',
    top: '10%',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'black',
    padding: 3,
    marginBottom: 50,
  },
  boxContainer2: {
    flex: 1,
    alignItems: 'center',
    top: '5%',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'black',
    padding: 3,
    marginBottom: 10,
    backgroundColor: 'silver',
    width: '100%',
  },
  boxContainer3: {
    height: '80%',
    top: '10%',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'black',
    padding: 10,
    marginBottom: 40,
    backgroundColor: 'silver',
    width: '90%',
    margin: 5,
    flexDirection: 'column',
    alignItems: 'center',
  },
  boxContainer4: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'black',
    padding: 10,
    backgroundColor: 'gray',
    width: '90%',
    margin: 50,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  VstackContainer: {
    marginTop: 5,
    alignItems: 'center',
    paddingHorizontal: 3,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: 10,
    gap: 5,
    width: '100%',
  },
  innerVstackContainer: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'black',
  },
  defaultPhoto: {
    width: '100%',
    height: 100,
    marginTop: '2%',
  },
  firstHint: {
    width: '90%',
    height: 650,
    borderColor: 'black',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    alignSelf: 'center',
    top: '10%',
    padding: 10,
  },
  lastHint: {
    width: '90%',
    height: 550,
    borderColor: 'black',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    top: '10%',
    borderRadius: 8,
    borderWidth: 2,
    alignSelf: 'center',
  },
  nextHint: {
    width: '90%',
    height: '90%',
    borderColor: 'black',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    top: '5%',
    borderRadius: 8,
    borderWidth: 2,
    alignSelf: 'center',
  },
  buttons: {
    margin: 20,
    padding: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  textCustom: {
    color: 'black',
    fontSize: 16,
  },
  budgetInput: {
    backgroundColor: 'seashell',
    width: '100%',
    color: 'black',
    fontSize: 18,
  },
  containerForRadioButton: {
    paddingHorizontal: 10,
    marginVertical: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
  },
  containerForRadioButtonInner: {
    flexDirection: 'column',
    gap: 10,
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
  radioButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  radioButtonSelected: {
    backgroundColor: 'blue',
  },
  upperButtons: {
    backgroundColor: 'pink',
  },
  nextButton: {
    backgroundColor: 'lemonchiffon',
    alignItems: 'center',
    width: '30%',
    height: 70,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    justifyContent: 'flex-start',
  },
});

export { WelcomeScreen, SecondGraphic, ThirdGraphic, FourthGraphic, FifthGraphic };

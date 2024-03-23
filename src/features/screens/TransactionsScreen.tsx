import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  FlatList,
  Alert,
} from 'react-native';
import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import ThemeContext from '../themes/themeContext';
import colors from '../themes/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorList } from '../types/Navigator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../rootStates/rootState';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../database/firebase.config';
import { useTranslation } from 'react-i18next';
import ExpenseUpdateModal from '../../components/ExpenseUpdateModal';
import {
  setMainContentScreenExpensesArray,
  setMainContentScreenIncomeArray,
  setMainContentScreenInvestmentsArray,
  setMainContentScreenSavingsArray,
  setTransactionsScreenExpenseUpdateModal,
  setTransactionsScreenIncomeUpdateModal,
  setTransactionsScreenInvestmentsUpdateModal,
  setTransactionsScreenSavingsUpdateModal,
} from '../../redux/actions';
import IncomeUpdateModal from '../../components/IncomeUpdateModal';
import SavingsUpdateModal from '../../components/SavingsUpdateModal';
import InvestmentsUpdateModal from '../../components/InvestmentsUpdateModal';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { User as FirebaseUser } from '@react-native-firebase/auth';
type Props = NativeStackScreenProps<NavigatorList, 'HomeScreen'>;

interface ExpenseItem {
  expenseAccount: string;
  expenseCategory: string;
  expenseDate: string;
  expenseNotes: string;
  expenseTitle: string;
  expenseValue: number;
  expenseCurrency: string;
  id: string;
}

interface IncomeItem {
  incomeAccount: string;
  incomeCategory: string;
  incomeDate: string;
  incomeNotes: string;
  incomeTitle: string;
  incomeValue: number;
  incomeCurrency: string;
  id: string;
}

interface SavingsItem {
  savingsAccount: string;
  savingsCategory: string;
  savingsDate: string;
  savingsNotes: string;
  savingsTitle: string;
  savingsValue: number;
  savingsCurrency: string;
  id: string;
}

interface InvestmentItem {
  investmentAccount: string;
  investmentCategory: string;
  investmentDate: string;
  investmentNotes: string;
  investmentTitle: string;
  investmentValue: number;
  investmentCurrency: string;
  id: string;
}

const ModalPopUp = ({ visible, children }: any) => {
  const [showModal, setShowModal] = useState(visible);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        delay: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => setShowModal(false), 100);
      });
    }
  };

  useEffect(() => {
    toggleModal();
  }, [visible]);
  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackground}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export const ModalPopUpExpensesUpdate = ({ visible, children }: any) => {
  const [showExpensesModal, setShowExpensesModal] = useState(visible);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const toggleModal = () => {
    if (visible) {
      setShowExpensesModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        delay: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => setShowExpensesModal(false), 100);
      });
    }
  };

  useEffect(() => {
    toggleModal();
  }, [visible]);
  return (
    <Modal transparent visible={showExpensesModal}>
      <View style={styles.modalBackground}>
        <Animated.View
          style={[styles.modalContainerUpdate, { transform: [{ scale: scaleValue }] }]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const TransactionsScreen: React.FC<Props> = ({ navigation }) => {
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  const toggleSortModal = () => {
    setIsSortModalVisible(!isSortModalVisible);
  };

  const [selectedOptionRadioButton, setSelectedOptionRadioButton] = useState('');

  const activateRadioButton = (option: string) => {
    setSelectedOptionRadioButton(option);
  };

  const mainContentGoogleAccountName = useSelector(
    (state: RootState) => state.name.googleAccountName
  );

  const theme = { mode: 'dark' };
  let activeColorsDark = colors.dark;
  let activeColorsLight = colors.light;

  const { themeconfig, toggleTheme, useSystemTheme }: any = useContext(ThemeContext);

  //Expenses Transactions
  const expensesArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenExpensesArray
  );

  //Income Transactions
  const incomeArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenIncomeArray
  );

  //Savings Transactions

  const savingsArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenSavingsArray
  );

  //Savings Transactions

  const investmentsArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenInvestmentsArray
  );

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const toggleExpenseUpdateComponentShown = (itemID: string) => {
    //Teraz uniqueID to 1 obiekt z tablicy expensesArray z polem ID na sztywno i zawsze zmianie ulegnie (updateowany) będzie 1 dokument z kolekcji expenseCollection
    //const uniqueDocumentId = expensesArray.length > 0 ? expensesArray[0].id : null;
    const unId = itemID;
    console.log('Expense id', unId);
    dispatch(setTransactionsScreenExpenseUpdateModal(true, unId));
  };

  const toggleIncomeUpdateComponentShown = (itemID: string) => {
    const unId = itemID;
    console.log('Income id', unId);
    dispatch(setTransactionsScreenIncomeUpdateModal(true, unId));
  };

  const toggleSavingsUpdateComponentShown = (itemID: string) => {
    const unId = itemID;
    console.log('Savings id', unId);
    dispatch(setTransactionsScreenSavingsUpdateModal(true, unId));
  };

  const toggleInvestmentsUpdateComponentShown = (itemID: string) => {
    const unId = itemID;
    console.log('Investmetns id', unId);
    dispatch(setTransactionsScreenInvestmentsUpdateModal(true, unId));
  };

  const deleteExpenseDocumentByID = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'expensesCollection', id));
      Alert.alert('Expense was deleted');
    } catch (error) {
      console.log('Error while deleting document', error);
    }
  };

  const deleteIncomeDocumentByID = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'incomeCollection', id));
      Alert.alert('Income was deleted');
    } catch (error) {
      console.log('Error while deleting document', error);
    }
  };

  const deleteSavingsDocumentByID = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'savingsCollection', id));
      Alert.alert('Savings were deleted');
    } catch (error) {
      console.log('Error while deleting document', error);
    }
  };

  const deleteInvestmentsDocumentByID = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'investmentsCollection', id));
      Alert.alert('Investments were deleted');
    } catch (error) {
      console.log('Error while deleting document', error);
    }
  };

  const sortExpenseByDate = () => {
    let sortOrder = '';

    switch (selectedOptionRadioButton) {
      case 'option1':
        sortOrder = 'dsc';
        break;
      case 'option2':
        sortOrder = 'asc';
        break;
      default:
        break;
    }

    const sortedExpenses = expensesArrayOnlyValues.slice().sort((a, b) => {
      const dateA = new Date(a.expenseDate);
      const dateB = new Date(b.expenseDate);

      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else if (sortOrder === 'dsc') {
        return dateB - dateA;
      } else {
        return 0;
      }
    });

    const sortedIncome = incomeArrayOnlyValues.slice().sort((a, b) => {
      const dateA = new Date(a.incomeDate);
      const dateB = new Date(b.incomeDate);

      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else if (sortOrder === 'dsc') {
        return dateB - dateA;
      } else {
        return 0;
      }
    });

    const sortedSavings = savingsArrayOnlyValues.slice().sort((a, b) => {
      const dateA = new Date(a.savingsDate);
      const dateB = new Date(b.savingsDate);

      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else if (sortOrder === 'dsc') {
        return dateB - dateA;
      } else {
        return 0;
      }
    });

    const sortedInvestments = investmentsArrayOnlyValues.slice().sort((a, b) => {
      const dateA = new Date(a.investmentDate);
      const dateB = new Date(b.investmentDate);

      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else if (sortOrder === 'dsc') {
        return dateB - dateA;
      } else {
        return 0;
      }
    });

    dispatch(setMainContentScreenExpensesArray(sortedExpenses));
    dispatch(setMainContentScreenIncomeArray(sortedIncome));
    dispatch(setMainContentScreenSavingsArray(sortedSavings));
    dispatch(setMainContentScreenInvestmentsArray(sortedInvestments));
  };

  const displayExpenseOrder = [
    'expenseCategory',
    'expenseAccount',
    'expenseValue',
    'expenseCurrency',
    'expenseTitle',
    'expenseNotes',
    'expenseDate',
  ];

  const renderItemExpenseUpdate = ({ item, index }: { item: ExpenseItem; index: number }) => {
    const sortedExpenseFields = displayExpenseOrder.filter((field) => field in item);
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'rgba(0,0,0,0.5)',
          width: '100%',
          borderTopRightRadius: 40,
          borderBottomRightRadius: 40,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            backgroundColor: 'crimson',
            padding: 10,
            width: '72%',
          }}
        >
          <Text style={{ marginLeft: 5, color: 'white', fontSize: 18 }}>{`${t(
            'TransactionsScreenEachExpenseText'
          )} ${index + 1}`}</Text>
          {sortedExpenseFields.map(
            (key) =>
              key !== 'id' && (
                <Text
                  key={key}
                  style={{ marginLeft: 10, color: 'white' }}
                >{`${key}: ${item[key]}`}</Text>
              )
          )}
        </View>
        <View
          style={{
            flexDirection: 'column',
            backgroundColor: 'blue',
            width: '28%',
            borderTopRightRadius: 40,
            borderBottomRightRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: 'orange',
              width: '100%',
              flex: 1,
              borderTopRightRadius: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'black',
            }}
            onPress={() => {
              item.id && toggleExpenseUpdateComponentShown(item.id.toString());
            }}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>
              {t('TransactionsScreenUpdateModalText')}
            </Text>
          </TouchableOpacity>
          {<ExpenseUpdateModal />}
          <TouchableOpacity
            style={{
              backgroundColor: 'gray',
              width: '100%',
              flex: 1,
              borderBottomRightRadius: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'black',
            }}
            onPress={() => deleteExpenseDocumentByID(item.id)}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>
              {t('TransactionsScreenDeleteButtonText')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const displayIncomeOrder = [
    'incomeCategory',
    'incomeAccount',
    'incomeValue',
    'incomeCurrency',
    'incomeTitle',
    'incomeNotes',
    'incomeDate',
  ];

  const renderItemIncomeUpdate = ({ item, index }: { item: IncomeItem; index: number }) => {
    const sortedIncomeFields = displayIncomeOrder.filter((field) => field in item);
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'rgba(0,0,0,0.5)',
          width: '100%',
          borderTopRightRadius: 40,
          borderBottomRightRadius: 40,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            backgroundColor: 'green',
            padding: 10,
            width: '72%',
          }}
        >
          <Text style={{ marginLeft: 5, color: 'white', fontSize: 18 }}>{`${t(
            'TransactionsScreenEachIncomeText'
          )} ${index + 1}`}</Text>
          {sortedIncomeFields.map(
            (key) =>
              key !== 'id' && (
                <Text
                  key={key}
                  style={{ marginLeft: 10, color: 'white' }}
                >{`${key}: ${item[key]}`}</Text>
              )
          )}
        </View>
        <View
          style={{
            flexDirection: 'column',
            backgroundColor: 'blue',
            width: '28%',
            borderTopRightRadius: 40,
            borderBottomRightRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: 'orange',
              width: '100%',
              flex: 1,
              borderTopRightRadius: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'black',
            }}
            onPress={() => {
              item.id && toggleIncomeUpdateComponentShown(item.id);
            }}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>
              {t('TransactionsScreenUpdateModalText')}
            </Text>
          </TouchableOpacity>
          {<IncomeUpdateModal />}
          <TouchableOpacity
            style={{
              backgroundColor: 'gray',
              width: '100%',
              flex: 1,
              borderBottomRightRadius: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'black',
            }}
            onPress={() => deleteIncomeDocumentByID(item.id)}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>
              {t('TransactionsScreenDeleteButtonText')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const displaySavingsOrder = [
    'savingsCategory',
    'savingsAccount',
    'savingsValue',
    'savingsCurrency',
    'savingsTitle',
    'savingsNotes',
    'savingsDate',
  ];

  const renderItemSavingsUpdate = ({ item, index }: { item: SavingsItem; index: number }) => {
    const sortedSavingsFields = displaySavingsOrder.filter((field) => field in item);
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'rgba(0,0,0,0.5)',
          width: '100%',
          borderTopRightRadius: 40,
          borderBottomRightRadius: 40,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            backgroundColor: 'gold',
            padding: 10,
            width: '72%',
          }}
        >
          <Text style={{ marginLeft: 5, color: 'black', fontSize: 18 }}>{`${t(
            'TransactionsScreenEachSavingsText'
          )} ${index + 1}`}</Text>
          {sortedSavingsFields.map(
            (key) =>
              key !== 'id' && (
                <Text
                  key={key}
                  style={{ marginLeft: 10, color: 'black' }}
                >{`${key}: ${item[key]}`}</Text>
              )
          )}
        </View>
        <View
          style={{
            flexDirection: 'column',
            backgroundColor: 'blue',
            width: '28%',
            borderTopRightRadius: 40,
            borderBottomRightRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: 'orange',
              width: '100%',
              flex: 1,
              borderTopRightRadius: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'black',
            }}
            onPress={() => {
              item.id && toggleSavingsUpdateComponentShown(item.id);
            }}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>
              {t('TransactionsScreenUpdateModalText')}
            </Text>
          </TouchableOpacity>
          {<SavingsUpdateModal />}
          <TouchableOpacity
            style={{
              backgroundColor: 'gray',
              width: '100%',
              flex: 1,
              borderBottomRightRadius: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'black',
            }}
            onPress={() => deleteSavingsDocumentByID(item.id)}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>
              {t('TransactionsScreenDeleteButtonText')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const displayInvestmentOrder = [
    'investmentCategory',
    'investmentAccount',
    'investmentValue',
    'investmentCurrecny',
    'investmentTitle',
    'investmentNotes',
    'investmentDate',
  ];

  const renderItemInvestmentsUpdate = ({
    item,
    index,
  }: {
    item: InvestmentItem;
    index: number;
  }) => {
    const sortedInvestmentFields = displayInvestmentOrder.filter((field) => field in item);
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'rgba(0,0,0,0.5)',
          width: '100%',
          borderTopRightRadius: 40,
          borderBottomRightRadius: 40,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            backgroundColor: 'royalblue',
            padding: 10,
            width: '72%',
          }}
        >
          <Text style={{ marginLeft: 5, color: 'white', fontSize: 18 }}>{`${t(
            'TransactionsScreenEachInvestmentText'
          )} ${index + 1}`}</Text>
          {sortedInvestmentFields.map(
            (key) =>
              key !== 'id' && (
                <Text
                  key={key}
                  style={{ marginLeft: 10, color: 'white' }}
                >{`${key}: ${item[key]}`}</Text>
              )
          )}
        </View>
        <View
          style={{
            flexDirection: 'column',
            backgroundColor: 'blue',
            width: '28%',
            borderTopRightRadius: 40,
            borderBottomRightRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: 'orange',
              width: '100%',
              flex: 1,
              borderTopRightRadius: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'black',
            }}
            onPress={() => {
              item.id && toggleInvestmentsUpdateComponentShown(item.id);
            }}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>
              {t('TransactionsScreenUpdateModalText')}
            </Text>
          </TouchableOpacity>
          {<InvestmentsUpdateModal />}
          <TouchableOpacity
            style={{
              backgroundColor: 'gray',
              width: '100%',
              flex: 1,
              borderBottomRightRadius: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'black',
            }}
            onPress={() => deleteInvestmentsDocumentByID(item.id)}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>
              {t('TransactionsScreenDeleteButtonText')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const { isGoogleUserLoggedIn, userGoogleUId } = useSelector(
    (state: RootState) => state.name.isGoogleUser
  );

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user: FirebaseUser | null) => {
      if (user) {
        console.log('User is still logged in', user.email);
        Alert.alert('You are logged in');
      } else {
        console.log('not logged in', user);
        Alert.alert('User is not logged in');
      }
    });
    return () => unsubscribe();
  }, [mainContentGoogleAccountName, userGoogleUId, isGoogleUserLoggedIn]);

  useEffect(() => {
    expensesArrayOnlyValues.map((expense, index) => {
      const id = expense.id;
      console.log(`Expense at index ${index} has id: ${id}`);
    });
    incomeArrayOnlyValues.map((income, index) => {
      const id = income.id;
      console.log(`Income at index ${index} has id: ${id}`);
    });
    savingsArrayOnlyValues.map((savings, index) => {
      const id = savings.id;
      console.log(`Savings at index ${index} has id: ${id}`);
    });
    investmentsArrayOnlyValues.map((investment, index) => {
      const id = investment.id;
      console.log(`Investment at index ${index} has id: ${id}`);
    });
  }, [
    expensesArrayOnlyValues,
    incomeArrayOnlyValues,
    savingsArrayOnlyValues,
    investmentsArrayOnlyValues,
  ]);

  return (
    <View
      style={[
        styles.transactionMainContainer,
        {
          backgroundColor:
            themeconfig === theme.mode ? activeColorsDark.primary : activeColorsLight.accent,
        },
      ]}
    >
      <View
        style={{
          ...styles.titleContainer,
          backgroundColor:
            themeconfig === theme.mode ? activeColorsDark.secondary : activeColorsLight.tint,
        }}
      >
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
        <Text
          style={{
            color:
              themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.secondary,
          }}
        >
          {t('TransactionsScreenAppBarText')}
        </Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="sort" color="white" size={30} onPress={toggleSortModal} />
        </TouchableOpacity>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ModalPopUp visible={isSortModalVisible}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={toggleSortModal}>
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
                    color: theme.mode ? activeColorsDark.primary : activeColorsLight.tint,
                  }}
                >
                  {t('TransactionsScreenSortModalHeaderText')}
                </Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
            </View>
          </View>
          <View style={styles.containerForRadioButton}>
            <View style={styles.containerForRadioButtonInner}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  selectedOptionRadioButton === 'option1' && styles.radioButtonSelected,
                ]}
                onPress={() => {
                  activateRadioButton('option1');
                  sortExpenseByDate();
                }}
              />
              <Text
                style={{
                  color:
                    themeconfig === theme.mode ? activeColorsDark.primary : activeColorsLight.tint,
                }}
              >
                {t('TransactionsScreenSortModalDesc')}
              </Text>
            </View>
            <View style={styles.containerForRadioButtonInner}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  selectedOptionRadioButton === 'option2' && styles.radioButtonSelected,
                ]}
                onPress={() => {
                  activateRadioButton('option2');
                  sortExpenseByDate();
                }}
              />
              <Text
                style={{
                  color:
                    themeconfig === theme.mode ? activeColorsDark.primary : activeColorsLight.tint,
                }}
              >
                {t('TransactionsScreenSortModalAsc')}
              </Text>
            </View>
          </View>
        </ModalPopUp>
      </View>

      <ScrollView>
        <View style={styles.VStackContentContainer}>
          <View style={styles.VStackContentContainerInner}>
            <View
              style={{
                flexDirection: 'column',
                backgroundColor: 'rgba(0,0,0,0.5)',
                width: '100%',
                borderTopRightRadius: 40,
                borderBottomRightRadius: 40,
              }}
            >
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ marginLeft: 5, color: 'white', fontSize: 18 }}>
                  {t('TransactionsScreenExpensesCategoryText')}
                </Text>
                <FlatList
                  data={expensesArrayOnlyValues}
                  renderItem={renderItemExpenseUpdate}
                  keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
                  style={{
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    width: '100%',
                    padding: 10,
                  }}
                  scrollEnabled={false}
                />
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ marginLeft: 5, color: 'white', fontSize: 18 }}>
                  {t('TransactionsScreenIncomeCategoryText')}
                </Text>
                <FlatList
                  data={incomeArrayOnlyValues}
                  renderItem={renderItemIncomeUpdate}
                  keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
                  style={{
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    width: '100%',
                    padding: 10,
                  }}
                  scrollEnabled={false}
                />
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ marginLeft: 5, color: 'white', fontSize: 18 }}>
                  {t('TransactionsScreenSavingsCategoryText')}
                </Text>
                <FlatList
                  data={savingsArrayOnlyValues}
                  renderItem={renderItemSavingsUpdate}
                  keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
                  style={{
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    width: '100%',
                    padding: 10,
                  }}
                  scrollEnabled={false}
                />
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ marginLeft: 5, color: 'white', fontSize: 18 }}>
                  {t('TransactionsScreenInvestmentCategoryText')}
                </Text>
                <FlatList
                  data={investmentsArrayOnlyValues}
                  renderItem={renderItemInvestmentsUpdate}
                  keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
                  style={{
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    width: '100%',
                    padding: 10,
                  }}
                  scrollEnabled={false}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionMainContainer: {
    height: '100%',
  },
  titleContainer: {
    padding: 5,
    margin: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
  },
  VStackContentContainer: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 4,
    marginTop: 20,
    flex: 1,
    margin: 5,
  },
  VStackContentContainerInner: {
    backgroundColor: 'navy',
    alignItems: 'center',
    padding: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 20,
    elevation: 20,
  },
  modalContainerUpdate: {
    width: '90%',
    backgroundColor: 'white',
    paddingHorizontal: 5,
    paddingVertical: 40,
    borderRadius: 20,
    elevation: 20,
    height: '80%',
  },
  containerForRadioButton: {
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  containerForRadioButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    borderRadius: 15,
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
});

export default TransactionsScreen;

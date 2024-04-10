import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { FirebaseAuth, db } from '../database/firebase.config';
import { setDoc, doc, addDoc, collection, getDocs, where, query } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../rootStates/rootState';
import { setMainContentScreenExpensesArray } from '../redux/actions';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import auth from '@react-native-firebase/auth';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

const GetAllExpensesDocs = () => {
  const [expensesArray, setExpensesArray] = useState<any[]>([]);

  const dispatch = useDispatch();
  const expensesArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenExpensesArray
  );

  const currentOneMonthFilterStatus = useSelector(
    (state: RootState) => state.name.onlyOneMonthDocs
  );
  const currentThreeMonthsFilterStatus = useSelector(
    (state: RootState) => state.name.onlyThreeMonthsDocs
  );

  const currentSixMonthsFilterStatus = useSelector(
    (state: RootState) => state.name.onlySixMonthsDocs
  );

  const currentOneYearFilterStatus = useSelector((state: RootState) => state.name.onlyOneYearDocs);

  const ReadAllDocs = useCallback(
    async (user) => {
      try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const currentUser = firebase.auth().currentUser;
        if (!user) {
          console.log('User is not logged in');
        }
        const expensesCollectionRef = firebase.firestore().collection('expensesCollection');

        const q = await expensesCollectionRef.where('userId', '==', user.uid).get();
        const parsedResult = q.docs.map((doc) => {
          const data = doc.data();
          const parsedDate = new Date(data.expenseDate);

          return {
            ...data,
            id: doc.id,
            expenseDate: parsedDate,
          };
        });

        switch (true) {
          case currentOneMonthFilterStatus: {
            let filteredExpenses: any[] = [];
            filteredExpenses = parsedResult.filter((expense) => {
              const expenseMonth = expense.expenseDate.getMonth();
              const expenseYear = expense.expenseDate.getFullYear();

              return expenseMonth === currentMonth && expenseYear === currentYear;
            });

            setExpensesArray(filteredExpenses);
            dispatch(
              setMainContentScreenExpensesArray(
                q.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
              )
            );
            break;
          }

          case currentThreeMonthsFilterStatus: {
            let filteredExpenses: any[] = [];
            filteredExpenses = parsedResult.filter((expense) => {
              const expenseMonth = expense.expenseDate.getMonth();
              const expenseYear = expense.expenseDate.getFullYear();

              const isLastThreeMonths =
                expenseYear === currentYear ||
                currentMonth - expenseMonth <= 2 ||
                currentMonth - expenseMonth >= 0;

              return isLastThreeMonths;
            });
            setExpensesArray(filteredExpenses);
            dispatch(
              setMainContentScreenExpensesArray(
                q.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
              )
            );
            break;
          }

          case currentSixMonthsFilterStatus: {
            let filteredExpenses: any[] = [];
            filteredExpenses = parsedResult.filter((expense) => {
              const expenseMonth = expense.expenseDate.getMonth();
              const expenseYear = expense.expenseDate.getFullYear();
              const isLastSixMonths =
                expenseYear === currentYear ||
                currentMonth - expenseMonth <= 5 ||
                currentMonth - expenseMonth >= 0;

              return isLastSixMonths;
            });

            setExpensesArray(filteredExpenses);
            dispatch(
              setMainContentScreenExpensesArray(
                q.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
              )
            );
            break;
          }

          case currentOneYearFilterStatus: {
            let filteredExpenses: any[] = [];
            filteredExpenses = parsedResult.filter((expense) => {
              const expenseMonth = expense.expenseDate.getMonth();
              const expenseYear = expense.expenseDate.getFullYear();

              const isOneYear = expenseYear <= currentYear || currentMonth - expenseMonth <= 11;

              return isOneYear;
            });

            setExpensesArray(filteredExpenses);
            dispatch(
              setMainContentScreenExpensesArray(
                q.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
              )
            );
            break;
          }
          default:
            let filteredExpenses: any[] = [];
            setExpensesArray(filteredExpenses);
            filteredExpenses = q.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            dispatch(
              setMainContentScreenExpensesArray(
                q.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
              )
            );
            setExpensesArray(filteredExpenses);
        }
      } catch (error) {
        console.log('Error while reading the all Expenses data', error);
      }
    },
    [
      dispatch,
      currentOneMonthFilterStatus,
      currentThreeMonthsFilterStatus,
      currentSixMonthsFilterStatus,
      currentOneYearFilterStatus,
    ]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FirebaseAuth, (user) => {
      if (user) {
        console.log('OK');
        ReadAllDocs(user);
      } else {
        console.log('You must log in');
        Alert.alert('You must log in');
        setExpensesArray([]);
      }
    });

    return () => unsubscribe();
  }, [ReadAllDocs]);

  return (
    <View style={{ flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center' }}>
      {expensesArray.map((expense: any) => (
        <View
          key={expense.id}
          style={{
            flexDirection: 'column',
            width: '100%',
            backgroundColor: 'crimson',
            marginTop: 10,
            marginBottom: 10,
            margin: 1,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              backgroundColor: 'lightgoldenrodyellow',
              padding: 5,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: 'black',
                fontSize: 18,
              }}
            >{`${expense.expenseTitle}`}</Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 5,
              marginTop: 5,
              padding: 15,
              borderRadius: 10,
              flex: 1,
              flexWrap: 'wrap',
            }}
          >
            <Text
              style={{
                color: 'ivory',
                fontSize: 18,
              }}
            >{`${expense.expenseCategory}`}</Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text
                style={{
                  color: 'red',
                  fontSize: 18,
                }}
              >{`-${expense.expenseValue}`}</Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                }}
              >{`${expense.expenseCurrency}`}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default GetAllExpensesDocs;

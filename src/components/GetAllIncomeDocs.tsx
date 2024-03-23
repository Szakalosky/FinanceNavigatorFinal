import { View, Text, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { FirebaseAuth, db } from '../database/firebase.config';
import { setDoc, doc, addDoc, collection, getDocs, where, query } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../rootStates/rootState';
import { setMainContentScreenIncomeArray } from '../redux/actions';
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

const GetAllIncomeDocs = () => {
  const [incomeArray, setIncomeArray] = useState<any[]>([]);

  const dispatch = useDispatch();
  const incomeArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenIncomeArray
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
  const ReadAllIncomeDocs = useCallback(
    async (user) => {
      try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        if (!user) {
          console.log('User is not logged in');
        }
        const incomeCollectionRef = firebase.firestore().collection('incomeCollection');

        const q = await incomeCollectionRef.where('userId', '==', user.uid).get();
        const parsedResult = q.docs.map((doc) => {
          const data = doc.data();
          const parsedDate = new Date(data.incomeDate);

          return {
            ...data,
            id: doc.id,
            incomeDate: parsedDate,
          };
        });

        switch (true) {
          case currentOneMonthFilterStatus: {
            let filteredIncome: any[] = [];
            filteredIncome = parsedResult.filter((income) => {
              const incomeMonth = income.incomeDate.getMonth();
              const incomeYear = income.incomeDate.getFullYear();

              return incomeMonth === currentMonth && incomeYear === currentYear;
            });

            setIncomeArray(filteredIncome);
            dispatch(
              setMainContentScreenIncomeArray(q.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            );
            break;
          }
          case currentThreeMonthsFilterStatus: {
            let filteredIncome: any[] = [];
            filteredIncome = parsedResult.filter((income) => {
              const incomeMonth = income.incomeDate.getMonth();
              const incomeYear = income.incomeDate.getFullYear();

              const isLastThreeMonths =
                incomeYear === currentYear ||
                currentMonth - incomeMonth <= 2 ||
                currentMonth - incomeMonth >= 0;

              return isLastThreeMonths;
            });

            setIncomeArray(filteredIncome);
            dispatch(
              setMainContentScreenIncomeArray(q.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            );
            break;
          }
          case currentSixMonthsFilterStatus: {
            let filteredIncome: any[] = [];
            filteredIncome = parsedResult.filter((income) => {
              const incomeMonth = income.incomeDate.getMonth();
              const incomeYear = income.incomeDate.getFullYear();

              const isLastSixMonths =
                incomeYear === currentYear ||
                currentMonth - incomeMonth <= 5 ||
                currentMonth - incomeMonth >= 0;

              return isLastSixMonths;
            });

            setIncomeArray(filteredIncome);
            dispatch(
              setMainContentScreenIncomeArray(q.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            );
            break;
          }
          case currentOneYearFilterStatus: {
            let filteredIncome: any[] = [];
            filteredIncome = parsedResult.filter((income) => {
              const incomeMonth = income.incomeDate.getMonth();
              const incomeYear = income.incomeDate.getFullYear();

              const isOneYear = incomeYear <= currentYear || currentMonth - incomeMonth <= 11;

              return isOneYear;
            });

            setIncomeArray(filteredIncome);
            dispatch(
              setMainContentScreenIncomeArray(q.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            );
            break;
          }

          default:
            let filteredIncome: any[] = [];
            filteredIncome = q.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            dispatch(
              setMainContentScreenIncomeArray(q.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            );
            setIncomeArray(filteredIncome);
        }
      } catch (error) {
        console.log('Error while reading the all data', error);
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
        ReadAllIncomeDocs(user);
      } else {
        console.log('You must log in');
        setIncomeArray([]);
      }
    });

    return () => unsubscribe();
  }, [ReadAllIncomeDocs]);

  return (
    <View style={{ flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center' }}>
      {incomeArray.map((income: any) => (
        <View
          key={income.id}
          style={{
            flexDirection: 'column',
            margin: 1,
            width: '100%',
            backgroundColor: 'green',
            marginTop: 10,
            marginBottom: 10,
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
            >{`${income.incomeTitle}`}</Text>
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
            >{`${income.incomeCategory}`}</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text
                style={{
                  color: 'green',
                  fontSize: 18,
                }}
              >{`+${income.incomeValue}`}</Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                }}
              >{`${income.incomeCurrency}`}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default GetAllIncomeDocs;

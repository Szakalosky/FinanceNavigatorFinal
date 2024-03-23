import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { FirebaseAuth, db } from '../database/firebase.config';
import { setDoc, doc, addDoc, collection, getDocs, where, query } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../rootStates/rootState';
import { setMainContentScreenSavingsArray } from '../redux/actions';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const GetAllSavingsDocs = () => {
  const [savingsArray, setSavingsArray] = useState<any[]>([]);

  const dispatch = useDispatch();
  const savingsArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenSavingsArray
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

  const ReadAllSavingsDocs = useCallback(
    async (user) => {
      try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        if (!user) {
          console.log('User is not logged in');
        }

        const savingsCollectionRef = firebase.firestore().collection('savingsCollection');

        const q = await savingsCollectionRef.where('userId', '==', user.uid).get();
        const parsedResult = q.docs.map((doc) => {
          const data = doc.data();
          const parsedDate = new Date(data.savingsDate);

          return {
            ...data,
            id: doc.id,
            savingsDate: parsedDate,
          };
        });

        switch (true) {
          case currentOneMonthFilterStatus: {
            let filteredSavings: any[] = [];
            filteredSavings = parsedResult.filter((savings) => {
              const savingsMonth = savings.savingsDate.getMonth();
              const savingsYear = savings.savingsDate.getFullYear();

              return savingsMonth === currentMonth && savingsYear === currentYear;
            });

            setSavingsArray(filteredSavings);
            dispatch(
              setMainContentScreenSavingsArray(q.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            );
            break;
          }
          case currentThreeMonthsFilterStatus: {
            let filteredSavings: any[] = [];
            filteredSavings = parsedResult.filter((savings) => {
              const savingsMonth = savings.savingsDate.getMonth();
              const savingsYear = savings.savingsDate.getFullYear();

              const isLastThreeMonths =
                savingsYear === currentYear ||
                currentMonth - savingsMonth <= 2 ||
                currentMonth - savingsMonth >= 0;

              return isLastThreeMonths;
            });

            setSavingsArray(filteredSavings);
            dispatch(
              setMainContentScreenSavingsArray(q.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            );
            break;
          }
          case currentSixMonthsFilterStatus: {
            let filteredSavings: any[] = [];
            filteredSavings = parsedResult.filter((savings) => {
              const savingsMonth = savings.savingsDate.getMonth();
              const savingsYear = savings.savingsDate.getFullYear();

              const isLastSixMonths =
                savingsYear === currentYear ||
                currentMonth - savingsMonth <= 5 ||
                currentMonth - savingsMonth >= 0;

              return isLastSixMonths;
            });

            setSavingsArray(filteredSavings);
            dispatch(
              setMainContentScreenSavingsArray(q.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            );
            break;
          }
          case currentOneYearFilterStatus: {
            let filteredSavings: any[] = [];
            filteredSavings = parsedResult.filter((savings) => {
              const savingsMonth = savings.savingsDate.getMonth();
              const savingsYear = savings.savingsDate.getFullYear();

              const isOneYear = savingsYear <= currentYear || currentMonth - savingsMonth <= 11;

              return isOneYear;
            });

            setSavingsArray(filteredSavings);
            dispatch(
              setMainContentScreenSavingsArray(q.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            );
            break;
          }
          default:
            let filteredSavings: any[] = [];
            filteredSavings = q.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            dispatch(
              setMainContentScreenSavingsArray(q.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            );
            setSavingsArray(filteredSavings);
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
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        console.log('OK USER');
        ReadAllSavingsDocs(user);
      } else {
        console.log('You must log in');
        setSavingsArray([]);
      }
    });

    return () => unsubscribe();
  }, [ReadAllSavingsDocs]);

  return (
    <View style={{ flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center' }}>
      {savingsArray.map((savings: any) => (
        <View
          key={savings.id}
          style={{
            flexDirection: 'column',
            width: '100%',
            backgroundColor: 'gold',
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
            >{`${savings.savingsTitle}`}</Text>
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
                fontSize: 16,
              }}
            >{`${savings.savingsCategory}`}</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text
                style={{
                  color: 'yellow',
                  fontSize: 16,
                }}
              >{`+${savings.savingsValue}`}</Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                }}
              >{`${savings.savingsCurrency}`}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default GetAllSavingsDocs;

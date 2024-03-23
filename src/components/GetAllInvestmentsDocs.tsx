import { View, Text, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { FirebaseAuth, db } from '../database/firebase.config';
import { setDoc, doc, addDoc, collection, getDocs, where, query } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../rootStates/rootState';
import { setMainContentScreenInvestmentsArray } from '../redux/actions';
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

const GetAllInvestmentsDocs = () => {
  const [investmentsArray, setInvestmentsArray] = useState<any[]>([]);

  const dispatch = useDispatch();
  const investmentArrayOnlyValues = useSelector(
    (state: RootState) => state.name.mainContentScreenInvestmentsArray
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

  const ReadAllInvestmentsDocs = useCallback(
    async (user) => {
      try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        if (!user) {
          console.log('User is not logged in');
        }
        const investmentsCollectionRef = firebase.firestore().collection('investmentsCollection');

        const q = await investmentsCollectionRef.where('userId', '==', user.uid).get();
        const parsedResult = q.docs.map((doc) => {
          const data = doc.data();
          const parsedDate = new Date(data.investmentDate);

          return {
            ...data,
            id: doc.id,
            investmentDate: parsedDate,
          };
        });

        switch (true) {
          case currentOneMonthFilterStatus: {
            let filteredInvestment: any[] = [];
            filteredInvestment = parsedResult.filter((investment) => {
              const investmentMonth = investment.investmentDate.getMonth();
              const investmentYear = investment.investmentDate.getFullYear();

              return investmentMonth === currentMonth && investmentYear === currentYear;
            });

            setInvestmentsArray(filteredInvestment);
            dispatch(
              setMainContentScreenInvestmentsArray(
                q.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
              )
            );
            break;
          }
          case currentThreeMonthsFilterStatus: {
            let filteredInvestment: any[] = [];
            filteredInvestment = parsedResult.filter((investment) => {
              const investmentMonth = investment.investmentDate.getMonth();
              const investmentYear = investment.investmentDate.getFullYear();

              const isLastThreeMonths =
                investmentYear === currentYear ||
                currentMonth - investmentMonth <= 2 ||
                currentMonth - investmentMonth >= 0;

              return isLastThreeMonths;
            });

            setInvestmentsArray(filteredInvestment);
            dispatch(
              setMainContentScreenInvestmentsArray(
                q.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
              )
            );
            break;
          }
          case currentSixMonthsFilterStatus: {
            let filteredInvestment: any[] = [];
            filteredInvestment = parsedResult.filter((investment) => {
              const investmentMonth = investment.investmentDate.getMonth();
              const investmentYear = investment.investmentDate.getFullYear();

              const isLastSixMonths =
                investmentYear === currentYear ||
                currentMonth - investmentMonth <= 5 ||
                currentMonth - investmentMonth >= 0;

              return isLastSixMonths;
            });

            setInvestmentsArray(filteredInvestment);
            dispatch(
              setMainContentScreenInvestmentsArray(
                q.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
              )
            );
            break;
          }
          case currentOneYearFilterStatus: {
            let filteredInvestment: any[] = [];
            filteredInvestment = parsedResult.filter((investment) => {
              const investmentMonth = investment.investmentDate.getMonth();
              const investmentYear = investment.investmentDate.getFullYear();

              const isOneYear =
                investmentYear <= currentYear || currentMonth - investmentMonth <= 11;

              return isOneYear;
            });

            setInvestmentsArray(filteredInvestment);
            dispatch(
              setMainContentScreenInvestmentsArray(
                q.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
              )
            );
            break;
          }
          default:
            let filteredInvestment: any[] = [];
            filteredInvestment = q.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            dispatch(
              setMainContentScreenInvestmentsArray(
                q.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
              )
            );
            setInvestmentsArray(filteredInvestment);
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
        ReadAllInvestmentsDocs(user);
      } else {
        console.log('You must log in');
        setInvestmentsArray([]);
      }
    });

    return () => unsubscribe();
  }, [ReadAllInvestmentsDocs]);

  return (
    <View style={{ flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center' }}>
      {investmentsArray.map((investments: any) => (
        <View
          key={investments.id}
          style={{
            flexDirection: 'column',
            margin: 1,
            width: '100%',
            backgroundColor: 'royalblue',
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
            >{`${investments.investmentTitle}`}</Text>
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
            >{`${investments.investmentCategory}`}</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text
                style={{
                  color: 'deepskyblue',
                  fontSize: 16,
                }}
              >{`+${investments.investmentValue}`}</Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                }}
              >{`${investments.investmentCurrency}`}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default GetAllInvestmentsDocs;

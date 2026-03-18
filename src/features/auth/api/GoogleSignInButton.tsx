import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../rootStates/rootState';
import { getGoogleAccountName, setKeepUserLoggedIn } from '../../../redux/actions';
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../database/firebase.config';
import { GoogleAuthProvider } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { Dimensions } from 'react-native';
import { User as FirebaseUser } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const GoogleSignInButton = () => {
  const { isGoogleUserLoggedIn, userGoogleUId } = useSelector(
    (state: RootState) => state.name.isGoogleUser
  );

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: '333948556331-0psqckb5nkj16h7h6s9gh9maone65a6a.apps.googleusercontent.com',
    });
  }, [userGoogleUId, isGoogleUserLoggedIn]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [givenName, setGivenName] = useState<string | null>();
  const [userInfo, setUserInfo] = useState(null);

  const dispatch = useDispatch();

  const handleGoogleAccountName = (name: string | null) => {
    dispatch(getGoogleAccountName(name));
  };

  const handleKeepUserLoggedIn = (isLoggedIn: boolean, uid: string | null) => {
    dispatch(setKeepUserLoggedIn(isLoggedIn, uid));
  };

  const { t } = useTranslation();

  const mainContentGoogleAccountName = useSelector(
    (state: RootState) => state.name.googleAccountName
  );

  const signIn = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      //const user_sign_in = auth().signInWithCredential(googleCredential);
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
              })
              .catch((error) => {
                console.error('Error adding Google data to Firestore', error);
              });
          } else {
            console.error('Current user is null. Unable to update Firestore.');
          }
        })
        .catch((error: any) => {
          console.log('Signed in failed', error);
          console.log('Google data were not added to firestore', error);
          setIsLoggedIn(false);
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

  const logoutSuccess = async () => {
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
      setIsLoggedIn(false);
      dispatch(getGoogleAccountName(''));
      handleKeepUserLoggedIn(false, '');
    } catch (error) {
      Alert.alert('You have been signed out');
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (authUser: FirebaseUser) => {
      if (authUser) {
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
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '50%',
      }}
    >
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
        style={{ width: screenWidth - screenWidth / 4 }}
      />
      {userGoogleUId ? (
        <View
          style={{
            alignItems: 'center',
            width: '100%',
            height: '50%',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: 'black', fontSize: 16 }}>
            {t('WelcomeScreenFifthGraphicGoogleLogInAsText')} {userGoogleUId}
          </Text>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: 'black',
              borderWidth: 2,
              padding: 8,
              backgroundColor: 'white',
              borderRadius: 15,
              width: 150,
            }}
            onPress={logoutSuccess}
          >
            <Image
              style={{ width: 48, height: 48, marginRight: 8 }}
              source={require('../../../assets/images/icons8-google-48.png')}
              alt="google-logo"
            />
            <Text style={{ color: 'black' }}>{t('WelcomeScreenFifthGraphicGoogleLogoutText')}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default GoogleSignInButton;

import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch, useSelector } from 'react-redux';
import { setConnectedState } from '../redux/actions';
import { RootState } from '../rootStates/rootState';
import { useTranslation } from 'react-i18next';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const ConnectedToTheNet = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(false);
  const [hasConnectionForFiveSecs, setHasConnectionForFiveSecs] = useState<boolean>(false);

  const dispatch = useDispatch();
  const checkNetworkConn = useSelector((state: RootState) => state.name.isConnectedToNetwork);

  const { t } = useTranslation();
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
      }
    });

    return () => unsubscribe();
  }, [isConnected, checkNetworkConn]);

  return (
    <View style={{ ...styles.bottomViewContainer, bottom: 60 }}>
      {isConnected ? (
        <View
          style={
            hasConnectionForFiveSecs
              ? styles.bottomViewConnectedExtended
              : styles.bottomViewConnected
          }
        >
          <Text style={styles.bottomViewText}>{t('ConnectedToTheNetOnText')}</Text>
        </View>
      ) : (
        <View style={styles.bottomViewDisconnected}>
          <Text style={styles.bottomViewText}>{t('ConnectedToTheNetOffText')}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomViewContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'transparent',
  },
  bottomViewConnected: {
    backgroundColor: 'green',
    color: 'white',
    padding: 10,
    textAlign: 'center',
  },
  bottomViewConnectedExtended: {
    backgroundColor: 'green',
    padding: 10,
    textAlign: 'center',
    transform: [{ translateX: screenWidth }],
  },
  bottomViewDisconnected: {
    backgroundColor: 'red',
    color: 'white',
    padding: 10,
    textAlign: 'center',
  },
  bottomViewText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ConnectedToTheNet;

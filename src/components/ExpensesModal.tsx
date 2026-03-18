import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import React, { useState, useContext, useEffect, useRef } from 'react';
import ModalPopUp from './ModalPopUp';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../features/themes/theme';
import ThemeContext from '../features/themes/themeContext';
const ExpensesModal = ({ visible, onClose }: any) => {
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

  const theme = { mode: 'dark' };
  let activeColors = colors.dark;
  let activeColors2 = colors.light;

  const { themeconfig, toggleTheme, useSystemTheme }: any = useContext(ThemeContext);

  useEffect(() => {
    toggleModal();
  }, [showExpensesModal]);
  return (
    <Modal transparent visible={showExpensesModal}>
      <View style={{ alignItems: 'center', height: 400, width: 400 }}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => {
              onClose();
            }}
          >
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
              Expenses
            </Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    width: '100%',
    height: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default ExpensesModal;

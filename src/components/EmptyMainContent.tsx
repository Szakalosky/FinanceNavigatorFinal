import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NavigatorList } from '../features/types/Navigator';
import { RouteProp } from '@react-navigation/native';
import colors from '../features/themes/theme';
import ThemeContext from '../features/themes/themeContext';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../rootStates/rootState';

export type HomeScreenProps = {
  navigation: DrawerNavigationProp<NavigatorList, 'HomeScreen'>;
  route: RouteProp<NavigatorList, 'HomeScreen'>;
};

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const initialOffset = screenWidth / 2;

const EmptyMainContent: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const angleRotation = useSharedValue(0);
  const { t } = useTranslation();

  const animateIconRotation = () => {
    angleRotation.value = withRepeat(
      withTiming(360, {
        duration: 2000, // Czas trwania pojedynczego obrótu
        easing: Easing.linear, // Easing dla płynności obrotu
      }),
      -1 // -1 includes infiniti
    );
  };

  const iconAnimationRotateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${angleRotation.value}deg`,
        },
      ],
    };
  });

  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState(false);

  const showMenu = () => {
    setVisible(!visible);
  };

  const newscale = useSharedValue(initialOffset);

  const animationModesContainer = () => {
    newscale.value = withDelay(
      200,
      withSpring(visible ? 0 : initialOffset, {
        duration: 1500,
        dampingRatio: 0.5,
      })
    );
  };

  const closeModal = () => {
    setVisible(false);

    newscale.value = withDelay(
      200,
      withSpring(initialOffset, {
        duration: 500,
        stiffness: 100,
      })
    );
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: newscale.value }],
    };
  });

  useEffect(() => {
    animateIconRotation();
  }, []);

  useEffect(() => {
    animationModesContainer();
  }, [visible]);

  const theme = { mode: 'dark' };
  let activeColorsDark = colors.dark;
  let activeColorsLight = colors.light;

  const { themeconfig, toggleTheme, useSystemTheme }: any = useContext(ThemeContext);

  return (
    <View
      style={{
        ...styles.externalContainer,
        backgroundColor:
          themeconfig === theme.mode ? activeColorsDark.primary : activeColorsLight.primary,
      }}
    >
      <View style={styles.insideContainer}>
        <View style={{ alignItems: 'center' }}>
          <Animated.View style={iconAnimationRotateStyle}>
            <MaterialCommunityIcons
              name="timer-sand-empty"
              color={themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black}
              size={30}
            />
          </Animated.View>
          <Text
            style={{
              color: themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
            }}
          >
            {t('EmptyMainContentScreenFirstAnimationText')}
          </Text>
          <Text
            style={{
              color: themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
            }}
          >
            {t('EmptyMainContentScreenSecondAnimationText')}
          </Text>
        </View>
      </View>
      <Modal transparent={true} visible={visible} onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground}>
            <Animated.View
              style={[
                styles.styleBoxModeContainer,
                { marginVertical: screenHeight / 2.5 },
                animatedStyles,
              ]}
            >
              <View style={styles.bottomContainerFirst}>
                <TouchableOpacity
                  style={styles.addButtonPropertiary}
                  onPress={() => navigation.navigate('InvestmentScreen')}
                >
                  <Text style={{ color: 'black', fontSize: 12 }}>
                    {t('MainContentScreenInChartInvestmentsText')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addButtonPropertiary}
                  onPress={() => navigation.navigate('SavingsScreen')}
                >
                  <Text style={{ color: 'black', fontSize: 14 }}>
                    {t('MainContentScreenInChartSavingsText')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addButtonPropertiary}
                  onPress={() => navigation.navigate('IncomeScreen')}
                >
                  <Text style={{ color: 'black', fontSize: 14 }}>
                    {t('MainContentScreenInChartIncomeText')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addButtonPropertiary}
                  onPress={() => navigation.navigate('ExpensesScreen')}
                >
                  <Text style={{ color: 'black', fontSize: 14 }}>
                    {t('MainContentScreenInChartExpensesText')}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View style={styles.bottomContainerSecond}>
        <TouchableOpacity style={styles.addButton} onPress={() => showMenu()}>
          <Text style={{ color: 'black', fontSize: 24 }}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  externalContainer: {
    height: '100%',
    flex: 1,
  },
  insideContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  },
  addButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'deepskyblue',
    position: 'absolute',
    right: 10,
    marginVertical: 75,
    bottom: 30,
  },
  addButtonPropertiary: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'deepskyblue',
    marginVertical: 2,
  },
  bottomContainerFirst: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center',
    //backgroundColor:'red',
    flexDirection: 'column',
    width: '100%',
  },
  bottomContainerSecond: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleBoxModeContainer: {
    paddingHorizontal: 0,
    padding: 0,
    position: 'absolute',
    top: 0,
    right: 10,
    //marginVertical: 350,
    justifyContent: 'flex-end',
  },
  modalHeader: {
    width: '100%',
    height: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 20,
    elevation: 20,
  },
  SecondModalBackground: {},
  SecondmodalContainer: {
    height: 300,
    width: 300,
    backgroundColor: 'red',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 50,
    elevation: 70,
  },
});

export default EmptyMainContent;

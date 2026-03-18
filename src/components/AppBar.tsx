/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Modal,
  Animated,
  Alert,
  Switch,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';

import React, { useContext, useState, useRef, useEffect, useLayoutEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigatorList } from '../features/types/Navigator';
import ThemeContext from '../features/themes/themeContext';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import colors from '../features/themes/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

export type HomeScreenProps = {
  navigation: DrawerNavigationProp<NavigatorList, 'HomeScreen'>;
  route: RouteProp<NavigatorList, 'HomeScreen'>;
};

const ThemeModePopUp = ({ visible, children, onRequestClose }: any) => {
  const [showModal, setShowModal] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const toggleModalTheme = () => {
      if (visible) {
        setShowModal(true);
        Animated.spring(scaleValue, {
          toValue: 1,
          delay: 200,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => setShowModal(false), 100);
          onRequestClose();
        });
      }
    };

    toggleModalTheme();
  }, [visible, scaleValue, onRequestClose]);
  return (
    <Modal transparent={true} visible={showModal} onRequestClose={onRequestClose}>
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.modalBackground}>
          <Animated.View
            style={[styles.styleBoxModeContainer, { transform: [{ scale: scaleValue }] }]}
          >
            {children}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const AppBar: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();

  const [isVisible, setIsVisible] = useState(false);

  const showMenu = () => setIsVisible(true);

  const modes = [
    {
      title: 'light',
      name: t('AppBarLightModeText'),
      MaterialIcons: 'light-mode',
      action: () => Alert.alert('Theme changed to light-mode'),
    },
    {
      title: 'dark',
      name: t('AppBarDarkModeText'),
      MaterialIcons: 'dark-mode',
      action: () => Alert.alert('dark-mode'),
    },
  ];
  const scaleModes = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    const animationModesContainer = () => {
      if (isVisible) {
        setIsVisible(true);
        Animated.spring(scaleModes, {
          toValue: 1,
          useNativeDriver: true,
          delay: 200,
        }).start();
      }
    };
    animationModesContainer();
  }, [isVisible, scaleModes]);

  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);

  const closeModal = () => {
    Animated.timing(scaleModes, {
      toValue: 0,
      useNativeDriver: true,
      duration: 200,
    }).start(() => {
      setTimeout(() => setIsVisible(false), 100);
    });
  };

  const theme = { mode: 'dark' };
  let activeColorsDark = colors.dark;
  let activeColorsLight = colors.light;
  let colorScheme = useColorScheme();
  const { themeconfig, toggleTheme }: any = useContext(ThemeContext);

  const handleToggleTheme = ({ newTheme }: any) => {
    newTheme = themeconfig === 'light' ? 'dark' : 'light';
    toggleTheme(newTheme);
  };

  const toggleSwitch = (newTheme: string) => {
    setIsSwitchEnabled(!isSwitchEnabled);
    handleToggleTheme(newTheme);
  };

  return (
    <>
      <StatusBar
        backgroundColor={
          theme.mode === colors.dark.tint ? activeColorsDark.primary : activeColorsLight.tint
        }
      />
      <View
        style={{
          ...styles.container,
          backgroundColor:
            themeconfig === theme.mode ? activeColorsDark.primary : activeColorsLight.accent,
        }}
      >
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <View style={{ paddingHorizontal: 5 }}>
            <MaterialIcons
              size={15}
              name="menu"
              color="white"
              onPress={() => navigation.openDrawer()}
            />
          </View>
          <Text
            style={{
              color: activeColorsDark.tint,
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            {t('AppBarOverviewText')}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '10%',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            style={{
              borderWidth: 2,
              borderColor:
                themeconfig === theme.mode ? activeColorsDark.white : activeColorsLight.black,
              padding: 2,
            }}
          >
            <MaterialIcons onPress={showMenu} name="dark-mode" size={25} color="white" />
          </TouchableOpacity>
          <ThemeModePopUp transparent={true} visible={isVisible} onRequestClose={closeModal}>
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={styles.modalBackground}>
                {modes.map((mode, i) => (
                  <View
                    key={i}
                    style={[
                      styles.styleHstackModeContainer,
                      { borderBottomWidth: i === modes.length - 1 ? 0 : 1 },
                    ]}
                  >
                    <MaterialIcons name={mode.MaterialIcons} size={30} color={'blue'} />
                    <Text style={{ color: 'white', fontSize: 18 }}>{mode.name}</Text>
                    <Switch
                      value={themeconfig === mode.title}
                      onValueChange={() => {
                        if (mode.title === 'light') {
                          toggleSwitch(mode.title);
                        } else if (mode.title === 'dark') {
                          toggleSwitch(mode.title);
                        }
                      }}
                    />
                    <Text>{themeconfig}</Text>
                  </View>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </ThemeModePopUp>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  textHome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  container: {
    height: '10%',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 1,
    paddingVertical: 1,
    flexDirection: 'row',
  },
  modeContainer: {
    flex: 1,
  },
  styleBoxModeContainer: {
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 2,
    paddingHorizontal: 10,
    padding: 10,
    margin: 5,
    position: 'absolute',
    top: 60,
    left: 150,
    height: '25%',
    width: '55%',
    justifyContent: 'center',
    backgroundColor: 'khaki',
  },
  styleHstackModeContainer: {
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default AppBar;

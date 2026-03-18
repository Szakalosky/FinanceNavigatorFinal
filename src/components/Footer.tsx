import { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorList } from '../features/types/Navigator';
import { HomeScreenProps } from './AppBar';
import colors from '../features/themes/theme';
import ThemeContext from '../features/themes/themeContext';
import { useTranslation } from 'react-i18next';

export type Props = NativeStackScreenProps<NavigatorList, 'HomeScreen'>;

const Footer: React.FC<HomeScreenProps> = ({ navigation }) => {
  const theme = { mode: 'dark' };
  let activeColorsDark = colors.dark;
  let activeColorsLight = colors.light;

  const { t } = useTranslation();
  const { themeconfig, toggleTheme, useSystemTheme }: any = useContext(ThemeContext);
  return (
    <>
      <View style={styles.bottomView}>
        <View
          style={[
            styles.bottomViewInner,
            {
              backgroundColor:
                themeconfig === theme.mode ? activeColorsDark.tertiary : activeColorsLight.tertiary,
            },
          ]}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => navigation.navigate('HomeScreenFinal')}
          >
            <View style={styles.centerContainer}>
              <MaterialCommunityIcons name={'home'} color="white" size={20} />
              <Text
                style={[
                  styles.iconDescription,
                  {
                    color:
                      themeconfig === theme.mode
                        ? activeColorsDark.black
                        : activeColorsLight.primary,
                  },
                ]}
              >
                {t('FooterHomeButtonText')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => navigation.navigate('CategoryScreen')}
          >
            <View style={styles.centerContainer}>
              <MaterialIcons name="category" color="white" size={20} />

              <Text
                style={[
                  styles.iconDescription,
                  {
                    color:
                      themeconfig === theme.mode
                        ? activeColorsDark.black
                        : activeColorsLight.primary,
                  },
                ]}
              >
                {t('FooterCategoryButtonText')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => navigation.navigate('TransactionsScreen')}
          >
            <View style={styles.centerContainer}>
              <MaterialCommunityIcons name={'clipboard-outline'} color="white" size={20} />

              <Text
                style={[
                  styles.iconDescription,
                  {
                    color:
                      themeconfig === theme.mode
                        ? activeColorsDark.black
                        : activeColorsLight.primary,
                  },
                ]}
              >
                {t('FooterTransactionsText')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('BudgetStack')}>
            <View style={styles.centerContainer}>
              <TouchableOpacity>
                <MaterialCommunityIcons name={'account'} color="white" size={20} />
              </TouchableOpacity>
              <Text
                style={[
                  styles.iconDescription,
                  {
                    color:
                      themeconfig === theme.mode
                        ? activeColorsDark.black
                        : activeColorsLight.primary,
                  },
                ]}
              >
                {t('FooterBudgetButtonText')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  iconDescription: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  linearGradinet: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  iconMargin: {
    marginBottom: 1,
  },
  bottomView: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //trick
    bottom: 0, //trick,
  },
  bottomViewInner: {
    alignItems: 'center',
    width: '100%',
    height: 60,
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Kolor tła przycisku
    borderRadius: 30, // Zakrąglenie krawędzi tła
    padding: 10, // Padding wewnątrz przycisku
  },
  centerContainer: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    margin: 10,
  },
});

export default Footer;

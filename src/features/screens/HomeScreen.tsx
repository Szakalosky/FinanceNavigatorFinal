import { View } from 'react-native';
import React from 'react';
import AppBar, { HomeScreenProps } from '../../components/AppBar';
import Footer from '../../components/Footer';
import EmptyMainContent from '../../components/EmptyMainContent';
import ConnectedToTheNet from '../../components/ConnectedToTheNet';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  return (
    <View style={{ flex: 1 }}>
      <AppBar navigation={navigation} route={route} />
      <EmptyMainContent navigation={navigation} route={route} />
      <ConnectedToTheNet />
      <Footer navigation={navigation} route={route} />
    </View>
  );
};

export default HomeScreen;

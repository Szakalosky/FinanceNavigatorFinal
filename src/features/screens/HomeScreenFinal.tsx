import { View } from 'react-native';
import React from 'react';

import { HomeScreenFinalProps } from '../../components/AppBarMainContent';
import MainContent from '../../components/MainContent';
import AppBarMainContent from '../../components/AppBarMainContent';
import FooterMainContent, { Props } from '../../components/FooterMainContent';
import ConnectedToTheNet from '../../components/ConnectedToTheNet';

const HomeScreenFinal: React.FC<HomeScreenFinalProps> = ({ navigation, route }) => {
  return (
    <View style={{ flex: 1 }}>
      <AppBarMainContent navigation={navigation} route={route} />
      <MainContent />
      <ConnectedToTheNet />
      <FooterMainContent navigation={navigation} route={route} />
    </View>
  );
};

export default HomeScreenFinal;

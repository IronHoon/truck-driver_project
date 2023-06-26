import React from 'react';
import {SafeAreaView} from 'react-native';
import Splash from '../views/Splash';

const SplashPage = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#3251d3'}}>
      <Splash />
    </SafeAreaView>
  );
};

export default SplashPage;

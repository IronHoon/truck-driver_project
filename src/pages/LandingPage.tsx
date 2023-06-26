import React from 'react';
import {SafeAreaView} from 'react-native';
import Landing from '../views/Landing';
import {COLOR} from '../constants/COLOR';

const LandingPage = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLOR.PRIMARY}}>
      <Landing />
    </SafeAreaView>
  );
};

export default LandingPage;

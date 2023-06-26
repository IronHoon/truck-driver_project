import React from 'react';
import {SafeAreaView} from 'react-native';
import Main from '../views/Main';

const MainPage = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Main />
    </SafeAreaView>
  );
};

export default MainPage;

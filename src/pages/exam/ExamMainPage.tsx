import React from 'react';
import {SafeAreaView} from 'react-native';
import ExamMain from '../../views/exam/ExamMain';

const ExamMainPage = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ExamMain />
    </SafeAreaView>
  );
};

export default ExamMainPage;

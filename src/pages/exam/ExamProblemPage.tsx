import React from 'react';
import {SafeAreaView} from 'react-native';
import ExamProblem from '../../views/exam/ExamProblem';

const ExamProblemPage = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ExamProblem />
    </SafeAreaView>
  );
};

export default ExamProblemPage;

import React from 'react';
import {SafeAreaView} from 'react-native';
import Chart from '../../views/exam/Chart';

const ChartPage = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Chart />
    </SafeAreaView>
  );
};

export default ChartPage;

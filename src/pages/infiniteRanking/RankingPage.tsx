import React from 'react';
import {SafeAreaView} from 'react-native';
import Ranking from '../../views/infiniteRanking/Ranking';

const RankingPage = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Ranking />
    </SafeAreaView>
  );
};

export default RankingPage;

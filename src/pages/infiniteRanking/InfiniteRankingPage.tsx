import React from 'react';
import {SafeAreaView} from 'react-native';
import InfiniteRanking from '../../views/infiniteRanking/InfiniteRanking';

const InfiniteRankingPage = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <InfiniteRanking />
    </SafeAreaView>
  );
};

export default InfiniteRankingPage;

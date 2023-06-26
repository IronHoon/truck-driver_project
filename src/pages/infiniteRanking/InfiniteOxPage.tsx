import React from 'react';
import {SafeAreaView} from 'react-native';
import InfiniteOx from '../../views/infiniteRanking/InfiniteOx';

const InfiniteOxPage = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <InfiniteOx />
    </SafeAreaView>
  );
};

export default InfiniteOxPage;

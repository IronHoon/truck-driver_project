import React, {useCallback, useState} from 'react';
import {FlatList, Image, TouchableOpacity, View} from 'react-native';
import BackHeader from '../../components/BackHeader';
import {COLOR} from '../../constants/COLOR';
import Space from '../../components/Space';
import MyAppText from '../../components/MyAppText';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {MainNavigationProp} from '../../navigations/MainNavigator';
import {post} from '../../net/rest/api';
import {useAtomValue} from 'jotai';
import tokenAtom from '../../stores/tokenAtom';
import SwrContainer from '../../components/SwrContainer';

const Ranking = () => {
  const token = useAtomValue(tokenAtom);
  const [rankList, setRankList] = useState([]);
  const [error, setError] = useState(false);

  console.log('token', token);
  const navigation = useNavigation<MainNavigationProp>();
  const getRanking = () => {
    var list;
    post(
      'LoopRank/get_rank_list',
      {access_token: token},
      {
        headers: {'Content-Type': `application/x-www-form-urlencoded`},
      },
      () => {},
      true,
    ).then((result: any) => {
      if (result.data) {
        setRankList(result.data);
        setError(false);
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      getRanking();
    }, []),
  );

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <BackHeader
        title={'무한 랭킹 OX'}
        onClick={() => navigation.navigate('/infiniteRanking')}></BackHeader>
      <SwrContainer data={rankList} error={error}>
        <FlatList
          data={rankList}
          renderItem={({item, index}: {item: any; index: number}) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  height: 80,
                  width: '95%',
                  backgroundColor: 'white',
                  alignSelf: 'center',
                  marginTop: 10,
                  borderRadius: 8,
                  shadowColor: 'black',
                  shadowRadius: 3,
                  shadowOffset: {
                    height: 3,
                    width: 0,
                  },
                  shadowOpacity: 0.2,
                  paddingHorizontal: 25,
                  alignItems: 'center',
                }}>
                <MyAppText
                  style={{
                    color: '#8A8A8A',
                    fontSize: 18,
                    fontFamily: 'NanumSquareB',
                  }}>
                  {(index + 1).toString()}
                </MyAppText>
                <Space width={10} />
                <View style={{width: 180}}>
                  <MyAppText style={{fontSize: 18, fontFamily: 'NanumSquareB'}}>
                    {item.nickname}
                  </MyAppText>
                </View>
                <View style={{width: 50}}>
                  {index === 0 ? (
                    <Image
                      source={require('../../assets/1st_ic.png')}
                      style={{width: 40, height: 40}}
                      resizeMode={'contain'}
                    />
                  ) : index === 1 ? (
                    <Image
                      source={require('../../assets/2nd_ic.png')}
                      style={{width: 40, height: 40}}
                      resizeMode={'contain'}
                    />
                  ) : index === 2 ? (
                    <Image
                      source={require('../../assets/3rd_ic.png')}
                      style={{width: 40, height: 40}}
                      resizeMode={'contain'}
                    />
                  ) : (
                    <></>
                  )}
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <MyAppText
                    style={{
                      color: COLOR.ACCENT,
                      fontSize: 20,
                      fontFamily: 'NanumSquareB',
                    }}>
                    {item.point_sum}
                  </MyAppText>
                </View>
              </View>
            );
          }}
        />
      </SwrContainer>

      <View
        style={{
          height: 90,
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('/infiniteRanking')}
          style={{
            height: 70,
            width: '45%',
            backgroundColor: COLOR.ACCENT,
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MyAppText style={{fontSize: 25, color: 'white'}}>재도전</MyAppText>
        </TouchableOpacity>
        <Space width={13} />
        <TouchableOpacity
          onPress={() => navigation.navigate('/main')}
          style={{
            height: 70,
            width: '45%',
            backgroundColor: COLOR.ACCENT,
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MyAppText style={{fontSize: 25, color: 'white'}}>홈으로</MyAppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Ranking;

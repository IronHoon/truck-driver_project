import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import BackHeader from '../../components/BackHeader';
import {COLOR} from '../../constants/COLOR';
import MyAppText from '../../components/MyAppText';
import Space from '../../components/Space';
import {useNavigation} from '@react-navigation/native';
import {MainNavigationProp} from '../../navigations/MainNavigator';

const InfiniteRanking = () => {
  const navigation = useNavigation<MainNavigationProp>();

  return (
    <View style={{flex: 1, backgroundColor: COLOR.PRIMARY}}>
      <View
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          overflow: 'hidden',
        }}>
        <Image
          source={require('../../assets/background.png')}
          style={{
            position: 'absolute',
            bottom: -210,
            left: -350,
            width: 900,
            height: (900 * 2399) / 3403,
          }}
          resizeMode={'cover'}></Image>
      </View>
      <BackHeader title={'무한 랭킹 OX'} border={true}></BackHeader>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            height: '80%',
            width: '90%',
            backgroundColor: 'white',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/ranking_ic.png')}
            style={{width: 100, height: 100}}
            resizeMode={'contain'}
          />
          <Space height={13} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MyAppText style={{fontSize: 25}}>무한 랭킹 OX는 </MyAppText>
            <MyAppText style={{fontSize: 28, color: COLOR.PRIMARY}}>
              총 3번
            </MyAppText>
          </View>
          <Space height={3} />
          <MyAppText style={{fontSize: 25}}>정답 기회가 제공됩니다.</MyAppText>
          <Space height={5} />
          <View style={{flexDirection: 'row'}}>
            <MyAppText style={{fontFamily: 'NanumSquareR'}}>
              문제 당 20초의{' '}
            </MyAppText>
            <MyAppText style={{fontFamily: 'NanumSquareR', color: '#FF7600'}}>
              시간 제한
            </MyAppText>
            <MyAppText style={{fontFamily: 'NanumSquareR'}}>
              {' '}
              이 있습니다.
            </MyAppText>
          </View>
          <Space height={20} />
          <TouchableOpacity
            onPress={() => navigation.navigate('/infiniteRanking/ranking')}
            style={{
              width: '50%',
              height: 50,
              backgroundColor: COLOR.ACCENT,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MyAppText style={{color: 'white', fontSize: 20}}>
              랭킹 확인
            </MyAppText>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('/infiniteRanking/ox')}
        style={{
          height: 70,
          width: '90%',
          backgroundColor: 'white',
          alignSelf: 'center',
          marginBottom: 20,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MyAppText style={{color: COLOR.PRIMARY, fontSize: 25}}>
          시작하기
        </MyAppText>
      </TouchableOpacity>
    </View>
  );
};

export default InfiniteRanking;

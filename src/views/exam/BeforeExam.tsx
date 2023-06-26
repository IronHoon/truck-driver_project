import React from 'react';
import {Image, Pressable, View} from 'react-native';
import {COLOR} from '../../constants/COLOR';
import Space from '../../components/Space';
import MyAppText from '../../components/MyAppText';

interface BeforeExamProps {
  setIsBefore: (is: boolean) => void;
  type?: string;
  examType?: string;
}

const BeforeExam = ({setIsBefore, type, examType}: BeforeExamProps) => {
  return (
    <Pressable
      onPress={() => setIsBefore(false)}
      style={{
        flex: 1,
        backgroundColor: COLOR.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
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
            bottom: -150,
            left: -350,
            width: 900,
            height: (900 * 2399) / 3403,
          }}
          resizeMode={'cover'}></Image>
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        {type && (
          <Image
            source={
              type === '0'
                ? require('../../assets/scale_ic.png')
                : type === '1'
                ? require('../../assets/truck_ic.png')
                : type === '2'
                ? require('../../assets/driver_ic.png')
                : require('../../assets/hand_ic.png')
            }
            style={{width: 80, height: 60}}
            resizeMode={'contain'}
          />
        )}
        <Space height={20} />
        {type && (
          <MyAppText
            style={{
              fontSize: 25,
              color: 'white',
            }}>
            {type === '0'
              ? '교통 및 화물 법규'
              : type === '1'
              ? '화물 취급 요령'
              : type === '2'
              ? '안전 운행'
              : '운송 서비스'}
          </MyAppText>
        )}
        {examType === '0' && (
          <MyAppText
            style={{
              fontSize: 25,
              color: 'white',
            }}>
            실전이다 모의고사
          </MyAppText>
        )}
        <Space height={8} />
        {examType === '0' ? (
          <View></View>
        ) : examType === '1' ? (
          <MyAppText style={{fontSize: 25, color: 'white'}}>모의고사</MyAppText>
        ) : (
          <MyAppText style={{fontSize: 25, color: 'white'}}>OX 학습</MyAppText>
        )}
        <Space height={80} />
        {examType === '0' ? (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <MyAppText
              style={{
                fontFamily: 'NanumSquareB',
                fontSize: 16,
                color: 'white',
              }}>
              화물운송기사자격증시험은 총 80문제입니다.
            </MyAppText>
            <Space height={5} />
            <MyAppText
              style={{
                fontFamily: 'NanumSquareB',
                fontSize: 16,
                color: 'white',
              }}>
              각 항목은 실제 모의고사 환경과 유사하게
            </MyAppText>
            <Space height={5} />
            <MyAppText
              style={{
                fontFamily: 'NanumSquareB',
                fontSize: 16,
                color: 'white',
              }}>
              구성되어 있습니다.
            </MyAppText>
          </View>
        ) : examType === '1' ? (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <MyAppText
              style={{
                fontFamily: 'NanumSquareB',
                fontSize: 16,
                color: 'white',
              }}>
              4지 선다형 문제로 실전 감각을 익힙니다.
            </MyAppText>
            <Space height={5} />
            <MyAppText
              style={{
                fontFamily: 'NanumSquareB',
                fontSize: 16,
                color: 'white',
              }}>
              화면을 터치하면 다음 문제로 넘어갑니다.{' '}
            </MyAppText>
            <Space height={5} />
          </View>
        ) : (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <MyAppText
              style={{
                fontFamily: 'NanumSquareB',
                fontSize: 16,
                color: 'white',
              }}>
              OX 퀴즈와 해설로 학습하는 항목입니다.
            </MyAppText>
            <Space height={5} />
            <MyAppText
              style={{
                fontFamily: 'NanumSquareB',
                fontSize: 16,
                color: 'white',
              }}>
              정답 선택 시 문제 해설이 나타나며
            </MyAppText>
            <Space height={5} />
            <MyAppText
              style={{
                fontFamily: 'NanumSquareB',
                fontSize: 16,
                color: 'white',
              }}>
              화면을 터치하면 다음 문제로 넘어갑니다.
            </MyAppText>
          </View>
        )}
        <Space height={100} />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../../assets/touch_ic.png')}
            style={{height: 120, width: 85}}
            resizeMode={'contain'}></Image>
          <Space height={25} />
          <MyAppText
            style={{fontFamily: 'NanumSquareB', fontSize: 20, color: 'white'}}>
            화면을 터치해주세요.
          </MyAppText>
        </View>
      </View>
    </Pressable>
  );
};

export default BeforeExam;

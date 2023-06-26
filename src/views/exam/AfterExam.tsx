import React from 'react';
import {COLOR} from '../../constants/COLOR';
import {Dimensions, Image, TouchableOpacity, View} from 'react-native';
import Space from '../../components/Space';
import MyAppText from '../../components/MyAppText';
import {useNavigation} from '@react-navigation/native';
import {MainNavigationProp} from '../../navigations/MainNavigator';
import BackHeader from '../../components/BackHeader';

interface AfterExamProps {
  type: string;
  score: number;
  setProblemNum: (num: number) => void;
  setScore: (num: number) => void;
  setTimer?: (num: number) => void;
  setRetry?: (is: boolean) => void;
  real?: boolean;
  level: number;
}

const AfterExam = ({
  type,
  score,
  setProblemNum,
  setScore,
  setTimer,
  setRetry,
  real,
  level,
}: AfterExamProps) => {
  const number = Math.floor(Math.random() * 5 - 0.1).toString();
  const numberList = ['0', '1', '2', '3', '4'];
  const width = Dimensions.get('window').width;
  const navigation = useNavigation<MainNavigationProp>();

  const scoreComment = {
    point_text_0: '모의고사를 풀어보세요',
    point_text_20: {
      '0': 'OX학습모드 부터 시작하세요',
      '1': '여러분의 강점은 끈기입니다.',
      '2': '중요한 것은 포기하지 않는거에요.',
      '3': '기초부터 차근차근 시작해보세요.',
      '4': '반복학습이 중요합니다.',
      '5': '다시 도전해보세요.',
    },
    point_text_40: {
      '0': '더 잘할 수 있어요',
      '1': '시작이 반이다.',
      '2': '꾸준히 문제를 풀어보세요.',
      '3': '반복학습만이 살길이다.',
      '4': '재도전 해보세요.',
    },
    point_text_60: {
      '0': '고지가 코앞이에요',
      '1': '합격이 눈앞에 있습니다.',
      '2': '반복학습만이 살길이다.',
      '3': '재도전 해보세요.',
      '4': '합격 안정권에 도달하셨습니다.',
    },
    point_text_80: {
      '0': '다음은 만점에 도전하세요',
      '1': '만점이 눈앞에 있습니다.',
      '2': '자격증이 눈앞에 있습니다.',
      '3': '훌륭하십니다.',
      '4': '합격 안정권에 도달하셨습니다.',
    },
    point_text_100: '당신은 이미 화물운송종사자!',
  };

  // @ts-ignore
  return (
    <View style={{flex: 1}}>
      <BackHeader title={'실전이다 모의고사'} border></BackHeader>
      <View
        style={{
          flex: 1,
          backgroundColor: COLOR.PRIMARY,

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
        <Space height={40} />
        <View style={{flex: 1, alignItems: 'center', paddingHorizontal: 20}}>
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
            style={{width: 80, height: 40}}
            resizeMode={'contain'}
          />
          <Space height={30} />
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
          <Space height={8} />
          <MyAppText style={{fontSize: 25, color: 'white'}}>OX 점수</MyAppText>
          <Space height={50} />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-end',
              flexDirection: 'row',
              height: 90,
            }}>
            <MyAppText style={{fontSize: 100, color: 'white'}}>
              {score.toString()}
            </MyAppText>
            <MyAppText style={{fontSize: 50, color: 'white'}}>점</MyAppText>
          </View>
          <Space height={50} />

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {score >= 0 && score < 20 ? (
              <MyAppText
                style={{
                  fontFamily: 'NanumSquareB',
                  fontSize: 35,
                  color: 'white',
                  alignSelf: 'center',
                }}>
                {scoreComment.point_text_0}
              </MyAppText>
            ) : score < 40 ? (
              <MyAppText
                style={{
                  fontFamily: 'NanumSquareB',
                  fontSize: 35,
                  color: 'white',
                  alignSelf: 'center',
                  //@ts-ignore
                }}>
                {scoreComment.point_text_20[number.toString()]}
              </MyAppText>
            ) : score < 60 ? (
              <MyAppText
                style={{
                  fontFamily: 'NanumSquareB',
                  fontSize: 35,
                  color: 'white',
                  alignSelf: 'center',
                  //@ts-ignore
                }}>
                {scoreComment.point_text_40[number.toString()]}
              </MyAppText>
            ) : score < 80 ? (
              <MyAppText
                style={{
                  fontFamily: 'NanumSquareB',
                  fontSize: 35,
                  color: 'white',
                  alignSelf: 'center',
                  //@ts-ignore
                }}>
                {scoreComment.point_text_60[number.toString()]}
              </MyAppText>
            ) : score < 100 ? (
              <MyAppText
                style={{
                  fontFamily: 'NanumSquareB',
                  fontSize: 35,
                  color: 'white',
                  alignSelf: 'center',
                  //@ts-ignore
                }}>
                {scoreComment.point_text_80[number.toString()]}
              </MyAppText>
            ) : (
              <MyAppText
                style={{
                  fontFamily: 'NanumSquareB',
                  fontSize: 35,
                  color: 'white',
                  alignSelf: 'center',
                }}>
                {scoreComment.point_text_100}
              </MyAppText>
            )}
            <Space height={25} />
            <MyAppText
              style={{
                fontFamily: 'NanumSquareB',
                fontSize: 13,
                color: 'white',
              }}>
              실제 화물운송종사자격시험의 합격 요건은 60점 이상입니다.
            </MyAppText>
            <Space height={3} />
            <MyAppText
              style={{
                fontFamily: 'NanumSquareB',
                fontSize: 13,
                color: 'white',
              }}>
              위 점수표는 학습자의 자가 피드백을 위해 만들어졌습니다.
            </MyAppText>
          </View>
        </View>
        <View
          style={{
            height: 85,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              setProblemNum(0);
              setScore(0);
              if (setTimer) setTimer(60);
              if (real) {
                navigation.navigate('/examMain/problem', {
                  type: type,
                  level: level,
                });
              } else {
                navigation.navigate('/oxMain/problem', {
                  type: type,
                  level: level,
                });
              }
            }}
            style={{
              width: width * 0.45,
              height: 65,
              backgroundColor: 'white',
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MyAppText style={{fontSize: 25, color: COLOR.ACCENT}}>
              재도전
            </MyAppText>
          </TouchableOpacity>
          <Space width={10} />
          <TouchableOpacity
            onPress={() => {
              if (real) {
                navigation.navigate('/examMain', {});
              } else {
                navigation.navigate('/oxMain');
              }
            }}
            style={{
              width: width * 0.45,
              height: 65,
              backgroundColor: 'white',
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MyAppText style={{fontSize: 25, color: COLOR.ACCENT}}>
              다른문제풀기
            </MyAppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AfterExam;

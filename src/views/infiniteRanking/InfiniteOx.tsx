import React, {useEffect, useState} from 'react';
import {Dimensions, Image, TouchableOpacity, View} from 'react-native';
import BackHeader from '../../components/BackHeader';
import {COLOR} from '../../constants/COLOR';
import MyAppText from '../../components/MyAppText';
import {useNavigation} from '@react-navigation/native';
import {MainNavigationProp} from '../../navigations/MainNavigator';
import Space from '../../components/Space';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {useAtomValue} from 'jotai';
import tokenAtom from '../../stores/tokenAtom';
import {post} from '../../net/rest/api';
import SwrContainer from '../../components/SwrContainer';

const InfiniteOx = () => {
  // const problemList = [
  //   {
  //     problem:    '공동위험행위 또는 난폭운전으로 형사입건하면 벌점은 60점이다.',
  //     answer:'o'
  //   },
  //   {
  //     problem: '충전용기 등을 차량에 적재할 때 운반 중의 충전 용기는 항상 60도 이하로 유지한다.',
  //     answer:'x'
  //   },
  //   {
  //     problem:   '야간 산모퉁이 길 운행 시 전조등과 상향 하향을 번갈아 점멸해 자신의 존재를 알린다.',
  //     answer:'o'
  //   },
  //   {
  //     problem:    '공동위험행위 또는 난폭운전으로 형사입건하면 벌점은 60점이다.',
  //     answer:'o'
  //   },
  //   {
  //     problem: '충전용기 등을 차량에 적재할 때 운반 중의 충전 용기는 항상 60도 이하로 유지한다.',
  //     answer:'x'
  //   },
  //   {
  //     problem:   '야간 산모퉁이 길 운행 시 전조등과 상향 하향을 번갈아 점멸해 자신의 존재를 알린다.',
  //     answer:'o'
  //   },
  //   {
  //     problem:    '공동위험행위 또는 난폭운전으로 형사입건하면 벌점은 60점이다.',
  //     answer:'o'
  //   },
  //   {
  //     problem: '충전용기 등을 차량에 적재할 때 운반 중의 충전 용기는 항상 60도 이하로 유지한다.',
  //     answer:'x'
  //   },
  //   {
  //     problem:   '야간 산모퉁이 길 운행 시 전조등과 상향 하향을 번갈아 점멸해 자신의 존재를 알린다.',
  //     answer:'o'
  //   },
  //
  //
  // ]

  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const [isVisible, setIsVisible] = useState(false);
  const [point, setPoint] = useState(0);
  const [problemNum, setProblemNum] = useState(0);
  const [answer, setAnswer] = useState('o');
  const [isAnswer, setIsAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [life, setLife] = useState(3);
  const navigation = useNavigation<MainNavigationProp>();
  const [isShowComment, setIsShowComment] = useState(false);
  const [timer, setTimer] = useState(20);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [timerId, setTimerId] = useState(0);

  const token = useAtomValue(tokenAtom);
  const [problemList, setProblemList] = useState([]);
  const [error, setError] = useState(false);

  const getProblem = () => {
    var list;
    post(
      'Problem/get_looprank_problem',
      {access_token: token},
      {
        headers: {'Content-Type': `application/x-www-form-urlencoded`},
      },
      () => {},
      true,
    ).then((result: any) => {
      if (result.data) {
        setProblemList(result.data);
      }
    });
  };

  useEffect(() => {
    getProblem();
    setPoint(0);
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prevState => prevState - 1);
    }, 1000);
    setTimerId(countdown);

    if (timer === 0 && !isShowComment) {
      clearInterval(countdown);
      setIsShowComment(true);
      setLife(prevState => prevState - 1);
      setIsTimeOut(true);
      if (life > 0) {
        setTimeout(() => {
          setIsShowComment(false);
          setProblemNum(prevState => prevState + 1);
          setIsAnswer(false);
          setTimer(20);
        }, 2000);
      }
    }
    return () => clearInterval(countdown);
  }, [timer]);

  useEffect(() => {
    if (isAnswer) {
      clearInterval(timerId);
      setIsTimeOut(false);
      //@ts-ignore
      if (problemList[problemNum].answer_yn === answer) {
        setIsCorrect(true);
        setPoint(prevState => prevState + 1);
      } else {
        setIsCorrect(false);
        setLife(prevState => prevState - 1);
      }
      if (life > 0) {
        setIsShowComment(true);
        setTimeout(() => {
          setIsShowComment(false);
          setProblemNum(prevState => prevState + 1);
          setIsAnswer(false);
          if (timer === 20) {
            setTimeout(() => {
              setTimer(19);
            }, 1000);
          } else {
            setTimer(20);
          }
        }, 2000);
      }
    }
    return clearInterval(timerId);
  }, [isAnswer]);

  useEffect(() => {
    if (life === 0) {
      post(
        'LoopRank/save_looprank_point',
        {
          access_token: token,
          point: point,
        },
        {
          headers: {'Content-Type': `application/x-www-form-urlencoded`},
        },
        () => {},
        true,
      ).then(result => console.log(result));
      setTimeout(() => {
        navigation.navigate('/infiniteRanking/ranking');
      }, 2000);
    }
  }, [life]);

  return (
    <View style={{flex: 1}}>
      <BackHeader
        title={'무한 랭킹 OX'}
        border
        onClick={() => {
          clearInterval(timerId);
          setIsVisible(true);
        }}
      />
      <SwrContainer data={problemList} error={error}>
        <View style={{flex: 1, backgroundColor: '#eceef2'}}>
          <View style={{flex: 1, paddingHorizontal: 25, paddingVertical: 10}}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: 6,
                paddingHorizontal: 20,
                paddingVertical: 15,
              }}>
              <View style={{flex: 1}}>
                {problemNum <= problemList.length - 1 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <MyAppText style={{fontSize: 20}}>
                      {problemNum < 9
                        ? '0' + (problemNum + 1).toString()
                        : (problemNum + 1).toString()}
                    </MyAppText>
                    <View style={{flexDirection: 'row'}}>
                      {life > 2 && (
                        <Image
                          source={require('../../assets/van_ic.png')}
                          style={{width: 40, height: 30}}
                          resizeMode={'contain'}
                        />
                      )}
                      <Space width={10} />
                      {life > 1 && (
                        <Image
                          source={require('../../assets/van_ic.png')}
                          style={{width: 40, height: 30}}
                          resizeMode={'contain'}
                        />
                      )}
                      <Space width={10} />
                      {life > 0 && (
                        <Image
                          source={require('../../assets/van_ic.png')}
                          style={{width: 40, height: 30}}
                          resizeMode={'contain'}
                        />
                      )}
                    </View>
                  </View>
                )}
                <Space height={20}></Space>
                {problemNum <= problemList.length - 1 && (
                  <MyAppText
                    style={{
                      fontSize: 23,
                      fontFamily: 'NanumSquareB',
                      lineHeight: 31,
                    }}>
                    {
                      //@ts-ignore
                      problemList[problemNum].question
                    }
                  </MyAppText>
                )}
              </View>
              <View
                style={{
                  height: 60,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {isShowComment && (
                  <MyAppText style={{fontSize: 25}}>
                    {isTimeOut
                      ? '시간이 초과되었습니다.'
                      : isCorrect
                      ? '정답입니다.'
                      : '정답이 아닙니다.'}
                  </MyAppText>
                )}
              </View>
              <LinearGradient
                colors={['#49dafe', '#3355d5']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                  width: '100%',
                  height: 25,
                  justifyContent: 'center',
                  borderRadius: 13,
                }}>
                <View
                  style={{
                    position: 'absolute',
                    right: 10,
                    alignSelf: 'center',
                    top: 4,
                  }}>
                  <MyAppText style={{color: 'white', alignSelf: 'center'}}>
                    {timer.toString()}
                  </MyAppText>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    right: 25 + ((width - 140) * timer) / 20,
                    width: 15,
                    height: 15,
                    borderRadius: 10,
                    backgroundColor: COLOR.ACCENT,
                  }}></View>
              </LinearGradient>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: width,
              height: (width - 10) / 2,
              paddingHorizontal: 25,
              justifyContent: 'space-between',
              paddingTop: 5,
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsAnswer(true);
                setAnswer('y');
              }}
              style={{
                height: (width - 55) / 2,
                width: (width - 55) / 2,
                backgroundColor: 'white',
                shadowColor: 'black',
                shadowRadius: 3,
                borderRadius: 5,
                shadowOffset: {
                  height: 2,
                  width: 0,
                },
                shadowOpacity: 0.3,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '70%',
                  height: '70%',
                  borderWidth: 3,
                  borderColor: COLOR.ACCENT,
                  borderRadius: 100,
                }}></View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsAnswer(true);
                setAnswer('n');
              }}
              style={{
                height: (width - 55) / 2,
                width: (width - 55) / 2,
                backgroundColor: 'white',
                shadowColor: 'black',
                shadowRadius: 3,
                borderRadius: 5,
                shadowOffset: {
                  height: 2,
                  width: 0,
                },
                shadowOpacity: 0.3,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#f56f22',
                  width: 120,
                  height: 3,
                  transform: [{rotate: '45deg'}],
                }}
              />
              <View
                style={{
                  backgroundColor: '#f56f22',
                  width: 120,
                  height: 3,
                  transform: [{rotate: '-45deg'}],
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SwrContainer>
      <Modal
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        isVisible={isVisible}
        onBackdropPress={() => {
          setIsVisible(false);
          setTimeout(() => setTimer(prevState => prevState - 1), 1000);
        }}>
        <View
          style={{
            width: '85%',
            height: 170,
            backgroundColor: 'white',
            borderRadius: 8,
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <MyAppText style={{fontSize: 20}}>무한도전</MyAppText>
            <Space height={15}></Space>
            <MyAppText
              style={{
                fontFamily: 'NanumSquareB',
                fontSize: 18,
                color: '#6D6D6D',
              }}>
              무한도전을 중지하시겠습니까?
            </MyAppText>
          </View>
          <View
            style={{
              width: '100%',
              height: 50,
              backgroundColor: '#E9E9E9',
              flexDirection: 'row',
              borderRadius: 8,
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsVisible(false);
                navigation.goBack();
              }}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRightWidth: 1,
                borderColor: 'white',
              }}>
              <MyAppText
                style={{
                  color: '#6D6D6D',
                  fontSize: 18,
                  fontFamily: 'NanumSquareB',
                }}>
                확인
              </MyAppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsVisible(false);
                setTimeout(() => setTimer(prevState => prevState - 1), 1000);
              }}
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <MyAppText
                style={{
                  color: COLOR.ACCENT,
                  fontSize: 18,
                  fontFamily: 'NanumSquareB',
                }}>
                취소
              </MyAppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InfiniteOx;

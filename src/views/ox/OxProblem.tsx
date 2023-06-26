import React, {useCallback, useState} from 'react';
import {Dimensions, Pressable, TouchableOpacity, View} from 'react-native';
import BackHeader from '../../components/BackHeader';
import {COLOR} from '../../constants/COLOR';
import MyAppText from '../../components/MyAppText';
import Space from '../../components/Space';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import BeforeExam from '../exam/BeforeExam';
import Modal from 'react-native-modal';
import {MainNavigationProp} from '../../navigations/MainNavigator';
import {post} from '../../net/rest/api';
import tokenAtom from '../../stores/tokenAtom';
import {useAtomValue} from 'jotai';
import SwrContainer from '../../components/SwrContainer';

const OxProblem = () => {
  const {
    //@ts-ignore
    params: {type, level},
  } = useRoute();

  const [isBefore, setIsBefore] = useState(true);
  const [problemNum, setProblemNum] = useState(0);
  const [score, setScore] = useState(0);
  const navigation = useNavigation<MainNavigationProp>();
  const [problemList, setProblemList] = useState([]);
  const [pos, setPos] = useState(0);
  const [error, setError] = useState(false);

  const width = Dimensions.get('window').width;
  const [isAnswer, setIsAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAfter, setIsAfter] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const token = useAtomValue(tokenAtom);

  const [retry, setRetry] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsBefore(true);
      post(
        'Course/get_course_problem',
        {
          access_token: token,
          type: 'study',
          category:
            type === '0'
              ? 'load_rule'
              : type === '1'
              ? 'load_tip'
              : type === '2'
              ? 'safe_drive'
              : 'drive_service',
          level: level,
        },
        {
          headers: {'Content-Type': `application/x-www-form-urlencoded`},
        },
        () => {},
        true,
      ).then((result: any) => {
        setProblemList(result.data.problem_list);
        console.log('result.data.pos', result.data.pos);
        setPos(Number(result.data.pos));
        setScore(Number(result.data.correct_cnt));
      });
    }, [retry]),
  );

  const submitAnswer = (answer: string) => {
    setIsAnswer(true);

    // console.log('problemList',problemList);
    console.log('problemListlength', problemList.length);
    //@ts-ignore
    if (problemList[problemNum].answer_yn === answer) {
      setIsCorrect(true);
      setScore(prevState => prevState + 5);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <BackHeader
        title={'OX 학습모드'}
        description={isBefore ? '' : type}
        border
        onClick={() => {
          if (isAfter || isBefore) {
            navigation.goBack();
          } else {
            setIsShowModal(true);
          }
        }}></BackHeader>
      {isBefore ? (
        <BeforeExam type={type} examType={'2'} setIsBefore={setIsBefore} />
      ) : (
        <SwrContainer data={problemList} error={error}>
          <View
            style={{
              flex: 1,
              backgroundColor: !isAnswer
                ? '#eceef2'
                : isCorrect
                ? COLOR.ACCENT
                : '#f56f22',
            }}>
            <View
              style={{
                minHeight: 160,
                width: width - 50,
                borderRadius: 8,
                backgroundColor: 'white',
                marginHorizontal: 25,
                marginVertical: 10,
                paddingHorizontal: 15,
              }}>
              <View
                style={{
                  height: 45,
                  width: '100%',
                  borderBottomColor: '#EFEFEF',
                  borderBottomWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 8,
                  justifyContent: 'space-between',
                }}>
                <MyAppText style={{fontSize: 25, alignSelf: 'center'}}>
                  {pos < 9 ? '0' + (pos + 1).toString() : (pos + 1).toString()}
                </MyAppText>
                <View
                  style={{
                    paddingHorizontal: 15,
                    borderRadius: 10,
                    backgroundColor: '#7A8EE2',
                    paddingVertical: 3,
                  }}>
                  <MyAppText
                    style={{
                      fontFamily: 'NanumSquareB',
                      fontSize: 15,
                      color: 'white',
                    }}>
                    20문항
                  </MyAppText>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  justifyContent: 'center',
                }}>
                {problemNum < problemList.length && (
                  <MyAppText style={{fontSize: 20, lineHeight: 25}}>
                    {
                      //@ts-ignore
                      problemList[problemNum].question
                    }
                  </MyAppText>
                )}
              </View>
            </View>
            <Pressable
              onPress={() => {
                if (isAnswer) {
                  setIsAnswer(false);

                  if (problemNum < problemList.length - 1) {
                    setProblemNum(prevState => prevState + 1);
                    setPos(prevState => prevState + 1);
                  } else {
                    post(
                      'Course/save_user_course',
                      {
                        access_token: token,
                        type: 'study',
                        category:
                          type === '0'
                            ? 'load_rule'
                            : type === '1'
                            ? 'load_tip'
                            : type === '2'
                            ? 'safe_drive'
                            : 'drive_service',
                        level: level,
                        point: score,
                        problem: '',
                        stop_pos: 0,
                        status: 1,
                      },
                      {
                        headers: {
                          'Content-Type': `application/x-www-form-urlencoded`,
                        },
                      },
                      () => {},
                      true,
                    ).then(result => console.log('saveCourse', result));
                    // @ts-ignore
                    navigation.navigate('/examMain/afterExam', {
                      type: type,
                      real: false,
                      level: level,
                      setProblemNum: setProblemNum,
                      score: score,
                      setScore: setScore,
                    });
                  }
                }
              }}
              style={{
                flex: 1,
                borderRadius: 8,
                backgroundColor: 'white',
                marginHorizontal: 25,
                marginBottom: 5,
                paddingVertical: 20,
                paddingHorizontal: 25,
              }}>
              {isAnswer && (
                <View>
                  <View
                    style={{
                      height: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {isCorrect ? (
                      <MyAppText style={{fontSize: 25}}>정답입니다.</MyAppText>
                    ) : (
                      <MyAppText style={{fontSize: 25}}>
                        정답이 아닙니다.
                      </MyAppText>
                    )}
                  </View>
                  <Space height={10} />
                  <View>
                    <MyAppText
                      style={{
                        fontFamily: 'NanumSquareB',
                        fontSize: 20,
                        lineHeight: 28,
                      }}>
                      {
                        //@ts-ignore
                        problemList[problemNum].desc
                      }
                    </MyAppText>
                  </View>
                </View>
              )}
            </Pressable>

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
                  if (!isAnswer) submitAnswer('y');
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
                  if (!isAnswer) submitAnswer('n');
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
      )}
      <Modal
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        isVisible={isShowModal}
        onBackdropPress={() => {
          setIsShowModal(false);
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
            <MyAppText style={{fontSize: 20}}>학습모드</MyAppText>
            <Space height={15}></Space>
            <MyAppText
              style={{
                fontFamily: 'NanumSquareB',
                fontSize: 18,
                color: '#6D6D6D',
              }}>
              학습모드를 중지하시겠습니까?
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
                var problem = [];
                for (
                  var i = isAnswer ? problemNum + 1 : problemNum;
                  i < problemList.length;
                  i++
                ) {
                  //@ts-ignore
                  problem.push(problemList[i].uid);
                  // problem.push(i+1)
                }
                post(
                  'Course/save_user_course',
                  {
                    access_token: token,
                    type: 'study',
                    category:
                      type === '0'
                        ? 'load_rule'
                        : type === '1'
                        ? 'load_tip'
                        : type === '2'
                        ? 'safe_drive'
                        : 'drive_service',
                    level: level,
                    point: score,
                    problem: problem.join(','),
                    stop_pos: isAnswer ? pos + 1 : pos,
                    status: 2,
                  },
                  {
                    headers: {
                      'Content-Type': `application/x-www-form-urlencoded`,
                    },
                  },
                  () => {},
                  true,
                ).then(result => console.log('saveCourse', result));
                setIsShowModal(false);
                navigation.navigate('/oxMain');
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
                setIsShowModal(false);
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

export default OxProblem;

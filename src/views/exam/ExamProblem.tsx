import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import BackHeader from '../../components/BackHeader';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import BeforeExam from './BeforeExam';
import {MainNavigationProp} from '../../navigations/MainNavigator';
import LinearGradient from 'react-native-linear-gradient';
import MyAppText from '../../components/MyAppText';
import {COLOR} from '../../constants/COLOR';
import Space from '../../components/Space';
import Modal from 'react-native-modal';
import tokenAtom from '../../stores/tokenAtom';
import {post} from '../../net/rest/api';
import {useAtomValue} from 'jotai';
import SwrContainer from '../../components/SwrContainer';

const ExamProblem = () => {
  const {
    //@ts-ignore
    params: {type, level},
  } = useRoute();

  const [isBefore, setIsBefore] = useState(true);
  const navigation = useNavigation<MainNavigationProp>();

  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const [isVisible, setIsVisible] = useState(false);
  const [problemNum, setProblemNum] = useState(0);
  const [answer, setAnswer] = useState(0);
  const [isAnswer, setIsAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isShowComment, setIsShowComment] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [timerId, setTimerId] = useState(0);
  const [isAfter, setIsAfter] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isShowModal, setIsShowModal] = useState(false);

  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);
  const token = useAtomValue(tokenAtom);
  const [problemList, setProblemList] = useState([]);
  const [retry, setRetry] = useState(false);
  const [error, setError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsBefore(true);
      console.log('level',level)
      console.log('token', token)
      post(
        'Course/get_course_problem',
        {
          access_token: token,
          type: 'real',
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
        console.log('result.data', result.data);
        setPos(Number(result.data.pos));
        setScore(Number(result.data.correct_cnt));
      }).catch((error)=>console.log(error));
    }, [retry]),
  );

  useEffect(() => {
    if (!isBefore) {
      const countdown = setInterval(() => {
        setTimer(prevState => prevState - 1);
      }, 1000);
      setTimerId(countdown);

      if (timer === 0 && !isShowComment) {
        clearInterval(countdown);
        setAnswer(0);
        setIsAnswer(true);
        setIsShowComment(true);
        setIsTimeOut(true);
        if (problemNum < problemList.length - 1) {
          setTimeout(() => {
            setIsShowComment(false);
            setProblemNum(prevState => prevState + 1);
            setPos(prevState => prevState + 1);
            setIsAnswer(false);
            setTimer(60);
          }, 2000);
        } else {
          setTimeout(() => {
            setIsAnswer(false);
            setTimer(60);
            // @ts-ignore
            navigation.navigate('/examMain/afterExam', {
              type: type,
              real: true,
              level: level,
              setProblemNum: setProblemNum,
              setTimer: setTimer,
              score: score,
              setScore: setScore,
            });
          }, 2000);
        }
      }
      return () => clearInterval(countdown);
    }
  }, [timer, isBefore]);

  useEffect(() => {
    if (isAnswer) {
      afterSubmit();
    }
  }, [isAnswer]);

  const submitAnswer = async (answer: number) => {
    setAnswer(answer);
    clearInterval(timerId);

    //@ts-ignore
    if ('y' === problemList[problemNum].answer_list[answer].correct_yn) {
      await setIsCorrect(true);
      await setCorrectCount(prevState => prevState + 1);
      await setScore(score + 5);
    } else {
      setIsCorrect(false);
    }

    setIsAnswer(true);
  };
  const afterSubmit = () => {
    if (pos < 19) {
      setTimeout(() => {
        setIsAnswer(false);
        if (timer === 60) {
          setTimeout(() => {
            setTimer(59);
          }, 1000);
        }
        setTimer(60);
        setProblemNum(prevState => prevState + 1);
        setPos(prevState => prevState + 1);
      }, 2000);
    } else {
      post(
        'Course/save_user_course',
        {
          access_token: token,
          type: 'real',
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
          headers: {'Content-Type': `application/x-www-form-urlencoded`},
        },
        () => {},
        true,
      ).then(result => console.log('saveCourse', result));
      clearInterval(timerId);
      setTimeout(() => {
        setIsAnswer(false);
        clearInterval(timerId);
        //@ts-ignore
        navigation.navigate('/examMain/afterExam', {
          type: type,
          real: true,
          level: level,
          setProblemNum: setProblemNum,
          setTimer: setTimer,
          score: score,
          setScore: setScore,
        });
      }, 2000);
    }
  };

  return (
    <View style={{flex: 1}}>
      <BackHeader
        title={'실전이다 모의고사'}
        description={isBefore ? null : type}
        border
        onClick={() => {
          if (isBefore || isAfter) {
            navigation.navigate('/examMain', {
              back: true,
            });
          } else {
            clearInterval(timerId);
            setIsShowModal(true);
          }
        }}></BackHeader>
      {isBefore ? (
        <BeforeExam setIsBefore={setIsBefore} examType={'1'} type={type} />
      ) : (
        <SwrContainer data={problemList} error={error}>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
              paddingTop: 10,
              paddingBottom: 20,
              backgroundColor: '#eceef2',
            }}>
            <View
              style={{
                minHeight: 200,
                width: '100%',
                backgroundColor: 'white',
                paddingHorizontal: 15,
                borderRadius: 10,
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
                <MyAppText
                  style={{
                    fontSize: 25,
                    alignSelf: 'center',
                  }}>
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
                  paddingVertical: 10,
                  justifyContent: 'center',
                  minHeight: 120,
                }}>
                {problemNum < problemList.length && (
                  //@ts-ignore
                  <MyAppText style={{fontSize: 20, lineHeight: 25}}>
                    {problemList[problemNum].question}
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
                    right: 25 + ((width - 120) * timer) / 60,
                    width: 15,
                    height: 15,
                    borderRadius: 10,
                    backgroundColor: COLOR.ACCENT,
                  }}></View>
              </LinearGradient>
              <Space height={15} />
            </View>
            {problemList.length > 0 ? (
              <>
                <AnswerBox
                  isAnswer={isAnswer}
                  submitAnswer={async () => {
                    await submitAnswer(0);
                  }}
                  number={0}
                  isCorrect={isCorrect}
                  problemNum={problemNum}
                  answer={answer}
                  problemList={problemList}
                />
                <AnswerBox
                  isAnswer={isAnswer}
                  submitAnswer={async () => {
                    await submitAnswer(1);
                  }}
                  number={1}
                  isCorrect={isCorrect}
                  problemNum={problemNum}
                  answer={answer}
                  problemList={problemList}
                />
                <AnswerBox
                  isAnswer={isAnswer}
                  submitAnswer={async () => {
                    await submitAnswer(2);
                  }}
                  number={2}
                  isCorrect={isCorrect}
                  problemNum={problemNum}
                  answer={answer}
                  problemList={problemList}
                />
                <AnswerBox
                  isAnswer={isAnswer}
                  submitAnswer={async () => {
                    await submitAnswer(3);
                  }}
                  number={3}
                  isCorrect={isCorrect}
                  problemNum={problemNum}
                  answer={answer}
                  problemList={problemList}
                />
              </>
            ) : (
              <ActivityIndicator size="small" color="#0000ff" />
            )}
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
            <MyAppText style={{fontSize: 20}}>모의고사</MyAppText>
            <Space height={15}></Space>
            <MyAppText
              style={{
                fontFamily: 'NanumSquareB',
                fontSize: 18,
                color: '#6D6D6D',
              }}>
              모의고사를 중지하시겠습니까?
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
                    type: 'real',
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
                navigation.navigate('/examMain', {
                  back: true,
                });
                setIsShowModal(false);
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
                setTimeout(() => {
                  setTimer(prevState => prevState - 1);
                }, 1000);
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

const AnswerBox = ({
  isAnswer,
  submitAnswer,
  number,
  isCorrect,
  problemNum,
  answer,
  problemList,
}: any) => {
  return (
    <TouchableOpacity
      onPress={async () => {
        if (!isAnswer) await submitAnswer();
      }}
      style={{
        flex: 1,
        marginTop: 5,
        backgroundColor: !isAnswer
          ? 'white'
          : answer === number && isCorrect
          ? COLOR.CORRECT
          : answer === number && !isCorrect
          ? COLOR.WRONG
          : problemList[problemNum].answer_list[number].correct_yn === 'y'
          ? COLOR.CORRECT
          : 'white',
        borderRadius: 10,
        shadowRadius: 3,
        shadowOffset: {
          height: 3,
          width: 0,
        },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        paddingHorizontal: 30,
        justifyContent: 'center',
      }}>
      {(answer === number && isCorrect) ||
      problemList[problemNum].answer_list[number].correct_yn === 'y' ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            left: 30,
          }}>
          <Image
            source={require('../../assets/circle_bg_ic.png')}
            style={{width: 50, height: 50, alignSelf: 'center'}}
          />
        </View>
      ) : (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            left: 30,
          }}>
          <Image
            source={require('../../assets/x_bg_ic.png')}
            style={{width: 50, height: 50, alignSelf: 'center'}}
          />
        </View>
      )}
      <MyAppText
        style={{
          fontFamily: 'NanumSquareR',
          fontSize: 18,
          color: !isAnswer
            ? 'black'
            : answer === number && isCorrect
            ? 'white'
            : answer === number && !isCorrect
            ? 'white'
            : problemList[problemNum].answer_list[number].correct_yn === 'y'
            ? 'white'
            : 'black',
        }}>
        {problemList[problemNum].answer_list[number].content}
      </MyAppText>
    </TouchableOpacity>
  );
};
export default ExamProblem;

import React, {useCallback, useState} from 'react';
import {FlatList, Image, Pressable, TouchableOpacity, View} from 'react-native';
import BackHeader from '../../components/BackHeader';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import BeforeExam from './BeforeExam';
import MyAppText from '../../components/MyAppText';
import Space from '../../components/Space';
import {COLOR} from '../../constants/COLOR';
import {MainNavigationProp} from '../../navigations/MainNavigator';
import SwrContainer from '../../components/SwrContainer';
import {useAtomValue} from 'jotai';
import tokenAtom from '../../stores/tokenAtom';
import {post} from '../../net/rest/api';

const ExamMain = () => {
  const [isBeforeMain, setIsBeforeMain] = useState(true);
  const navigation = useNavigation<MainNavigationProp>();
  const [isProgress, setIsProgress] = useState(true);
  const score = 80;

  const {
    //@ts-ignore
    params: {back},
  } = useRoute();

  const token = useAtomValue(tokenAtom);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  console.log('token', token);
  const getCourse = () => {
    var list;
    post(
      'Course/get_user_course',
      {access_token: token, type: 'real'},
      {
        headers: {'Content-Type': `application/x-www-form-urlencoded`},
      },
      () => {},
      true,
    ).then((result: any) => {
      console.log(result.data);
      setData(result.data);
    });
  };

  useFocusEffect(
    useCallback(() => {
      getCourse();
      if (back) setIsBeforeMain(false);
    }, []),
  );

  // @ts-ignore
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <BackHeader title={'실전이다 모의고사'} border />
      {isBeforeMain ? (
        <BeforeExam setIsBefore={setIsBeforeMain} examType={'0'} />
      ) : (
        <View style={{flex: 1}}>
          <View
            style={{
              backgroundColor: '#3552c7',
              height: 92,
              width: '100%',
              justifyContent: 'center',
              paddingLeft: 20,
            }}>
            <MyAppText style={{fontSize: 25, color: 'white'}}>
              4지 선다형 완전정복
            </MyAppText>
            <Space height={5} />
            <MyAppText style={{fontSize: 25, color: 'white'}}>
              실전처럼 모의고사 도전
            </MyAppText>
          </View>
          <View style={{flex: 1}}>
            <SwrContainer data={data} error={error}>
              <>
                <ProblemContainer
                  navigation={navigation}
                  data={data}
                  type={1}
                />
                <ProblemContainer
                  navigation={navigation}
                  data={data}
                  type={2}
                />
                <ProblemContainer
                  navigation={navigation}
                  data={data}
                  type={3}
                />
                <ProblemContainer
                  navigation={navigation}
                  data={data}
                  type={4}
                />
              </>
            </SwrContainer>
          </View>
        </View>
      )}
    </View>
  );
};

const ProblemContainer = ({navigation, type, data}: any) => {
  var score =
    type === 1
      ? parseInt(data.load_rule.avg_point)
      : type === 2
      ? parseInt(data.load_tip.avg_point)
      : type === 3
      ? parseInt(data.safe_drive.avg_point)
      : type === 4
      ? parseInt(data.drive_service.avg_point)
      : 80;
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          height: 35,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingRight: 10,
        }}>
        <View
          style={{
            height: 35,
            flexDirection: 'row',
            paddingLeft: 10,
            alignItems: 'center',
          }}>
          <Image
            source={
              type === 1
                ? require('../../assets/scale_exam_ic.png')
                : type === 2
                ? require('../../assets/truck_exam_ic.png')
                : type === 3
                ? require('../../assets/driver_exam_ic.png')
                : require('../../assets/hand_exam_ic.png')
            }
            style={{width: 25, height: 25}}
            resizeMode={'contain'}
          />

          <Space width={5} />
          <MyAppText style={{fontSize: 16}}>
            {type === 1
              ? '교통 및 화물\n   관련 법규'
              : type === 2
              ? '화물 취급 요령'
              : type === 3
              ? '안전 운행'
              : '운송 서비스'}
          </MyAppText>
        </View>
        <Pressable
          onPress={() => {
            if (
              (type === 1 && data.load_rule.course !== null) ||
              (type === 2 && data.load_tip.course !== null) ||
              (type === 3 && data.safe_drive.course !== null) ||
              (type === 4 && data.drive_service.course !== null)
            ) {
            } else {
              console.log('typeCheck', type);
              navigation.navigate('/examMain/problem', {
                type: (type - 1).toString(),
                level: 1,
              });
            }
          }}>
          <MyAppText
            style={{
              fontFamily: 'NanumSquareB',
              color:
                (type === 1 && data.load_rule.course !== null) ||
                (type === 2 && data.load_tip.course !== null) ||
                (type === 3 && data.safe_drive.course !== null) ||
                (type === 4 && data.drive_service.course !== null)
                  ? COLOR.ACCENT
                  : COLOR.TEXT_GRAY,
              fontSize: 16,
            }}>
            {type === 1 && data.load_rule.course !== null
              ? data.load_rule.course.status === 'ok'
                ? data.load_rule.course.level + '회차 완료'
                : data.load_rule.course.level + '회차 진행중'
              : type === 2 && data.load_tip.course !== null
              ? data.load_tip.course.status === 'ok'
                ? data.load_tip.course.level + '회차 완료'
                : data.load_tip.course.level + '회차 진행중'
              : type === 3 && data.safe_drive.course !== null
              ? data.safe_drive.course.status === 'ok'
                ? data.safe_drive.course.level + '회차 완료'
                : data.safe_drive.course.level + '회차 진행중'
              : type === 4 && data.drive_service.course !== null
              ? data.drive_service.course.status === 'ok'
                ? data.drive_service.course.level + '회차 완료'
                : data.drive_service.course.level + '회차 진행중'
              : '도전하기'}
          </MyAppText>
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          borderBottomColor: '#f5f6f8',
          borderBottomWidth: 1,
          flexDirection: 'row',
          paddingVertical: 10,
        }}>
        <View
          style={{
            height: '100%',
            width: 120,
            borderRightWidth: 2,
            borderRightColor: '#f5f6f8',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MyAppText style={{fontSize: 40, fontFamily: 'NanumSquareB'}}>
            {score.toString()}
          </MyAppText>
          <Space height={5} />

          <View
            style={{
              height: 4,
              width: 80,
              //@ts-ignore
              backgroundColor:
                score === 0
                  ? '#A0A0A0'
                  : score < 60
                  ? '#bc0022'
                  : score < 90
                  ? '#09942b'
                  : '#1c9b3b',
            }}
          />
        </View>
        <View style={{flex: 1, paddingHorizontal: 10}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={
                type === 1
                  ? data.load_rule.level_list
                  : type === 2
                  ? data.load_tip.level_list
                  : type === 3
                  ? data.safe_drive.level_list
                  : data.drive_service.level_list
              }
              renderItem={({item, index}) => {
                var number =
                  index < 9
                    ? '0' + (index + 1).toString()
                    : (index + 1).toString();
                return (
                  <View style={{justifyContent: 'center'}}>
                    <View
                      style={{
                        alignSelf: 'center',
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        position: 'absolute',
                        shadowColor: COLOR.ACCENT,
                        shadowRadius: 5,
                        shadowOffset: {
                          height: 0,
                          width: 0,
                        },
                        shadowOpacity: 0.7,
                        backgroundColor: 'white',
                      }}></View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('/examMain/problem', {
                          type: (type - 1).toString(),
                          level: index + 1,
                        })
                      }
                      style={{
                        alignSelf: 'center',
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        borderWidth: 3,
                        borderColor: COLOR.ACCENT,
                        marginHorizontal: 12,
                        shadowColor: COLOR.ACCENT,
                        shadowRadius: 5,
                        shadowOffset: {
                          height: 0,
                          width: 0,
                        },
                        shadowOpacity: 0.7,
                        backgroundColor:
                          type === 1
                            ? data.load_rule.level_list[index].status === 'ok'
                              ? COLOR.ACCENT
                              : 'white'
                            : type === 2
                            ? data.load_tip.level_list[index].status === 'ok'
                              ? COLOR.ACCENT
                              : 'white'
                            : type === 3
                            ? data.safe_drive.level_list[index].status === 'ok'
                              ? COLOR.ACCENT
                              : 'white'
                            : type === 4
                            ? data.drive_service.level_list[index].status ===
                              'ok'
                              ? COLOR.ACCENT
                              : 'white'
                            : 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        overflow: 'hidden',
                      }}>
                      {type === 1 ? (
                        data.load_rule.level_list[index].status === 'ok' ? (
                          <Image
                            source={require('../../assets/check_ic.png')}
                            style={{width: 25, height: 25}}
                          />
                        ) : data.load_rule.level_list[index].status ===
                          'going' ? (
                          <>
                            <View
                              style={{
                                width: 25,
                                height: 50,
                                backgroundColor: COLOR.ACCENT,
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                              }}>
                              <MyAppText style={{fontSize: 20, color: 'white'}}>
                                {number.substring(0, 1)}
                              </MyAppText>
                            </View>
                            <View
                              style={{
                                width: 25,
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                              }}>
                              <MyAppText
                                style={{fontSize: 20, color: COLOR.ACCENT}}>
                                {number.substring(1, 2)}
                              </MyAppText>
                            </View>
                          </>
                        ) : (
                          <MyAppText
                            style={{fontSize: 20, color: COLOR.ACCENT}}>
                            {number}
                          </MyAppText>
                        )
                      ) : type === 2 ? (
                        data.load_tip.level_list[index].status === 'ok' ? (
                          <Image
                            source={require('../../assets/check_ic.png')}
                            style={{width: 25, height: 25}}
                          />
                        ) : data.load_tip.level_list[index].status ===
                          'going' ? (
                          <>
                            <View
                              style={{
                                width: 25,
                                height: 50,
                                backgroundColor: COLOR.ACCENT,
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                              }}>
                              <MyAppText style={{fontSize: 20, color: 'white'}}>
                                {number.substring(0, 1)}
                              </MyAppText>
                            </View>
                            <View
                              style={{
                                width: 25,
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                              }}>
                              <MyAppText
                                style={{fontSize: 20, color: COLOR.ACCENT}}>
                                {number.substring(1, 2)}
                              </MyAppText>
                            </View>
                          </>
                        ) : (
                          <MyAppText
                            style={{fontSize: 20, color: COLOR.ACCENT}}>
                            {number}
                          </MyAppText>
                        )
                      ) : type === 3 ? (
                        data.safe_drive.level_list[index].status === 'ok' ? (
                          <Image
                            source={require('../../assets/check_ic.png')}
                            style={{width: 25, height: 25}}
                          />
                        ) : data.safe_drive.level_list[index].status ===
                          'going' ? (
                          <>
                            <View
                              style={{
                                width: 25,
                                height: 50,
                                backgroundColor: COLOR.ACCENT,
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                              }}>
                              <MyAppText style={{fontSize: 20, color: 'white'}}>
                                {number.substring(0, 1)}
                              </MyAppText>
                            </View>
                            <View
                              style={{
                                width: 25,
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                              }}>
                              <MyAppText
                                style={{fontSize: 20, color: COLOR.ACCENT}}>
                                {number.substring(1, 2)}
                              </MyAppText>
                            </View>
                          </>
                        ) : (
                          <MyAppText
                            style={{fontSize: 20, color: COLOR.ACCENT}}>
                            {number}
                          </MyAppText>
                        )
                      ) : type === 4 ? (
                        data.drive_service.level_list[index].status === 'ok' ? (
                          <Image
                            source={require('../../assets/check_ic.png')}
                            style={{width: 25, height: 25}}
                          />
                        ) : data.drive_service.level_list[index].status ===
                          'going' ? (
                          <>
                            <View
                              style={{
                                width: 25,
                                height: 50,
                                backgroundColor: COLOR.ACCENT,
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                              }}>
                              <MyAppText style={{fontSize: 20, color: 'white'}}>
                                {number.substring(0, 1)}
                              </MyAppText>
                            </View>
                            <View
                              style={{
                                width: 25,
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                              }}>
                              <MyAppText
                                style={{fontSize: 20, color: COLOR.ACCENT}}>
                                {number.substring(1, 2)}
                              </MyAppText>
                            </View>
                          </>
                        ) : (
                          <MyAppText
                            style={{fontSize: 20, color: COLOR.ACCENT}}>
                            {number}
                          </MyAppText>
                        )
                      ) : (
                        <></>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
export default ExamMain;

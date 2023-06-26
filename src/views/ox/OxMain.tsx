import React, {useCallback, useState} from 'react';
import {FlatList, Image, Pressable, TouchableOpacity, View} from 'react-native';
import BackHeader from '../../components/BackHeader';
import MyAppText from '../../components/MyAppText';
import Space from '../../components/Space';
import {COLOR} from '../../constants/COLOR';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {MainNavigationProp} from '../../navigations/MainNavigator';
import {useAtomValue} from 'jotai';
import tokenAtom from '../../stores/tokenAtom';
import {post} from '../../net/rest/api';
import SwrContainer from '../../components/SwrContainer';

const OxMain = () => {
  const navigation = useNavigation<MainNavigationProp>();

  const token = useAtomValue(tokenAtom);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  console.log('token', token);
  const getCourse = () => {
    var list;
    post(
      'Course/get_user_course',
      {access_token: token, type: 'study'},
      {
        headers: {'Content-Type': `application/x-www-form-urlencoded`},
      },
      () => {},
      true,
    ).then((result: any) => {
      console.log(result.data);
      setData(result.data);
      // if(result.data) {
      //   setRankList(result.data)
      //   setError(false)
      // }});
    });
  };

  useFocusEffect(
    useCallback(() => {
      console.log('getCourse start');
      getCourse();
    }, []),
  );

  return (
    <View style={{flex: 1}}>
      <BackHeader title={'OX 학습모드'} border />
      <View
        style={{
          backgroundColor: '#3552c7',
          height: 92,
          width: '100%',
          justifyContent: 'center',
          paddingLeft: 20,
        }}>
        <MyAppText style={{fontSize: 25, color: 'white'}}>
          분야별 OX 학습
        </MyAppText>
        <Space height={5} />
        <MyAppText style={{fontSize: 25, color: 'white'}}>
          회차별 20문제로 탄탄하게
        </MyAppText>
      </View>
      <View style={{flex: 1}}>
        <SwrContainer data={data} error={error}>
          <>
            <ProblemContainer navigation={navigation} type={1} data={data} />
            <ProblemContainer navigation={navigation} type={2} data={data} />
            <ProblemContainer navigation={navigation} type={3} data={data} />
            <ProblemContainer navigation={navigation} type={4} data={data} />
          </>
        </SwrContainer>
      </View>
    </View>
  );
};

export default OxMain;

const ProblemContainer = ({navigation, type, data}: any) => {
  return (
    <View
      style={{
        flex: 1,
        borderBottomColor: '#d0d2d6',
        borderBottomWidth: 1,
        flexDirection: 'row',
      }}>
      <View
        style={{
          height: '100%',
          width: 120,
          borderRightWidth: 1,
          borderRightColor: '#d0d2d6',
          justifyContent: 'center',
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
          style={{width: 60, height: 80}}
          resizeMode={'contain'}
        />
        <MyAppText style={{fontSize: 16, alignSelf: 'center'}}>
          {type === 1
            ? '교통 및 화물\n   관련 법규'
            : type === 2
            ? '화물 취급 요령'
            : type === 3
            ? '안전 운행'
            : '운송 서비스'}
        </MyAppText>
      </View>
      <View style={{flex: 1, paddingHorizontal: 10}}>
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
              navigation.navigate('/oxMain/problem', {
                type: (type - 1).toString(),
                level: 1,
              });
            }
          }}
          style={{
            height: 30,
            width: '100%',
            borderBottomWidth: 1,
            borderBottomColor: '#d0d2d6',
            justifyContent: 'center',
            alignItems: 'flex-end',
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
              // return <TouchableOpacity onPress={()=>navigation.navigate('/oxMain/problem',{
              //   type:(type-1).toString()
              // })} style={{alignSelf:'center',width:50, height:50,borderRadius:25, borderWidth:3, borderColor:COLOR.ACCENT, marginHorizontal:12, shadowColor:COLOR.ACCENT, shadowRadius:5, shadowOffset:{
              //     height:0, width:0}, shadowOpacity:0.7, backgroundColor:type===1?(data.load_rule.level_list[index].status==='ok'?COLOR.ACCENT:'white'):'white', justifyContent:'center', alignItems:'center'
              // }}>
              //   <MyAppText style={{fontSize:20, color:COLOR.ACCENT}}>{index<9?'0'+(index+1).toString():(index+1).toString()}</MyAppText>
              // </TouchableOpacity>
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
                      navigation.navigate('/oxMain/problem', {
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
                          ? data.drive_service.level_list[index].status === 'ok'
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
                        <MyAppText style={{fontSize: 20, color: COLOR.ACCENT}}>
                          {number}
                        </MyAppText>
                      )
                    ) : type === 2 ? (
                      data.load_tip.level_list[index].status === 'ok' ? (
                        <Image
                          source={require('../../assets/check_ic.png')}
                          style={{width: 25, height: 25}}
                        />
                      ) : data.load_tip.level_list[index].status === 'going' ? (
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
                        <MyAppText style={{fontSize: 20, color: COLOR.ACCENT}}>
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
                        <MyAppText style={{fontSize: 20, color: COLOR.ACCENT}}>
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
                        <MyAppText style={{fontSize: 20, color: COLOR.ACCENT}}>
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
  );
};

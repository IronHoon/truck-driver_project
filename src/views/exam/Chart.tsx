import React, {useCallback, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import BackHeader from '../../components/BackHeader';
import {COLOR} from '../../constants/COLOR';
import MyAppText from '../../components/MyAppText';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {MainNavigationProp} from '../../navigations/MainNavigator';
import Space from '../../components/Space';
import {
  VictoryArea,
  VictoryChart,
  VictoryLabel,
  VictoryPolarAxis,
  VictoryScatter,
  VictoryTheme,
} from 'victory-native';
import {post} from '../../net/rest/api';
import {useAtomValue} from 'jotai';
import tokenAtom from '../../stores/tokenAtom';
import nickNameAtom from '../../stores/nickNameAtom';
// import {  } from "victory";

const Chart = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const width = Dimensions.get('window').width;
  const token = useAtomValue(tokenAtom);
  const [data, setData] = useState([]);
  const [avg, setAvg] = useState(0);
  const nickName = useAtomValue(nickNameAtom);

  useFocusEffect(
    useCallback(() => {
      post(
        'Main/get_main_data',
        {
          access_token: token,
        },
        {
          headers: {'Content-Type': `application/x-www-form-urlencoded`},
        },
        () => {},
        true,
      ).then((result: any) => {
        setAvg(result.data.avg_point);
        //@ts-ignore
        setData([
          //@ts-ignore
          result.data.load_tip_point,
          //@ts-ignore
          result.data.load_rule_point,
          //@ts-ignore
          result.data.safe_drive_point,
          //@ts-ignore
          result.data.drive_service_point,
        ]);
      });
    }, []),
  );

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLOR.PRIMARY,
      }}>
      <BackHeader title={'학습통계'} border></BackHeader>

      <View style={{flex: 1}}>
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
        <View style={{flex: 1, alignItems: 'center'}}>
          <Space height={10} />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('/examMain/chart/myInfo', {
                avg: avg,
              })
            }
            style={{
              height: 70,
              width: '90%',
              backgroundColor: COLOR.PRIMARY,
              borderRadius: 6,
              justifyContent: 'space-between',
              alignItems: 'center',
              shadowOpacity: 0.2,
              shadowRadius: 5,
              shadowOffset: {
                height: 0,
                width: 0,
              },
              shadowColor: 'black',
              flexDirection: 'row',
              paddingHorizontal: 10,
            }}>
            <View>
              <MyAppText style={{fontSize: 23, color: 'white'}}>
                {nickName}
              </MyAppText>
              <Space height={3} />
              <MyAppText
                style={{
                  fontSize: 14,
                  color: 'white',
                  fontFamily: 'NanumSquareB',
                }}>
                평균 모의고사 점수
              </MyAppText>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MyAppText
                style={{
                  fontSize: 27,
                  color: 'white',
                  fontFamily: 'NanumSquareB',
                }}>
                {
                  //@ts-ignore
                  parseInt(avg).toString()
                }
              </MyAppText>
              <MyAppText style={{fontSize: 25, color: 'white'}}> 점</MyAppText>
            </View>
          </TouchableOpacity>
          <View style={{height: '60%', width: '100%'}}>
            <View
              style={{
                position: 'absolute',
                bottom: width * 0.07,
                right: width * 0.03,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/hand_ic.png')}
                style={{width: 25, height: 25}}
                resizeMode={'contain'}
              />
              <Space width={8} />
              <MyAppText style={{color: 'white'}}>운송 서비스</MyAppText>
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: width * 0.07,
                left: width * 0.03,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/driver_ic.png')}
                style={{width: 25, height: 25}}
                resizeMode={'contain'}
              />
              <Space width={8} />
              <MyAppText style={{color: 'white'}}>안전 운행</MyAppText>
            </View>
            <View
              style={{
                position: 'absolute',
                top: width * 0.06,
                right: width * 0.03,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/truck_ic.png')}
                style={{width: 25, height: 25}}
                resizeMode={'contain'}
              />
              <Space width={8} />
              <MyAppText style={{color: 'white'}}>화물 취급 요령</MyAppText>
            </View>
            <View
              style={{
                position: 'absolute',
                top: width * 0.06,
                left: width * 0.03,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/scale_ic.png')}
                style={{width: 25, height: 25}}
                resizeMode={'contain'}
              />
              <Space width={8} />
              <MyAppText style={{color: 'white'}}>교통 및 화물 법규</MyAppText>
            </View>
            <View style={styles.container}>
              <VictoryChart
                polar
                startAngle={45}
                endAngle={405}
                theme={VictoryTheme.material}>
                {[1, 2, 3, 4].map((d, i) => (
                  <VictoryPolarAxis
                    key={i}
                    dependentAxis
                    axisAngle={90 * i}
                    labelPlacement="perpendicular"
                    style={{
                      axis: {stroke: 'white', strokeWidth: 1},
                      tickLabels: {fill: 'transparent'},
                    }}
                    tickValues={[20, 40, 60, 80, 100]}
                  />
                ))}

                <VictoryPolarAxis
                  dependentAxis
                  style={{
                    axis: {stroke: 'none'},
                    tickLabels: {
                      fill: 'white',
                      fontSize: 16,
                      verticalAnchor: 'start',
                      fontWeight: '700',
                    },
                    grid: {
                      stroke: 'white',
                      strokeWidth: 1,
                      strokeDasharray: '1',
                    },
                  }}
                  axisAngle={90}
                  tickValues={[20, 40, 60, 80]}
                  tickLabelComponent={
                    <VictoryLabel
                      dy={-10}
                      dx={-8}
                      textAnchor="start"
                      backgroundPadding={[3]}
                      backgroundStyle={[{fill: COLOR.PRIMARY}]}
                    />
                  }
                  labelPlacement="vertical"
                />
                <VictoryPolarAxis
                  labelPlacement="vertical"
                  dependentAxis
                  axisAngle={90}
                  style={{
                    axis: {stroke: 'none'},
                    grid: {
                      stroke: 'white',
                      strokeWidth: 2,
                      strokeDasharray: '1',
                    },
                    tickLabels: {
                      fill: 'white',
                      fontSize: 16,
                      fontWeight: '700',
                      verticalAnchor: 'start',
                    },
                  }}
                  tickValues={[100]}
                  tickLabelComponent={
                    <VictoryLabel
                      dy={-10}
                      dx={-12}
                      textAnchor="start"
                      backgroundPadding={[3]}
                      backgroundStyle={[{fill: COLOR.PRIMARY}]}
                    />
                  }
                />

                <VictoryPolarAxis
                  labelPlacement="vertical"
                  dependentAxis
                  axisAngle={90}
                  style={{
                    axis: {stroke: 'none'},
                    grid: {
                      stroke: COLOR.YELLOW,
                      strokeWidth: 2,
                      strokeDasharray: '1',
                    },
                    tickLabels: {
                      fill: COLOR.YELLOW,
                      fontSize: 16,
                      fontWeight: '700',
                      verticalAnchor: 'start',
                    },
                  }}
                  tickValues={[60]}
                  tickLabelComponent={
                    <VictoryLabel
                      dy={-10}
                      dx={-8}
                      textAnchor="start"
                      backgroundPadding={[3]}
                      backgroundStyle={[{fill: COLOR.PRIMARY}]}
                    />
                  }
                />

                <VictoryArea
                  data={data}
                  style={{
                    data: {fill: 'rgba(255,255,255,0.2)'},
                    labels: {
                      fontSize: 15,
                      fill: 'white',
                      verticalAnchor: 'start',
                    },
                  }}
                />
                <VictoryScatter
                  data={data}
                  size={3}
                  style={{data: {fill: 'white'}}}
                />
                <VictoryScatter
                  data={data}
                  size={1.5}
                  style={{data: {fill: COLOR.PRIMARY}}}
                />
              </VictoryChart>
            </View>
          </View>
          <View style={{width: '100%', alignItems: 'center'}}>
            <MyAppText
              style={{
                color: COLOR.YELLOW,
                fontSize: 14,
                fontFamily: 'NanumSquareB',
              }}>
              합격기준 60점 이상
            </MyAppText>
          </View>
          <Space height={50} />
          <View style={{width: '100%', alignItems: 'center'}}>
            <MyAppText
              style={{
                color: 'white',
                fontSize: 25,
                fontFamily: 'NanumSquareB',
              }}>
              나는 어디쯤일까?
            </MyAppText>
          </View>
        </View>
        <View
          style={{
            height: 100,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('/examMain', {
                back: true,
              })
            }
            style={{
              height: 70,
              width: '90%',
              backgroundColor: 'white',
              borderRadius: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MyAppText
              style={{color: COLOR.ACCENT, fontSize: 27, fontWeight: '900'}}>
              모의고사 바로가기
            </MyAppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Chart;

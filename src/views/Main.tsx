import React, {useCallback, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import MyAppText from '../components/MyAppText';
import Space from '../components/Space';
import {COLOR} from '../constants/COLOR';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {MainNavigationProp} from '../navigations/MainNavigator';
import {
  VictoryArea,
  VictoryChart,
  VictoryLabel,
  VictoryPolarAxis,
  VictoryScatter,
} from 'victory-native';
import {useAtomValue} from 'jotai';
import tokenAtom from '../stores/tokenAtom';
import {post} from '../net/rest/api';
import nickNameAtom from '../stores/nickNameAtom';
import loginCntAtom from '../stores/loginCntAtom';
import {userAtom} from '../stores/userAtom';
import {getElapsedDays} from '../utils';

const urlList = [
  'https://www.youtube.com/watch?v=xP8nKhqt8P0',
  'http://m.joowonlogis.com/bbs_shop/list.htm?board_code=a01_18',
  'http://m.jiibjobkorea.com/main',
  'http://m.joowongroup.com/shop_add_page/index.htm?page_code=page86',
  'http://www.iltonman.com/mobile/index.html',
  'http://m.joowonlogis.com/shop_contents/myreg_form.htm?myreg_code=se001',
];

const Main = () => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  const navigation = useNavigation<MainNavigationProp>();
  const [activeIndex, setActiveIndex] = useState(0);

  const [data, setData] = useState<any[]>([]);
  const [avg, setAvg] = useState(0);
  const nickName = useAtomValue(nickNameAtom);
  const loginCnt = useAtomValue(loginCntAtom);
  // useAtomValue()

  const token = useAtomValue(tokenAtom);
  const user = useAtomValue(userAtom);

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
          result.data.load_tip_point,
          result.data.load_rule_point,
          result.data.safe_drive_point,
          result.data.drive_service_point,
        ]);
      });
    }, [token]),
  );

  const carouselRef = useRef();

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{height: '100%', width: '100%'}}>
        <View style={{height: '38%', width: '100%'}}>
          <Carousel
            loop
            width={width}
            //@ts-ignore
            ref={carouselRef}
            height={height * 0.43}
            autoPlay={true}
            autoPlayInterval={3000}
            data={urlList}
            scrollAnimationDuration={1000}
            onSnapToItem={index => {
              setActiveIndex(index);
            }}
            // onSnapToItem={(index) => console.log("current index:", index)}
            renderItem={({index}) => (
              <View
                style={{
                  height: '100%',
                  width: '100%',
                  paddingTop: 30,
                }}>
                {/*<WebView*/}
                {/*  source={{ uri: ''}}*/}
                {/*  style={{ marginTop: 20 }}*/}
                {/*/>*/}
                <View
                  style={{
                    borderRadius: 10,
                    width: '100%',
                    height: '80%',
                    overflow: 'hidden',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  <Pressable
                    onPress={() => {
                      Linking.openURL(urlList[index]);
                    }}
                    style={{
                      width: '100%',
                      height: '70%',
                      borderWidth: 1,
                      borderColor: COLOR.GRAY,
                    }}>
                    <Image
                      source={
                        index === 0
                          ? require('../assets/carousel_1.png')
                          : index === 1
                          ? require('../assets/carousel_2.png')
                          : index === 2
                          ? require('../assets/carousel_3.png')
                          : index === 3
                          ? require('../assets/carousel_4.png')
                          : index === 4
                          ? require('../assets/carousel_5.png')
                          : require('../assets/carousel_6.png')
                      }
                      style={{width: '100%', height: '100%'}}
                      resizeMode={'contain'}
                    />
                  </Pressable>
                </View>
              </View>
            )}
          />
        </View>
        <View
          //   onPress={async()=>{
          //   await AsyncStorage.removeItem('token')
          //   navigation.navigate('/landing')
          // }}
          style={{
            height: '5%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <FlatList
            horizontal={true}
            data={new Array(6).fill(1)}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor:
                      activeIndex === index ? '#696969' : '#e4e4e4',
                    borderRadius: 10,
                    alignSelf: 'center',
                    marginRight: 10,
                  }}
                />
              );
            }}></FlatList>
        </View>
        <Pressable
          onPress={() => navigation.navigate('/infiniteRanking')}
          style={{
            height: '10%',
            backgroundColor: '#ffbe61',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/infinite_ranking.png')}
            style={{width: 50, height: (50 * 175) / 150}}
          />
          <Space width={5} />
          <View>
            <MyAppText style={{color: 'white', fontSize: 25}}>
              무한랭킹 OX
            </MyAppText>
            <Space height={5} />
            <MyAppText style={{color: 'white', fontSize: 18}}>
              날마다 다른 퀴즈 문제
            </MyAppText>
          </View>
        </Pressable>
        <View
          style={{
            height: '22%',
            backgroundColor: 'white',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('/oxMain')}
            style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#7a8ee2',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/o_ic.png')}
                style={{width: 40, height: 40}}
              />
              <Space width={10} />
              <Image
                source={require('../assets/x_ic.png')}
                style={{width: 40, height: 40}}
              />
            </View>
            <View
              style={{
                flex: 1.3,
                justifyContent: 'center',
                alignItems: 'center',
                borderRightWidth: 1,
                borderColor: '#C8C9CD',
              }}>
              <MyAppText style={{fontSize: 25}}>기출OX</MyAppText>
              <MyAppText style={{fontSize: 25}}>학습모드</MyAppText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('/examMain', {
                back: false,
              })
            }
            style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#229575',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/time_ic.png')}
                style={{width: 40, height: 40}}
              />
              <View style={{position: 'absolute', alignItems: 'center'}}>
                <Image
                  source={require('../assets/exam_ic.png')}
                  style={{width: 25, height: 25}}
                />
              </View>
            </View>
            <View
              style={{
                flex: 1.3,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MyAppText style={{fontSize: 25}}>실전이다</MyAppText>
              <MyAppText style={{fontSize: 25}}>모의고사</MyAppText>
            </View>
          </TouchableOpacity>
        </View>
        <Pressable
          onPress={() => {
            console.log('hello world');
            navigation.navigate('/examMain/chart');
          }}
          style={{height: '25%', flexDirection: 'row'}}>
          <Pressable
            onPress={() => {
              console.log('hello world');
              navigation.navigate('/examMain/chart');
            }}
            style={{
              height: '100%',
              width: '50%',
              backgroundColor: COLOR.PRIMARY,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                position: 'absolute',
                bottom: width * 0.07,
                right: width * 0.03,
              }}>
              <Image
                source={require('../assets/hand_ic.png')}
                style={{width: 25, height: 25}}
                resizeMode={'contain'}
              />
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: width * 0.07,
                left: width * 0.03,
              }}>
              <Image
                source={require('../assets/driver_ic.png')}
                style={{width: 25, height: 25}}
                resizeMode={'contain'}
              />
            </View>
            <View
              style={{
                position: 'absolute',
                top: width * 0.06,
                right: width * 0.03,
              }}>
              <Image
                source={require('../assets/truck_ic.png')}
                style={{width: 25, height: 25}}
                resizeMode={'contain'}
              />
            </View>
            <View
              style={{
                position: 'absolute',
                top: width * 0.06,
                left: width * 0.03,
              }}>
              <Image
                source={require('../assets/scale_ic.png')}
                style={{width: 25, height: 25}}
                resizeMode={'contain'}
              />
            </View>

            <Pressable
              onPress={() => {
                console.log('hello world');
              }}
              style={styles.container}>
              <VictoryChart
                polar
                startAngle={45}
                endAngle={405}
                // theme={VictoryTheme.material}
                height={250}
                width={250}>
                {[1, 2, 3, 4].map((d, i) => (
                  <VictoryPolarAxis
                    key={i.toString()}
                    dependentAxis
                    axisAngle={90 * i}
                    labelPlacement="perpendicular"
                    style={{
                      axis: {stroke: 'white', strokeWidth: 1},
                      tickLabels: {fill: 'transparent'},
                    }}
                    tickValues={[80, 100]}
                  />
                ))}

                <VictoryPolarAxis
                  dependentAxis
                  style={{
                    axis: {stroke: 'none'},
                    tickLabels: {fill: 'transparent'},

                    grid: {
                      stroke: 'white',
                      strokeWidth: 1,
                      strokeDasharray: '1',
                    },
                  }}
                  tickValues={[80]}
                  axisAngle={90}
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
                      strokeWidth: 1.5,
                      strokeDasharray: '1',
                    },
                    tickLabels: {
                      fill: 'white',
                      fontSize: 13,
                      textAlign: 'center',
                      fontWeight: '700',
                      alignSelf: 'center',
                      verticalAnchor: 'start',
                    },
                  }}
                  tickValues={[100]}
                  tickLabelComponent={
                    <VictoryLabel
                      dy={-10}
                      textAnchor="middle"
                      backgroundPadding={[4]}
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
                      strokeWidth: 1.5,
                      strokeDasharray: '1',
                    },
                    tickLabels: {
                      fill: COLOR.YELLOW,
                      fontSize: 13,
                      fontWeight: '700',
                      verticalAnchor: 'start',
                    },
                  }}
                  tickValues={[60]}
                  tickLabelComponent={
                    <VictoryLabel
                      dy={-10}
                      textAnchor="middle"
                      backgroundPadding={[4]}
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
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate('/examMain/chart');
              }}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                position: 'absolute',
              }}></Pressable>
          </Pressable>
          <View style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                borderBottomColor: '#C8C9CD',
                borderBottomWidth: 0.2,
                borderTopWidth: 0.2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MyAppText style={{fontSize: 20, fontFamily: 'NanumSquareB'}}>
                평균 모의고사 점수
              </MyAppText>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MyAppText style={{fontSize: 30}}>
                  {
                    //@ts-ignore
                    parseInt(avg).toString()
                  }
                </MyAppText>
                <Space width={3} />
                <MyAppText style={{fontSize: 17, fontFamily: 'NanumSquareB'}}>
                  점
                </MyAppText>
              </View>

              <MyAppText style={{fontFamily: 'NanumSquareR'}}>
                합격기준 60점 이상
              </MyAppText>
            </View>
            <View
              style={{
                flex: 1,
                borderBottomColor: '#C8C9CD',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MyAppText style={{fontSize: 20, fontFamily: 'NanumSquareB'}}>
                {nickName + ' 님'}
              </MyAppText>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MyAppText style={{fontSize: 17, fontFamily: 'NanumSquareB'}}>
                  학습
                </MyAppText>
                <Space width={5} />
                <MyAppText style={{fontSize: 25}}>
                  {getElapsedDays(user?.reg_time || '')}
                </MyAppText>
                <Space width={3} />
                <MyAppText style={{fontSize: 17, fontFamily: 'NanumSquareB'}}>
                  일째
                </MyAppText>
              </View>
            </View>
          </View>
        </Pressable>
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

export default Main;

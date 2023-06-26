import React, {useCallback, useEffect} from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';
import MyAppText from '../components/MyAppText';
import Space from '../components/Space';
import {MainNavigationProp} from '../navigations/MainNavigator';
import {
  StackActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAtom, useSetAtom} from 'jotai';
import tokenAtom from '../stores/tokenAtom';
import nickNameAtom from '../stores/nickNameAtom';
import loginCntAtom from '../stores/loginCntAtom';
import {post, rememberToken, rememberUser} from '../net/rest/api';
import {userAtom} from '../stores/userAtom';
// import {useFocusEffect, useNavigation} from "@react-navigation/native";

const Splash = () => {
  const navigation = useNavigation<MainNavigationProp>();
  const [, setToken] = useAtom(tokenAtom);
  const setNickName = useSetAtom(nickNameAtom);
  const setLoginCnt = useSetAtom(loginCntAtom);
  const setUser = useSetAtom(userAtom);

  useFocusEffect(
    useCallback(() => {
      var token: string;
      var id: string;
      var login_type: string;
      console.log('thisis landing');
      (async () => {
        token = (await AsyncStorage.getItem('token')) ?? '';
        id = (await AsyncStorage.getItem('userId')) ?? '';
        login_type = (await AsyncStorage.getItem('login_type')) ?? '';

        console.log('tokenCheck', token);
      })().then(async () => {
        if (token) {
          await post(
            '/User/login',
            {
              id: id,
              login_type: login_type,
              dev_type: Platform.OS === 'ios' ? 'ios' : 'android',
              dev_token: '',
            },
            {
              headers: {'Content-Type': `application/x-www-form-urlencoded`},
            },
            () => {
              // 통신에 실패해도 로그인 화면으로 이동
              navigation.dispatch(StackActions.replace('/landing'));
            },
            true,
          ).then((result: any) => {
            console.log(result);
            // @ts-ignore
            if (result.msg === '성공') {
              setToken(result.data.access_token);
              rememberToken(result.data.access_token);
              rememberUser(result.data);
              setNickName(result.data.nickname);
              setLoginCnt(result.data.login_cnt);
              setUser(result.data);
              navigation.dispatch(
                StackActions.replace('/main', {
                  token: result.data.access_token,
                }),
              );
            } else {
              navigation.dispatch(StackActions.replace('/landing'));
            }
          });
        } else {
          navigation.dispatch(StackActions.replace('/landing'));
        }
      });
    }, []),
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        backgroundColor: '#3251d3',
      }}>
      <View
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          overflow: 'hidden',
        }}>
        <Image
          source={require('../assets/background.png')}
          style={{
            position: 'absolute',
            bottom: -210,
            left: -350,
            width: 900,
            height: (900 * 2399) / 3403,
          }}
          resizeMode={'cover'}></Image>
      </View>

      <View style={{width: '100%', alignContent: 'center'}}>
        <Image
          source={require('../assets/ic_truck.png')}
          style={{alignSelf: 'center', width: 180, height: (180 * 330) / 582}}
        />
        <Space height={4} />
        <MyAppText
          style={{
            color: 'white',
            fontSize: 40,
            alignSelf: 'center',
            lineHeight: 40,
          }}>
          슬기로운
        </MyAppText>
        <Space height={5} />
        <MyAppText style={{color: 'white', fontSize: 40, alignSelf: 'center'}}>
          화물기사생활
        </MyAppText>
        <Space height={8} />
        <MyAppText
          style={{
            color: 'white',
            fontSize: 14,
            alignSelf: 'center',
            fontFamily: 'NanumSquareR',
          }}>
          화물운송종사자격시험 대비 완전정복
        </MyAppText>
      </View>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: 100,
          bottom: 120,
          justifyContent: 'center',
        }}>
        <MyAppText
          style={{
            color: 'white',
            alignSelf: 'center',
            fontFamily: 'NanumSquareR',
            fontWeight: '700',
            fontSize: 16,
          }}>
          주원통운 &times; 한양대학교
        </MyAppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    height: '100%',
    display: 'flex',
  },
});

export default Splash;

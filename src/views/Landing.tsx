import React, {useCallback, useEffect, useState} from 'react';
import {Image, Platform, Pressable, View} from 'react-native';
import Space from '../components/Space';
import MyAppText from '../components/MyAppText';
import {getProfile, login} from '@react-native-seoul/kakao-login';
import appleAuth from '@invertase/react-native-apple-authentication';
import {post, rememberToken, rememberUser} from '../net/rest/api';
import {StackActions, useNavigation} from '@react-navigation/native';
import {MainNavigationProp} from '../navigations/MainNavigator';
import {useAtom, useSetAtom} from 'jotai';
import tokenAtom from '../stores/tokenAtom';
import nickNameAtom from '../stores/nickNameAtom';
import loginCntAtom from '../stores/loginCntAtom';
import {userAtom} from '../stores/userAtom';
import {SignInParamsType} from '../types';
import {SignInResponseType} from '../types/SignInResponseType';
import Nullable from '../types/Nullable';

const Landing = () => {
  const [, setResult] = useState<string>('');
  const navigation = useNavigation<MainNavigationProp>();
  const [, setId] = useState('');
  const [, setToken] = useAtom(tokenAtom);
  const [, setNickName] = useAtom(nickNameAtom);
  const [, setLoginCnt] = useAtom(loginCntAtom);
  const setUser = useSetAtom(userAtom);

  const signIn = useCallback(
    async (params: SignInParamsType) => {
      const result: Nullable<SignInResponseType> = await post<
        SignInResponseType,
        SignInParamsType
      >(
        '/User/login',
        params,
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        },
        () => {},
        true,
      );
      if (!!result && result.msg === '성공') {
        setToken(result.data.access_token);
        rememberToken(result.data.access_token);
        rememberUser(result.data);
        setNickName(result.data.nickname);
        setLoginCnt(result.data.login_cnt.toString());
        setUser(result.data);
        navigation.dispatch(
          StackActions.replace('/main', {token: result.data.access_token}),
        );
      } else {
        navigation.navigate('/signup', {
          id: params.id,
          loginType: params.login_type,
        });
      }
    },
    [navigation, setLoginCnt, setNickName, setToken, setUser],
  );

  const signInWithKakao = async (): Promise<void> => {
    try {
      const token = await login();
      const profile = await getProfile();
      setResult(JSON.stringify(token));
      setId(profile.id);
      await signIn({
        id: profile.id,
        login_type: 'kakao',
        dev_type: Platform.OS === 'ios' ? 'ios' : 'android',
        dev_token: '',
      });
    } catch (err) {
      console.error('login err', err);
    }
  };

  const onAppleButtonPress = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: it appears putting FULL_NAME first is important, see issue #293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      console.log('success applelogin', appleAuthRequestResponse.user);
      setId(appleAuthRequestResponse.user);
      await signIn({
        id: appleAuthRequestResponse.user,
        login_type: 'apple',
        dev_type: Platform.OS === 'ios' ? 'ios' : 'android',
        dev_token: '',
      });
    } else {
      console.log('fail to login');
    }
  };

  useEffect(() => {
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    return () => {
      if (Platform.OS === 'ios') {
        appleAuth.onCredentialRevoked(async () => {
          console.warn(
            'If this function executes, User Credentials have been Revoked',
          );
        });
      }
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        backgroundColor: '#3251d3',
      }}>
      <View style={{height: '100%', width: '100%', position: 'absolute'}}>
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
        <Space height={100} />
        <MyAppText
          style={{
            color: 'white',
            alignSelf: 'center',
            fontFamily: 'NanumSquareR',
            fontSize: 20,
          }}>
          로그인 계정을 선택하세요
        </MyAppText>
        <Space height={25} />
        <Pressable
          onPress={async () => {
            try {
              await signInWithKakao();
            } catch (error) {
              console.warn(error);
            }
          }}
          style={{
            width: '80%',
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            backgroundColor: 'white',
            borderRadius: 5,
            flexDirection: 'row',
          }}>
          <Image
            source={require('../assets/ktalk-logo-black-and-white.png')}
            style={{width: 40, height: 40}}
          />
          <Space width={10} />
          <MyAppText>카카오 계정으로 로그인</MyAppText>
        </Pressable>
        {Platform.OS === 'ios' && (
          <>
            <Space height={15} />
            <Pressable
              onPress={() => onAppleButtonPress()}
              style={{
                width: '80%',
                height: 60,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                backgroundColor: 'white',
                borderRadius: 5,
                flexDirection: 'row',
              }}>
              <Image
                source={require('../assets/Apple-logo-black-and-white.png')}
                style={{width: 30, height: 35}}
              />
              <Space width={10} />
              <MyAppText>APPLE로 로그인</MyAppText>
            </Pressable>
          </>
        )}
        {/*{__DEV__ && (*/}
        {/*  <>*/}
        {/*    <Space height={15} />*/}
        {/*    <Pressable*/}
        {/*      onPress={async () => {*/}
        {/*        await signIn({*/}
        {/*          id: '2764528259',*/}
        {/*          login_type: 'kakao',*/}
        {/*          dev_type: Platform.OS === 'ios' ? 'ios' : 'android',*/}
        {/*          dev_token: '',*/}
        {/*        });*/}
        {/*      }}>*/}
        {/*      <MyAppText>로그인 : 2764528259 (김닉닉)</MyAppText>*/}
        {/*    </Pressable>*/}
        {/*    <Space height={15} />*/}
        {/*    <Pressable*/}
        {/*      onPress={() => {*/}
        {/*        navigation.navigate('/signup', {*/}
        {/*          id: (new Date().getTime() + Math.random()).toString(),*/}
        {/*          loginType: 'kakao',*/}
        {/*        });*/}
        {/*      }}>*/}
        {/*      <MyAppText>회원가입</MyAppText>*/}
        {/*    </Pressable>*/}
        {/*  </>*/}
        {/*)}*/}
      </View>
    </View>
  );
};

export default Landing;

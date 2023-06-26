import React, {useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import BackHeader from '../../components/BackHeader';
import {COLOR} from '../../constants/COLOR';
import MyAppText from '../../components/MyAppText';
import Space from '../../components/Space';
import Modal from 'react-native-modal';
import {useNavigation, useRoute} from '@react-navigation/native';
import {MainNavigationProp} from '../../navigations/MainNavigator';
import tokenAtom from '../../stores/tokenAtom';
import {useAtomValue} from 'jotai';
import {post, rememberToken, rememberUser} from '../../net/rest/api';
import nickNameAtom from '../../stores/nickNameAtom';
import loginCntAtom from '../../stores/loginCntAtom';
import {useAtom, useSetAtom} from 'jotai/index';
import {userAtom} from '../../stores/userAtom';
import {getElapsedDays} from '../../utils';

const MyInfo = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const navigation = useNavigation<MainNavigationProp>();
  const token = useAtomValue(tokenAtom);
  const nickName = useAtomValue(nickNameAtom);
  const loginCnt = useAtomValue(loginCntAtom);
  const [, setToken] = useAtom(tokenAtom);
  const [, setNickName] = useAtom(nickNameAtom);
  const [, setLoginCnt] = useAtom(loginCntAtom);
  const [user, setUser] = useAtom(userAtom);

  const {
    //@ts-ignore
    params: {avg},
  } = useRoute();

  return (
    <View style={{flex: 1, backgroundColor: COLOR.PRIMARY}}>
      <BackHeader title={'회원정보'} border />
      <View style={{flex: 1, paddingHorizontal: 15}}>
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
        <View>
          <Space height={60} />
          <MyAppText
            style={{color: 'white', fontFamily: 'NanumSquareB', fontSize: 23}}>
            {nickName + ' 님'}
          </MyAppText>
          <Space height={30} />
          <MyAppText
            style={{color: 'white', fontFamily: 'NanumSquareB', fontSize: 23}}>
            {'학습 ' + getElapsedDays(user?.reg_time || '') + '일째'}
          </MyAppText>
          <Space height={30} />
          <MyAppText
            style={{color: 'white', fontFamily: 'NanumSquareB', fontSize: 23}}>
            {'평균 모의고사 점수 ' + parseInt(avg) + '점'}
          </MyAppText>
        </View>
        <Space height={40} />
        <TouchableOpacity
          onPress={() => setIsShowModal(true)}
          style={{
            height: 55,
            width: 180,
            backgroundColor: 'white',
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MyAppText style={{color: COLOR.PRIMARY, fontSize: 25}}>
            회원 탈퇴하기
          </MyAppText>
        </TouchableOpacity>
      </View>
      <Modal
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        isVisible={isShowModal}
        onBackdropPress={() => {
          setIsShowModal(false);
        }}>
        <View
          style={{
            width: '90%',
            height: 190,
            backgroundColor: 'white',
            borderRadius: 8,
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <MyAppText style={{fontSize: 20}}>
              회원탈퇴를 하시겠습니까?
            </MyAppText>
            <Space height={15}></Space>
            <MyAppText
              style={{
                fontFamily: 'NanumSquareB',
                fontSize: 16,
                color: '#6D6D6D',
              }}>
              회원 탈퇴 시 로그 내역 및 성적 등 모든
            </MyAppText>
            <Space height={5} />
            <MyAppText
              style={{
                fontFamily: 'NanumSquareB',
                fontSize: 16,
                color: '#6D6D6D',
              }}>
              정보가 사라집니다.
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
                setIsShowModal(false);
                post('User/signout', {
                  access_token: token,
                  reason: '',
                }).then(() => {
                  setToken('');
                  rememberToken('');
                  rememberUser('');
                  setNickName('');
                  setLoginCnt('');
                  setUser(null);

                  // @ts-ignore
                  navigation.navigate('/landing');
                });
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
                탈퇴하기
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

export default MyInfo;

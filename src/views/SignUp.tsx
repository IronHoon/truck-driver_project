import React, {useCallback, useState} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import BackHeader from '../components/BackHeader';
import MyAppText from '../components/MyAppText';
import Space from '../components/Space';
import {COLOR} from '../constants/COLOR';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import styled from '@emotion/native';
//@ts-ignore
import {Picker} from 'react-native-wheel-pick';
import Modal from 'react-native-modal';
import {MainNavigationProp} from '../navigations/MainNavigator';
import {post, rememberToken, rememberUser} from '../net/rest/api';
import Toast from 'react-native-toast-message';
import tokenAtom from '../stores/tokenAtom';
import {useAtom, useSetAtom} from 'jotai';
import nickNameAtom from '../stores/nickNameAtom';
import loginCntAtom from '../stores/loginCntAtom';
import {userAtom} from '../stores/userAtom';

const SignUp = () => {
  const [nickName, setNickName] = useState('');
  const [visible, setVisible] = useState(false);
  const [age, setAge] = useState(0);
  const navigation = useNavigation<MainNavigationProp>();
  const [, setToken] = useAtom(tokenAtom);
  const [, setNickNameAtom] = useAtom(nickNameAtom);
  const [, setLoginCnt] = useAtom(loginCntAtom);
  const setUser = useSetAtom(userAtom);
  const {
    //@ts-ignore
    params: {id, loginType},
  } = useRoute();

  console.log('id', id);
  console.log('nickName', nickName);

  const showToast = (text: string) => {
    Toast.show({
      type: 'error',
      text1: text,
      position: 'bottom',
      bottomOffset: 120,
    });
  };

  const signUp = async () => {
    await post(
      '/User/signup',
      {
        id: id,
        login_type: loginType,
        name: id,
        nickname: nickName,
        age: age,
        dev_type: Platform.OS === 'ios' ? 'ios' : 'android',
        pwd: '',
        dev_token: '',
      },
      {
        headers: {'Content-Type': `application/x-www-form-urlencoded`},
      },
      error => {
        console.warn(error);
        Alert.alert(
          '회원가입 실패',
          '서버와 통신에 실패했습니다. 문제가 계속되면 관리자에게 문의해주세요.',
        );
      },
      true,
    ).then((result: any) => {
      if (result.msg === '성공') {
        rememberToken(result.data.access_token);
        rememberUser(result.data);
        setLoginCnt(result.data.login_cnt);
        setNickNameAtom(result.data.nickname);
        setToken(result.data.access_token);
        setUser(result.data);
        navigation.navigate('/main', {
          token: result.data.access_token,
        });
      } else {
        if (result.reason === 'The nickname field is required.') {
          console.log('닉네임입력해주세요');
          showToast('닉네임을 입력해주세요');
        } else if (result.msg === '이미 사용되고 있는 닉네임입니다.') {
          console.log('이미 사용되고 있는 닉네임입니다.');
          showToast('이미 사용되고 있는 닉네임입니다.');
        }
      }
    });
  };

  return (
    <View style={{flex: 1}}>
      <BackHeader title={'가입하기'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <View
                  style={{
                    width: 80,
                    justifyContent: 'center',
                    alignContent: 'flex-start',
                  }}>
                  <MyAppText style={{fontSize: 20, alignSelf: 'flex-start'}}>
                    닉네임
                  </MyAppText>
                </View>
                <Space width={15} />
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#D0D0D0',
                    borderRadius: 6,
                    height: 67,
                    width: 220,
                    justifyContent: 'center',
                  }}>
                  <TextInput
                    value={nickName}
                    onChangeText={text => setNickName(text)}
                    style={{
                      // height: 40,
                      width: '100%',
                      fontSize: 24,
                      paddingHorizontal: 20,
                      alignSelf: 'center',
                      textAlign: 'center',
                    }}
                    autoFocus={true}></TextInput>
                </View>
              </View>
              <Space height={10} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <View
                  style={{
                    width: 80,
                    justifyContent: 'center',
                    alignContent: 'flex-start',
                  }}>
                  <MyAppText style={{fontSize: 20, alignSelf: 'flex-start'}}>
                    출생년도
                  </MyAppText>
                </View>
                <Space width={15} />
                <Pressable
                  onPress={() => setVisible(true)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#D0D0D0',
                    borderRadius: 6,
                    height: 67,
                    width: 220,
                    justifyContent: 'center',
                  }}>
                  <MyAppText style={{fontSize: 20, alignSelf: 'center'}}>
                    {age === 0 ? '' : age.toString()}
                  </MyAppText>
                  <View
                    style={{
                      position: 'absolute',
                      width: '100%',
                      alignSelf: 'center',
                      alignItems: 'flex-end',
                      paddingRight: 20,
                    }}>
                    <MyAppText style={{fontSize: 18}}>▼</MyAppText>
                  </View>
                </Pressable>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                signUp();
              }}
              style={{
                width: '90%',
                height: 55,
                backgroundColor: COLOR.PRIMARY,
                justifyContent: 'center',
                alignContent: 'center',
                borderRadius: 6,
              }}>
              <MyAppText
                style={{fontSize: 20, color: 'white', alignSelf: 'center'}}>
                저장하기
              </MyAppText>
            </TouchableOpacity>
            <Space height={10} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <StyleModal
        visible={visible}
        setVisible={setVisible}
        age={age}
        setAge={setAge}></StyleModal>
    </View>
  );
};

export const StyleModal = ({visible, setVisible, age, setAge}: any) => {
  const [error, setError] = useState(false);
  var styleList = [];
  for (var i = 1920; i < 2021; i++) {
    styleList.push(i);
  }
  useFocusEffect(
    useCallback(() => {
      setError(false);
    }, []),
  );
  return (
    <Modal
      style={{
        flex: 1,
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      hideModalContentWhileAnimating={true}
      isVisible={visible}>
      <View
        style={{
          width: 320,
          height: 400,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
          backgroundColor: 'white',
        }}>
        <TitleContainer>
          <MyAppText style={{fontSize: 18, fontWeight: '700'}}>
            출생년도
          </MyAppText>
        </TitleContainer>
        <Picker
          style={{backgroundColor: 'white', width: 300, height: 215}}
          selectedValue="1920"
          pickerData={styleList}
          selectTextColor={COLOR.PRIMARY}
          //@ts-ignore
          onValueChange={value => {
            console.log(value);
            setAge(value);
          }}
        />
        <ButtonContainer>
          <ConfrimBox
            onPress={() => {
              setError(false);
              setVisible(false);
            }}>
            <MyAppText style={{color: 'white', fontWeight: '600'}}>
              확인
            </MyAppText>
          </ConfrimBox>
        </ButtonContainer>
      </View>
    </Modal>
  );
};

const TitleContainer = styled.View`
  width: 100%;
  height: 30px;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.View`
  width: 100%;
  height: 70px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const CancelBox = styled.Pressable`
  width: 40%;
  height: 50px;
  background-color: #e4e4e4;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const ConfrimBox = styled.Pressable`
  width: 100%;
  height: 50px;
  background-color: ${COLOR.PRIMARY};
  border-radius: 16px;
  justify-content: center;
  align-items: center;
`;
export default SignUp;

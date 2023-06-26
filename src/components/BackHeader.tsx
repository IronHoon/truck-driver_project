import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import styled from '@emotion/native';
import {COLOR} from '../constants/COLOR';
import MyAppText from './MyAppText';
import {useNavigation} from '@react-navigation/native';
import {MainNavigationProp} from '../navigations/MainNavigator';

const HeaderContainer = styled.View<{border?: boolean}>`
  height: 65px;
  padding: 15px 25px 15px 15px;
  border-bottom-color: #34499e;
  background-color: ${COLOR.PRIMARY};
  border-bottom-width: ${props => (props.border ? '2px' : '0px')};
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

interface BackHeaderProps {
  title?: string;
  border?: boolean;
  onClick?: () => void;
  description?: string;
}

const BackHeader = ({title, border, onClick, description}: BackHeaderProps) => {
  const navigation = useNavigation<MainNavigationProp>();

  return (
    <HeaderContainer border={border}>
      <TouchableOpacity
        onPress={() => {
          if (onClick) {
            onClick();
          } else {
            navigation.goBack();
          }
        }}>
        <Image
          source={require('../assets/ic_back_white.png')}
          style={{width: 30, height: 20}}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
      <View style={{alignItems: 'flex-end'}}>
        {title && (
          <MyAppText style={{fontSize: 22, color: 'white'}}>{title}</MyAppText>
        )}
        {description && (
          <View style={{marginTop: 3}}>
            <MyAppText
              style={{
                fontSize: 15,
                color: 'white',
                fontFamily: 'NanumSquareL',
              }}>
              {description === '0'
                ? '교통 및 화물 법규'
                : description === '1'
                ? '화물 취급 요령'
                : description === '2'
                ? '안전 운행'
                : '운송 서비스'}
            </MyAppText>
          </View>
        )}
      </View>
    </HeaderContainer>
  );
};

export default BackHeader;

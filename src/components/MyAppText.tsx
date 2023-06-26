import React from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';

interface MyAppTextProp {
  children: string;
  style?: StyleProp<TextStyle>;
  numberofLines?: number;
}

const MyAppText = ({children, style, numberofLines}: MyAppTextProp) => {
  return (
    <Text
      numberOfLines={numberofLines}
      style={[{fontFamily: 'NanumSquareEB', color: 'black'}, style]}>
      {children}
    </Text>
  );
};

export default MyAppText;

import React from 'react';
import {Text, TextProps, StyleProp, TextStyle} from 'react-native';
import {appFonts} from '../themes/appFont';

const GlobalText: React.FC<TextProps> = ({style, children, ...rest}) => {
  return (
    <Text
      {...rest}
      style={[
        {fontFamily: appFonts.MontserratSemiBold},
        style as StyleProp<TextStyle>,
      ]}>
      {children}
    </Text>
  );
};

export default GlobalText;

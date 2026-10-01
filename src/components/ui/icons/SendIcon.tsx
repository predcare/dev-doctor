import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../../styled/theme.styled';
import { IconProps } from '../../../typescripts/types/types';

export const SendIcon: React.FC<IconProps> = ({
  size = 22,
  width,
  height,
  color = theme.colors.textMuted,
  strokeWidth = 2,
  style,
}) => {
  const iconWidth = width ?? size;
  const iconHeight = height ?? size;

  return (
    <Svg width={iconWidth} height={iconHeight} viewBox="0 0 20 20" fill="none">
      <Path
        d="M2 10L18 2L10 18L8.5 11.5L2 10Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M8.5 11.5L13 7" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
};

export default SendIcon;

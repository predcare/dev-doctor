import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { theme } from '../../../styled/theme.styled';
import { IconProps } from '../../../typescripts/types/types';

export const PatientAvatarIcon: React.FC<IconProps> = ({
  size = 24,
  width,
  height,
  color = theme.colors.primary,
  style,
}) => {
  const iconWidth = width ?? size;
  const iconHeight = height ?? size;

  return (
    <Svg width={iconWidth} height={iconHeight} viewBox="0 0 24 24" fill="none" style={style}>
      <Circle cx={12} cy={8} r={4} fill={color} />
      <Path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" fill={color} />
    </Svg>
  );
};

export default PatientAvatarIcon;

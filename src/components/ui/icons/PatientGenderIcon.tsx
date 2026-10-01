import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { theme } from '../../../styled/theme.styled';
import { IconProps } from '../../../typescripts/types/types';

export const PatientGenderIcon: React.FC<IconProps> = ({
  size = 14,
  width,
  height,
  color = theme.colors.primary,
  strokeWidth = 1.25,
  style,
}) => {
  const iconWidth = width ?? 18;
  const iconHeight = height ?? size;

  return (
    <Svg width={iconWidth} height={iconHeight} viewBox="0 0 18 14" fill="none" style={style}>
      <Circle cx={11} cy={3.5} r={2.5} fill={color} />
      <Path
        d="M5.5 13.5c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default PatientGenderIcon;

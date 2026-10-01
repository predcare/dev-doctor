import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { theme } from '../../../styled/theme.styled';
import { IconProps } from '../../../typescripts/types/types';

export const PatientAgeCalendarIcon: React.FC<IconProps> = ({
  size = 14,
  width,
  height,
  color = theme.colors.primary,
  strokeWidth = 1.3,
  style,
}) => {
  const iconWidth = width ?? size;
  const iconHeight = height ?? size;

  return (
    <Svg width={iconWidth} height={iconHeight} viewBox="0 0 14 14" fill="none" style={style}>
      <Rect
        x={1}
        y={2.5}
        width={12}
        height={10}
        rx={1.5}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path d="M1 5.5H13" stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M4.5 1V3M9.5 1V3"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default PatientAgeCalendarIcon;

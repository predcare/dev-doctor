import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../../typescripts/types/types';

export const MealIcon: React.FC<IconProps> = ({
  size = 18,
  width,
  height,
  color = '#64748B',
  strokeWidth = 1.8,
  style,
}) => {
  const iconWidth = width ?? size;
  const iconHeight = height ?? size;

  return (
    <Svg width={iconWidth} height={iconHeight} viewBox="0 0 24 24" fill="none" style={style}>
      <Path
        d="M4 3v7a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V3M7 3v18M16 3c-1.7 0-3 2.2-3 5v5h6V8c0-2.8-1.3-5-3-5zm3 10v8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default MealIcon;

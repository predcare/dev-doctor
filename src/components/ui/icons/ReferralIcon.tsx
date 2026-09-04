import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../../typescripts/types/types';

export const ReferralIcon: React.FC<IconProps> = ({
  size = 18,
  width,
  height,
  color = '#1D4ED8',
  strokeWidth = 2,
  style,
}) => {
  const iconWidth = width ?? size;
  const iconHeight = height ?? size;

  return (
    <Svg width={iconWidth} height={iconHeight} viewBox="0 0 24 24" fill="none" style={style}>
      <Path
        d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ReferralIcon;

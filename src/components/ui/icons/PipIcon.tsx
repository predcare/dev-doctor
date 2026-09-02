import React from 'react';
import Svg, { Rect } from 'react-native-svg';
import type { IconProps } from '../../../typescripts/types/types';

export const PipIcon: React.FC<IconProps> = ({ size = 22, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="4" width="20" height="16" rx="3" stroke={color} strokeWidth="1.8" />
    <Rect
      x="13"
      y="11"
      width="6"
      height="6"
      rx="1.5"
      stroke={color}
      strokeWidth="1.5"
      fill={color}
    />
  </Svg>
);

export default PipIcon;

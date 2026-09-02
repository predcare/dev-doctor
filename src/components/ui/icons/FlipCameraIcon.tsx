import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from '../../../typescripts/types/types';

export const FlipCameraIcon: React.FC<IconProps> = ({ size = 22, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 19a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h3l2-3h8l2 3h3a2 2 0 012 2v11z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 13a3 3 0 015.12-2.12M15 13a3 3 0 01-5.12 2.12"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

export default FlipCameraIcon;

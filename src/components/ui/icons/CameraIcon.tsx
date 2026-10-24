import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from '../../../typescripts/types/types';

export const CameraIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#FFFFFF',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="13" r="3" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

export default CameraIcon;

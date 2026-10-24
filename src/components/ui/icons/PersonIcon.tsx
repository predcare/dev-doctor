import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { theme } from '../../../styled/theme.styled';
import { IconProps } from '../../../typescripts/types/types';

export const PersonIcon: React.FC<IconProps> = ({
  size = 24,
  color = theme.colors.primary,
  strokeWidth = 1.8,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="3.4" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M5.2 19.2c.7-3.2 3.35-5.2 6.8-5.2s6.1 2 6.8 5.2"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export default PersonIcon;

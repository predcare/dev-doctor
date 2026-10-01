import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import theme from '../../../styled/theme.styled';

export const DefaultEmptyIcon = () => (
  <Svg width={44} height={44} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="4"
      stroke={theme.colors.primary}
      strokeWidth="1.75"
      strokeDasharray="4 3"
    />
    <Path
      d="M8 12H16M10 16H14"
      stroke={theme.colors.primary}
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="8" r="1.5" fill={theme.colors.primary} />
    <Circle cx="19" cy="5" r="2" fill={theme.colors.mint} opacity={0.6} />
    <Circle cx="5" cy="19" r="1.5" fill={theme.colors.primaryDark} opacity={0.5} />
  </Svg>
);

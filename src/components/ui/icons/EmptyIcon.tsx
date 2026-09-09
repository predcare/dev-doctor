import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { theme } from '../../../styled/theme.styled';
const EmptyIcon = ({ size = 40, color = theme.colors.primary, opacity = 1 }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ marginBottom: 10, opacity }}
    >
      <Rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        stroke={color ? color : '#888'}
        strokeWidth="1.8"
      />
      <Path
        d="M16 2v4M8 2v4M3 10h18"
        stroke={color ? color : '#888'}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default EmptyIcon;

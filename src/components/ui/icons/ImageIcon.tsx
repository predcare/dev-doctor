import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { IconProps } from '../../../typescripts/types/types';

export const ImageIcon: React.FC<IconProps> = ({
  size = 22,
  width,
  height,
  color = '#3B6FD4',
  strokeWidth = 2,
  style,
}) => {
  const iconWidth = width ?? size;
  const iconHeight = height ?? size;

  return (
    <Svg width={iconWidth} height={iconHeight} viewBox="0 0 24 24" fill="none" style={style}>
      <Rect x="3" y="3" width="18" height="18" rx="4" stroke={color} strokeWidth={strokeWidth} />
      <Circle cx="8.5" cy="8.5" r="1.5" fill={color} />
      <Path
        d="M21 15l-5-5L5 21"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ImageIcon;

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../../styled/theme.styled';
import { IconProps } from '../../../typescripts/types/types';

export const LightbulbInstructionsIcon: React.FC<IconProps> = ({
  size = 18,
  width,
  height,
  color = theme.colors.primary,
  strokeWidth = 2,
  style,
}) => {
  const iconWidth = width ?? size;
  const iconHeight = height ?? size;

  return (
    <Svg width={iconWidth} height={iconHeight} viewBox="0 0 24 24" fill="none" style={style}>
      <Path
        d="M9 18h6m-3-3v3M9.663 17h4.673M12 3a6 6 0 00-6 6c0 1.942.923 3.67 2.356 4.773A6.002 6.002 0 0012 15a6.002 6.002 0 003.644-1.227C17.077 12.67 18 10.942 18 9a6 6 0 00-6-6z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default LightbulbInstructionsIcon;

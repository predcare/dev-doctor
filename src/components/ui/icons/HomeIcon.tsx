import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../../styled/theme.styled';
import { IconProps } from '../../../typescripts/types/types';

export const HomeIcon: React.FC<IconProps> = ({
  size = 22,
  width,
  height,
  color = theme.colors.textMuted,
  style,
}) => {
  const iconWidth = width ?? size;
  const iconHeight = height ?? size;

  return (
    <Svg width={iconWidth} height={iconHeight} viewBox="0 0 18 18" fill="none">
      <Path
        d="M9.98438 0H18V6H9.98438V0V0M9.98438 18V8.01562H18V18H9.98438V18M0 18V12H8.01562V18H0V18M0 9.98438V0H8.01562V9.98438H0V9.98438"
        fill={color}
      />
    </Svg>
  );
};

export default HomeIcon;

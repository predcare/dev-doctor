import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import theme from '../../../styled/theme.styled';

export interface FilterIconProps extends SvgProps {
  size?: number;
  color?: string;
  bgColor?: string;
}

export const FilterIcon: React.FC<FilterIconProps> = ({
  size = 18,
  color = theme.colors.primary,
  ...props
}) => (
  <Svg width={size} height={size} viewBox="0 0 18 12" fill="none" {...props}>
    <Path d="M7 12V10H11V12H7V12M3 7V5H15V7H3V7M0 2V0H18V2H0V2" fill={color} />
  </Svg>
);

export default FilterIcon;

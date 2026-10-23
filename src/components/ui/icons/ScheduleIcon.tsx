import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../../styled/theme.styled';
import { IconProps } from '../../../typescripts/types/types';

export const ScheduleIcon: React.FC<IconProps> = ({
  size = 22,
  width,
  height,
  color = theme.colors.textMuted,
  strokeWidth = 0,
  style,
}) => {
  const iconWidth = width ?? size;
  const iconHeight = height ?? size;

  return (
    <Svg width={iconWidth} height={iconHeight} viewBox="0 0 20 23" fill={color} stroke={color} strokeWidth={strokeWidth}>
      <Path
        d="M18 20.0156V7.03125H1.96875V20.0156H18ZM18 2.01562C18.5312 2.01562 18.9922 2.21875 19.3828 2.625C19.7734 3.03125 19.9688 3.5 19.9688 4.03125V20.0156C19.9688 20.5469 19.7734 21.0156 19.3828 21.4219C18.9922 21.8281 18.5312 22.0312 18 22.0312H1.96875C1.4375 22.0312 0.976562 21.8281 0.585938 21.4219C0.195312 21.0156 0 20.5469 0 20.0156V4.03125C0 3.5 0.195312 3.03125 0.585938 2.625C0.976562 2.21875 1.4375 2.01562 1.96875 2.01562H3V0H4.96875V2.01562H15V0H16.9688V2.01562H18Z"
        fill={color}
      />
    </Svg>
  );
};

export default ScheduleIcon;

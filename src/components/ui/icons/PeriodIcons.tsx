import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { theme } from '../../../styled/theme.styled';
import { IconProps } from '../../../typescripts/types/types';

type PeriodIconProps = IconProps & {
  period: string;
};

const iconSize = (size: number | undefined, width?: number, height?: number) => ({
  width: width ?? size ?? 16,
  height: height ?? size ?? 16,
});

const MorningIcon: React.FC<IconProps> = ({ size, width, height, color, strokeWidth = 1.8, style }) => {
  const box = iconSize(size, width, height);
  return (
    <Svg width={box.width} height={box.height} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M12 3v6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M5.6 8.6l1.4 1.4M18.4 8.6l-1.4 1.4M3 16h2M19 16h2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M4 20h16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M8 20a4 4 0 0 1 8 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
};

const AfternoonIcon: React.FC<IconProps> = ({ size, width, height, color, strokeWidth = 1.8, style }) => {
  const box = iconSize(size, width, height);
  return (
    <Svg width={box.width} height={box.height} viewBox="0 0 24 24" fill="none" style={style}>
      <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M12 2.5v2.2M12 19.3v2.2M4.8 4.8l1.6 1.6M17.6 17.6l1.6 1.6M2.5 12h2.2M19.3 12h2.2M6.4 17.6l-1.6 1.6M19.2 4.8l-1.6 1.6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

const EveningIcon: React.FC<IconProps> = ({ size, width, height, color, strokeWidth = 1.8, style }) => {
  const box = iconSize(size, width, height);
  return (
    <Svg width={box.width} height={box.height} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M12 10V4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M9 7l3 3 3-3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5.2 11.2l1.4 1.4M18.8 11.2l-1.4 1.4M3 17h2M19 17h2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M4 21h16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M8 21a4 4 0 0 1 8 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
};

const NightIcon: React.FC<IconProps> = ({ size, width, height, color, strokeWidth = 1.8, style }) => {
  const box = iconSize(size, width, height);
  return (
    <Svg width={box.width} height={box.height} viewBox="0 0 24 24" fill="none" style={style}>
      <Path
        d="M21 14.5A8.5 8.5 0 1 1 9.5 3 6.5 6.5 0 0 0 21 14.5z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const DefaultPeriodIcon: React.FC<IconProps> = ({ size, width, height, color, strokeWidth = 1.8, style }) => {
  const box = iconSize(size, width, height);
  return (
    <Svg width={box.width} height={box.height} viewBox="0 0 24 24" fill="none" style={style}>
      <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M12 8v4.5l2.5 1.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export const PeriodIcon: React.FC<PeriodIconProps> = ({
  period,
  size = 16,
  width,
  height,
  color = theme.colors.textSlate,
  strokeWidth = 1.8,
  style,
}) => {
  const props = { size, width, height, color, strokeWidth, style };
  switch (period) {
    case 'MORNING':
      return <MorningIcon {...props} />;
    case 'AFTERNOON':
      return <AfternoonIcon {...props} />;
    case 'EVENING':
      return <EveningIcon {...props} />;
    case 'NIGHT':
      return <NightIcon {...props} />;
    default:
      return <DefaultPeriodIcon {...props} />;
  }
};

export default PeriodIcon;

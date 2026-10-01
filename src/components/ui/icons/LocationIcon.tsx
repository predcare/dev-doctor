import React from 'react';
import Svg, { Path } from 'react-native-svg';
import theme from '../../../styled/theme.styled';

interface LocationIconProps {
  color?: string;
  size?: number;
}

export const LocationIcon: React.FC<LocationIconProps> = ({
  color = theme.colors.primary,
  size = 24,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5Z"
        fill={color}
      />
    </Svg>
  );
};

export default LocationIcon;

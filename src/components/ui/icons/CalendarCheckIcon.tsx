import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { IconProps } from '../../../typescripts/types/types';

export const CalendarCheckIcon: React.FC<IconProps> = ({
    size = 32,
    width,
    height,
    color = '#3B82F6',
    style,
}) => {
    const iconWidth = width ?? size;
    const iconHeight = height ?? size;

    return (
        <Svg width={iconWidth} height={iconHeight} viewBox="0 0 32 32" fill="none">
            <Rect width="32" height="32" rx="8" fill="#EFF6FF" />
            <Path
                d="M21.8203 22.6602V13.5195H10.1797V22.6602H21.8203V22.6602M21.8203 9.33984C22.263 9.33984 22.6536 9.50911 22.9922 9.84766C23.3307 10.1862 23.5 10.5768 23.5 11.0195V22.6602C23.5 23.1029 23.3307 23.4935 22.9922 23.832C22.6536 24.1706 22.263 24.3398 21.8203 24.3398H10.1797C9.71094 24.3398 9.3138 24.1771 8.98828 23.8516C8.66276 23.526 8.5 23.1289 8.5 22.6602V11.0195C8.5 10.5768 8.66276 10.1862 8.98828 9.84766C9.3138 9.50911 9.71094 9.33984 10.1797 9.33984H11V7.66016H12.6797V9.33984H19.3203V7.66016H21V9.33984H21.8203V9.33984M19.7891 16.0586L14.8281 21.0195L12.1719 18.3633L13.0703 17.4648L14.8281 19.2227L18.8906 15.1602L19.7891 16.0586V16.0586"
                fill={color}
            />
        </Svg>
    );
};

export default CalendarCheckIcon;

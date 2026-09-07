import React from 'react';
import { Text, View } from 'react-native';
import { homeStyles } from '../../../styled/HomeScreen.styled';
import { theme } from '../../../styled/theme.styled';

export interface StatTileProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg?: string;
}

export const HomeStatsCard: React.FC<StatTileProps> = ({
  label,
  value,
  icon,
  iconBg = theme.colors.surfaceSecondary,
}) => {
  return (
    <View style={homeStyles.statTile}>
      <View style={homeStyles.statTileTop}>
        <View style={[homeStyles.statIconWrapper, { backgroundColor: iconBg }]}>{icon}</View>
        <Text style={homeStyles.statTileValue}>{value}</Text>
      </View>
      <Text style={homeStyles.statTileLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

export default HomeStatsCard;

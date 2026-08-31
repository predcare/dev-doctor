import React from 'react';
import { Text, View } from 'react-native';
import { homeStyles } from '../../../styled/HomeScreen.styled';
import { theme } from '../../../styled/theme.styled';
import { TrendIcon } from '../../ui/icons';

export interface StatTileProps {
  label: string;
  value: string;
  trend: string;
  isUp?: boolean;
  icon: React.ReactNode;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  trend,
  isUp = true,
  icon,
}) => {
  const trendColor = isUp ? theme.colors.success : theme.colors.danger;

  return (
    <View style={homeStyles.statTile}>
      <View style={homeStyles.statTileTop}>
        <View style={homeStyles.statIconWrapper}>{icon}</View>
        <View style={homeStyles.statTrendBadge}>
          <TrendIcon isUp={isUp} size={11} color={trendColor} style={{ marginRight: 2 }} />
          <Text style={[homeStyles.statTrendText, { color: trendColor }]}>
            {trend}
          </Text>
        </View>
      </View>
      <Text style={homeStyles.statTileValue}>{value}</Text>
      <Text style={homeStyles.statTileLabel}>{label}</Text>
    </View>
  );
};

export default StatTile;

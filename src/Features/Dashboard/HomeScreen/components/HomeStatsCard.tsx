import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { homeStyles } from '../../../../styled/HomeScreen.styled';
import theme from '../../../../styled/theme.styled';

export interface StatTileProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg?: string;
  loading?: boolean;
}

export const HomeStatsCard: React.FC<StatTileProps> = ({
  label,
  value,
  icon,
  iconBg = theme.colors.surfaceSecondary,
  loading = false,
}) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!loading) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [loading, pulseAnim]);

  return (
    <View style={homeStyles.statTile}>
      <View style={homeStyles.statTileTop}>
        <View style={[homeStyles.statIconWrapper, { backgroundColor: iconBg }]}>{icon}</View>
        {loading ? (
          <Animated.View
            style={{
              width: 25,
              height: 25,
              borderRadius: 6,
              backgroundColor: '#CBD5E1',
              opacity: pulseAnim,
              marginBottom: 3,
            }}
          />
        ) : (
          <Text style={homeStyles.statTileValue}>{value}</Text>
        )}
      </View>
      <Text style={homeStyles.statTileLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

export default HomeStatsCard;

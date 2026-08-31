import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { homeStyles } from '../../../styled/HomeScreen.styled';

export interface QuickAccessCardProps {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  label,
  icon,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={homeStyles.quickAccessCard}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {icon}
      <Text style={homeStyles.quickAccessLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

export default QuickAccessCard;

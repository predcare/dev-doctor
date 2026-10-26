import React, { useCallback } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { ensureClinicAccess } from '../../../../lib/commons/auth.Utils';
import { homeStyles } from '../../../../styled/HomeScreen.styled';

export interface QuickAccessCardProps {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ label, icon, onPress }) => {
  const handlePress = useCallback(() => {
    if (!ensureClinicAccess()) return;
    onPress?.();
  }, [onPress]);

  return (
    <TouchableOpacity style={homeStyles.quickAccessCard} onPress={handlePress} activeOpacity={0.75}>
      {icon}
      <Text style={homeStyles.quickAccessLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

export default QuickAccessCard;

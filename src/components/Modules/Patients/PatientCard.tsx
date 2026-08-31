import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ChevronRightIcon from '../../../components/ui/icons/ChevronRightIcon';
import { theme } from '../../../styled/theme.styled';

export interface PatientItem {
  id: string;
  patient_id?: string;
  name: string;
  phone_number?: string;
  gender?: string;
  age?: number | string;
  date_of_birth?: string;
  condition?: string;
  last_visit?: string;
}

export interface PatientCardProps {
  item: PatientItem;
  onPress?: () => void;
}

const getInitials = (name: string): string => {
  if (!name) return 'PT';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const PatientCard: React.FC<PatientCardProps> = React.memo(
  ({ item, onPress }) => {
    const patientName = item.name || 'Unknown Patient';
    const displayId = item.patient_id || `PAT-${item.id}`;
    const initials = getInitials(patientName);
    const genderInitial = item.gender ? item.gender.charAt(0).toUpperCase() : '';
    const ageDisplay = item.age ? `${item.age}y` : '';

    return (
      <TouchableOpacity
        style={styles.txCard}
        onPress={onPress}
        activeOpacity={0.75}
      >
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarTxt}>{initials}</Text>
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text style={styles.txName} numberOfLines={1}>
            {patientName}
          </Text>
          <Text style={styles.txSub} numberOfLines={1}>
            {displayId}
            {genderInitial || ageDisplay ? '  •  ' : ''}
            {genderInitial}
            {genderInitial && ageDisplay ? ' / ' : ''}
            {ageDisplay}
            {item.condition ? `  •  ${item.condition}` : ''}
          </Text>
        </View>

        {/* Right Arrow */}
        <ChevronRightIcon size={16} color={theme.colors.textMuted} />
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginHorizontal: 14,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarTxt: {
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.surface,
  },
  txName: {
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
  },
  txSub: {
    fontSize: 11,
    color: theme.colors.textSlate,
    marginTop: 2,
  },
});

export default PatientCard;

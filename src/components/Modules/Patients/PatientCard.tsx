import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ChevronRightIcon from '../../../components/ui/icons/ChevronRightIcon';
import { capitalizeFirstLetter } from '../../../lib/common/common.utils';
import { theme } from '../../../styled/theme.styled';

export interface PatientCardProps {
  onPress?: () => void;
  name: string;
  patientId: string;
  gender: string;
  age: string;
  condition?: string;
}

export const PatientCard: React.FC<PatientCardProps> = React.memo(
  ({ onPress, name, patientId, gender, age, condition }) => {
    return (
      <TouchableOpacity style={styles.txCard} onPress={onPress} activeOpacity={0.75}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTxt}>PT</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.txName} numberOfLines={1}>
            {name || 'Unknown'}
          </Text>
          <Text style={styles.txSub} numberOfLines={1}>
            {patientId || 'N/A'}
            {'  •  '}
            {capitalizeFirstLetter(gender) || 'N/A'}
            {' / '}
            {age || 'N/A'}
            {condition ? `  •  ${condition}` : ''}
          </Text>
        </View>

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

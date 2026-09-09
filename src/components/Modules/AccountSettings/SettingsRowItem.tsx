import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { profileStyles } from '../../../styled/ProfileScreen.styled';
import { theme } from '../../../styled/theme.styled';
import { ChevronRightIcon } from '../../ui/icons';

export interface SettingsRowItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
  last?: boolean;
  noBg?: boolean;
  indent?: boolean;
}

export const SettingsRowItem = React.memo<SettingsRowItemProps>(
  ({
    icon,
    label,
    value,
    onPress,
    right,
    danger = false,
    last = false,
    noBg = false,
    indent = false,
  }) => (
    <TouchableOpacity
      style={[
        profileStyles.row,
        !last && profileStyles.rowBorder,
        danger && profileStyles.rowDanger,
        indent && { paddingLeft: 28 },
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
      disabled={!onPress}
    >
      <View style={[profileStyles.rowIconBox, noBg && { backgroundColor: 'transparent' }]}>
        {icon}
      </View>
      <Text
        style={[profileStyles.rowLabel, danger && { color: theme.colors.danger }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
      {value ? (
        <Text style={profileStyles.rowValue} numberOfLines={1} ellipsizeMode="tail">
          {value}
        </Text>
      ) : null}
      <View style={{ marginLeft: 'auto', paddingLeft: 8, flexDirection: 'row', alignItems: 'center' }}>
        {right ??
          (onPress && !danger ? <ChevronRightIcon size={16} color={theme.colors.textMuted} /> : null)}
      </View>
    </TouchableOpacity>
  )
);

export default SettingsRowItem;

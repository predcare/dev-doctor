import React from 'react';
import { Text } from 'react-native';
import { profileStyles } from '../../../styled/ProfileScreen.styled';

export interface SettingsSectionLabelProps {
  title: string;
}

export const SettingsSectionLabel = React.memo<SettingsSectionLabelProps>(({ title }) => (
  <Text style={profileStyles.sectionLabel}>{title}</Text>
));

export default SettingsSectionLabel;

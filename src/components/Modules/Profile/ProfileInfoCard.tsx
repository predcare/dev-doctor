import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { theme } from '../../../styled/theme.styled';

export interface ProfileInfoCardProps {
  iconPath: React.ReactNode;
  label: string;
  value?: string;
  multiTag?: boolean;
  tags?: string[];
  containerStyle?: ViewStyle;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = React.memo(
  ({ iconPath, label, value, multiTag = false, tags = [], containerStyle }) => (
    <View style={[styles.card, containerStyle]}>
      <View style={styles.tealCircle}>{iconPath}</View>
      <View style={styles.body}>
        <Text style={styles.lbl}>{label}</Text>
        {multiTag ? (
          <View style={styles.tagRow}>
            {tags.map(t => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagTxt}>{t}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.val}>{value || 'N/A'}</Text>
        )}
      </View>
    </View>
  )
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 13,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: theme.colors.bg,
  },
  tealCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  lbl: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
    marginBottom: 4,
  },
  val: {
    fontSize: theme.fontSize.sm,
    // fontWeight: theme.fontWeight.semibold,
    color: theme.colors.dark,
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  tag: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
  },
  tagTxt: {
    fontSize: 12,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
});

export default ProfileInfoCard;

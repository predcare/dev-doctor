import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme, { globalShadows } from '../../../../styled/theme.styled';

export interface ProfileInfoCardProps {
  iconPath: React.ReactNode;
  label: string;
  value?: string;
  multiTag?: boolean;
  tags?: string[];
  containerStyle?: ViewStyle;
  rightAction?: React.ReactNode;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = React.memo(
  ({ iconPath, label, value, multiTag = false, tags = [], containerStyle, rightAction }) => (
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
      {rightAction && <View style={styles.rightActionContainer}>{rightAction}</View>}
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
    ...globalShadows.card,
  },
  tealCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.inPersonBg,
    color: theme.colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  lbl: {
    fontSize: 9,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSlate,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
    marginBottom: 4,
  },
  val: {
    fontSize: 14,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text334155,
    lineHeight: 18,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  tag: {
    // backgroundColor: theme.colors.inPersonBg,
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.inPersonBg,
  },
  tagTxt: {
    fontSize: 12,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primary,
  },
  rightActionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: 8,
  },
});

export default ProfileInfoCard;

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatDate } from '../../../../lib/commons/common.utils';
import theme, { globalShadows } from '../../../../styled/theme.styled';

interface PolicyMetaCardProps {
  title: string;
  version?: number | string;
  publishedAt?: string;
  status?: string;
  icon?: React.ReactNode;
}

export const PolicyMetaCard: React.FC<PolicyMetaCardProps> = ({
  title,
  version,
  publishedAt,
  status = 'active',
  icon,
}) => {
  const isActive = status.toLowerCase() === 'active';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        {icon && <View style={styles.iconCircle}>{icon}</View>}
        <View style={styles.infoCol}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.badgeRow}>
            {version !== undefined && (
              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>v{version}.0</Text>
              </View>
            )}
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isActive ? theme.colors.inPersonBg : theme.colors.dangerLight },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: isActive ? theme.colors.primaryDark : theme.colors.danger },
                ]}
              >
                {isActive ? 'ACTIVE' : status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {publishedAt && (
        <View style={styles.footerRow}>
          <Text style={styles.dateLabel}>Published / Effective Date:</Text>
          <Text style={styles.dateValue}>{formatDate(publishedAt)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    ...globalShadows.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.inPersonBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.dark,
    lineHeight: 19,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  versionBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  versionText: {
    fontSize: 11,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSlate,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dateLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: theme.fontWeight.medium,
  },
  dateValue: {
    fontSize: 11,
    color: theme.colors.text334155,
    fontWeight: theme.fontWeight.semibold,
  },
});

export default PolicyMetaCard;

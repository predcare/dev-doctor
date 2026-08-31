import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { profileStyles } from '../../../styled/ProfileScreen.styled';
import { theme } from '../../../styled/theme.styled';
import { ClockIcon } from '../../ui/icons';

export interface SubscriptionPlanBlockProps {
  onManageSubscription?: () => void;
  onAddonPress?: (addonName: string) => void;
}

const ADDONS = [
  {
    icon: '💬',
    name: 'Extra Messaging',
    sub: '+500 credits/mo',
    action: 'BUY',
    actionColor: theme.colors.primary,
    actionFill: true,
  },
  {
    icon: '☁️',
    name: 'Additional Storage',
    sub: '100 GB Cloud Space',
    action: 'SUBSCRIBED',
    actionColor: theme.colors.textMuted,
    actionFill: false,
  },
  {
    icon: '⭐',
    name: 'Priority Support',
    sub: '24/7 VIP Concierge',
    action: 'BUY',
    actionColor: theme.colors.primary,
    actionFill: true,
  },
];

export const SubscriptionPlanBlock = React.memo<SubscriptionPlanBlockProps>(
  ({ onManageSubscription, onAddonPress }) => (
    <View style={profileStyles.expandedBlock}>
      {/* Current Plan Card */}
      <View style={profileStyles.currentPlanCard}>
        <Text style={profileStyles.expandedMeta}>CURRENT PLAN</Text>
        <View style={profileStyles.planHeaderRow}>
          <Text style={profileStyles.planName}>Prime Professional</Text>
          <View style={profileStyles.activeBadge}>
            <Text style={profileStyles.activeBadgeTxt}>ACTIVE</Text>
          </View>
        </View>

        <View style={profileStyles.renewalRow}>
          <ClockIcon size={14} color={theme.colors.textMuted} />
          <Text style={profileStyles.renewalText}>Renews on Oct 12, 2024</Text>
        </View>

        <TouchableOpacity
          style={profileStyles.manageSubBtn}
          onPress={onManageSubscription}
          activeOpacity={0.7}
        >
          <Text style={profileStyles.manageSubTxt}>Manage Subscription</Text>
        </TouchableOpacity>
      </View>

      <Text style={[profileStyles.sectionLabel, { marginTop: 14, marginBottom: 6, marginLeft: 20 }]}>
        AVAILABLE ADD-ONS
      </Text>

      {/* Add-ons list */}
      <View style={{ backgroundColor: theme.colors.surface }}>
        {ADDONS.map((item, i) => (
          <View
            key={i}
            style={[
              profileStyles.addonRow,
              i < ADDONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.bg },
            ]}
          >
            <View style={profileStyles.addonIcon}>
              <Text style={profileStyles.addonIconTxt}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={profileStyles.addonName}>{item.name}</Text>
              <Text style={profileStyles.addonSub}>{item.sub}</Text>
            </View>
            <TouchableOpacity
              style={[
                profileStyles.addonBtn,
                item.actionFill
                  ? { backgroundColor: item.actionColor, borderColor: item.actionColor }
                  : { backgroundColor: theme.colors.surface, borderColor: theme.colors.surfaceBorder },
              ]}
              onPress={() => item.actionFill && onAddonPress?.(item.name)}
              activeOpacity={item.actionFill ? 0.7 : 1}
              disabled={!item.actionFill}
            >
              <Text
                style={[
                  profileStyles.addonBtnTxt,
                  { color: item.actionFill ? theme.colors.surface : theme.colors.textMuted },
                ]}
              >
                {item.action}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  )
);

export default SubscriptionPlanBlock;

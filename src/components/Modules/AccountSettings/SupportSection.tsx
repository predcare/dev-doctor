import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { profileStyles } from '../../../styled/ProfileScreen.styled';
import { theme } from '../../../styled/theme.styled';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  FileDocumentIcon,
  FileTextIcon,
  HelpIcon,
  InfoCircleIcon,
  LogoutIcon,
  ShieldIcon,
} from '../../ui/icons';
import SettingsRowItem from './SettingsRowItem';
import SettingsSectionLabel from './SettingsSectionLabel';

export interface SupportSectionProps {
  onContactSupport?: () => void;
  onHelpCenter: () => void;
  onPrivacyPolicy: () => void;
  onTermsOfService?: () => void;
  onCompliance?: () => void;
  onLogout: () => void;
}

export const SupportSection = React.memo<SupportSectionProps>(
  ({
    onContactSupport,
    onHelpCenter,
    onPrivacyPolicy,
    onTermsOfService,
    onCompliance,
    onLogout,
  }) => {
    const [policiesExpanded, setPoliciesExpanded] = useState(false);

    return (
      <>
        <SettingsSectionLabel title="SUPPORT & LEGAL" />
        <View style={profileStyles.menuGroup}>
          <SettingsRowItem
            icon={<HelpIcon size={18} color={theme.colors.primary} />}
            label="Help Center"
            onPress={onHelpCenter}
          />
          {onContactSupport ? (
            <SettingsRowItem
              icon={<HelpIcon size={18} color={theme.colors.primary} />}
              label="Contact Support"
              onPress={onContactSupport}
            />
          ) : null}

          {/* Policies & Legal accordion header */}
          <SettingsRowItem
            icon={<ShieldIcon size={18} color={theme.colors.primary} />}
            label="Policies & Legal"
            onPress={() => setPoliciesExpanded(v => !v)}
            last={!policiesExpanded}
            right={
              policiesExpanded ? (
                <ChevronUpIcon size={16} color={theme.colors.textMuted} />
              ) : (
                <ChevronDownIcon size={16} color={theme.colors.textMuted} />
              )
            }
          />

          {/* Enhanced Policy Sub-items */}
          {policiesExpanded && (
            <View style={profileStyles.expandedBlock}>
              {/* Privacy Policy */}
              <TouchableOpacity
                style={profileStyles.policySubRow}
                onPress={onPrivacyPolicy}
                activeOpacity={0.7}
              >
                <View style={profileStyles.policyIconBox}>
                  <FileTextIcon size={15} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={profileStyles.policyTitle}>Privacy Policy</Text>
                  <Text style={profileStyles.policySub}>Data protection & privacy guidelines</Text>
                </View>
                <ChevronRightIcon size={14} color={theme.colors.textMuted} />
              </TouchableOpacity>

              {/* Terms of Service */}
              <TouchableOpacity
                style={profileStyles.policySubRow}
                onPress={onTermsOfService ?? onPrivacyPolicy}
                activeOpacity={0.7}
              >
                <View style={profileStyles.policyIconBox}>
                  <FileDocumentIcon size={15} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={profileStyles.policyTitle}>Terms of Service</Text>
                  <Text style={profileStyles.policySub}>
                    Practice portal usage terms & conditions
                  </Text>
                </View>
                <ChevronRightIcon size={14} color={theme.colors.textMuted} />
              </TouchableOpacity>

              {/* HIPAA & Data Compliance */}
              <TouchableOpacity
                style={[profileStyles.policySubRow, { borderBottomWidth: 0 }]}
                onPress={onCompliance ?? onPrivacyPolicy}
                activeOpacity={0.7}
              >
                <View style={profileStyles.policyIconBox}>
                  <InfoCircleIcon size={15} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={profileStyles.policyTitle}>HIPAA & Data Compliance</Text>
                  <Text style={profileStyles.policySub}>
                    Medical data security & HIPAA standards
                  </Text>
                </View>
                <ChevronRightIcon size={14} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={profileStyles.logoutCard}
          onPress={onLogout}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Log Out"
        >
          <View style={profileStyles.logoutIconBox}>
            <LogoutIcon size={18} color={theme.colors.danger} />
          </View>
          <View style={profileStyles.logoutInfo}>
            <Text style={profileStyles.logoutTitle}>Log Out</Text>
          </View>
          <ChevronRightIcon size={16} color={theme.colors.danger} />
        </TouchableOpacity>

        <Text style={profileStyles.versionText}>VERSION 2.4.0 (BUILD 882)</Text>
        <View style={{ height: 20 }} />
      </>
    );
  }
);

export default SupportSection;

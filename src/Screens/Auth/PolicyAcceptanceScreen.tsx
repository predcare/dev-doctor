import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import PolicyViewerModal, {
  PolicyItemType,
} from '../../components/commons/PolicyViewerModal/PolicyViewerModal';
import { queryClient } from '../../components/providers/ReactQueryProvider';
import PolicyAcceptanceSkeleton from '../../components/Skeletons/PolicyAcceptanceSkeleton';
import {
  CheckBadgeIcon,
  ChevronRightIcon,
  FileDocumentIcon,
  InfoCircleIcon,
  LogoutIcon,
  ShieldIcon,
} from '../../components/ui/icons';
import {
  usePolicies,
  usePostPolicyAcceptance,
} from '../../hooks/react-query/policies/policies.hooks';
import { getProfile } from '../../hooks/react-query/profile/profile.funcs';
import { ProfileQueryKeys } from '../../hooks/react-query/query.keys';
import SafeAreaWrapper from '../../Layout/SafeAreaWrapper';
import { resetToMainTabs } from '../../lib/common/navigation.utils';
import { Assets } from '../../resources/assets';
import {
  AppRoute,
  type PolicyAcceptanceScreenNavigationProp,
  type PolicyAcceptanceScreenProps,
} from '../../route';
import { policyStyles } from '../../styled/PolicyAcceptanceScreen.styled';
import theme from '../../styled/theme.styled';
import { IPolicyAcceptancePayload } from '../../typescripts/interfaces/policies.interfaces';
import { useAuthStore } from '../../zustand/stores/useAuthStore';
import { useLoadingStore } from '../../zustand/stores/useLoadingStore';

export const PolicyAcceptanceScreen: React.FC<PolicyAcceptanceScreenProps> = ({
  navigation: propNavigation,
}) => {
  const defaultNavigation = useNavigation<PolicyAcceptanceScreenNavigationProp>();
  const navigation = propNavigation || defaultNavigation;
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 24, 500);

  const { data: allPolicies, isPending: isLoadingPolicies } = usePolicies();
  const { logout, userData, setUserData } = useAuthStore(state => state);
  const [selectedPolicyItem, setSelectedPolicyItem] = useState<PolicyItemType | null>(null);
  const [formStates, setFormStates] = useState<IPolicyAcceptancePayload>({
    audience: 'doctor',
    source: 'forced_reaccept',
    documents: [],
  });
  const { mutate: postPolicyAcceptanceMutation, isPending: isPostPolicyAcceptancePending } =
    usePostPolicyAcceptance();
  const { hideLoader, showLoader } = useLoadingStore(state => state);

  const termsData = allPolicies?.terms;
  const privacyData = allPolicies?.privacy_policy;
  const consentData = allPolicies?.informed_consent;

  const isAgreedTermsAndPrivacy =
    Boolean(formStates.documents?.some(d => d.document_kind === 'terms')) &&
    Boolean(formStates.documents?.some(d => d.document_kind === 'privacy'));

  const isAgreedConsent = Boolean(
    formStates.documents?.some(d => d.document_kind === 'informed_consent')
  );
  const isFormValid = isAgreedTermsAndPrivacy && isAgreedConsent;

  const toggleTermsAndPrivacy = () => {
    setFormStates(prev => {
      const existingDocs = prev.documents || [];
      if (isAgreedTermsAndPrivacy) {
        return {
          ...prev,
          documents: existingDocs.filter(
            d => d.document_kind !== 'terms' && d.document_kind !== 'privacy'
          ),
        };
      } else {
        const newDocs = existingDocs.filter(
          d => d.document_kind !== 'terms' && d.document_kind !== 'privacy'
        );
        if (termsData) {
          newDocs.push({
            document_kind: 'terms',
            document_id: Number(termsData?.id),
            document_version: termsData.version,
          });
        }
        if (privacyData) {
          newDocs.push({
            document_kind: 'privacy',
            document_id: Number(privacyData?.id),
            document_version: privacyData.version,
          });
        }
        return {
          ...prev,
          documents: newDocs,
        };
      }
    });
  };

  const toggleConsent = () => {
    setFormStates(prev => {
      const existingDocs = prev.documents || [];
      if (isAgreedConsent) {
        return {
          ...prev,
          documents: existingDocs.filter(d => d.document_kind !== 'informed_consent'),
        };
      } else {
        const newDocs = existingDocs.filter(d => d.document_kind !== 'informed_consent');
        if (consentData) {
          newDocs.push({
            document_kind: 'informed_consent',
            document_id: Number(consentData?.id),
            document_version: consentData.version,
          });
        }
        return {
          ...prev,
          documents: newDocs,
        };
      }
    });
  };

  const handleAccept = () => {
    if (!isFormValid) return;
    showLoader('Submitting your response...');
    postPolicyAcceptanceMutation(formStates, {
      onSuccess: async res => {
        if (res?.success) {
          await queryClient.invalidateQueries({ queryKey: [ProfileQueryKeys.Profile] });
          const profileRes = await getProfile();
          if (profileRes?.data) {
            setUserData(profileRes.data);
          }
          hideLoader();
          resetToMainTabs(navigation);
        } else {
          hideLoader();
        }
      },
      onError: () => {
        hideLoader();
      },
    });
  };

  const handleSignOut = () => {
    if (userData?.id) {
      logout();
      if (navigation && navigation.navigate) {
        navigation.navigate(AppRoute.LOGIN, { refetchOnMount: true });
      }
    }
  };

  const openPolicyModal = (policy?: PolicyItemType) => {
    if (policy) {
      setSelectedPolicyItem(policy);
    }
  };

  return (
    <SafeAreaWrapper>
      <ScrollView
        style={policyStyles.scrollContainer}
        contentContainerStyle={policyStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={policyStyles.logoContainer}>
          <Image source={Assets.logo2} style={policyStyles.logo} resizeMode="contain" />
        </View>
        <View style={[policyStyles.card, { width: cardWidth }]}>
          <View style={policyStyles.titleContainer}>
            <Text style={policyStyles.title}>Review & Accept Policies</Text>
            <Text style={policyStyles.subtitle}>
              Please review and accept the latest Doctor policies to continue.
            </Text>
          </View>

          {isLoadingPolicies ? (
            <PolicyAcceptanceSkeleton />
          ) : (
            <>
              <View style={policyStyles.docListContainer}>
                <Pressable
                  style={({ pressed }) => [
                    policyStyles.docTileCard,
                    pressed && policyStyles.docTileCardActive,
                  ]}
                  onPress={() => openPolicyModal(termsData)}
                >
                  <View style={policyStyles.docTileLeft}>
                    <View style={policyStyles.docIconBox}>
                      <FileDocumentIcon size={20} color={theme.colors.primary} />
                    </View>
                    <View style={policyStyles.docMeta}>
                      <View style={policyStyles.docTitleRow}>
                        <Text style={policyStyles.docTitle} numberOfLines={1}>
                          {termsData?.title || 'Terms of Use'}
                        </Text>
                        <View style={policyStyles.docVersionBadge}>
                          <Text style={policyStyles.docVersionText}>
                            v{termsData?.version || 1}
                          </Text>
                        </View>
                      </View>
                      <Text style={policyStyles.docSubtext}>Doctor Terms & Service Guidelines</Text>
                    </View>
                  </View>
                  <View style={policyStyles.docActionPill}>
                    <Text style={policyStyles.docActionText}>View</Text>
                    <ChevronRightIcon size={14} color={theme.colors.primary} />
                  </View>
                </Pressable>

                {/* Privacy Policy Tile */}
                <Pressable
                  style={({ pressed }) => [
                    policyStyles.docTileCard,
                    pressed && policyStyles.docTileCardActive,
                  ]}
                  onPress={() => openPolicyModal(privacyData)}
                >
                  <View style={policyStyles.docTileLeft}>
                    <View style={policyStyles.docIconBox}>
                      <ShieldIcon size={20} color={theme.colors.primary} />
                    </View>
                    <View style={policyStyles.docMeta}>
                      <View style={policyStyles.docTitleRow}>
                        <Text style={policyStyles.docTitle} numberOfLines={1}>
                          {privacyData?.title || 'Privacy Policy'}
                        </Text>
                        <View style={policyStyles.docVersionBadge}>
                          <Text style={policyStyles.docVersionText}>
                            v{privacyData?.version || 1}
                          </Text>
                        </View>
                      </View>
                      <Text style={policyStyles.docSubtext}>Data Protection & Privacy Policy</Text>
                    </View>
                  </View>
                  <View style={policyStyles.docActionPill}>
                    <Text style={policyStyles.docActionText}>View</Text>
                    <ChevronRightIcon size={14} color={theme.colors.primary} />
                  </View>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    policyStyles.docTileCard,
                    pressed && policyStyles.docTileCardActive,
                  ]}
                  onPress={() => openPolicyModal(consentData)}
                >
                  <View style={policyStyles.docTileLeft}>
                    <View style={policyStyles.docIconBox}>
                      <CheckBadgeIcon size={20} color={theme.colors.primary} />
                    </View>
                    <View style={policyStyles.docMeta}>
                      <View style={policyStyles.docTitleRow}>
                        <Text style={policyStyles.docTitle} numberOfLines={1}>
                          {consentData?.title || 'Informed Consent'}
                        </Text>
                        <View style={policyStyles.docVersionBadge}>
                          <Text style={policyStyles.docVersionText}>
                            v{consentData?.version || 1}
                          </Text>
                        </View>
                      </View>
                      <Text style={policyStyles.docSubtext}>Doctor Informed Consent Policy</Text>
                    </View>
                  </View>
                  <View style={policyStyles.docActionPill}>
                    <Text style={policyStyles.docActionText}>View</Text>
                    <ChevronRightIcon size={14} color={theme.colors.primary} />
                  </View>
                </Pressable>
              </View>
              <View style={policyStyles.noticeBox}>
                <InfoCircleIcon size={16} color="#B45309" style={policyStyles.noticeIcon} />
                <Text style={policyStyles.noticeText}>
                  These are the current published versions for doctors. If policies are updated, you
                  will be notified to accept before accessing portal features.
                </Text>
              </View>
            </>
          )}

          <View style={policyStyles.divider} />
          <View style={policyStyles.checkboxContainer}>
            <Pressable
              style={[
                policyStyles.checkboxCard,
                isAgreedTermsAndPrivacy && policyStyles.checkboxCardChecked,
              ]}
              onPress={toggleTermsAndPrivacy}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isAgreedTermsAndPrivacy }}
            >
              <View
                style={[
                  policyStyles.checkboxSquare,
                  isAgreedTermsAndPrivacy && policyStyles.checkboxSquareChecked,
                ]}
              >
                {isAgreedTermsAndPrivacy && <Text style={policyStyles.checkmarkText}>✓</Text>}
              </View>
              <Text style={policyStyles.checkboxLabel}>
                I have read and agree to the{' '}
                <Text
                  style={policyStyles.linkText}
                  onPress={e => {
                    e.stopPropagation();
                    openPolicyModal(termsData);
                  }}
                >
                  Terms of Use
                </Text>{' '}
                and{' '}
                <Text
                  style={policyStyles.linkText}
                  onPress={e => {
                    e.stopPropagation();
                    openPolicyModal(privacyData);
                  }}
                >
                  Privacy Policy
                </Text>
              </Text>
            </Pressable>
            <Pressable
              style={[
                policyStyles.checkboxCard,
                isAgreedConsent && policyStyles.checkboxCardChecked,
              ]}
              onPress={toggleConsent}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isAgreedConsent }}
            >
              <View
                style={[
                  policyStyles.checkboxSquare,
                  isAgreedConsent && policyStyles.checkboxSquareChecked,
                ]}
              >
                {isAgreedConsent && <Text style={policyStyles.checkmarkText}>✓</Text>}
              </View>
              <Text style={policyStyles.checkboxLabel}>
                I have read and agree to the{' '}
                <Text
                  style={policyStyles.linkText}
                  onPress={e => {
                    e.stopPropagation();
                    openPolicyModal(consentData);
                  }}
                >
                  Informed Consent Policy
                </Text>
              </Text>
            </Pressable>
          </View>
          <View style={policyStyles.buttonGroup}>
            <Pressable
              disabled={!isFormValid || isPostPolicyAcceptancePending}
              style={({ pressed }) => [
                policyStyles.primaryButton,
                (!isFormValid || isPostPolicyAcceptancePending) &&
                  policyStyles.primaryButtonDisabled,
                pressed && isFormValid && { opacity: 0.85 },
              ]}
              onPress={handleAccept}
            >
              {isPostPolicyAcceptancePending ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={policyStyles.primaryButtonText}>Accept & Continue</Text>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [policyStyles.secondaryButton, pressed && { opacity: 0.75 }]}
              onPress={handleSignOut}
            >
              <LogoutIcon size={16} color={theme.colors.textSecondary} />
              <Text style={policyStyles.secondaryButtonText}>Sign out</Text>
            </Pressable>
          </View>
        </View>
        <View style={policyStyles.footerContainer}>
          <View style={policyStyles.footerSecurityNote}>
            <ShieldIcon size={12} color="rgba(255, 255, 255, 0.75)" />
            <Text style={policyStyles.footerSecurityText}>256-bit Encrypted Medical Portal</Text>
          </View>
          <Text style={policyStyles.copyrightText}>
            © {new Date().getFullYear()} PRED Care. All rights reserved.
          </Text>
        </View>
      </ScrollView>

      <PolicyViewerModal
        visible={Boolean(selectedPolicyItem)}
        policy={selectedPolicyItem}
        onClose={() => setSelectedPolicyItem(null)}
      />
    </SafeAreaWrapper>
  );
};

export default PolicyAcceptanceScreen;

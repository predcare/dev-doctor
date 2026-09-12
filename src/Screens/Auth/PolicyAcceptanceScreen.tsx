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
import { IPolicyAcceptancePayload } from '../../typescripts/interfaces/policies.interfaces';
import { useAuthStore } from '../../zustand/stores/useAuthStore';

export const PolicyAcceptanceScreen: React.FC<PolicyAcceptanceScreenProps> = ({
  navigation: propNavigation,
}) => {
  const defaultNavigation = useNavigation<PolicyAcceptanceScreenNavigationProp>();
  const navigation = propNavigation || defaultNavigation;
  const { width, height } = useWindowDimensions();
  const cardWidth = Math.min(width - 32, 480);
  const cardMaxHeight = Math.min(height - 100, 640);

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

  const termsData = allPolicies?.terms;
  const privacyData = allPolicies?.privacy;
  const consentData = allPolicies?.informed_consent;

  const isAgreedTermsAndPrivacy =
    Boolean(formStates.documents?.some(d => d.document_kind === 'terms')) &&
    Boolean(formStates.documents?.some(d => d.document_kind === 'privacy'));

  const isAgreedConsent = Boolean(
    formStates.documents?.some(d => d.document_kind === 'informed_consent')
  );

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
            document_id: termsData.id,
            document_version: termsData.version,
          });
        }
        if (privacyData) {
          newDocs.push({
            document_kind: 'privacy',
            document_id: privacyData.id,
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
            document_id: consentData.id,
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

  const isFormValid = isAgreedTermsAndPrivacy && isAgreedConsent;

  const handleAccept = () => {
    if (!isFormValid) return;
    postPolicyAcceptanceMutation(formStates, {
      onSuccess: async res => {
        if (res?.success) {
          await queryClient.invalidateQueries({ queryKey: [ProfileQueryKeys.Profile] });
          const profileRes = await getProfile();
          if (profileRes?.doctor) {
            setUserData(profileRes.doctor);
          }
          resetToMainTabs(navigation);
        }
      },
    });
  };

  const handleSignOut = () => {
    if (userData?.user_id) {
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
      <View style={policyStyles.screenContainer}>
        <View style={policyStyles.logoContainer}>
          <Image source={Assets.logo2} style={policyStyles.logo} resizeMode="contain" />
        </View>
        <View style={[policyStyles.card, { width: cardWidth, maxHeight: cardMaxHeight }]}>
          <View style={policyStyles.titleContainer}>
            <Text style={policyStyles.title}>Review & Accept Policies</Text>
            <Text style={policyStyles.subtitle}>
              Please review and accept the latest Doctor policies to continue.
            </Text>
          </View>

          <ScrollView
            style={policyStyles.scrollableContent}
            contentContainerStyle={policyStyles.scrollableContentInner}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          >
            {isLoadingPolicies ? (
              <PolicyAcceptanceSkeleton />
            ) : (
              <>
                <View style={policyStyles.policyBox}>
                  <Text style={policyStyles.policyItem}>
                    <Text style={policyStyles.policyBoldLabel}>Terms: </Text>
                    <Text
                      style={policyStyles.policyLinkText}
                      onPress={() => openPolicyModal(termsData)}
                    >
                      {termsData?.title || 'Terms of Use – Doctor'} (v{termsData?.version || 1})
                    </Text>
                  </Text>
                  <Text style={policyStyles.policyItem}>
                    <Text style={policyStyles.policyBoldLabel}>Privacy: </Text>
                    <Text
                      style={policyStyles.policyLinkText}
                      onPress={() => openPolicyModal(privacyData)}
                    >
                      {privacyData?.title || 'Privacy Policy – Doctor'} (v
                      {privacyData?.version || 1})
                    </Text>
                  </Text>
                  <Text style={policyStyles.policyItem}>
                    <Text style={policyStyles.policyBoldLabel}>Informed Consent: </Text>
                    <Text
                      style={policyStyles.policyLinkText}
                      onPress={() => openPolicyModal(consentData)}
                    >
                      {consentData?.title || 'PRED Care Informed Consent Policy – Doctor'} (v
                      {consentData?.version || 1})
                    </Text>
                  </Text>
                </View>

                <Text style={policyStyles.noticeText}>
                  These are the current published versions for doctors. If policies are updated
                  later, you will be asked to accept again before using the portal.
                </Text>
              </>
            )}
          </ScrollView>

          <View style={policyStyles.fixedBottomSection}>
            <View style={policyStyles.checkboxContainer}>
              <Pressable
                style={policyStyles.checkboxRow}
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
                  {isAgreedTermsAndPrivacy && <Text style={policyStyles.checkmarkIcon}>✓</Text>}
                </View>
                <Text style={policyStyles.checkboxLabel}>
                  I have read and agree to the{' '}
                  <Text
                    style={policyStyles.policyLinkBold}
                    onPress={() => openPolicyModal(termsData)}
                  >
                    Terms of Use
                  </Text>{' '}
                  and{' '}
                  <Text
                    style={policyStyles.policyLinkBold}
                    onPress={() => openPolicyModal(privacyData)}
                  >
                    Privacy Policy.
                  </Text>
                </Text>
              </Pressable>

              <Pressable
                style={policyStyles.checkboxRow}
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
                  {isAgreedConsent && <Text style={policyStyles.checkmarkIcon}>✓</Text>}
                </View>
                <Text style={policyStyles.checkboxLabel}>
                  I have read and agree to the{' '}
                  <Text
                    style={policyStyles.policyLinkBold}
                    onPress={() => openPolicyModal(consentData)}
                  >
                    Informed Consent Policy.
                  </Text>
                </Text>
              </Pressable>
            </View>

            <View style={policyStyles.buttonGroup}>
              <Pressable
                disabled={!isFormValid}
                style={({ pressed }) => [
                  policyStyles.primaryButton,
                  !isFormValid && policyStyles.primaryButtonDisabled,
                  pressed && isFormValid && { opacity: 0.85 },
                ]}
                onPress={handleAccept}
              >
                {isPostPolicyAcceptancePending ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={policyStyles.primaryButtonText}>Accept & Continue</Text>
                )}
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  policyStyles.secondaryButton,
                  pressed && { opacity: 0.75 },
                ]}
                onPress={handleSignOut}
              >
                <Text style={policyStyles.secondaryButtonText}>Sign out</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={policyStyles.footerContainer}>
          <Text style={policyStyles.copyrightText}>
            © {new Date().getFullYear()} PRED Care. All rights reserved.
          </Text>
        </View>
      </View>
      <PolicyViewerModal
        visible={!!selectedPolicyItem}
        policy={selectedPolicyItem}
        onClose={() => setSelectedPolicyItem(null)}
      />
    </SafeAreaWrapper>
  );
};

export default PolicyAcceptanceScreen;

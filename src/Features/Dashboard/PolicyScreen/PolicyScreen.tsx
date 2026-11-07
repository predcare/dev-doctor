import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CheckBadgeIcon, FileDocumentIcon, ShieldIcon } from '../../../components/ui/icons';
import { usePolicies } from '../../../hooks/react-query/policies/policies.hooks';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import type { PolicyScreenRouteProp } from '../../../route';
import theme, { globalShadows } from '../../../styled/theme.styled';
import PolicyContentRenderer from './Components/PolicyContentRenderer';
import PolicyMetaCard from './Components/PolicyMetaCard';
import PolicyScreenSkeleton from './Skeletons/PolicyScreenSkeleton';

type PolicyKey = 'privacy_policy' | 'terms' | 'informed_consent';

export const PolicyScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<PolicyScreenRouteProp>();
  const policyKey = (route.params?.initialPolicy as PolicyKey) || 'privacy_policy';

  const [isRefetching, setIsRefetching] = useState(false);
  const { data: allPolicies, isPending, refetch } = usePolicies();

  const onRefresh = useCallback(async () => {
    setIsRefetching(true);
    await refetch();
    setIsRefetching(false);
  }, [refetch]);

  const currentPolicy = useMemo(() => {
    if (!allPolicies) return null;
    return allPolicies[policyKey];
  }, [allPolicies, policyKey]);

  const currentIcon = useMemo(() => {
    switch (policyKey) {
      case 'privacy_policy':
        return <ShieldIcon size={22} color={theme.colors.primary} />;
      case 'terms':
        return <FileDocumentIcon size={22} color={theme.colors.primary} />;
      case 'informed_consent':
        return <CheckBadgeIcon size={22} color={theme.colors.primary} />;
    }
  }, [policyKey]);

  if (isPending || !allPolicies) {
    return <PolicyScreenSkeleton />;
  }

  return (
    <SafeAreaWrapper
      activeBottomTab="Account"
      header={
        <Header
          title="Policy Details"
          description="View and verify policy details"
          isBackBtn
          onBackPress={() => navigation.goBack()}
        />
      }
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {currentPolicy ? (
          <>
            <PolicyMetaCard
              title={currentPolicy.title}
              version={currentPolicy.version}
              publishedAt={currentPolicy.published_at}
              status={currentPolicy.status}
              icon={currentIcon}
            />

            <View style={styles.contentCard}>
              <PolicyContentRenderer content={currentPolicy.content} />
            </View>
          </>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Policy details not available.</Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  scrollContent: {
    paddingTop: 14,
    paddingBottom: 24,
  },
  contentCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    ...globalShadows.card,
  },
  emptyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 24,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...globalShadows.card,
  },
  emptyText: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
});

export default PolicyScreen;

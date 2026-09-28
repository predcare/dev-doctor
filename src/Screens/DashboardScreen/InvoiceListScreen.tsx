import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonEmptyCard from '../../components/commons/CommonEmptyCard/CommonEmptyCard';
import CommonErrorCard from '../../components/commons/CommonErrorCard/CommonErrorCard';
import InvoiceSkeleton from '../../components/Skeletons/InvoiceSkeleton';
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from '../../components/ui/icons';
import { useDebounce } from '../../hooks/commons/useDebounce';
import {
  useInvoicesStats,
  useMyAllInvoices,
} from '../../hooks/react-query/invoices/invoices.hooks';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { capitalize, formatDate, getPayStatus } from '../../lib/common/common.utils';
import { type InvoiceListScreenProps } from '../../route';
import { invoiceListStyles as S } from '../../styled/InvoiceListScreen.styled';
import { theme } from '../../styled/theme.styled';

export const InvoiceListScreen: React.FC<InvoiceListScreenProps> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Paid' | 'Unpaid'>('All');
  const [showPicker, setShowPicker] = useState(false);

  const paymentStatusParam = useMemo(() => {
    if (activeFilter === 'All') return undefined;
    return activeFilter.toLowerCase();
  }, [activeFilter]);

  const {
    data,
    isPending,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyAllInvoices({
    search: debouncedSearch,
    payment_status: paymentStatusParam,
    limit: 10,
  });

  const { data: invoiceStats, isPending: isPendingInvoiceStats } = useInvoicesStats();

  const invoicesList = useMemo(() => {
    return data?.pages?.flatMap(page => page.data || []) ?? [];
  }, [data]);

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SafeAreaWrapper showBottomBar isPathClear>
      <View style={S.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={S.backBtn}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={S.headerTitle}>Invoices</Text>
      </View>
      <View style={S.searchRow}>
        <View style={[S.searchPill, { marginRight: 0 }]}>
          <SearchIcon size={16} color="#9CA3AF" />
          <TextInput
            style={S.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search by patient name or invoice #"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
      <View style={S.chipRow}>
        {(['All', 'Paid', 'Unpaid'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[S.chip, activeFilter === f && S.chipActive]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.7}
          >
            <Text style={[S.chipTxt, activeFilter === f && S.chipTxtActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={invoicesList || []}
        keyExtractor={(item, index) => `${item.invoice_number}-${index}`}
        renderItem={({ item }) => {
          const { bg, txt, label } = getPayStatus(item.payment_status);
          return (
            <TouchableOpacity style={S.txCard} activeOpacity={0.75}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={S.txName}>{item.invoice_number || ``}</Text>
                  <View style={[S.badge, { backgroundColor: bg, marginLeft: 8 }]}>
                    <Text style={[S.badgeTxt, { color: txt }]}>{label}</Text>
                  </View>
                </View>
                <Text style={S.txSub}>
                  {formatDate(item.created_at)} • {capitalize(item.payment_mode)}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[
                    S.txAmt,
                    (label === 'OVERDUE' || label === 'CANCELLED' || label === 'UNPAID') && {
                      color: '#EF4444',
                    },
                  ]}
                >
                  {item.grand_total ? `₹${item.grand_total}` : 'N/A'}
                </Text>

                <View style={{ paddingLeft: 4 }}>
                  <ChevronRightIcon size={16} color="#9CA3AF" />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListHeaderComponent={
          <View>
            <View style={S.statsRow}>
              <View style={S.statCardTeal}>
                <Text style={S.statLabelWhite}>OUTSTANDING</Text>
                <Text style={S.statAmtWhite}>$2,333</Text>
              </View>
              <View style={S.statCardWhite}>
                <Text style={S.statLabelGray}>TOTAL COLLECTED</Text>
                <Text style={S.statAmtDark}>$4,500</Text>
              </View>
            </View>

            <View style={S.txHeader}>
              <Text style={S.txLabel}>RECENT TRANSACTIONS</Text>
              <Text style={S.txCount}>TOTAL 10 INVOICES</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          isPending ? (
            <InvoiceSkeleton />
          ) : isError ? (
            <CommonErrorCard
              title="Failed to Load Invoices"
              message="Please check your network connection and try again."
              onRetry={refetch}
              retryText="Retry"
            />
          ) : (
            <CommonEmptyCard
              title="No Invoices Found"
              message="Try adjusting your search or filter settings, or tap + to create a new invoice."
            />
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ paddingVertical: 16, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : null
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[theme.colors.primary]}
          />
        }
      />

      {/* <InvoicePreviewModal
        visible={!!selectedInvoiceForPreview}
        invoice={selectedInvoiceForPreview}
        onClose={() => {}}
      /> */}
    </SafeAreaWrapper>
  );
};

export default InvoiceListScreen;

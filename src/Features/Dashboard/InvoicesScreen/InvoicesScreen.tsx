import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getBottomBarHeight } from '../../../components/commons/CustomBottomBar/CustomBottomBar';
import CommonEmptyCard from '../../../components/commons/CommonEmptyCard/CommonEmptyCard';
import CommonErrorCard from '../../../components/commons/CommonErrorCard/CommonErrorCard';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon } from '../../../components/ui/icons';
import { useDebounce } from '../../../hooks/commons/useDebounce';
import {
    useInvoicesStats,
    useMyAllInvoices,
} from '../../../hooks/react-query/invoices/invoices.hooks';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import { _toTitleCase, formatDate, getPayStatus } from '../../../lib/commons/common.utils';
import { AppRoute, InvoiceListScreenProps } from '../../../route';
import { invoiceListStyles } from '../../../styled/InvoiceListScreen.styled';
import theme from '../../../styled/theme.styled';
import { IInvoiceDoc } from '../../../typescripts/interfaces/invoices.interfaces';
import SelectPatientModal from '../../../components/commons/SelectPatientModal/SelectPatientModal';
import { InvoicePreviewModal } from './Modals/InvoicePreviewModal';
import InvoiceSkeleton from './Skeletons/InvoiceSkeleton';

export const InvoiceListScreen: React.FC<InvoiceListScreenProps> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 400);
    const [activeFilter, setActiveFilter] = useState<'All' | 'Paid' | 'Unpaid'>('All');
    const [selectedInvoice, setSelectedInvoice] = useState<IInvoiceDoc | null>(null);
    const [showSelectPatientModal, setShowSelectPatientModal] = useState(false);

    const paymentStatusParam = useMemo(() => {
        if (activeFilter === 'All') return undefined;
        return activeFilter.toLowerCase();
    }, [activeFilter]);

    const { data, isPending, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useMyAllInvoices({
            search: debouncedSearch,
            payment_status: paymentStatusParam,
            limit: 10,
            category: 'manual',
        });

    const { data: invoiceStats, isPending: isPendingInvoiceStats } = useInvoicesStats({
        category: 'manual',
    });

    const { invoicesList, totalCount } = useMemo(() => {
        const pages = data?.pages ?? [];
        const list = pages.flatMap(page => page?.data || []);
        const total = pages[0]?.meta?.total ?? list.length;
        return {
            invoicesList: list,
            totalCount: total,
        };
    }, [data]);

    const handleEndReached = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return (
        <SafeAreaWrapper showBottomBar>
            <View style={invoiceListStyles.header}>
                <TouchableOpacity
                    onPress={() => navigation?.goBack()}
                    style={invoiceListStyles.backBtn}
                    activeOpacity={0.7}
                >
                    <ChevronLeftIcon size={20} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={invoiceListStyles.headerTitle}>Invoices</Text>
                <TouchableOpacity
                    onPress={() => setShowSelectPatientModal(true)}
                    style={invoiceListStyles.backBtn}
                    activeOpacity={0.7}
                >
                    <PlusIcon size={20} color={theme.colors.textPrimary} />
                </TouchableOpacity>
            </View>

            <View style={invoiceListStyles.statsRow}>
                <View style={invoiceListStyles.statCardTeal}>
                    <Text style={invoiceListStyles.statLabelWhite}>OUTSTANDING</Text>
                    <Text style={invoiceListStyles.statAmtWhite}>
                        {isPendingInvoiceStats
                            ? '...'
                            : `₹${Number(invoiceStats?.total_outstanding ?? 0).toLocaleString('en-IN')}`}
                    </Text>
                </View>
                <View style={invoiceListStyles.statCardWhite}>
                    <Text style={invoiceListStyles.statLabelGray}>TOTAL COLLECTED</Text>
                    <Text style={invoiceListStyles.statAmtDark}>
                        {isPendingInvoiceStats
                            ? '...'
                            : `₹${Number(invoiceStats?.total_collected ?? 0).toLocaleString('en-IN')}`}
                    </Text>
                </View>
            </View>

            <View style={invoiceListStyles.searchRow}>
                <View style={[invoiceListStyles.searchPill, { marginRight: 0 }]}>
                    <SearchIcon size={16} color="#9CA3AF" />
                    <TextInput
                        style={invoiceListStyles.searchInput}
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search by patient name or invoice #"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <View style={invoiceListStyles.chipRow}>
                {(['All', 'Paid', 'Unpaid'] as const).map(f => {
                    return (
                        <TouchableOpacity
                            key={f}
                            style={[invoiceListStyles.chip, activeFilter === f && invoiceListStyles.chipActive]}
                            onPress={() => setActiveFilter(f)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    invoiceListStyles.chipTxt,
                                    activeFilter === f && invoiceListStyles.chipTxtActive,
                                ]}
                            >
                                {f}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <FlatList
                data={invoicesList || []}
                keyExtractor={(item, index) => `${item.invoice_number}-${index}`}
                renderItem={({ item }) => {
                    const { bg, txt, label } = getPayStatus(item.payment_status);
                    return (
                        <TouchableOpacity
                            style={invoiceListStyles.txCard}
                            activeOpacity={0.75}
                            onPress={() => setSelectedInvoice(item)}
                        >
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                    <Text style={invoiceListStyles.txName}>{item.invoice_number || ``}</Text>
                                    <View style={[invoiceListStyles.badge, { backgroundColor: bg, marginLeft: 8 }]}>
                                        <Text style={[invoiceListStyles.badgeTxt, { color: txt }]}>{label}</Text>
                                    </View>
                                </View>
                                <Text style={invoiceListStyles.txSub}>
                                    {formatDate(item.created_at)} • {_toTitleCase(item.payment_mode)}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text
                                    style={[
                                        invoiceListStyles.txAmt,
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
                    <View style={invoiceListStyles.txHeader}>
                        <Text style={invoiceListStyles.txLabel}>RECENT TRANSACTIONS</Text>
                        <Text style={invoiceListStyles.txCount}>TOTAL {totalCount} INVOICES</Text>
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
                    ) : (
                        <></>
                    )
                }
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
                style={[
                    invoiceListStyles.fab,
                    {
                        bottom: getBottomBarHeight(insets.bottom) + 16,
                        right: 20,
                        zIndex: 999,
                    },
                ]}
                onPress={() => setShowSelectPatientModal(true)}
                activeOpacity={0.85}
            >
                <PlusIcon size={24} color={theme.colors.surface} />
            </TouchableOpacity>

            <SelectPatientModal
                title="Select Patient for Invoice"
                visible={showSelectPatientModal}
                onClose={() => setShowSelectPatientModal(false)}
                onSelectPatient={patient => {
                    setShowSelectPatientModal(false);
                    navigation?.navigate(AppRoute.CREATE_INVOICE as any, {
                        patientId: patient.id,
                        patientGeneratedId: patient.patient_id,
                        patientName: patient.name,
                    });
                }}
            />

            <InvoicePreviewModal
                visible={!!selectedInvoice}
                invoice={selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
            />
        </SafeAreaWrapper>
    );
};

export default InvoiceListScreen;

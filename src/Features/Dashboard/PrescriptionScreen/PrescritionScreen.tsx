import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import CommonErrorCard from '../../../components/commons/CommonErrorCard/CommonErrorCard';
import { getBottomBarHeight } from '../../../components/commons/CustomBottomBar/CustomBottomBar';
import SelectPatientModal from '../../../components/commons/SelectPatientModal/SelectPatientModal';
import { FilterIcon, PlusIcon, SearchIcon } from '../../../components/ui/icons';
import { useDebounce } from '../../../hooks/commons/useDebounce';
import { useGetInfinitePrescriptions } from '../../../hooks/react-query/prescriptions/prescriptions.hooks';
import { AppRoute } from '../../../route';
import { prescriptionListStyles } from '../../../styled/PrescriptionListScreen.styled';
import theme from '../../../styled/theme.styled';
import PrescriptionItemCard from './Components/PrescriptionItemCard';
import PrescriptionFilterModal from './Modals/PrescriptionFilterModal';



export type PrescriptionStatus = 'All' | 'Draft' | 'Sent' | 'Active';
export type DateRangeOption = 'Today' | 'This Week' | 'Current Month' | 'Current Year' | 'Custom';

export interface IPrescriptionFilterState {
    activeChip: string;
    status: string;
    date_filter: string;
    from_date: string;
    to_date: string;
}

const initialFilterState: IPrescriptionFilterState = {
    activeChip: 'all',
    status: 'all',
    date_filter: 'today',
    from_date: '',
    to_date: '',
};

export const PrescriptionScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const appNavigation = useNavigation()
    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [filterState, setFilterState] = useState<IPrescriptionFilterState>(initialFilterState);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showSelectPatientModal, setShowSelectPatientModal] = useState(false);

    const debounceSearch = useDebounce(search?.trim(), 600);

    const {
        data: prescriptionInfiniteData,
        isPending: prescriptionsLoading,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetInfinitePrescriptions({
        limit: 15,
        search: debounceSearch.trim() || undefined,
        status:
            filterState.activeChip !== 'all'
                ? filterState.activeChip
                : filterState.status !== 'all'
                    ? filterState.status
                    : undefined,
        date_filter: filterState.date_filter,
        from_date:
            filterState.date_filter === 'custom' && filterState.from_date
                ? filterState.from_date
                : undefined,
        to_date:
            filterState.date_filter === 'custom' && filterState.to_date ? filterState.to_date : undefined,
    });

    const { prescriptionsList, totalCount } = useMemo(() => {
        const pages = prescriptionInfiniteData?.pages ?? [];
        const list = pages.flatMap(page => (Array.isArray(page?.data) ? page.data : []));
        const total = pages[0]?.meta?.total ?? list.length;
        return {
            prescriptionsList: list,
            totalCount: total,
        };
    }, [prescriptionInfiniteData?.pages]);

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    const updateFilterState = <K extends keyof IPrescriptionFilterState>(
        key: K,
        value: IPrescriptionFilterState[K]
    ) => {
        setFilterState(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilterState(initialFilterState);
    };

    return (
        <SafeAreaWrapper
            showBottomBar={true}
            header={
                <Header
                    title="Prescriptions"
                    description="Manage and view prescription records"
                    isBackBtn
                    onBackPress={() => appNavigation?.goBack()}
                />
            }
        >
            <View style={prescriptionListStyles.searchRow}>
                <View style={prescriptionListStyles.searchPill}>
                    <SearchIcon size={16} color="#9CA3AF" />
                    <TextInput
                        style={prescriptionListStyles.searchInput}
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search by patient name or prescription ID..."
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
                <TouchableOpacity
                    style={prescriptionListStyles.filterIconBtn}
                    onPress={() => setShowFilterModal(true)}
                    activeOpacity={0.7}
                >
                    <FilterIcon size={18} color={theme.colors.textPrimary} />
                </TouchableOpacity>
            </View>
            <View style={prescriptionListStyles.chipRow}>
                {[
                    { label: 'All', value: 'all' },
                    { label: 'Draft', value: 'draft' },
                    { label: 'Sent', value: 'sent' },
                    { label: 'Completed', value: 'completed' },
                ].map(f => (
                    <TouchableOpacity
                        key={f.value}
                        style={[
                            prescriptionListStyles.chip,
                            filterState.activeChip === f.value && prescriptionListStyles.chipActive,
                        ]}
                        onPress={() => updateFilterState('activeChip', f.value)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                prescriptionListStyles.chipTxt,
                                filterState.activeChip === f.value && prescriptionListStyles.chipTxtActive,
                            ]}
                        >
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {prescriptionsLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={{ marginTop: 12, fontSize: 13, color: '#64748B' }}>
                        Loading prescriptions...
                    </Text>
                </View>
            ) : isError ? (
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    <CommonErrorCard
                        title="Failed to Load Prescriptions"
                        message="Could not load your prescriptions. Please check your connection and try again."
                        onRetry={refetch}
                    />
                </ScrollView>
            ) : (
                <FlatList
                    style={prescriptionListStyles.scroll}
                    data={prescriptionsList}
                    keyExtractor={item => String(item.id)}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    keyboardShouldPersistTaps="handled"
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]}
                            tintColor={theme.colors.primary}
                        />
                    }
                    ListHeaderComponent={
                        <View style={prescriptionListStyles.txHeader}>
                            <Text style={prescriptionListStyles.txLabel}>PRESCRIPTION RECORDS</Text>
                            <Text style={prescriptionListStyles.txCount}>TOTAL {totalCount} PRESCRIPTIONS</Text>
                        </View>
                    }
                    ListFooterComponent={
                        isFetchingNextPage ? (
                            <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                            </View>
                        ) : undefined
                    }
                    ListEmptyComponent={
                        <View style={prescriptionListStyles.emptyBox}>
                            <Text style={prescriptionListStyles.emptyTitle}>No prescriptions found</Text>
                            <Text style={prescriptionListStyles.emptySub}>
                                {search ? 'Try adjusting your search query.' : 'Tap + to write a new prescription.'}
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <PrescriptionItemCard
                            item={item}
                            onPress={() =>
                                appNavigation?.navigate(AppRoute.VIEW_PRESCRIPTION, {
                                    rxId: item.id,
                                    patientId: item.patient_id,
                                    patientName: item.patient_name,
                                    fromScreen: AppRoute.PRESCRIPTION_LIST,
                                })
                            }
                        />
                    )}
                />
            )}

            <TouchableOpacity
                style={[
                    prescriptionListStyles.fab,
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
                title="Select Patient for Prescription"
                visible={showSelectPatientModal}
                onClose={() => setShowSelectPatientModal(false)}
                onSelectPatient={patient => {
                    appNavigation?.navigate(AppRoute.CREATE_PRESCRIPTION, {
                        patientId: patient.id,
                        patientName: patient.name,
                        fromScreen: AppRoute.PRESCRIPTION_LIST,
                    });
                }}
            />
            <PrescriptionFilterModal
                visible={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                filterState={filterState}
                updateFilterState={updateFilterState}
                onReset={resetFilters}
                onApply={() => setShowFilterModal(false)}
            />
        </SafeAreaWrapper>
    );
};

export default PrescriptionScreen;

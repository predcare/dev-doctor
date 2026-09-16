import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonErrorCard from '../../components/commons/CommonErrorCard/CommonErrorCard';
import SelectPatientModal from '../../components/commons/SelectPatientModal/SelectPatientModal';
import PrescriptionFilterModal from '../../components/Modules/Prescription/PrescriptionFilterModal';
import PrescriptionItemCard from '../../components/Modules/Prescription/PrescriptionItemCard';
import { ChevronLeftIcon, FilterIcon, PlusIcon, SearchIcon } from '../../components/ui/icons';
import { useDebounce } from '../../hooks/commons/useDebounce';
import { useGetAllPrescriptions } from '../../hooks/react-query/prescriptions/prescriptions.hooks';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { AppRoute } from '../../route';
import { prescriptionListStyles as S } from '../../styled/PrescriptionListScreen.styled';
import { theme } from '../../styled/theme.styled';

export interface PrescriptionListScreenProps {
  navigation?: any;
  route?: any;
}

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

export const PrescriptionListScreen: React.FC<PrescriptionListScreenProps> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState<IPrescriptionFilterState>(initialFilterState);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSelectPatientModal, setShowSelectPatientModal] = useState(false);

  const debounceSearch = useDebounce(search?.trim(), 600);

  const updateFilterState = <K extends keyof IPrescriptionFilterState>(
    key: K,
    value: IPrescriptionFilterState[K]
  ) => {
    setFilterState(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilterState(initialFilterState);
  };

  const {
    data: prescriptionListData,
    isPending: prescriptionsLoading,
    isError,
    refetch,
  } = useGetAllPrescriptions({
    page: 1,
    limit: 100,
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

  return (
    <SafeAreaWrapper>
      <View style={S.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={S.backBtn}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={S.headerTitle}>Prescriptions</Text>
      </View>
      <View style={S.searchRow}>
        <View style={S.searchPill}>
          <SearchIcon size={16} color="#9CA3AF" />
          <TextInput
            style={S.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search by patient name or prescription ID..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity
          style={S.filterIconBtn}
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.7}
        >
          <FilterIcon size={18} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={S.chipRow}>
        {[
          { label: 'All', value: 'all' },
          { label: 'Draft', value: 'draft' },
          { label: 'Sent', value: 'sent' },
          { label: 'Completed', value: 'completed' },
        ].map(f => (
          <TouchableOpacity
            key={f.value}
            style={[S.chip, filterState.activeChip === f.value && S.chipActive]}
            onPress={() => updateFilterState('activeChip', f.value)}
            activeOpacity={0.7}
          >
            <Text style={[S.chipTxt, filterState.activeChip === f.value && S.chipTxtActive]}>
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
          style={S.scroll}
          data={prescriptionListData?.data || []}
          keyExtractor={item => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListHeaderComponent={
            <View style={S.txHeader}>
              <Text style={S.txLabel}>PRESCRIPTION RECORDS</Text>
              <Text style={S.txCount}>TOTAL {prescriptionListData?.meta?.total} PRESCRIPTIONS</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={S.emptyBox}>
              <Text style={S.emptyTitle}>No prescriptions found</Text>
              <Text style={S.emptySub}>
                {search ? 'Try adjusting your search query.' : 'Tap + to write a new prescription.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <PrescriptionItemCard
              item={item}
              onPress={() =>
                navigation?.navigate(AppRoute.PRESCRIPTION_VIEW, {
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
        style={S.fab}
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
          navigation?.navigate(AppRoute.CREATE_PRESCRIPTION, {
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

export default PrescriptionListScreen;

import React, { useMemo, useState } from 'react';
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
import { useGetAllPrescriptions } from '../../hooks/react-query/prescriptions/prescriptions.hooks';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { AppRoute } from '../../route';
import { prescriptionListStyles as S } from '../../styled/PrescriptionListScreen.styled';
import { theme } from '../../styled/theme.styled';
import { useAuthStore } from '../../zustand/stores/useAuthStore';

export interface PrescriptionListScreenProps {
  navigation?: any;
  route?: any;
}

export type PrescriptionStatus = 'All' | 'Draft' | 'Sent' | 'Active';
export type DateRangeOption = 'Today' | 'This Week' | 'Current Month' | 'Current Year' | 'Custom';

const isDateInRange = (
  dateStr?: string,
  range?: DateRangeOption,
  customFrom?: string,
  customTo?: string
): boolean => {
  if (!range) return true;
  if (!dateStr) return false;

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return true;

  const now = new Date();

  if (range === 'Today') {
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }

  if (range === 'This Week') {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return d >= startOfWeek && d <= endOfWeek;
  }

  if (range === 'Current Month') {
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }

  if (range === 'Current Year') {
    return d.getFullYear() === now.getFullYear();
  }

  if (range === 'Custom') {
    if (customFrom) {
      const fromDate = new Date(customFrom + 'T00:00:00');
      if (d < fromDate) return false;
    }
    if (customTo) {
      const toDate = new Date(customTo + 'T23:59:59');
      if (d > toDate) return false;
    }
    return true;
  }

  return true;
};

export const PrescriptionListScreen: React.FC<PrescriptionListScreenProps> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<PrescriptionStatus>('All');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSelectPatientModal, setShowSelectPatientModal] = useState(false);

  // Filter Modal state
  const [dateRange, setDateRange] = useState<DateRangeOption>('Today');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set(['All']));

  // Get Auth State User Data
  const { userData } = useAuthStore(state => state);

  // API Call using user_id
  const {
    data: prescriptionListData,
    isPending: prescriptionsLoading,
    isError,
    refetch,
  } = useGetAllPrescriptions(userData?.user_id || '');

  const prescriptions = useMemo(() => {
    return prescriptionListData?.prescriptions || [];
  }, [prescriptionListData]);

  // Filtering Logic
  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(item => {
      // 1. Search Match
      const searchLower = search.toLowerCase().trim();
      const matchSearch =
        !searchLower ||
        (item.patient_name && item.patient_name.toLowerCase().includes(searchLower)) ||
        (item.prescription_id && item.prescription_id.toLowerCase().includes(searchLower));

      // 2. Chip Match
      const statusLower = (item.status || 'draft').toLowerCase();
      const matchChip =
        activeFilter === 'All' ||
        (activeFilter === 'Draft' && statusLower === 'draft') ||
        (activeFilter === 'Sent' && (statusLower === 'sent' || statusLower === 'completed')) ||
        (activeFilter === 'Active' && statusLower === 'active');

      // 3. Modal Status Match
      const matchModalStatus =
        statusFilter.has('All') ||
        (statusFilter.has('Draft') && statusLower === 'draft') ||
        (statusFilter.has('Sent') && (statusLower === 'sent' || statusLower === 'completed')) ||
        (statusFilter.has('Active') && statusLower === 'active');

      // 4. Date Range Match
      const itemDate = item.created_at || item.consultation_date || item.appointment_date;
      const matchDate = isDateInRange(itemDate, dateRange, customFrom, customTo);

      return matchSearch && matchChip && matchModalStatus && matchDate;
    });
  }, [prescriptions, search, activeFilter, statusFilter, dateRange, customFrom, customTo]);

  const toggleStatusFilter = (s: string) => {
    setStatusFilter(prev => {
      const next = new Set(prev);
      if (s === 'All') return new Set(['All']);
      next.delete('All');
      if (next.has(s)) {
        next.delete(s);
        if (next.size === 0) next.add('All');
      } else {
        next.add(s);
      }
      return next;
    });
  };

  const resetFilters = () => {
    setDateRange('Today');
    setCustomFrom('');
    setCustomTo('');
    setStatusFilter(new Set(['All']));
  };

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
        {(['All', 'Draft', 'Sent', 'Active'] as const).map(f => (
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

      {/* Main Content Area */}
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
          data={filteredPrescriptions}
          keyExtractor={item => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListHeaderComponent={
            <View style={S.txHeader}>
              <Text style={S.txLabel}>PRESCRIPTION RECORDS</Text>
              <Text style={S.txCount}>TOTAL {filteredPrescriptions.length} PRESCRIPTIONS</Text>
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
          });
        }}
      />
      <PrescriptionFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        dateRange={dateRange}
        setDateRange={setDateRange}
        customFrom={customFrom}
        setCustomFrom={setCustomFrom}
        customTo={customTo}
        setCustomTo={setCustomTo}
        statusFilter={statusFilter}
        toggleStatusFilter={toggleStatusFilter}
        onReset={resetFilters}
        onApply={() => setShowFilterModal(false)}
      />
    </SafeAreaWrapper>
  );
};

export default PrescriptionListScreen;

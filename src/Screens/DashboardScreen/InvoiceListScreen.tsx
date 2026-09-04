import React, { useCallback, useMemo, useState } from 'react';
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
import SelectPatientModal, {
  SelectablePatient,
} from '../../components/commons/SelectPatientModal/SelectPatientModal';
import InvoiceFilterModal from '../../components/Modules/Invoice/InvoiceFilterModal';
import InvoicePreviewModal from '../../components/Modules/Invoice/InvoicePreviewModal';
import InvoiceSkeleton from '../../components/Skeletons/InvoiceSkeleton';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
} from '../../components/ui/icons';
import {
  useDownloadInvoicePdf,
  useMyAllInvoices,
} from '../../hooks/react-query/invoices/invoices.hooks';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { handleInvoicePdfAction } from '../../lib/common/file.utils';
import { showErrorToast, showSuccessToast } from '../../lib/common/toast.utils';
import type { InvoiceListScreenProps } from '../../route';
import { invoiceListStyles as S } from '../../styled/InvoiceListScreen.styled';
import { theme } from '../../styled/theme.styled';
import { IInvoiceDoc } from '../../typescripts/interfaces/invoices.interfaces';
import { useAuthStore } from '../../zustand/stores/useAuthStore';

const fmtAmt = (num: number) =>
  `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (isoStr: string) => {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return isoStr;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Checks if a date falls within the selected date range filter.
 */
const isDateInRange = (
  dateStr: string,
  dateRange: 'Today' | 'This Week' | 'Current Month' | 'Current Year' | 'Custom',
  customFrom: string,
  customTo: string
): boolean => {
  if (!dateStr) return true;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return true;

  const now = new Date();

  if (dateRange === 'Today') {
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }

  if (dateRange === 'This Week') {
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return d >= startOfWeek && d <= endOfWeek;
  }

  if (dateRange === 'Current Month') {
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }

  if (dateRange === 'Current Year') {
    return d.getFullYear() === now.getFullYear();
  }

  if (dateRange === 'Custom') {
    let fromValid = true;
    let toValid = true;

    if (customFrom) {
      const fromDate = new Date(customFrom + 'T00:00:00');
      if (!isNaN(fromDate.getTime())) {
        fromValid = d >= fromDate;
      }
    }

    if (customTo) {
      const toDate = new Date(customTo + 'T23:59:59');
      if (!isNaN(toDate.getTime())) {
        toValid = d <= toDate;
      }
    }

    return fromValid && toValid;
  }

  return true;
};

const getStatusStyle = (statusStr: string) => {
  const s = (statusStr || '').toLowerCase().trim();
  if (s === 'paid') return { bg: '#D1FAE5', txt: '#065F46', label: 'PAID' };
  if (s === 'overdue' || s === 'cancelled')
    return { bg: '#FEE2E2', txt: '#B91C1C', label: s.toUpperCase() };
  return { bg: '#FEF3C7', txt: '#B45309', label: 'PENDING' };
};

export const InvoiceListScreen: React.FC<InvoiceListScreenProps> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Paid' | 'Pending' | 'Overdue'>('All');
  const [showPicker, setShowPicker] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState<IInvoiceDoc | null>(
    null
  );
  const [downloadingId, setDownloadingId] = useState<number | string | null>(null);

  // Filter Modal State — Initial default Date Range is "Today" and Status is "All"
  const [dateRange, setDateRange] = useState<
    'Today' | 'This Week' | 'Current Month' | 'Current Year' | 'Custom'
  >('Today');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set(['All']));

  const { userData } = useAuthStore(state => state);
  const {
    data: allInvoices,
    isPending: allInvoicesPending,
    isError,
    refetch,
    isRefetching,
  } = useMyAllInvoices({
    doctorId: userData?.user_id,
  });

  const { mutate: downloadPdfMutate } = useDownloadInvoicePdf();

  // Helper function to download PDF to device
  const downloadInvoicePDF = useCallback(
    (inv: IInvoiceDoc, action: 'open' | 'save' = 'save') => {
      if (!inv?.id) {
        showErrorToast('Invoice ID is missing', 'Cannot Download PDF');
        return;
      }
      setDownloadingId(inv.id);
      downloadPdfMutate(inv.id, {
        onSuccess: bytes => {
          handleInvoicePdfAction(inv, action, bytes)
            .then(() => {
              if (action === 'save') {
                showSuccessToast(
                  `Invoice ${inv.invoice_number || inv.id} saved successfully!`,
                  '✅ Downloaded'
                );
              }
            })
            .catch(err => {
              showErrorToast(err?.message || 'Failed to save PDF', 'Download Error');
            })
            .finally(() => {
              setDownloadingId(null);
            });
        },
        onError: (err: any) => {
          showErrorToast(err?.message || 'Could not fetch PDF from server', 'Download Failed');
          setDownloadingId(null);
        },
      });
    },
    [downloadPdfMutate]
  );

  // Date-filtered invoices base set
  const dateFilteredInvoices = useMemo(() => {
    if (!allInvoices || !Array.isArray(allInvoices)) return [];
    return allInvoices.filter(inv =>
      isDateInRange(inv.created_at, dateRange, customFrom, customTo)
    );
  }, [allInvoices, dateRange, customFrom, customTo]);

  // Dynamically calculated stats scoped strictly to selected Date Range Filter
  const totalCollected = useMemo(() => {
    return dateFilteredInvoices
      .filter(i => (i.payment_status || '').toLowerCase().trim() === 'paid')
      .reduce((sum, i) => sum + parseFloat(i.grand_total || '0'), 0);
  }, [dateFilteredInvoices]);

  const outstanding = useMemo(() => {
    return dateFilteredInvoices
      .filter(i => (i.payment_status || '').toLowerCase().trim() !== 'paid')
      .reduce((sum, i) => sum + parseFloat(i.grand_total || '0'), 0);
  }, [dateFilteredInvoices]);

  // Full filtered invoice list (Search + Chip + Modal Status + Date Range)
  const filteredInvoices = useMemo(() => {
    return dateFilteredInvoices.filter(inv => {
      const invNum = (inv.invoice_number || '').toLowerCase();
      const patName = (inv.patient_name || '').toLowerCase();
      const patId = String(inv.patient_id || '').toLowerCase();
      const searchLower = search.toLowerCase().trim();

      const matchSearch =
        !searchLower ||
        invNum.includes(searchLower) ||
        patName.includes(searchLower) ||
        patId.includes(searchLower);

      const statusNormalized = (inv.payment_status || 'pending').toLowerCase().trim();

      let matchChip = true;
      if (activeFilter === 'Paid') matchChip = statusNormalized === 'paid';
      else if (activeFilter === 'Pending') matchChip = statusNormalized === 'pending';
      else if (activeFilter === 'Overdue')
        matchChip = statusNormalized === 'overdue' || statusNormalized === 'cancelled';

      let matchStatusModal = statusFilter.has('All');
      if (!matchStatusModal) {
        statusFilter.forEach(sf => {
          const sfLower = sf.toLowerCase().trim();
          if (sfLower === statusNormalized) matchStatusModal = true;
          if (
            sfLower === 'overdue' &&
            (statusNormalized === 'overdue' || statusNormalized === 'cancelled')
          ) {
            matchStatusModal = true;
          }
        });
      }

      return matchSearch && matchChip && matchStatusModal;
    });
  }, [dateFilteredInvoices, search, activeFilter, statusFilter]);

  const handleSelectPatient = (patient: SelectablePatient) => {
    setShowPicker(false);
    console.log('patient', patient)
    navigation?.navigate('CreateInvoice', {
      patientId: patient.id,
      patientName: patient.name,
    });
  };

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
    setActiveFilter('All');
    setSearch('');
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
        <Text style={S.headerTitle}>Invoices</Text>
      </View>

      {/* Search Row */}
      <View style={S.searchRow}>
        <View style={S.searchPill}>
          <SearchIcon size={16} color="#9CA3AF" />
          <TextInput
            style={S.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search by patient name or invoice #"
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
      <View style={S.chipRow}>
        {(['All', 'Paid', 'Pending', 'Overdue'] as const).map(f => (
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
        data={filteredInvoices}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => {
          const { bg, txt, label } = getStatusStyle(item.payment_status);
          const isDownloading = downloadingId === item.id;
          const grandTotalNum = parseFloat(item.grand_total || '0');
          return (
            <TouchableOpacity
              style={S.txCard}
              onPress={() => setSelectedInvoiceForPreview(item)}
              activeOpacity={0.75}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={S.txName}>{item.patient_name || 'Patient'}</Text>
                  <View style={[S.badge, { backgroundColor: bg, marginLeft: 8 }]}>
                    <Text style={[S.badgeTxt, { color: txt }]}>{label}</Text>
                  </View>
                </View>
                <Text style={S.txSub}>
                  #{item.invoice_number || `INV-${item.id}`} • {formatDate(item.created_at)}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[
                    S.txAmt,
                    (label === 'OVERDUE' || label === 'CANCELLED') && { color: '#EF4444' },
                  ]}
                >
                  {fmtAmt(grandTotalNum)}
                </Text>
                <TouchableOpacity
                  style={{
                    marginLeft: 10,
                    padding: 6,
                    borderRadius: 6,
                    backgroundColor: theme.colors.background,
                    borderWidth: 1,
                    borderColor: theme.colors.surfaceBorder,
                  }}
                  onPress={e => {
                    e.stopPropagation();
                    downloadInvoicePDF(item, 'save');
                  }}
                  disabled={isDownloading}
                  activeOpacity={0.7}
                >
                  {isDownloading ? (
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                  ) : (
                    <FileTextIcon size={16} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>

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
                <Text style={S.statAmtWhite}>{fmtAmt(outstanding)}</Text>
              </View>
              <View style={S.statCardWhite}>
                <Text style={S.statLabelGray}>TOTAL COLLECTED</Text>
                <Text style={S.statAmtDark}>{fmtAmt(totalCollected)}</Text>
              </View>
            </View>

            <View style={S.txHeader}>
              <Text style={S.txLabel}>RECENT TRANSACTIONS</Text>
              <Text style={S.txCount}>TOTAL {filteredInvoices.length} INVOICES</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          allInvoicesPending ? (
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
              title={dateRange === 'Today' ? 'No Invoices Found Today' : 'No Invoices Found'}
              message={
                dateRange === 'Today'
                  ? 'Switch to another date range or tap + to create a new invoice.'
                  : 'Try adjusting your search or filter settings.'
              }
            />
          )
        }
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

      <TouchableOpacity style={S.fab} onPress={() => setShowPicker(true)} activeOpacity={0.85}>
        <PlusIcon size={24} color={theme.colors.surface} />
      </TouchableOpacity>

      <SelectPatientModal
        title="Select Patient for Invoice"
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelectPatient={handleSelectPatient}
      />

      <InvoiceFilterModal
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
      <InvoicePreviewModal
        visible={!!selectedInvoiceForPreview}
        invoice={selectedInvoiceForPreview}
        onClose={() => setSelectedInvoiceForPreview(null)}
      />
    </SafeAreaWrapper>
  );
};

export default InvoiceListScreen;

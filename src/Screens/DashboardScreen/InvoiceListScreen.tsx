import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import InvoiceFilterModal from '../../components/Modules/Invoice/InvoiceFilterModal';
import InvoicePreviewModal from '../../components/Modules/Invoice/InvoicePreviewModal';
import SelectPatientModal, {
  SelectablePatient,
} from '../../components/Modules/Invoice/SelectPatientModal';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
} from '../../components/ui/icons';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { Header } from '../../Layout/Header';
import type { InvoiceListScreenProps } from '../../route';
import { invoiceListStyles as S } from '../../styled/InvoiceListScreen.styled';
import { theme } from '../../styled/theme.styled';
import { Invoice } from '../../typescripts/types/invoice.types';

const fmtAmt = (num: number) =>
  `₹${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const InvoiceListScreen: React.FC<InvoiceListScreenProps> = ({
  navigation,
}) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'All' | 'Paid' | 'Pending' | 'Overdue'
  >('All');
  const [showPicker, setShowPicker] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] =
    useState<Invoice | null>(null);

  // Filter Modal State
  const [dateRange, setDateRange] = useState<
    'Today' | 'This Week' | 'Current Month' | 'Current Year' | 'Custom'
  >('Today');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [statusFilter, setStatusFilter] = useState<Set<string>>(
    new Set(['All']),
  );

  // Static Invoices Master Data
  const [invoices] = useState<Invoice[]>([
    {
      id: 'inv_1',
      invoiceNumber: 'INV-2026-0042',
      patientId: 'PAT-1092',
      patientName: 'Eleanor Vance',
      appointmentDate: '12 Aug 2026',
      createdDate: '12 Aug 2026',
      items: [
        {
          id: '1',
          name: 'Cardiology Consultation',
          qty: '1',
          price: '800',
          discount: '0',
          discount_type: '%',
          tax_percent: '18',
          total: 944,
        },
      ],
      subtotal: 1300,
      totalDiscount: 0,
      cgst: 72,
      sgst: 72,
      igst: 0,
      grandTotal: 1444,
      paymentMode: 'UPI',
      status: 'Paid',
    },
    {
      id: 'inv_2',
      invoiceNumber: 'INV-2026-0041',
      patientId: 'PAT-1088',
      patientName: 'James Thornton',
      appointmentDate: '11 Aug 2026',
      createdDate: '11 Aug 2026',
      items: [
        {
          id: '1',
          name: 'Comprehensive Health Screening',
          qty: '1',
          price: '2500',
          discount: '250',
          discount_type: 'flat',
          tax_percent: '18',
          total: 2655,
        },
      ],
      subtotal: 2500,
      totalDiscount: 250,
      cgst: 202.5,
      sgst: 202.5,
      igst: 0,
      grandTotal: 2655,
      paymentMode: 'Card',
      status: 'Paid',
    },
    {
      id: 'inv_3',
      invoiceNumber: 'INV-2026-0040',
      patientId: 'PAT-1074',
      patientName: 'Sophia Martinez',
      appointmentDate: '10 Aug 2026',
      createdDate: '10 Aug 2026',
      items: [
        {
          id: '1',
          name: 'Dermatology Consultation',
          qty: '1',
          price: '1800',
          discount: '10',
          discount_type: '%',
          tax_percent: '18',
          total: 1911.6,
        },
      ],
      subtotal: 1800,
      totalDiscount: 180,
      cgst: 145.8,
      sgst: 145.8,
      igst: 0,
      grandTotal: 1911.6,
      paymentMode: 'Cash',
      status: 'Pending',
    },
    {
      id: 'inv_4',
      invoiceNumber: 'INV-2026-0039',
      patientId: 'PAT-1065',
      patientName: 'Robert Chen',
      appointmentDate: '08 Aug 2026',
      createdDate: '08 Aug 2026',
      items: [
        {
          id: '1',
          name: 'Orthopedic Joint X-Ray',
          qty: '1',
          price: '1500',
          discount: '0',
          discount_type: '%',
          tax_percent: '0',
          total: 1500,
        },
      ],
      subtotal: 1500,
      totalDiscount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      grandTotal: 1500,
      paymentMode: 'Online',
      status: 'Overdue',
    },
  ]);

  const filteredInvoices = invoices.filter(i => {
    const matchSearch =
      !search ||
      i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      i.patientName.toLowerCase().includes(search.toLowerCase());
    const matchChip = activeFilter === 'All' || i.status === activeFilter;
    const matchStatusModal =
      statusFilter.has('All') || statusFilter.has(i.status);
    return matchSearch && matchChip && matchStatusModal;
  });

  const totalCollected = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + i.grandTotal, 0);

  const outstanding = invoices
    .filter(i => i.status !== 'Paid')
    .reduce((sum, i) => sum + i.grandTotal, 0);

  const statusStyle = (status: string) => {
    if (status === 'Paid') return { bg: '#D1FAE5', txt: '#065F46' };
    if (status === 'Overdue') return { bg: '#FEE2E2', txt: '#B91C1C' };
    return { bg: '#FEF3C7', txt: '#B45309' };
  };

  const handleSelectPatient = (patient: SelectablePatient) => {
    setShowPicker(false);
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
  };

  return (
    <SafeAreaWrapper edges={['top', 'left', 'right', 'bottom']}>
      <Header
        title="Reports & Invoices"
        subtitle="Billing statements & history"
        unreadCount={3}
        onNotificationPress={() => navigation?.navigate('Notifications')}
        onProfilePress={() => navigation?.navigate('DoctorProfile')}
      />

      {/* ── Search + Filter Icon ── */}
      <View style={S.searchRow}>
        <View style={S.searchPill}>
          <SearchIcon size={16} color="#9CA3AF" />
          <TextInput
            style={S.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search by patient name or ID"
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

      {/* ── Filter Chips ── */}
      <View style={S.chipRow}>
        {(['All', 'Paid', 'Pending', 'Overdue'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[S.chip, activeFilter === f && S.chipActive]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.7}
          >
            <Text style={[S.chipTxt, activeFilter === f && S.chipTxtActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={S.scroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Stats Cards ── */}
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

        {/* ── Recent Transactions Heading ── */}
        <View style={S.txHeader}>
          <Text style={S.txLabel}>RECENT TRANSACTIONS</Text>
          <Text style={S.txCount}>TOTAL {invoices.length} INVOICES</Text>
        </View>

        {/* ── Invoice Rows ── */}
        {filteredInvoices.length === 0 ? (
          <View style={S.emptyBox}>
            <Text style={S.emptyTitle}>No invoices found</Text>
            <Text style={S.emptySub}>Tap + to create your first invoice.</Text>
          </View>
        ) : (
          filteredInvoices.map(inv => {
            const { bg, txt } = statusStyle(inv.status);
            return (
              <TouchableOpacity
                key={inv.id}
                style={S.txCard}
                onPress={() => setSelectedInvoiceForPreview(inv)}
                activeOpacity={0.75}
              >
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}
                  >
                    <Text style={S.txName}>{inv.patientName}</Text>
                    <View
                      style={[S.badge, { backgroundColor: bg, marginLeft: 8 }]}
                    >
                      <Text style={[S.badgeTxt, { color: txt }]}>
                        {inv.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={S.txSub}>
                    #{inv.invoiceNumber} • {inv.createdDate}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={[
                      S.txAmt,
                      inv.status === 'Overdue' && { color: '#EF4444' },
                    ]}
                  >
                    {fmtAmt(inv.grandTotal)}
                  </Text>
                  <View style={{ paddingLeft: 6 }}>
                    <ChevronRightIcon size={16} color="#9CA3AF" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* ── FAB + Button ── */}
      <TouchableOpacity
        style={S.fab}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.85}
      >
        <PlusIcon size={24} color={theme.colors.surface} />
      </TouchableOpacity>

      {/* Patient Selector Modal */}
      <SelectPatientModal
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelectPatient={handleSelectPatient}
      />

      {/* PDF View Modal */}
      {selectedInvoiceForPreview && (
        <InvoicePreviewModal
          visible={!!selectedInvoiceForPreview}
          invoice={selectedInvoiceForPreview}
          onClose={() => setSelectedInvoiceForPreview(null)}
        />
      )}

      {/* Filter Popup Modal */}
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
    </SafeAreaWrapper>
  );
};

export default InvoiceListScreen;

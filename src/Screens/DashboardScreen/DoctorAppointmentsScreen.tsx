import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CustomKebabMenu,
  CustomKebabMenuItem,
} from '../../components/ui/CustomMenu/CustomKebabMenu';
import {
  CheckIcon,
  ChevronLeftIcon,
  CircleXIcon,
  ClinicIcon,
  ClockIcon,
  FilterIcon,
  InfoCircleIcon,
  PlayCircleIcon,
  PrescriptionIcon,
  RescheduleIcon,
  SearchIcon,
  TrashIcon,
  VideoIcon,
} from '../../components/ui/icons';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { showInfoToast, showSuccessToast } from '../../lib/common/toast.utils';
import { MOCK_APPOINTMENTS, MockAppointment } from '../../resources/mockData';
import type { DoctorAppointmentsScreenProps } from '../../route';
import {
  doctorAppointmentsStyles as S,
  TEAL,
} from '../../styled/DoctorAppointmentsScreen.styled';
import { theme } from '../../styled/theme.styled';

type TabType = 'both' | 'inperson' | 'video';
type DateRangeFilter = 'today' | 'tomorrow' | 'thisweek' | 'all';

export const DoctorAppointmentsScreen: React.FC<DoctorAppointmentsScreenProps> = ({
  navigation,
}) => {
  const [appointmentsList, setAppointmentsList] = useState<MockAppointment[]>(MOCK_APPOINTMENTS);
  const [activeTab, setActiveTab] = useState<TabType>('both');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Bottom Sheet State - default to 'all' & [] so all appointments display clearly
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterDateRange, setFilterDateRange] = useState<DateRangeFilter>('all');
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);

  // Pending filter choices inside modal
  const [pendingDateRange, setPendingDateRange] = useState<DateRangeFilter>('all');
  const [pendingStatuses, setPendingStatuses] = useState<string[]>([]);

  // Details Modal
  const [selectedDetailsApt, setSelectedDetailsApt] = useState<MockAppointment | null>(null);

  const isFilterApplied = filterDateRange !== 'all' || filterStatuses.length > 0;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#10B981';
      case 'cancelled':
        return '#EF4444';
      case 'pending':
        return '#F59E0B';
      default:
        return '#3B82F6';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#D1FAE5';
      case 'cancelled':
        return '#FEE2E2';
      case 'pending':
        return '#FEF3C7';
      default:
        return '#DBEAFE';
    }
  };

  const filteredAppointments = appointmentsList.filter(apt => {
    // Custom tab filter
    if (activeTab === 'video' && apt.consultation_type !== 'video') return false;
    if (activeTab === 'inperson' && apt.consultation_type === 'video') return false;

    // Date range filter
    if (filterDateRange === 'today' && apt.appointment_date !== '2026-08-18') return false;
    if (filterDateRange === 'tomorrow' && apt.appointment_date !== '2026-08-19') return false;
    if (
      filterDateRange === 'thisweek' &&
      !['2026-08-18', '2026-08-19', '2026-08-20', '2026-08-21', '2026-08-22'].includes(apt.appointment_date)
    )
      return false;

    // Status filter
    if (filterStatuses.length > 0) {
      const status = apt.appointment_status.toLowerCase();
      if (!filterStatuses.includes(status)) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = apt.patient_name.toLowerCase();
      const aptId = apt.appointment_id.toLowerCase();
      const phone = apt.patient_phone.toLowerCase();
      return name.includes(q) || aptId.includes(q) || phone.includes(q);
    }

    return true;
  });

  // Top stats
  const todayCount = appointmentsList.filter(a => a.appointment_date === '2026-08-18').length;
  const upcoming3hCount = appointmentsList.filter(a => a.appointment_status === 'confirmed').length;

  const handleStartConsultation = (apt: MockAppointment) => {
    if (apt.consultation_type === 'video') {
      navigation?.navigate('DoctorMeeting', {
        appointmentId: apt.id,
        patientId: apt.patient_record_id,
      });
    } else {
      navigation?.navigate('PatientDetails', {
        patientId: apt.patient_record_id,
        patientName: apt.patient_name,
      });
    }
  };

  const handleReschedule = (apt: MockAppointment) => {
    navigation?.navigate('RescheduleAppointment', {
      appointmentId: apt.id,
      patientId: apt.patient_record_id,
    });
  };

  const handleCancelAppointment = (aptId: number) => {
    setAppointmentsList(prev =>
      prev.map(a => (a.id === aptId ? { ...a, appointment_status: 'cancelled' } : a))
    );
    showSuccessToast('Appointment cancelled successfully', 'Cancelled');
  };

  const handleCompleteAppointment = (aptId: number) => {
    setAppointmentsList(prev =>
      prev.map(a => (a.id === aptId ? { ...a, appointment_status: 'completed' } : a))
    );
    showSuccessToast('Appointment marked as completed', 'Completed');
  };

  const handleCreatePrescription = (apt: MockAppointment) => {
    navigation?.navigate('PrescriptionView', {
      rxId: `RX-${apt.appointment_id}`,
      patientName: apt.patient_name,
      patientId: apt.patient_record_id,
    });
  };

  const handleDeleteAppointment = (aptId: number) => {
    setAppointmentsList(prev => prev.filter(a => a.id !== aptId));
    setSelectedDetailsApt(null);
    showSuccessToast('Appointment deleted successfully', 'Deleted');
  };

  const handleApplyFilters = () => {
    setFilterDateRange(pendingDateRange);
    setFilterStatuses(pendingStatuses);
    setShowFilterPanel(false);
  };

  const handleResetFilters = () => {
    setPendingDateRange('all');
    setPendingStatuses([]);
    setFilterDateRange('all');
    setFilterStatuses([]);
    setShowFilterPanel(false);
  };

  return (
    <SafeAreaWrapper edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity style={S.backButtonCircle} onPress={() => navigation?.goBack()}>
          <ChevronLeftIcon size={18} color="#334155" strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={S.headerContent}>
          <Text style={S.headerTitle}>Manage Appointments</Text>
        </View>
      </View>

      {/* Top Stats Cards Row */}
      <View style={S.statsRow}>
        <View style={[S.statCard, S.statCardActive]}>
          <Text style={[S.statLabel, S.statLabelActive]}>TODAY'S</Text>
          <Text style={[S.statValue, S.statValueActive]}>{todayCount}</Text>
          <Text style={[S.statSub, S.statSubActive]}>Scheduled Patients</Text>
        </View>

        <View style={S.statCard}>
          <Text style={S.statLabel}>UPCOMING</Text>
          <Text style={S.statValue}>{upcoming3hCount}</Text>
          <Text style={S.statSub}>Next 3 hours</Text>
        </View>
      </View>

      {/* Search Row */}
      <View style={S.searchRow}>
        <View style={S.searchBox}>
          <SearchIcon size={16} color="#94A3B8" />
          <TextInput
            style={[S.searchInput, { paddingVertical: 0 }]}
            placeholder="Search patients or appointments..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
              <CircleXIcon size={14} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={S.filterBtn}
          onPress={() => {
            setPendingDateRange(filterDateRange);
            setPendingStatuses([...filterStatuses]);
            setShowFilterPanel(true);
          }}
          activeOpacity={0.7}
        >
          <FilterIcon size={18} color={TEAL} />
        </TouchableOpacity>
      </View>

      {/* Custom Segmented Tabs: Both | In-person | Video */}
      <View style={S.tabsContainer}>
        {(
          [
            { key: 'both', label: 'Both' },
            { key: 'inperson', label: 'In-person' },
            { key: 'video', label: 'Video' },
          ] as { key: TabType; label: string }[]
        ).map(t => (
          <TouchableOpacity
            key={t.key}
            style={[S.tab, activeTab === t.key && S.activeTab]}
            onPress={() => setActiveTab(t.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                S.tabText,
                {
                  color: activeTab === t.key ? '#FFFFFF' : '#374151',
                  fontWeight: activeTab === t.key ? '700' : '600',
                },
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Active Filter Banner */}
      {isFilterApplied && (
        <View style={S.filterBanner}>
          <Text style={S.filterBannerTxt}>
            Filtered · {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity onPress={handleResetFilters}>
            <Text style={S.filterBannerClear}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Appointments List with flex: 1 */}
      <FlatList
        style={{ flex: 1 }}
        data={filteredAppointments}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={S.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={S.emptyContainer}>
            <Text style={{ fontSize: 36 }}>📅</Text>
            <Text style={S.emptyTitle}>No Appointments Found</Text>
            <Text style={S.emptyText}>No appointments match your search or filter criteria.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isVideo = item.consultation_type === 'video';
          const isCompleted = item.appointment_status.toLowerCase() === 'completed';
          const statusColor = getStatusColor(item.appointment_status);
          const statusBg = getStatusBackground(item.appointment_status);

          // Menu items for reusable CustomKebabMenu component
          const menuItems: CustomKebabMenuItem[] = [
            {
              id: 'reschedule',
              label: 'Reschedule',
              icon: <RescheduleIcon size={18} color="#64748B" />,
              color: '#64748B',
              onPress: () => handleReschedule(item),
            },
            {
              id: 'cancel',
              label: 'Cancel Appointment',
              icon: <CircleXIcon size={18} color="#EF4444" />,
              color: '#EF4444',
              onPress: () => handleCancelAppointment(item.id),
            },
            {
              id: 'complete',
              label: 'Mark Complete',
              icon: <CheckIcon size={18} color="#64748B" />,
              color: '#64748B',
              onPress: () => handleCompleteAppointment(item.id),
            },
            {
              id: 'prescription',
              label: 'Create Prescription',
              icon: <PrescriptionIcon size={18} color={TEAL} />,
              color: TEAL,
              onPress: () => handleCreatePrescription(item),
            },
            {
              id: 'details',
              label: 'View Details',
              icon: <InfoCircleIcon size={18} color="#64748B" />,
              color: '#64748B',
              onPress: () => setSelectedDetailsApt(item),
            },
            {
              id: 'delete',
              label: 'Delete Appointment',
              icon: <TrashIcon size={18} color="#EF4444" />,
              color: '#EF4444',
              onPress: () => handleDeleteAppointment(item.id),
            },
          ];

          return (
            <View style={S.card}>
              {/* Card Header */}
              <View style={S.cardHeader}>
                <View style={S.patientRow}>
                  <View style={[S.patientAvatar, { backgroundColor: TEAL }]}>
                    <Text style={S.patientAvatarText}>{item.patient_name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={S.patientName}>{item.patient_name}</Text>
                    <Text style={S.patientAge}>
                      {item.patient_gender} / {item.patient_age}
                    </Text>
                    <Text style={S.aptIdText}>APT ID: {item.appointment_id}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={[S.statusBadge, { backgroundColor: statusBg }]}>
                    <View style={[S.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={[S.statusText, { color: statusColor }]}>
                      {item.appointment_status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Compact Single Row Chips */}
              <View style={S.chipsRow}>
                {/* Type Chip */}
                <View
                  style={[
                    S.chip,
                    {
                      backgroundColor: isVideo ? '#E6F7F5' : '#FFF3E6',
                      borderColor: isVideo ? '#B2DFDB' : '#FDDCB5',
                    },
                  ]}
                >
                  {isVideo ? (
                    <VideoIcon size={12} color={TEAL} />
                  ) : (
                    <ClinicIcon size={12} color="#F97316" />
                  )}
                  <Text style={[S.chipText, { color: isVideo ? TEAL : '#F97316' }]}>
                    {isVideo ? 'Video Call' : 'In-Clinic'}
                  </Text>
                </View>

                {/* Date Chip */}
                <View style={[S.chip, { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' }]}>
                  <ClockIcon size={12} color="#475569" />
                  <Text style={[S.chipText, { color: '#475569' }]}>{item.appointment_date}</Text>
                </View>

                {/* Time Chip */}
                <View style={[S.chip, { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' }]}>
                  <ClockIcon size={12} color="#475569" />
                  <Text style={[S.chipText, { color: '#475569' }]}>
                    {item.start_time} - {item.end_time}
                  </Text>
                </View>
              </View>

              {/* Symptoms / Reason Box */}
              {!!(item.symptoms || item.reason) && (
                <View style={S.symptomsBox}>
                  <Text style={S.symptomsLabel}>SYMPTOMS</Text>
                  <Text style={S.symptomsText} numberOfLines={2}>
                    {item.symptoms || item.reason}
                  </Text>
                </View>
              )}

              {/* Card Footer Actions */}
              <View style={S.cardFooterActions}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <TouchableOpacity
                    style={[S.joinButton, { flex: 1 }]}
                    onPress={() => handleStartConsultation(item)}
                    activeOpacity={0.85}
                  >
                    <PlayCircleIcon size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={S.joinButtonText}>
                      {isCompleted
                        ? 'View Details'
                        : isVideo
                        ? 'Join Call'
                        : 'Start Consultation'}
                    </Text>
                  </TouchableOpacity>

                  {/* Reusable CustomKebabMenu */}
                  <CustomKebabMenu items={menuItems} />
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Details Modal */}
      <Modal visible={selectedDetailsApt !== null} transparent animationType="slide">
        <View style={S.modalOverlay}>
          <View style={S.modalContent}>
            <View style={S.modalHeader}>
              <Text style={S.modalTitle}>Appointment Details</Text>
              <TouchableOpacity onPress={() => setSelectedDetailsApt(null)}>
                <Text style={S.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedDetailsApt && (
              <View style={S.modalBody}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: theme.colors.dark }}>
                  {selectedDetailsApt.patient_name} ({selectedDetailsApt.patient_record_id})
                </Text>
                <Text style={{ fontSize: 13, color: theme.colors.textSlate, marginTop: 4 }}>
                  📞 Phone: {selectedDetailsApt.patient_phone}
                </Text>
                <Text style={{ fontSize: 13, color: theme.colors.textSlate, marginTop: 2 }}>
                  📅 Scheduled: {selectedDetailsApt.appointment_date} ({selectedDetailsApt.start_time} - {selectedDetailsApt.end_time})
                </Text>
                <Text style={{ fontSize: 13, color: TEAL, fontWeight: '700', marginTop: 6 }}>
                  Fee: ₹{selectedDetailsApt.appointment_fee} ({selectedDetailsApt.consultation_type.toUpperCase()})
                </Text>

                {!!selectedDetailsApt.reason && (
                  <View style={[S.reasonBox, { marginTop: 12, marginHorizontal: 0 }]}>
                    <Text style={S.reasonText}>Reason: {selectedDetailsApt.reason}</Text>
                  </View>
                )}
              </View>
            )}

            <View style={S.modalFooter}>
              <TouchableOpacity
                style={S.modalDeleteBtn}
                onPress={() => {
                  if (selectedDetailsApt) handleDeleteAppointment(selectedDetailsApt.id);
                }}
              >
                <Text style={S.modalDeleteBtnTxt}>Delete Appointment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={S.modalCloseFooterBtn}
                onPress={() => setSelectedDetailsApt(null)}
              >
                <Text style={S.modalCloseFooterBtnTxt}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Schedule Filters Bottom Sheet Modal */}
      <Modal visible={showFilterPanel} transparent animationType="slide">
        <View style={S.sheetOverlay}>
          <View style={S.sheetContent}>
            <View style={S.sheetHandle}>
              <View style={S.sheetHandleBar} />
            </View>

            <View style={S.sheetHeader}>
              <Text style={S.sheetTitle}>Schedule Filters</Text>
              <TouchableOpacity onPress={() => setShowFilterPanel(false)}>
                <Text style={{ fontSize: 18, color: '#64748B', fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20 }}>
              <Text style={S.sheetSectionTitle}>DATE RANGE</Text>

              {[
                { key: 'today', label: 'Today' },
                { key: 'tomorrow', label: 'Tomorrow' },
                { key: 'thisweek', label: 'This Week' },
                { key: 'all', label: 'All Dates' },
              ].map(opt => (
                <TouchableOpacity
                  key={opt.key}
                  style={S.filterOptionRow}
                  onPress={() => setPendingDateRange(opt.key as DateRangeFilter)}
                >
                  <Text
                    style={[
                      S.filterOptionTxt,
                      { color: pendingDateRange === opt.key ? TEAL : '#1E293B' },
                      pendingDateRange === opt.key && { fontWeight: '700' },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {pendingDateRange === opt.key && (
                    <Text style={{ color: TEAL, fontWeight: 'bold', fontSize: 16 }}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}

              <Text style={S.sheetSectionTitle}>STATUS</Text>

              {[
                { key: 'upcoming', label: 'Upcoming' },
                { key: 'completed', label: 'Completed' },
                { key: 'cancelled', label: 'Cancelled' },
              ].map(st => {
                const selected = pendingStatuses.includes(st.key);
                return (
                  <TouchableOpacity
                    key={st.key}
                    style={S.filterOptionRow}
                    onPress={() => {
                      if (selected) {
                        setPendingStatuses(prev => prev.filter(s => s !== st.key));
                      } else {
                        setPendingStatuses(prev => [...prev, st.key]);
                      }
                    }}
                  >
                    <Text
                      style={[
                        S.filterOptionTxt,
                        { color: selected ? TEAL : '#1E293B' },
                        selected && { fontWeight: '700' },
                      ]}
                    >
                      {st.label}
                    </Text>
                    {selected && <Text style={{ color: TEAL, fontWeight: 'bold', fontSize: 16 }}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={S.filterFooter}>
              <TouchableOpacity style={S.btnReset} onPress={handleResetFilters}>
                <Text style={S.btnResetTxt}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity style={S.btnApply} onPress={handleApplyFilters}>
                <Text style={S.btnApplyTxt}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaWrapper>
  );
};

export default DoctorAppointmentsScreen;

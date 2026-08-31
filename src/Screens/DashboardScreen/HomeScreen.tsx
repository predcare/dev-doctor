import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppointmentCard } from '../../components/Modules/Dashboard/AppointmentCard';
import { AssistanceBanner } from '../../components/Modules/Dashboard/AssistanceBanner';
import { QuickAccessCard } from '../../components/Modules/Dashboard/QuickAccessCard';
import { StatTile } from '../../components/Modules/Dashboard/StatTile';
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  InvoiceIcon,
  PatientsIcon,
  PrescriptionIcon,
  ScheduleIcon,
  SearchIcon,
  WalletIcon,
} from '../../components/ui/icons';
import { Header } from '../../Layout/Header';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import type { HomeScreenProps } from '../../route';
import { homeStyles } from '../../styled/HomeScreen.styled';
import { theme } from '../../styled/theme.styled';

type PeriodKey = 'today' | 'week' | 'month';

const PERIOD_LABELS: Record<PeriodKey, string> = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [period, setPeriod] = useState<PeriodKey>('week');
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);

  // Static Mock Stats Data
  const stats = [
    {
      id: '1',
      label: 'Upcoming Appts',
      value: '5',
      trend: '+12%',
      isUp: true,
      icon: <ClockIcon size={20} color="#8B5CF6" />,
    },
    {
      id: '2',
      label: 'Total Appts',
      value: '14',
      trend: '+8%',
      isUp: true,
      icon: <CalendarIcon size={20} color={theme.colors.primary} />,
    },
    {
      id: '3',
      label: 'Earnings',
      value: '₹18.5k',
      trend: '+15%',
      isUp: true,
      icon: <WalletIcon size={20} color={theme.colors.primary} />,
    },
    {
      id: '4',
      label: 'Total Patients',
      value: '128',
      trend: '+5%',
      isUp: true,
      icon: <PatientsIcon size={20} color={theme.colors.warning} />,
    },
  ];

  // Static Mock Upcoming Patient Appointments Data
  const upcomingPatients = [
    {
      id: 'p1',
      name: 'Eleanor Vance',
      ageGender: '34 yrs • Female',
      time: '10:30 AM',
      timeDistance: 'IN 15 MINS',
      type: 'ONLINE',
      chiefComplaint: 'Chest tightness & fatigue',
      avatar: 'EV',
      avatarBg: theme.colors.primary,
      isOngoing: true,
    },
  ];

  // Quick Access Items Data using UI Icons
  const quickAccessItems = [
    {
      id: 'q1',
      label: 'BOOK APPT',
      screen: 'BookAppointment' as const,
      icon: <CalendarIcon size={30} color={theme.colors.primary} />,
    },
    {
      id: 'q2',
      label: 'WRITE RX',
      screen: 'PrescriptionSettings' as const,
      icon: <PrescriptionIcon size={30} color={theme.colors.primary} />,
    },
    {
      id: 'q3',
      label: 'AVAILABILITY',
      screen: 'Availability' as const,
      icon: <ScheduleIcon size={30} color={theme.colors.primary} />,
    },
    {
      id: 'q4',
      label: 'BILLING',
      screen: 'InvoiceList' as const,
      icon: <InvoiceIcon size={30} color={theme.colors.primary} />,
    },
  ];

  return (
    <SafeAreaWrapper edges={['top', 'left', 'right', 'bottom']}>
      <Header
        isHome={true}
        doctorName="Dr. Sarah Jenkins"
        specialty="Cardiologist • MD"
        clinicName="St. Jude Medical Center"
        unreadCount={3}
        onNotificationPress={() => navigation?.navigate('Notifications')}
        onProfilePress={() => navigation?.navigate('DoctorProfile')}
      />

      <ScrollView
        style={homeStyles.container}
        contentContainerStyle={homeStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Input Bar */}
        <View style={homeStyles.searchBar}>
          <SearchIcon size={20} color={theme.colors.textMuted} />
          <TextInput
            style={homeStyles.searchInput}
            placeholder="Search patient name, ID, or condition..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Highlights & Insights Section */}
        <View style={homeStyles.insightsSection}>
          <View style={homeStyles.insightsHeader}>
            <Text style={homeStyles.insightsTitle}>Highlights & Insights</Text>
            {/* Period Dropdown */}
            <View style={{ position: 'relative' }}>
              <TouchableOpacity
                style={homeStyles.periodPill}
                onPress={() => setShowPeriodMenu(v => !v)}
                activeOpacity={0.8}
              >
                <Text style={homeStyles.periodPillText}>
                  {PERIOD_LABELS[period]}
                </Text>
                {showPeriodMenu ? (
                  <ChevronUpIcon size={12} color={theme.colors.primary} />
                ) : (
                  <ChevronDownIcon size={12} color={theme.colors.primary} />
                )}
              </TouchableOpacity>

              {showPeriodMenu && (
                <View style={homeStyles.periodDropdownMenu}>
                  {(Object.entries(PERIOD_LABELS) as [PeriodKey, string][]).map(
                    ([key, label]) => (
                      <TouchableOpacity
                        key={key}
                        onPress={() => {
                          setPeriod(key);
                          setShowPeriodMenu(false);
                        }}
                        activeOpacity={0.75}
                        style={homeStyles.periodMenuItem}
                      >
                        <Text
                          style={[
                            homeStyles.periodMenuItemText,
                            period === key &&
                              homeStyles.periodMenuItemTextActive,
                          ]}
                        >
                          {label}
                        </Text>
                        {period === key && (
                          <CheckIcon size={14} color={theme.colors.primary} />
                        )}
                      </TouchableOpacity>
                    ),
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Horizontal Stats Carousel */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: theme.spacing.lg }}
          >
            {stats.map(stat => (
              <StatTile
                key={stat.id}
                label={stat.label}
                value={stat.value}
                trend={stat.trend}
                isUp={stat.isUp}
                icon={stat.icon}
              />
            ))}
          </ScrollView>
        </View>

        {/* Today's Queue / Upcoming Patient Appointments */}
        <View style={homeStyles.sectionHeader}>
          <Text style={homeStyles.sectionTitle}>Upcoming Appointments</Text>
          <TouchableOpacity
            onPress={() => navigation?.navigate('Patients')}
            activeOpacity={0.7}
          >
            <Text style={homeStyles.sectionLink}>See All</Text>
          </TouchableOpacity>
        </View>

        {upcomingPatients.map(patient => (
          <AppointmentCard
            key={patient.id}
            id={patient.id}
            patientName={patient.name}
            ageGender={patient.ageGender}
            time={patient.time}
            timeDistance={patient.timeDistance}
            consultType={patient.type}
            chiefComplaint={patient.chiefComplaint}
            avatarInitials={patient.avatar}
            avatarBgColor={patient.avatarBg}
            isOngoing={patient.isOngoing}
            onActionPress={() =>
              (navigation as any)?.navigate('PatientDetails', {
                patientId: patient.id,
                patientName: patient.name,
              })
            }
            onSecondaryPress={() =>
              (navigation as any)?.navigate('PatientDetails', {
                patientId: patient.id,
                patientName: patient.name,
              })
            }
          />
        ))}

        {/* Need Assistance Support Banner */}
        <AssistanceBanner
          onContactSupport={() => navigation?.navigate('Notifications')}
        />

        {/* Quick Access 2x2 Grid */}
        <View style={homeStyles.sectionHeader}>
          <Text style={homeStyles.sectionTitle}>Quick Access</Text>
        </View>

        <View style={homeStyles.quickAccessGrid}>
          {quickAccessItems.map(item => (
            <QuickAccessCard
              key={item.id}
              label={item.label}
              icon={item.icon}
              onPress={() => navigation?.navigate(item.screen)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;

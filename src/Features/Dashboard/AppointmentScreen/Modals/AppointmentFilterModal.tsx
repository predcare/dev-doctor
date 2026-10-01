import React, { useCallback, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PredDatePickerModal from '../../../../components/commons/PredDatePickerModal/PredDatePickerModal';
import { CalendarIcon, CheckIcon, CircleXIcon, ClockIcon, InfoCircleIcon } from '../../../../components/ui/icons';
import S from '../../../../styled/AppointmentFilterModal.styled';
import theme from '../../../../styled/theme.styled';

export type DateRangeFilter = 'today' | 'tomorrow' | 'thisweek' | 'all' | null;

export interface FilterStates {
  dateRange: DateRangeFilter;
  statuses: string[];
  fromDate: Date | null;
  toDate: Date | null;
  activeTarget: 'from' | 'to' | null;
  bookingMode: string | null;
}

interface AppointmentFilterModalProps {
  visible: boolean;
  filterStates: FilterStates;
  updateFilterState: (updates: Partial<FilterStates>) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

const formatDisplayDate = (d: Date | null): string => {
  if (!d || isNaN(d.getTime())) return '';
  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

export const AppointmentFilterModal: React.FC<AppointmentFilterModalProps> = React.memo(
  ({ visible, filterStates, updateFilterState, onApply, onReset, onClose }) => {
    const insets = useSafeAreaInsets();
    const [datePickerTarget, setDatePickerTarget] = useState<'from' | 'to' | null>(null);
    const { dateRange, statuses, fromDate, toDate } = filterStates;

    const dateRangeOptions = [
      { key: 'today', label: 'Today', icon: CalendarIcon },
      { key: 'tomorrow', label: 'Tomorrow', icon: CalendarIcon },
      { key: 'thisweek', label: 'This Week', icon: CalendarIcon },
      { key: 'all', label: 'Calendar', icon: CalendarIcon },
    ];

    const statusOptions = [
      { key: 'upcoming', label: 'Upcoming', icon: ClockIcon },
      { key: 'completed', label: 'Completed', icon: CheckIcon },
      { key: 'cancelled', label: 'Cancelled', icon: CircleXIcon },
      { key: 'noshow', label: 'No Show', icon: CircleXIcon },
      { key: 'pending', label: 'Pending', icon: InfoCircleIcon },
    ];

    const handleDateOptionPress = useCallback(
      (key: DateRangeFilter) => {
        updateFilterState({
          dateRange: key,
          activeTarget: null,
          ...(key !== 'all' ? { fromDate: null, toDate: null } : {}),
        });
      },
      [updateFilterState]
    );

    const handleToggleStatus = useCallback(
      (stKey: string) => {
        const exists = statuses.includes(stKey);
        const newStatuses = exists ? statuses.filter(s => s !== stKey) : [...statuses, stKey];
        updateFilterState({ statuses: newStatuses });
      },
      [statuses, updateFilterState]
    );

    const handleResetAll = useCallback(() => {
      setDatePickerTarget(null);
      updateFilterState({
        dateRange: null,
        statuses: [],
        fromDate: null,
        toDate: null,
        activeTarget: null,
      });
      onReset();
    }, [onReset, updateFilterState]);

    return (
      <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
        <View style={[S.sheetOverlay, { paddingTop: insets.top }]}>
          <View style={S.sheetContent}>
            <View style={S.sheetHandle}>
              <View style={S.sheetHandleBar} />
            </View>

            <View style={S.sheetHeader}>
              <Text style={S.sheetTitle}>Schedule Filters</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity onPress={handleResetAll} activeOpacity={0.7}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.primary }}>
                    Clear
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={S.closeBtnCircle}
                  onPress={onClose}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={S.closeBtnTxt}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Scrollable Filter List */}
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={S.scrollBody}
            >
              {/* DATE RANGE SECTION */}
              <Text style={S.sectionTitle}>DATE RANGE</Text>
              {dateRangeOptions.map(opt => {
                const selected = dateRange === opt.key;
                const IconComponent = opt.icon;
                const activeColor = theme.colors.primary;
                const inactiveColor = theme.colors.textSlate;

                return (
                  <React.Fragment key={opt.key}>
                    <TouchableOpacity
                      style={S.optionRow}
                      onPress={() => handleDateOptionPress(opt.key as DateRangeFilter)}
                      activeOpacity={0.7}
                    >
                      <View style={S.optionLeft}>
                        <View style={[S.iconBox, selected && S.iconBoxActive]}>
                          <IconComponent
                            size={20}
                            color={selected ? activeColor : inactiveColor}
                            strokeWidth={2}
                          />
                        </View>
                        <Text style={[S.optionText, selected && S.optionTextActive]}>
                          {opt.label}
                        </Text>
                      </View>

                      {selected && <CheckIcon size={20} color={activeColor} strokeWidth={2.6} />}
                    </TouchableOpacity>

                    {/* Render FROM / TO Inputs */}
                    {opt.key === 'all' && selected && (
                      <View style={S.calendarInputsContainer}>
                        {/* FROM Input Group */}
                        <View style={S.inputGroup}>
                          <Text style={S.inputGroupLabel}>FROM</Text>
                          <TouchableOpacity
                            style={[
                              S.dateInputRow,
                              datePickerTarget === 'from' && S.dateInputRowActive,
                            ]}
                            onPress={() => setDatePickerTarget('from')}
                            activeOpacity={0.8}
                          >
                            <View style={S.dateInputLeft}>
                              <CalendarIcon
                                size={18}
                                color={
                                  fromDate
                                    ? theme.colors.primary
                                    : theme.colors.textMuted
                                }
                              />
                              {fromDate ? (
                                <Text style={S.dateInputText}>{formatDisplayDate(fromDate)}</Text>
                              ) : (
                                <Text style={S.dateInputPlaceholder}>mm/dd/yyyy</Text>
                              )}
                            </View>
                            {fromDate && (
                              <TouchableOpacity
                                style={S.clearBtn}
                                onPress={() => updateFilterState({ fromDate: null })}
                                activeOpacity={0.7}
                              >
                                <Text style={S.clearBtnTxt}>✕</Text>
                              </TouchableOpacity>
                            )}
                          </TouchableOpacity>
                        </View>

                        {/* TO Input Group */}
                        <View style={S.inputGroup}>
                          <Text style={S.inputGroupLabel}>TO</Text>
                          <TouchableOpacity
                            style={[
                              S.dateInputRow,
                              datePickerTarget === 'to' && S.dateInputRowActive,
                            ]}
                            onPress={() => setDatePickerTarget('to')}
                            activeOpacity={0.8}
                          >
                            <View style={S.dateInputLeft}>
                              <CalendarIcon
                                size={18}
                                color={
                                  toDate
                                    ? theme.colors.primary
                                    : theme.colors.textMuted
                                }
                              />
                              {toDate ? (
                                <Text style={S.dateInputText}>{formatDisplayDate(toDate)}</Text>
                              ) : (
                                <Text style={S.dateInputPlaceholder}>mm/dd/yyyy</Text>
                              )}
                            </View>
                            {toDate && (
                              <TouchableOpacity
                                style={S.clearBtn}
                                onPress={() => updateFilterState({ toDate: null })}
                                activeOpacity={0.7}
                              >
                                <Text style={S.clearBtnTxt}>✕</Text>
                              </TouchableOpacity>
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </React.Fragment>
                );
              })}

              {/* APPOINTMENT STATUS SECTION */}
              <Text style={S.sectionTitle}>APPOINTMENT STATUS</Text>
              {statusOptions.map(st => {
                const selected = statuses.includes(st.key);
                const IconComponent = st.icon;
                const activeColor = theme.colors.primary;
                const inactiveColor = theme.colors.textSlate;

                return (
                  <TouchableOpacity
                    key={st.key}
                    style={S.optionRow}
                    onPress={() => handleToggleStatus(st.key)}
                    activeOpacity={0.7}
                  >
                    <View style={S.optionLeft}>
                      <View style={[S.iconBox, selected && S.iconBoxActive]}>
                        <IconComponent
                          size={20}
                          color={selected ? activeColor : inactiveColor}
                          strokeWidth={2}
                        />
                      </View>
                      <Text style={[S.optionText, selected && S.optionTextActive]}>{st.label}</Text>
                    </View>

                    {selected && <CheckIcon size={20} color={activeColor} strokeWidth={2.6} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={[S.filterFooter, { paddingBottom: Math.max(20, insets.bottom + 12) }]}>
              <TouchableOpacity style={S.btnReset} onPress={handleResetAll} activeOpacity={0.75}>
                <Text style={S.btnResetTxt}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity style={S.btnApply} onPress={onApply} activeOpacity={0.85}>
                <Text style={S.btnApplyTxt}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* PredCare Date Picker Modal */}
        {datePickerTarget !== null && (
          <PredDatePickerModal
            visible={datePickerTarget !== null}
            title={datePickerTarget === 'from' ? 'Select From Date' : 'Select To Date'}
            value={(datePickerTarget === 'from' ? fromDate : toDate) || new Date()}
            onConfirm={selectedDate => {
              if (datePickerTarget === 'from') {
                updateFilterState({ fromDate: selectedDate });
              } else if (datePickerTarget === 'to') {
                updateFilterState({ toDate: selectedDate });
              }
              setDatePickerTarget(null);
            }}
            onCancel={() => setDatePickerTarget(null)}
          />
        )}
      </Modal>
    );
  }
);

export default AppointmentFilterModal;

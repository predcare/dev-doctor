import React, { useCallback } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import S from '../../../../styled/AppointmentFilterModal.styled';
import theme from '../../../../styled/theme.styled';
import InlineCalendar from '../../../commons/InlineCalendar/InlineCalendar';
import { CalendarIcon, CheckIcon, CircleXIcon, ClockIcon, InfoCircleIcon } from '../../../ui/icons';

export type DateRangeFilter = 'today' | 'tomorrow' | 'thisweek' | 'all' | null;

export interface FilterStates {
  dateRange: DateRangeFilter;
  statuses: string[];
  fromDate: Date | null;
  toDate: Date | null;
  activeTarget: 'from' | 'to' | null;
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
    const { dateRange, statuses, fromDate, toDate, activeTarget } = filterStates;

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
          activeTarget: key === 'all' ? 'to' : null,
          ...(key !== 'all' ? { fromDate: null, toDate: null } : {}),
        });
      },
      [updateFilterState]
    );

    const handleSelectDay = useCallback(
      (day: Date) => {
        if (activeTarget === 'from') {
          updateFilterState({ fromDate: day, activeTarget: null });
        } else if (activeTarget === 'to') {
          updateFilterState({ toDate: day, activeTarget: null });
        } else {
          updateFilterState({ activeTarget: null });
        }
      },
      [activeTarget, updateFilterState]
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
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={S.sheetOverlay}>
          <View style={S.sheetContent}>
            {/* Top Sheet Drag Handle */}
            <View style={S.sheetHandle}>
              <View style={S.sheetHandleBar} />
            </View>

            {/* Modal Header */}
            <View style={S.sheetHeader}>
              <Text style={S.sheetTitle}>Schedule Filters</Text>
              <TouchableOpacity
                style={S.closeBtnCircle}
                onPress={onClose}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={S.closeBtnTxt}>✕</Text>
              </TouchableOpacity>
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

                    {/* Render FROM / TO Inputs and Target-Specific InlineCalendar */}
                    {opt.key === 'all' && selected && (
                      <View style={S.calendarInputsContainer}>
                        {/* FROM Input Group */}
                        <View style={S.inputGroup}>
                          <Text style={S.inputGroupLabel}>FROM</Text>
                          <TouchableOpacity
                            style={[
                              S.dateInputRow,
                              activeTarget === 'from' && S.dateInputRowActive,
                            ]}
                            onPress={() =>
                              updateFilterState({
                                activeTarget: activeTarget === 'from' ? null : 'from',
                              })
                            }
                            activeOpacity={0.8}
                          >
                            <View style={S.dateInputLeft}>
                              <CalendarIcon
                                size={18}
                                color={
                                  activeTarget === 'from'
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

                          {/* Inline Calendar rendered directly below FROM input */}
                          {activeTarget === 'from' && (
                            <InlineCalendar
                              selectedDate={fromDate}
                              onSelectDate={handleSelectDay}
                              initialMonth={fromDate || new Date(2026, 8, 1)}
                            />
                          )}
                        </View>

                        {/* TO Input Group */}
                        <View style={S.inputGroup}>
                          <Text style={S.inputGroupLabel}>TO</Text>
                          <TouchableOpacity
                            style={[S.dateInputRow, activeTarget === 'to' && S.dateInputRowActive]}
                            onPress={() =>
                              updateFilterState({
                                activeTarget: activeTarget === 'to' ? null : 'to',
                              })
                            }
                            activeOpacity={0.8}
                          >
                            <View style={S.dateInputLeft}>
                              <CalendarIcon
                                size={18}
                                color={
                                  activeTarget === 'to'
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

                          {/* Inline Calendar rendered directly below TO input */}
                          {activeTarget === 'to' && (
                            <InlineCalendar
                              selectedDate={toDate}
                              onSelectDate={handleSelectDay}
                              initialMonth={toDate || new Date(2026, 8, 1)}
                            />
                          )}
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

            {/* Footer Buttons */}
            <View style={S.filterFooter}>
              <TouchableOpacity style={S.btnReset} onPress={handleResetAll} activeOpacity={0.75}>
                <Text style={S.btnResetTxt}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity style={S.btnApply} onPress={onApply} activeOpacity={0.85}>
                <Text style={S.btnApplyTxt}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

AppointmentFilterModal.displayName = 'AppointmentFilterModal';
export default AppointmentFilterModal;

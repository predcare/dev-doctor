import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CommonEmptyCard from '../../components/commons/CommonEmptyCard/CommonEmptyCard';
import ExistingSlotCard from '../../components/Modules/Availability/ExistingSlotCard';
import SlotEditorCard from '../../components/Modules/Availability/SlotEditorCard';
import AvailabilitySkeleton from '../../components/Skeletons/AvailabilitySkeleton';
import ChevronLeftIcon from '../../components/ui/icons/ChevronLeftIcon';
import PlusIcon from '../../components/ui/icons/PlusIcon';
import {
  useAvailablityList,
  useDeleteAvailability,
} from '../../hooks/react-query/availability/availablity.hooks';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { showSuccessToast } from '../../lib/common/toast.utils';
import type { ProfileScreenNavigationProp, ProfileScreenRouteProp } from '../../route';
import { availabilityStyles as S } from '../../styled/DoctorAvailabilityScreen.styled';
import { theme } from '../../styled/theme.styled';
import { IMyAvailabilityDoc } from '../../typescripts/interfaces/availability.interfaces';
import { useAlertStore } from '../../zustand/stores/useAlertStore';
import { useLoadingStore } from '../../zustand/stores/useLoadingStore';

export interface AvailabilityScreenProps {
  navigation?: ProfileScreenNavigationProp;
  route?: ProfileScreenRouteProp;
}

export const AvailabilityScreen: React.FC<AvailabilityScreenProps> = ({ navigation }) => {
  const [showExistingSlots, setShowExistingSlots] = useState(true);
  const [showNewSlotForm, setShowNewSlotForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<IMyAvailabilityDoc | null>(null);

  const { showConfirm } = useAlertStore(state => state);
  const { hideLoader, showLoader } = useLoadingStore(state => state);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: availablityList,
    isFetching: isLoadingAvailablityList,
    refetch: avialRefetch,
  } = useAvailablityList();

  const { mutate: deleteAvailabilityMutation } = useDeleteAvailability();

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await avialRefetch();
    setIsRefreshing(false);
  }, []);

  const handleDeleteSlot = (id: number) => {
    showConfirm({
      title: 'Delete Availability Slot',
      message: 'Are you sure you want to delete this availability slot?',
      buttonText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        showLoader('Deleting availability slot...');
        deleteAvailabilityMutation(id, {
          onSuccess: async res => {
            hideLoader();
            if (res?.success) {
              showSuccessToast(res?.message || 'Availability slot has been deleted successfully.');
              await avialRefetch();
              hideLoader();
            } else {
              hideLoader();
            }
          },
          onError: () => {
            hideLoader();
          },
        });
      },
    });
  };

  return (
    <SafeAreaWrapper>
      <View style={S.container}>
        <View style={S.header}>
          <TouchableOpacity
            style={S.backBtn}
            onPress={() => {
              if (showNewSlotForm) {
                setShowNewSlotForm(false);
                setShowExistingSlots(true);
                setEditingSlot(null);
              } else if (navigation && navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
            activeOpacity={0.7}
          >
            <ChevronLeftIcon color={theme.colors.textSecondary} size={18} />
          </TouchableOpacity>
          <Text style={S.headerTitle}>Doctor Availability</Text>
        </View>

        <ScrollView
          style={S.scroll}
          contentContainerStyle={S.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          <TouchableOpacity
            style={S.sectionHeader}
            onPress={() => {
              if ((availablityList?.length || 0) > 0) setShowExistingSlots(!showExistingSlots);
            }}
            activeOpacity={0.75}
          >
            <Text style={S.sectionHeaderText}>
              Your Current Availability ({availablityList?.length || 0})
            </Text>
            <Text style={S.sectionHeaderIcon}>{showExistingSlots ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {showExistingSlots && (
            <View>
              {isLoadingAvailablityList ? (
                <AvailabilitySkeleton />
              ) : availablityList?.length === 0 ? (
                <CommonEmptyCard
                  title="No Availability Slots"
                  message="You haven't added any clinical sessions yet. Tap '+ Add New Slot' to start accepting patient appointments."
                />
              ) : (
                availablityList?.map((slot: IMyAvailabilityDoc) => (
                  <ExistingSlotCard
                    key={`${slot.id}-${slot?.id}`}
                    id={slot.id}
                    date_selection_mode={slot.date_selection_mode}
                    selected_dates={slot.selected_dates}
                    recurring_days={slot.recurring_days}
                    recurring_start_date={slot.recurring_start_date}
                    recurring_end_date={slot.recurring_end_date}
                    recurring_dates={slot.recurring_dates}
                    leave_dates={slot.leave_dates}
                    slot_duration={slot.slot_duration}
                    from_time={slot.from_time}
                    to_time={slot.to_time}
                    consultation_type={slot.consultation_type}
                    in_person_fee={slot.in_person_fee}
                    video_fee={slot.video_fee}
                    hide_fee={Boolean(slot.hide_fee)}
                    require_payment={Boolean(slot.require_payment)}
                    onEdit={() => {
                      setEditingSlot(slot);
                      setShowNewSlotForm(true);
                      setShowExistingSlots(false);
                    }}
                    onDelete={handleDeleteSlot}
                  />
                ))
              )}
            </View>
          )}
          {showNewSlotForm && (
            <SlotEditorCard
              slotIndex={availablityList?.length || 0}
              editingSlot={editingSlot}
              existingSlots={availablityList}
              onSave={_data => {
                setShowNewSlotForm(false);
                setEditingSlot(null);
                setShowExistingSlots(true);
              }}
              onCancel={() => {
                setEditingSlot(null);
                setShowNewSlotForm(false);
                setShowExistingSlots(true);
              }}
            />
          )}
        </ScrollView>

        {!showNewSlotForm && (
          <TouchableOpacity
            style={S.fabBtn}
            onPress={() => {
              setEditingSlot(null);
              setShowNewSlotForm(true);
              setShowExistingSlots(false);
            }}
            activeOpacity={0.8}
            accessibilityLabel="Add New Availability Slot"
          >
            <PlusIcon size={24} color={theme.colors.surface} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default AvailabilityScreen;

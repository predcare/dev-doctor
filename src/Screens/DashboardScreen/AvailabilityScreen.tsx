import React, { useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CommonEmptyCard from '../../components/commons/CommonEmptyCard/CommonEmptyCard';
import ExistingSlotCard from '../../components/Modules/Availability/ExistingSlotCard';
import SlotEditorCard from '../../components/Modules/Availability/SlotEditorCard';
import AvailabilitySkeleton from '../../components/Skeletons/AvailabilitySkeleton';
import ChevronLeftIcon from '../../components/ui/icons/ChevronLeftIcon';
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
import { useAuthStore } from '../../zustand/stores/useAuthStore';

export interface AvailabilityScreenProps {
  navigation?: ProfileScreenNavigationProp;
  route?: ProfileScreenRouteProp;
}

export const AvailabilityScreen: React.FC<AvailabilityScreenProps> = ({ navigation }) => {
  const [showExistingSlots, setShowExistingSlots] = useState(true);
  const [showNewSlotForm, setShowNewSlotForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<IMyAvailabilityDoc | null>(null);

  const { userData } = useAuthStore(state => state);
  const { showConfirm } = useAlertStore(state => state);

  const {
    data: availablityList,
    isFetching: isLoadingAvailablityList,
    refetch,
  } = useAvailablityList({
    doctorId: userData?.user_id,
  });

  const { mutate: deleteAvailabilityMutation } = useDeleteAvailability();

  const handleDeleteSlot = (id: number) => {
    showConfirm({
      title: 'Delete Availability Slot',
      message: 'Are you sure you want to delete this availability slot?',
      buttonText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        deleteAvailabilityMutation(id, {
          onSuccess: async () => {
            showSuccessToast('Availability slot has been removed.');
            await refetch();
          },
        });
      },
    });
  };

  const totalSlotsCount = availablityList?.length || 0;

  return (
    <SafeAreaWrapper>
      <View style={S.container}>
        <View style={S.header}>
          <TouchableOpacity
            style={S.backBtn}
            onPress={() => {
              if (navigation && navigation.canGoBack()) navigation.goBack();
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
          refreshControl={
            <RefreshControl
              refreshing={isLoadingAvailablityList}
              onRefresh={refetch}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          <TouchableOpacity
            style={S.sectionHeader}
            onPress={() => setShowExistingSlots(!showExistingSlots)}
            activeOpacity={0.75}
          >
            <Text style={S.sectionHeaderText}>Your Current Availability ({totalSlotsCount})</Text>
            <Text style={S.sectionHeaderIcon}>{showExistingSlots ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {showExistingSlots && (
            <View>
              {isLoadingAvailablityList ? (
                <AvailabilitySkeleton />
              ) : totalSlotsCount === 0 ? (
                <CommonEmptyCard
                  title="No Availability Slots"
                  message="You haven't added any clinical sessions yet. Tap '+ Add New Slot' to start accepting patient appointments."
                />
              ) : (
                availablityList?.map((slot: IMyAvailabilityDoc) => (
                  <ExistingSlotCard
                    key={slot.id}
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
          {!showNewSlotForm && (
            <TouchableOpacity
              style={S.addSlotBtn}
              onPress={() => {
                setEditingSlot(null);
                setShowNewSlotForm(true);
                setShowExistingSlots(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={S.addSlotBtnTxt}>+ Add New Slot</Text>
            </TouchableOpacity>
          )}

          {showNewSlotForm && (
            <SlotEditorCard
              slotIndex={totalSlotsCount}
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
      </View>
    </SafeAreaWrapper>
  );
};

export default AvailabilityScreen;

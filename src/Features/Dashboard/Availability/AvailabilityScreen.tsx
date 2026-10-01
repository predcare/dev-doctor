import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CommonEmptyCard from '../../../components/commons/CommonEmptyCard/CommonEmptyCard';
import { PlusIcon } from '../../../components/ui/icons';
import {
  useAvailablityList,
  useDeleteAvailability,
} from '../../../hooks/react-query/availability/availablity.hooks';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import { showSuccessToast } from '../../../lib/commons/toast.utils';
import availabilityStyles from '../../../styled/DoctorAvailabilityScreen.styled';
import theme from '../../../styled/theme.styled';
import { IMyAvailabilityDoc } from '../../../typescripts/interfaces/availability.interfaces';
import { useAlertStore } from '../../../zustand/stores/useAlertStore';
import { useLoadingStore } from '../../../zustand/stores/useLoadingStore';
import ExistingSlotCard from './Cards/ExistingSlotCard';
import SlotEditorCard from './Cards/SlotEditorCard';
import AvailabilitySkeleton from './Skeletons/AvailabilitySkeleton';

export const AvailabilityScreen: React.FC = () => {
  const navigation = useNavigation();
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
    if (showNewSlotForm) return
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
    <SafeAreaWrapper
      showBottomBar
      activeBottomTab="Account"
      header={
        <Header
          isBackBtn
          onBackPress={() => {
            if (showNewSlotForm) {
              setShowNewSlotForm(false);
              setShowExistingSlots(true);
              setEditingSlot(null);
            } else if (navigation && navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
          title="Doctor Availability"
          description="Manage your availability"
        />
      }
    >
      <View style={availabilityStyles.container}>
        <ScrollView
          style={availabilityStyles.scroll}
          contentContainerStyle={availabilityStyles.scrollContent}
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
            style={availabilityStyles.sectionHeader}
            onPress={() => {
              if ((availablityList?.length || 0) > 0) setShowExistingSlots(!showExistingSlots);
            }}
            activeOpacity={0.75}
          >
            <Text style={availabilityStyles.sectionHeaderText}>
              Your Current Availability ({availablityList?.length || 0})
            </Text>
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
            style={availabilityStyles.fabBtn}
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

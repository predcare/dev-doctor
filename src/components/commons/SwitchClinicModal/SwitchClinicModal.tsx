import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    Animated,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { queryClient } from '../../../components/providers/ReactQueryProvider';
import { useDoctorClinics, useSwitchClinic } from '../../../hooks/react-query/profile/profile.hooks';
import { showErrorToast, showInfoToast, showSuccessToast } from '../../../lib/commons/toast.utils';
import { resetRoot } from '../../../navigation/navigationRef';
import { AppRoute } from '../../../route';
import { switchClinicModalStyles as styles } from '../../../styled/SwitchClinicModal.styled';
import { useAuthStore } from '../../../zustand/stores/useAuthStore';
import { useLoadingStore } from '../../../zustand/stores/useLoadingStore';
import { useSwitchClinicStore } from '../../../zustand/stores/useSwitchClinicStore';
import CrossIcon from '../../ui/icons/CrossIcon';

const ClinicListSkeleton = () => {
    const pulse = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1, duration: 650, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 0.4, duration: 650, useNativeDriver: true }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [pulse]);

    return (
        <>
            {[0, 1, 2].map(item => (
                <Animated.View key={item} style={[styles.skeletonRow, { opacity: pulse }]} />
            ))}
        </>
    );
};

export const SwitchClinicModal: React.FC = () => {
    const insets = useSafeAreaInsets();
    const visible = useSwitchClinicStore(state => state.visible);
    const close = useSwitchClinicStore(state => state.close);
    const { showLoader, hideLoader } = useLoadingStore(state => state);
    const userData = useAuthStore(state => state.userData);
    const currentClinicId = String(userData?.clinic?.id || '');
    const [selectedId, setSelectedId] = useState(currentClinicId);

    const { data: clinics, isPending } = useDoctorClinics({
        enabled: visible,
    });
    const { mutate: switchClinic, isPending: isSwitchingClinic } = useSwitchClinic();

    const handleSwitchClinic = () => {
        if (isSwitchingClinic) return;
        if (!selectedId) return showErrorToast('Please select a clinic');
        if (selectedId === currentClinicId) {
            showInfoToast('You are already in this clinic', 'info');
            return close();
        };
        const payload = {
            clinic_id: selectedId,
        };
        showLoader('Switching clinic...');
        switchClinic(payload, {
            onSuccess: () => {
                showSuccessToast('Clinic switched successfully');
                setTimeout(() => {
                    queryClient.clear();
                    close();
                    resetRoot(AppRoute.SPLASH);
                    hideLoader();
                }, 2000);
            },
            onError: () => {
                hideLoader();
                showErrorToast('Failed to switch clinic');
            },
        });
    };

    useLayoutEffect(() => {
        if (!visible || !clinics?.length) return;
        const match = clinics?.find(clinic => String(clinic.id) === currentClinicId);
        if (match?.id) {
            setSelectedId(String(match?.id));
        }
    }, [visible, clinics, currentClinicId]);

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
            <View style={styles.modalContainer}>
                <TouchableWithoutFeedback onPress={close}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <View style={[styles.bottomSheet, { paddingBottom: Math.max(insets.bottom + 16, 24) }]}>
                    <View style={styles.dragHandleContainer}>
                        <View style={styles.dragHandle} />
                    </View>

                    <View style={styles.header}>
                        <View style={styles.headerTitleRow}>
                            <Text style={styles.title}>Switch clinic</Text>
                            <TouchableOpacity style={styles.closeBtn} onPress={close} activeOpacity={0.7}>
                                <Text style={styles.closeTxt}>
                                    <CrossIcon color="#000" size={24} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.subtitle}>Choose the clinic you want to work in.</Text>
                    </View>

                    {isPending ? (
                        <ClinicListSkeleton />
                    ) : (
                        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                            {clinics?.length === 0 ? (
                                <Text style={styles.emptyText}>No clinic found</Text>
                            ) : (
                                clinics?.map(clinic => {
                                    const id = String(clinic.id);
                                    const selected = selectedId === id;
                                    return (
                                        <TouchableOpacity
                                            key={id}
                                            style={[styles.clinicRow, selected && styles.clinicRowSelected]}
                                            onPress={() => setSelectedId(id)}
                                            activeOpacity={0.85}
                                        >
                                            <Text style={styles.clinicName} numberOfLines={2}>
                                                {clinic.name}
                                            </Text>
                                            <View style={[styles.radioCircle, selected && styles.radioCircleSelected]}>
                                                {selected ? <View style={styles.radioInner} /> : null}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })
                            )}
                        </ScrollView>
                    )}

                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={handleSwitchClinic}
                        disabled={isSwitchingClinic}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.confirmButtonText}>Switch</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default SwitchClinicModal;

import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import bookAppointmentStyles from '../../../../styled/BookAppointmentScreen.styled';

interface BookingPatientSkeletonProps {
  count?: number;
}

export const BookingPatientSkeleton: React.FC<BookingPatientSkeletonProps> = ({ count = 4 }) => {
  const pulseAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 650,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={`sk-${index}`}
          style={[bookAppointmentStyles.patientItem, bookAppointmentStyles.skeletonItem, { opacity: pulseAnim }]}
        >
          <View style={bookAppointmentStyles.skeletonAvatar} />
          <View style={bookAppointmentStyles.patientDetails}>
            <View style={[bookAppointmentStyles.skeletonLine, { width: '60%', height: 14, marginBottom: 8 }]} />
            <View style={[bookAppointmentStyles.skeletonLine, { width: '40%', height: 11, marginBottom: 6 }]} />
            <View style={[bookAppointmentStyles.skeletonLine, { width: '50%', height: 11 }]} />
          </View>
        </Animated.View>
      ))}
    </>
  );
};

export default BookingPatientSkeleton;

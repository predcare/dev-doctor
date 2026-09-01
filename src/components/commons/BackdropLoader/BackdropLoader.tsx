import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../styled/theme.styled';
import { useLoadingStore } from '../../../zustand/stores/useLoadingStore';

export const BackdropLoader: React.FC = () => {
  const isLoading = useLoadingStore(state => state.isLoading);
  const message = useLoadingStore(state => state.message);

  if (!isLoading) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isLoading}
      statusBarTranslucent
      hardwareAccelerated
      supportedOrientations={[
        'portrait',
        'portrait-upside-down',
        'landscape',
        'landscape-left',
        'landscape-right',
      ]}
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.loaderCard}>
          <View style={styles.loaderCircle}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {message || 'Please wait...'}
            </Text>

            <Text style={styles.subtitle}>Processing...</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',

    justifyContent: 'center',
    alignItems: 'center',

    // Stronger backdrop
    backgroundColor: 'rgba(2, 6, 23, 0.72)',
  },

  loaderCard: {
    flexDirection: 'row',
    alignItems: 'center',

    width: 'auto',
    minWidth: 230,
    maxWidth: 320,

    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: theme.colors.surface,
    borderRadius: 18,

    elevation: 15,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 18,
  },

  loaderCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(59, 130, 246, 0.10)',

    marginRight: 14,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },

  subtitle: {
    marginTop: 3,

    fontSize: 12,
    fontWeight: '400',

    color: '#64748B',
    lineHeight: 17,
  },
});

export default BackdropLoader;

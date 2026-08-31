import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../../styled/theme.styled';

export interface StepIndicatorProps {
  step: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = React.memo(({ step }) => {
  const steps = [
    { n: 1, l: 'Basic Info' },
    { n: 2, l: 'Medical' },
    { n: 3, l: 'Contact' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.stepRow}>
        {steps.map((st, i) => {
          const active = st.n === step;
          const done = st.n < step;
          return (
            <React.Fragment key={st.n}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    done && styles.stepCircleDone,
                    active && styles.stepCircleActive,
                  ]}
                >
                  <Text style={[styles.stepN, (done || active) && styles.stepNActive]}>
                    {done ? '✓' : st.n}
                  </Text>
                </View>
                <Text
                  style={[styles.stepL, done && styles.stepLDone, active && styles.stepLActive]}
                  numberOfLines={1}
                >
                  {st.l}
                </Text>
              </View>
              {i < steps.length - 1 && (
                <View style={styles.lineTrack}>
                  <View style={[styles.stepLine, done && styles.stepLineDone]} />
                </View>
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 2,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    width: 74,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: theme.colors.surfaceBorder,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleDone: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  stepCircleActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  stepN: {
    fontSize: 14,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
  },
  stepNActive: {
    color: theme.colors.surface,
  },
  stepL: {
    fontSize: 11,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },
  stepLDone: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },
  stepLActive: {
    color: theme.colors.dark,
    fontWeight: theme.fontWeight.bold,
  },
  lineTrack: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  stepLine: {
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: theme.colors.surfaceBorder,
    width: '100%',
  },
  stepLineDone: {
    backgroundColor: theme.colors.primary,
  },
});

export default StepIndicator;

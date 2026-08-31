import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '../../styled/theme.styled';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  numInputs?: number;
  disabled?: boolean;
  autoFocus?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value = '',
  onChange,
  numInputs = 6,
  disabled = false,
  autoFocus = true,
}) => {
  const inputRef = useRef<any>(null);
  const [isFocused, setIsFocused] = useState(false);

  const cleanValue = value.replace(/\D/g, '').slice(0, numInputs);
  const activeIndex =
    cleanValue.length < numInputs ? cleanValue.length : numInputs - 1;

  const handlePress = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  const handleChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, numInputs);
    onChange(cleaned);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      disabled={disabled}
      style={styles.otpContainer}
      accessibilityRole="button"
      accessibilityLabel="OTP Input"
    >
      <TextInput
        ref={inputRef}
        style={styles.fullCoverInput}
        keyboardType="number-pad"
        maxLength={numInputs}
        value={cleanValue}
        onChangeText={handleChange}
        editable={!disabled}
        autoFocus={autoFocus}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        caretHidden
        autoComplete={Platform.OS === 'ios' ? 'one-time-code' : 'sms-otp'}
        textContentType={Platform.OS === 'ios' ? 'oneTimeCode' : 'none'}
      />

      {Array.from({ length: numInputs }).map((_, index) => {
        const digit = cleanValue[index] || '';
        const isActive = isFocused && index === activeIndex;

        return (
          <View
            key={index}
            pointerEvents="none"
            style={[
              styles.otpInput,
              styles.centerBox,
              !!digit && styles.otpInputFilled,
              isActive && styles.otpInputFocused,
            ]}
          >
            {digit ? (
              <Text style={styles.digitText}>{digit}</Text>
            ) : isActive ? (
              <BlinkingCursor />
            ) : null}
          </View>
        );
      })}
    </TouchableOpacity>
  );
};

function BlinkingCursor() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return <Animated.View style={[styles.cursorBar, { opacity }]} />;
}

export default OtpInput;

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    width: '100%',
    position: 'relative',
  },
  fullCoverInput: {
    ...StyleSheet.absoluteFill,
    opacity: 0.01,
    zIndex: 10,
    fontSize: 1,
    color: 'transparent',
  },
  otpInput: {
    width: 44,
    height: 52,
    borderWidth: 2,
    borderColor: theme.colors.inputBorder,
    borderRadius: 12,
    backgroundColor: theme.colors.inputBg,
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInputFilled: {
    borderColor: theme.colors.brandBlue,
    backgroundColor: theme.colors.brandBlueSoft,
  },
  otpInputFocused: {
    borderColor: theme.colors.brandBlue,
    borderWidth: 2.5,
    backgroundColor: theme.colors.brandBlueSoft,
    shadowColor: theme.colors.brandBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  digitText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.brandBlue,
  },
  cursorBar: {
    width: 2,
    height: 22,
    backgroundColor: theme.colors.brandBlue,
    borderRadius: 1,
  },
});

import React, { useEffect, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
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
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const digits = Array.from({ length: numInputs }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus && !disabled) {
      const timer = setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocus, disabled]);

  const handleChangeText = (text: string, index: number) => {
    let cleanText = text.replace(/\D/g, '');

    if (
      cleanText.length > numInputs &&
      digits[index] &&
      cleanText.startsWith(digits[index])
    ) {
      cleanText = cleanText.slice(digits[index].length);
    }

    if (cleanText.length > 1) {
      const pasted = cleanText.slice(0, numInputs);

      if (pasted.length === numInputs) {
        onChange(pasted);
        setTimeout(() => {
          inputsRef.current[numInputs - 1]?.focus();
        }, 50);
      } else {
        const newDigits = [...digits];
        for (let i = 0; i < pasted.length && index + i < numInputs; i++) {
          newDigits[index + i] = pasted[i];
        }
        const updatedOtp = newDigits.join('');
        onChange(updatedOtp);
        const focusIdx = Math.min(index + pasted.length, numInputs - 1);
        setTimeout(() => {
          inputsRef.current[focusIdx]?.focus();
        }, 50);
      }
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleanText;
    const newOtpStr = newDigits.join('');
    onChange(newOtpStr);

    if (cleanText && index < numInputs - 1) {
      setTimeout(() => {
        inputsRef.current[index + 1]?.focus();
      }, 10);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      onChange(newDigits.join(''));
      setTimeout(() => {
        inputsRef.current[index - 1]?.focus();
      }, 10);
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: numInputs }).map((_, index) => (
        <TextInput
          key={index}
          ref={ref => {
            inputsRef.current[index] = ref;
          }}
          style={[styles.input, digits[index] ? styles.inputFilled : null]}
          keyboardType="number-pad"
          value={digits[index]}
          onChangeText={text => handleChangeText(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          editable={!disabled}
          selectTextOnFocus
          maxLength={numInputs}
          autoFocus={autoFocus && index === 0}
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
        />
      ))}
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    width: '100%',
  },
  input: {
    width: 44,
    height: 52,
    borderWidth: 2,
    borderColor: theme.colors.inputBorder,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: theme.colors.inputBg,
    color: '#000000',
  },
  inputFilled: {
    borderColor: theme.colors.brandBlue,
    backgroundColor: theme.colors.brandBlueSoft,
  },
});

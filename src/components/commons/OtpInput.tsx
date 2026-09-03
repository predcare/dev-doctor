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
    const cleanText = text.replace(/\D/g, '');

    if (cleanText.length > 1) {
      let pasted = cleanText;
      if (digits[index] && pasted.startsWith(digits[index]) && pasted.length > numInputs) {
        pasted = pasted.slice(digits[index].length);
      }
      pasted = pasted.slice(0, numInputs);

      if (pasted.length === numInputs) {
        onChange(pasted);
        inputsRef.current[numInputs - 1]?.focus();
      } else {
        const newDigits = [...digits];
        for (let i = 0; i < pasted.length && index + i < numInputs; i++) {
          newDigits[index + i] = pasted[i];
        }
        const updatedOtp = newDigits.join('');
        onChange(updatedOtp);
        const focusIdx = Math.min(index + pasted.length - 1, numInputs - 1);
        inputsRef.current[focusIdx]?.focus();
      }
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleanText;
    const newOtpStr = newDigits.join('');
    onChange(newOtpStr);

    if (cleanText && index < numInputs - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      onChange(newDigits.join(''));
      inputsRef.current[index - 1]?.focus();
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

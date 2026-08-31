import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import OtpInput from '../../components/commons/OtpInput';
import { MailIcon, PhoneIcon } from '../../components/ui/icons';
import {
  LoginFormSchema,
  TLoginFormSchemaType,
} from '../../lib/schemas/auth.schema';
import { Assets } from '../../resources/assets';
import type {
  LoginScreenNavigationProp,
  LoginScreenRouteProp,
} from '../../route';
import { loginStyles } from '../../styled/LoginScreen.styled';
import { theme } from '../../styled/theme.styled';
import { LoginMode } from '../../typescripts/types/common.types';

export interface LoginScreenProps {
  navigation?: LoginScreenNavigationProp;
  route?: LoginScreenRouteProp;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  navigation: propNavigation,
}) => {
  const defaultNavigation = useNavigation<LoginScreenNavigationProp>();
  const navigation = propNavigation || defaultNavigation;
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 32, 480);

  const [loginMode, setLoginMode] = useState<LoginMode>('mobile');
  const [otpSent, setOtpSent] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<TLoginFormSchemaType>({
    resolver: yupResolver(LoginFormSchema),
    defaultValues: {
      mode: 'mobile',
      identifier: '9876543210',
      otp: '',
    },
    mode: 'onChange',
  });

  const identifier = watch('identifier') || '';
  const otpValue = watch('otp') || '';

  const maskedIdentifier = () => {
    if (!identifier) return '';
    if (loginMode === 'email') {
      const [name, domain] = identifier.split('@');
      if (!name || !domain) return identifier;
      return `${name.slice(0, 2)}${'*'.repeat(
        Math.max(0, name.length - 2),
      )}@${domain}`;
    }
    return `+91 ${identifier.slice(0, 2)}****${identifier.slice(-2)}`;
  };

  const switchMode = (mode: LoginMode) => {
    if (otpSent) return;
    setLoginMode(mode);
    clearErrors();
    setValue('mode', mode, { shouldValidate: false });
    setValue(
      'identifier',
      mode === 'mobile' ? '9876543210' : 'doctor@example.com',
      {
        shouldValidate: false,
      },
    );
    setValue('otp', '', { shouldValidate: false });
    setOtpSent(false);
  };

  const onSubmitSendOtp = (_data: TLoginFormSchemaType) => {
    setValue('otp', '', { shouldValidate: false });
    setOtpSent(true);
  };

  const onSubmitVerifyOtp = (_data: TLoginFormSchemaType) => {
    const nav = navigation || defaultNavigation;
    if (nav) {
      if (typeof nav.reset === 'function') {
        nav.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else if (typeof nav.navigate === 'function') {
        nav.navigate('MainTabs');
      }
    }
  };

  const handlePrimaryPress = () => {
    if (!otpSent) {
      handleSubmit(onSubmitSendOtp)();
    } else {
      handleSubmit(onSubmitVerifyOtp)();
    }
  };

  const isVerifyDisabled = otpSent && otpValue.length !== 6;

  return (
    <SafeAreaWrapper
      edges={['top', 'left', 'right', 'bottom']}
      backgroundColor={theme.colors.brandBlue}
      barStyle="light-content"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={loginStyles.keyboardAvoid}
      >
        <ScrollView
          style={loginStyles.scrollContainer}
          contentContainerStyle={loginStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={loginStyles.logoContainer}>
            <Image
              source={Assets.logo2}
              style={loginStyles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={[loginStyles.card, { width: cardWidth }]}>
            <View style={loginStyles.titleContainer}>
              <Text style={loginStyles.title}>
                {!otpSent ? 'Welcome, Doctor' : 'Verify OTP'}
              </Text>
              <Text style={loginStyles.subtitle}>
                {otpSent
                  ? loginMode === 'mobile'
                    ? `OTP sent via SMS & WhatsApp to ${maskedIdentifier()}`
                    : `OTP sent to ${maskedIdentifier()}`
                  : 'Choose your preferred login method'}
              </Text>
            </View>

            {!otpSent ? (
              <>
                <View style={loginStyles.tabContainer}>
                  <Pressable
                    style={({ pressed }) => [
                      loginStyles.tabButton,
                      loginMode === 'mobile' && loginStyles.tabButtonActive,
                      pressed && { opacity: 0.8 },
                    ]}
                    onPress={() => switchMode('mobile')}
                  >
                    <PhoneIcon
                      size={18}
                      color={
                        loginMode === 'mobile'
                          ? theme.colors.surface
                          : theme.colors.textMuted
                      }
                    />
                    <Text
                      style={[
                        loginStyles.tabText,
                        loginMode === 'mobile' && loginStyles.tabTextActive,
                      ]}
                    >
                      Mobile
                    </Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      loginStyles.tabButton,
                      loginMode === 'email' && loginStyles.tabButtonActive,
                      pressed && { opacity: 0.8 },
                    ]}
                    onPress={() => switchMode('email')}
                  >
                    <MailIcon
                      size={18}
                      color={
                        loginMode === 'email'
                          ? theme.colors.surface
                          : theme.colors.textMuted
                      }
                    />
                    <Text
                      style={[
                        loginStyles.tabText,
                        loginMode === 'email' && loginStyles.tabTextActive,
                      ]}
                    >
                      Email
                    </Text>
                  </Pressable>
                </View>
                <View style={loginStyles.inputSection}>
                  <Text style={loginStyles.label}>
                    {loginMode === 'mobile' ? 'Mobile Number' : 'Email Address'}
                  </Text>
                  <View
                    style={[
                      loginStyles.inputRow,
                      errors.identifier ? loginStyles.inputError : null,
                    ]}
                  >
                    <View style={loginStyles.inputIcon}>
                      {loginMode === 'mobile' ? (
                        <PhoneIcon size={20} color="#666666" />
                      ) : (
                        <MailIcon size={20} color="#666666" />
                      )}
                    </View>
                    <Controller
                      control={control}
                      name="identifier"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          key={loginMode}
                          style={loginStyles.inputField}
                          placeholder={
                            loginMode === 'mobile'
                              ? 'Enter 10-digit mobile number'
                              : 'doctor@example.com'
                          }
                          placeholderTextColor="#999999"
                          keyboardType={
                            loginMode === 'mobile'
                              ? 'phone-pad'
                              : 'email-address'
                          }
                          maxLength={loginMode === 'mobile' ? 10 : undefined}
                          autoCapitalize="none"
                          value={value}
                          onChangeText={text => {
                            if (loginMode === 'mobile') {
                              const cleanNum = text
                                .replace(/\D/g, '')
                                .slice(0, 10);
                              onChange(cleanNum);
                            } else {
                              onChange(text);
                            }
                          }}
                        />
                      )}
                    />
                  </View>
                  {errors.identifier ? (
                    <Text style={loginStyles.errorText}>
                      {errors.identifier.message}
                    </Text>
                  ) : null}
                </View>
              </>
            ) : (
              <View style={loginStyles.otpSection}>
                <Text style={loginStyles.label}>Enter 6-digit OTP</Text>
                <Controller
                  control={control}
                  name="otp"
                  render={({ field: { onChange, value = '' } }) => (
                    <OtpInput
                      value={value}
                      onChange={val => {
                        onChange(val);
                        if (val.length === 6) {
                          Keyboard.dismiss();
                          handleSubmit(onSubmitVerifyOtp)();
                        }
                      }}
                      numInputs={6}
                    />
                  )}
                />
                {errors.otp ? (
                  <Text style={loginStyles.errorText}>
                    {errors.otp.message}
                  </Text>
                ) : null}
                <View style={loginStyles.resendContainer}>
                  <Text style={loginStyles.resendText}>
                    Didn't receive OTP?{' '}
                  </Text>
                  <Pressable
                    onPress={() => handleSubmit(onSubmitSendOtp)()}
                    style={({ pressed }) => [pressed && { opacity: 0.6 }]}
                  >
                    <Text style={loginStyles.resendLink}>Resend</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    loginStyles.changeNumberBtn,
                    pressed && { opacity: 0.6 },
                  ]}
                  onPress={() => {
                    setOtpSent(false);
                    setValue('otp', '');
                  }}
                >
                  <Text style={loginStyles.changeNumberText}>
                    ← Change{' '}
                    {loginMode === 'mobile' ? 'Mobile Number' : 'Email'}
                  </Text>
                </Pressable>
              </View>
            )}
            <Pressable
              disabled={isVerifyDisabled}
              style={({ pressed }) => [
                loginStyles.primaryButton,
                isVerifyDisabled && loginStyles.buttonDisabled,
                pressed && !isVerifyDisabled && { opacity: 0.85 },
              ]}
              onPress={handlePrimaryPress}
            >
              {!otpSent ? (
                <Text style={loginStyles.primaryButtonText}>Send OTP</Text>
              ) : (
                <View style={loginStyles.verifyBtnInner}>
                  <Text style={loginStyles.verifyBtnIcon}>✓</Text>
                  <Text style={loginStyles.primaryButtonText}>Verify OTP</Text>
                </View>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

export default LoginScreen;

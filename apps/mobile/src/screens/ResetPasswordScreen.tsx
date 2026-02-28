import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { resetPassword } from '../services/auth';
import { useToast } from '../contexts/ToastContext';
import type { AuthStackParamList } from '../navigation/types';
import { colors, tokens } from '../theme';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;
type ResetPasswordRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;

interface PasswordStrength {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecial: boolean;
}

function checkPassword(pwd: string): PasswordStrength {
  return {
    minLength: pwd.length >= 8,
    hasUppercase: /[A-Z]/.test(pwd),
    hasLowercase: /[a-z]/.test(pwd),
    hasSpecial: /[^a-zA-Z0-9]/.test(pwd),
  };
}

function isPasswordValid(strength: PasswordStrength): boolean {
  return Object.values(strength).every(Boolean);
}

function Requirement({ met, text }: { met: boolean; text: string }) {
  return (
    <View style={reqStyles.row}>
      <MaterialIcons
        name={met ? 'check-circle' : 'radio-button-unchecked'}
        size={14}
        color={met ? colors.success : colors.textLight}
      />
      <Text style={[reqStyles.text, met && reqStyles.textMet]}>{text}</Text>
    </View>
  );
}

const reqStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  text: {
    fontSize: tokens.typography.small.size,
    color: colors.textLight,
  },
  textMet: {
    color: colors.success,
  },
});

export function ResetPasswordScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResetPasswordRouteProp>();
  const { email } = route.params;

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const passwordStrength = checkPassword(newPassword);

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!code.trim()) {
      newErrors.code = 'Digite o código recebido';
    } else if (code.trim().length !== 6) {
      newErrors.code = 'O código deve ter 6 dígitos';
    }

    if (!newPassword) {
      newErrors.newPassword = 'Digite a nova senha';
    } else if (!isPasswordValid(passwordStrength)) {
      newErrors.newPassword = 'A senha não atende aos requisitos mínimos';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não conferem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await resetPassword(email, code.trim(), newPassword);
      showToast('Senha redefinida com sucesso!', 'success');
      navigation.navigate('Login');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao redefinir senha';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Redefinir senha</Text>
          <Text style={styles.subtitle}>
            Digite o código enviado para {email} e sua nova senha
          </Text>

          <View style={styles.form}>
            {/* Código */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.codeInput, errors.code && styles.inputError]}
                placeholder="000000"
                placeholderTextColor={colors.textLight}
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={(v) => { setCode(v); clearFieldError('code'); }}
                editable={!isLoading}
              />
              {errors.code && <Text style={styles.fieldError}>{errors.code}</Text>}
            </View>

            {/* Nova senha */}
            <View style={styles.inputGroup}>
              <View style={[styles.passwordContainer, errors.newPassword && styles.inputError]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Nova senha"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry={!showPassword}
                  value={newPassword}
                  onChangeText={(v) => { setNewPassword(v); clearFieldError('newPassword'); }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(prev => !prev)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={22}
                    color={colors.textLight}
                  />
                </TouchableOpacity>
              </View>
              {errors.newPassword && (
                <Text style={styles.fieldError}>{errors.newPassword}</Text>
              )}
              {(passwordFocused || newPassword.length > 0) && (
                <View style={styles.requirements}>
                  <Requirement met={passwordStrength.minLength} text="Mínimo 8 caracteres" />
                  <Requirement met={passwordStrength.hasUppercase} text="Letra maiúscula (A-Z)" />
                  <Requirement met={passwordStrength.hasLowercase} text="Letra minúscula (a-z)" />
                  <Requirement met={passwordStrength.hasSpecial} text="Caractere especial (!@#$...)" />
                </View>
              )}
            </View>

            {/* Confirmar nova senha */}
            <View style={styles.inputGroup}>
              <View style={[styles.passwordContainer, errors.confirmPassword && styles.inputError]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirmar nova senha"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(v) => { setConfirmPassword(v); clearFieldError('confirmPassword'); }}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(prev => !prev)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={showConfirmPassword ? 'visibility-off' : 'visibility'}
                    size={22}
                    color={colors.textLight}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Redefinir senha</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backLink}
            onPress={handleBackToLogin}
            disabled={isLoading}
          >
            <Text style={styles.backLinkText}>Voltar para o login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontSize: tokens.typography.display.size,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 4,
  },
  codeInput: {
    height: 64,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 28,
    fontWeight: 'bold',
    backgroundColor: colors.background,
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 8,
  },
  inputError: {
    borderColor: colors.error,
  },
  passwordContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  eyeButton: {
    padding: 4,
  },
  fieldError: {
    fontSize: tokens.typography.small.size,
    color: colors.error,
    marginLeft: 4,
  },
  requirements: {
    marginTop: 8,
    paddingHorizontal: 4,
    gap: 2,
  },
  button: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: tokens.typography.h2.size,
    fontWeight: '600',
  },
  backLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  backLinkText: {
    fontSize: tokens.typography.caption.size,
    color: colors.primary,
    fontWeight: '600',
  },
});

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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/auth-store';
import type { AuthStackParamList } from '../navigation/types';
import { colors, tokens } from '../theme';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

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

export function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isLoading, error, clearError } = useAuthStore();

  const passwordStrength = checkPassword(password);

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

    if (!name.trim()) newErrors.name = 'Nome é obrigatório';

    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'E-mail inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!isPasswordValid(passwordStrength)) {
      newErrors.password = 'A senha não atende aos requisitos mínimos';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não conferem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      await register(name.trim(), email.trim(), password);
    } catch {
      // Error is handled by the store
    }
  };

  const handleNavigateToLogin = () => {
    clearError();
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
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Preencha seus dados para começar</Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            {/* Nome */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Nome completo"
                placeholderTextColor={colors.textLight}
                autoCapitalize="words"
                autoCorrect={false}
                value={name}
                onChangeText={(v) => { setName(v); clearFieldError('name'); }}
                editable={!isLoading}
              />
              {errors.name && <Text style={styles.fieldError}>{errors.name}</Text>}
            </View>

            {/* E-mail */}
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="E-mail"
                placeholderTextColor={colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={(v) => { setEmail(v); clearFieldError('email'); }}
                editable={!isLoading}
              />
              {errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
            </View>

            {/* Senha */}
            <View style={styles.inputGroup}>
              <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Senha"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(v) => { setPassword(v); clearFieldError('password'); }}
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
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}
              {(passwordFocused || password.length > 0) && (
                <View style={styles.requirements}>
                  <Requirement met={passwordStrength.minLength} text="Mínimo 8 caracteres" />
                  <Requirement met={passwordStrength.hasUppercase} text="Letra maiúscula (A-Z)" />
                  <Requirement met={passwordStrength.hasLowercase} text="Letra minúscula (a-z)" />
                  <Requirement met={passwordStrength.hasSpecial} text="Caractere especial (!@#$...)" />
                </View>
              )}
            </View>

            {/* Confirmar Senha */}
            <View style={styles.inputGroup}>
              <View style={[styles.passwordContainer, errors.confirmPassword && styles.inputError]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirmar senha"
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
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Criar conta</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={handleNavigateToLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginLinkText}>
              Já tem uma conta?{' '}
              <Text style={styles.loginLinkHighlight}>Faça login</Text>
            </Text>
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
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: tokens.typography.caption.size,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 4,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: colors.background,
    color: colors.textPrimary,
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
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: tokens.typography.caption.size,
    color: colors.textSecondary,
  },
  loginLinkHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },
});

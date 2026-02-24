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
        color={met ? '#2ECC71' : '#bbb'}
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
    fontSize: 12,
    color: '#999',
  },
  textMet: {
    color: '#2ECC71',
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
                placeholderTextColor="#999"
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
                  placeholderTextColor="#999"
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
                    color="#999"
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
                  placeholderTextColor="#999"
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
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
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
    backgroundColor: '#fff',
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 28,
    fontWeight: 'bold',
    backgroundColor: '#fafafa',
    color: '#1a1a1a',
    textAlign: 'center',
    letterSpacing: 8,
  },
  inputError: {
    borderColor: '#c62828',
  },
  passwordContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  eyeButton: {
    padding: 4,
  },
  fieldError: {
    fontSize: 12,
    color: '#c62828',
    marginLeft: 4,
  },
  requirements: {
    marginTop: 8,
    paddingHorizontal: 4,
    gap: 2,
  },
  button: {
    height: 56,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  backLinkText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});

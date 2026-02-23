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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { requestPasswordReset } from '../services/auth';
import { useToast } from '../contexts/ToastContext';
import type { AuthStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (!email.trim()) {
      showToast('Digite seu e-mail', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showToast('Digite um e-mail válido', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await requestPasswordReset(email.trim());
      showToast('Código enviado para seu e-mail', 'success');
      navigation.navigate('ResetPassword', { email: email.trim() });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao enviar código';
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
      <View style={styles.content}>
        <Text style={styles.title}>Esqueceu a senha?</Text>
        <Text style={styles.subtitle}>
          Digite seu e-mail e enviaremos um código para redefinir sua senha
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Enviar código</Text>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
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
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#1a1a1a',
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

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { colors, tokens } from '../theme';
import type { AppStackParamList } from '../navigation/types';
import * as patientService from '../services/patients';
import { isApiError } from '../services/api';
import { ConfirmDialog } from '../components';
import { useToast } from '../contexts/ToastContext';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'PatientForm'
>;
type PatientFormRouteProp = RouteProp<AppStackParamList, 'PatientForm'>;

interface PatientFormData {
  name: string;
  phone: string;
  notes: string;
}

export function PatientFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PatientFormRouteProp>();
  const patientId = route.params?.patientId;
  const isEditMode = !!patientId;

  const { showToast } = useToast();
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEditMode);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    if (isEditMode && patientId) {
      loadPatientData(patientId);
    }
  }, [isEditMode, patientId]);

  const loadPatientData = async (id: string) => {
    try {
      const patient = await patientService.getPatient(id);
      setIsActive(patient.isActive);
      setFormData({
        name: patient.name,
        phone: patient.phone ? formatPhone(patient.phone) : '',
        notes: patient.notes || '',
      });
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os dados do paciente');
      navigation.goBack();
    } finally {
      setIsLoadingData(false);
    }
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) {
      return numbers.length ? `(${numbers}` : '';
    }
    if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleChange = (field: keyof PatientFormData, value: string) => {
    if (field === 'phone') {
      setFormData(prev => ({ ...prev, phone: formatPhone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const getPhoneDigits = (phone: string): string => {
    return phone.replace(/\D/g, '');
  };

  const validateForm = (): boolean => {
    if (!isEditMode && !formData.name.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return false;
    }

    const phoneDigits = getPhoneDigits(formData.phone);
    if (phoneDigits.length > 0 && phoneDigits.length < 10) {
      Alert.alert(
        'Erro',
        'Telefone deve ter pelo menos 10 dígitos (DDD + número)'
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const phoneDigits = getPhoneDigits(formData.phone);

      if (isEditMode && patientId) {
        await patientService.updatePatient(patientId, {
          phone: phoneDigits || null,
          notes: formData.notes.trim() || null,
        });
      } else {
        await patientService.createPatient({
          name: formData.name.trim(),
          phone: phoneDigits || undefined,
          notes: formData.notes.trim() || undefined,
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error('Submit error:', error);
      let message = isEditMode
        ? 'Não foi possível atualizar o paciente'
        : 'Não foi possível cadastrar o paciente';
      if (isApiError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      Alert.alert('Erro', message);
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    console.log('handleDelete called, patientId:', patientId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!patientId) return;

    setIsDeleting(true);
    try {
      const result = await patientService.deletePatient(patientId);
      if (result.action === 'deactivated') {
        showToast('Paciente desativado (possui histórico de consultas)', 'info');
      } else {
        showToast('Paciente excluído com sucesso', 'success');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Delete error:', error);
      let message = 'Não foi possível excluir o paciente';
      if (isApiError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      showToast(message, 'error');
      setIsDeleting(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (isLoadingData) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Editar Paciente' : 'Novo Paciente'}
          </Text>
          {isEditMode && !isActive && (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveBadgeText}>Inativo</Text>
            </View>
          )}
        </View>
        {isEditMode && isActive ? (
          <TouchableOpacity
            style={styles.deleteHeaderButton}
            onPress={handleDelete}
            disabled={isLoading || isDeleting}
            activeOpacity={0.6}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons
              name="delete-outline"
              size={24}
              color={
                isLoading || isDeleting ? colors.textLight : colors.secondary
              }
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informações do Paciente</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nome completo {!isEditMode && '*'}
              </Text>
              {isEditMode ? (
                <View style={[styles.input, styles.inputDisabled]}>
                  <Text style={styles.inputDisabledText}>{formData.name}</Text>
                </View>
              ) : (
                <TextInput
                  style={styles.input}
                  placeholder="Digite o nome do paciente"
                  placeholderTextColor={colors.textLight}
                  value={formData.name}
                  onChangeText={value => handleChange('name', value)}
                  editable={!isLoading}
                  autoCapitalize="words"
                />
              )}
              {isEditMode && (
                <Text style={styles.readOnlyHint}>
                  O nome não pode ser alterado
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                placeholder="(00) 00000-0000"
                placeholderTextColor={colors.textLight}
                value={formData.phone}
                onChangeText={value => handleChange('phone', value)}
                keyboardType="phone-pad"
                editable={!isLoading && !isDeleting && isActive}
                maxLength={15}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observações</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Informações adicionais sobre o paciente"
                placeholderTextColor={colors.textLight}
                value={formData.notes}
                onChangeText={value => handleChange('notes', value)}
                multiline
                numberOfLines={4}
                editable={!isLoading && !isDeleting && isActive}
                textAlignVertical="top"
              />
            </View>
          </View>

          {(!isEditMode || isActive) && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (isLoading || isDeleting) && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isLoading || isDeleting}
                activeOpacity={0.8}
              >
                {isLoading || isDeleting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isEditMode ? 'Salvar Alterações' : 'Cadastrar Paciente'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={showDeleteDialog}
        title="Excluir Paciente"
        message="Tem certeza que deseja excluir este paciente? Se houver histórico de consultas, ele será apenas desativado. Caso contrário, será excluído permanentemente."
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={() => {
          setShowDeleteDialog(false);
          confirmDelete();
        }}
        onCancel={() => setShowDeleteDialog(false)}
        destructive
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 44,
  },
  deleteHeaderButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  inactiveBadge: {
    backgroundColor: tokens.colors.border.default,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  inactiveBadgeText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  formSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
  },
  inputDisabled: {
    backgroundColor: colors.border,
    justifyContent: 'center',
  },
  inputDisabledText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  readOnlyHint: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    fontStyle: 'italic',
  },
  textArea: {
    height: 120,
    paddingTop: 14,
  },
  buttonContainer: {
    marginTop: 8,
    gap: 12,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

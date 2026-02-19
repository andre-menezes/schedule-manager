import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useAppointmentsStore } from '../stores/appointments-store';
import { useToast } from '../contexts/ToastContext';
import { colors } from '../theme/colors';
import type { AppStackParamList } from '../navigation/types';
import * as patientService from '../services/patients';
import * as appointmentService from '../services/appointments';
import type { PatientListItem } from '../services/patients';

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'AppointmentForm'>;
type FormRouteProp = RouteProp<AppStackParamList, 'AppointmentForm'>;

function formatDateDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatTimeInput(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
}

function isValidTime(time: string): boolean {
  const match = time.match(/^(\d{2}):(\d{2})$/);
  if (!match) return false;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

function buildISODateTime(dateStr: string, timeStr: string): string {
  return `${dateStr}T${timeStr}:00.000Z`;
}

export function AppointmentFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<FormRouteProp>();
  const { appointmentId, date: routeDate } = route.params || {};
  const isEditMode = !!appointmentId;

  const { createAppointment, fetchAppointments, selectedDate } = useAppointmentsStore();
  const { showToast } = useToast();

  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientListItem | null>(null);
  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [date, setDate] = useState(routeDate || selectedDate);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const loadPatients = useCallback(async () => {
    try {
      const data = await patientService.listPatients();
      setPatients(data);
    } catch {
      showToast('Erro ao carregar pacientes', 'error');
    }
  }, [showToast]);

  const loadAppointment = useCallback(async () => {
    if (!appointmentId) return;
    try {
      const appt = await appointmentService.getAppointment(appointmentId);
      const start = new Date(appt.startAt);
      const end = new Date(appt.endAt);
      setDate(appt.startAt.split('T')[0]);
      setStartTime(
        `${String(start.getUTCHours()).padStart(2, '0')}:${String(start.getUTCMinutes()).padStart(2, '0')}`
      );
      setEndTime(
        `${String(end.getUTCHours()).padStart(2, '0')}:${String(end.getUTCMinutes()).padStart(2, '0')}`
      );
      setNotes(appt.notes || '');
      setSelectedPatient({ id: appt.patientId, name: appt.patientName, phone: null, notes: null });
    } catch {
      showToast('Erro ao carregar agendamento', 'error');
      navigation.goBack();
    }
  }, [appointmentId, showToast, navigation]);

  useEffect(() => {
    const init = async () => {
      await loadPatients();
      if (isEditMode) await loadAppointment();
      setIsLoadingData(false);
    };
    init();
  }, [loadPatients, loadAppointment, isEditMode]);

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedPatient) {
      showToast('Selecione um paciente', 'error');
      return;
    }
    if (!startTime || !isValidTime(startTime)) {
      showToast('Horário de início inválido', 'error');
      return;
    }
    if (!endTime || !isValidTime(endTime)) {
      showToast('Horário de fim inválido', 'error');
      return;
    }
    if (startTime >= endTime) {
      showToast('Horário de início deve ser antes do fim', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const startAt = buildISODateTime(date, startTime);
      const endAt = buildISODateTime(date, endTime);

      if (isEditMode && appointmentId) {
        await appointmentService.updateAppointment(appointmentId, {
          startAt,
          endAt,
          notes: notes.trim() || null,
        });
        showToast('Agendamento atualizado', 'success');
      } else {
        await createAppointment({
          patientId: selectedPatient.id,
          startAt,
          endAt,
          notes: notes.trim() || null,
        });
        showToast('Agendamento criado', 'success');
      }
      await fetchAppointments(date);
      navigation.goBack();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao salvar agendamento';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Editar Agendamento' : 'Novo Agendamento'}
        </Text>
        <View style={styles.headerSpacer} />
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
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Informações da Consulta</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Paciente *</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowPatientPicker(true)}
                disabled={isEditMode}
              >
                <Text
                  style={[
                    styles.pickerText,
                    !selectedPatient && styles.pickerPlaceholder,
                    isEditMode && styles.pickerDisabled,
                  ]}
                >
                  {selectedPatient?.name || 'Selecione um paciente'}
                </Text>
                {!isEditMode && (
                  <MaterialIcons
                    name="arrow-drop-down"
                    size={24}
                    color={colors.textSecondary}
                  />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data</Text>
              <View style={[styles.input, styles.inputDisabled]}>
                <Text style={styles.inputDisabledText}>
                  {formatDateDisplay(date)}
                </Text>
              </View>
            </View>

            <View style={styles.timeRow}>
              <View style={styles.timeInput}>
                <Text style={styles.label}>Início *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="08:00"
                  placeholderTextColor={colors.textLight}
                  value={startTime}
                  onChangeText={(v) => setStartTime(formatTimeInput(v))}
                  keyboardType="number-pad"
                  maxLength={5}
                  editable={!isLoading}
                />
              </View>
              <View style={styles.timeInput}>
                <Text style={styles.label}>Fim *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="09:00"
                  placeholderTextColor={colors.textLight}
                  value={endTime}
                  onChangeText={(v) => setEndTime(formatTimeInput(v))}
                  keyboardType="number-pad"
                  maxLength={5}
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observações</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Informações adicionais"
                placeholderTextColor={colors.textLight}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!isLoading}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEditMode ? 'Salvar Alterações' : 'Agendar Consulta'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showPatientPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPatientPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Paciente</Text>
              <TouchableOpacity onPress={() => setShowPatientPicker(false)}>
                <MaterialIcons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Buscar paciente..."
              placeholderTextColor={colors.textLight}
              value={patientSearch}
              onChangeText={setPatientSearch}
              autoFocus
            />

            <FlatList
              data={filteredPatients}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.patientItem}
                  onPress={() => {
                    setSelectedPatient(item);
                    setShowPatientPicker(false);
                    setPatientSearch('');
                  }}
                >
                  <Text style={styles.patientItemName}>{item.name}</Text>
                  {item.phone && (
                    <Text style={styles.patientItemPhone}>{item.phone}</Text>
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyPatients}>
                  <Text style={styles.emptyPatientsText}>
                    Nenhum paciente encontrado
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
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
    width: 40,
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
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
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
    justifyContent: 'center',
  },
  inputDisabledText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  textArea: {
    height: 80,
    paddingTop: 14,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  timeInput: {
    flex: 1,
  },
  pickerButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  pickerPlaceholder: {
    color: colors.textLight,
  },
  pickerDisabled: {
    color: colors.textSecondary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  searchInput: {
    margin: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  patientItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  patientItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  patientItemPhone: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyPatients: {
    padding: 32,
    alignItems: 'center',
  },
  emptyPatientsText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

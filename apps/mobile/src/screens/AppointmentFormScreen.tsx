import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useAppointmentsStore } from '../stores/appointments-store';
import { useToast } from '../contexts/ToastContext';
import { colors, spacing, tokens } from '../theme';
import type { HomeStackParamList } from '../navigation/types';
import * as patientService from '../services/patients';
import * as appointmentService from '../services/appointments';
import type { PatientListItem } from '../services/patients';
import type { AppointmentListItem } from '../services/appointments';
import { Calendar } from 'react-native-calendars';
import { SCHEDULING_DEFAULTS } from '../constants/scheduling';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'AppointmentForm'>;
type FormRouteProp = RouteProp<HomeStackParamList, 'AppointmentForm'>;

interface TimeSlot {
  time: string;
  available: boolean;
}

function formatDateDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

function getTodayDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getCurrentTimeMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function addMinutesToTime(time: string, minutes: number): string {
  const total = timeToMinutes(time) + minutes;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function buildISODateTime(dateStr: string, timeStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0).toISOString();
}

function formatPhone(phone: string | null): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

function generateTimeSlots(
  appointments: AppointmentListItem[],
  date: string,
  editingAppointmentId?: string
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startMinutes = timeToMinutes(SCHEDULING_DEFAULTS.WORK_START_TIME);
  const lastMinutes = timeToMinutes(SCHEDULING_DEFAULTS.LAST_SLOT_TIME);
  const interval = SCHEDULING_DEFAULTS.SLOT_INTERVAL_MINUTES;
  const duration = SCHEDULING_DEFAULTS.SLOT_DURATION_MINUTES;

  const isToday = date === getTodayDate();
  const currentMinutes = getCurrentTimeMinutes();

  const activeAppointments = appointments.filter(
    (a) => a.status !== 'CANCELADO' && a.id !== editingAppointmentId
  );

  for (let m = startMinutes; m <= lastMinutes; m += interval) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    const time = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;

    const slotStart = m;
    const slotEnd = m + duration;

    const isPast = isToday && slotStart <= currentMinutes;

    const isOccupied = activeAppointments.some((appt) => {
      const apptStart = new Date(appt.startAt);
      const apptEnd = new Date(appt.endAt);
      const apptStartMinutes = apptStart.getUTCHours() * 60 + apptStart.getUTCMinutes();
      const apptEndMinutes = apptEnd.getUTCHours() * 60 + apptEnd.getUTCMinutes();
      return slotStart < apptEndMinutes && slotEnd > apptStartMinutes;
    });

    slots.push({
      time,
      available: !isPast && !isOccupied,
    });
  }

  return slots;
}

export function AppointmentFormScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<FormRouteProp>();
  const { appointmentId, date: routeDate } = route.params || {};
  const isEditMode = !!appointmentId;

  const { createAppointment, fetchAppointments, selectedDate } = useAppointmentsStore();
  const { showToast } = useToast();

  const prevPatientIdsRef = useRef<Set<string>>(new Set());

  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientListItem | null>(null);
  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [date, setDate] = useState(routeDate || selectedDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dayAppointments, setDayAppointments] = useState<AppointmentListItem[]>([]);

  const isPastDate = date < getTodayDate();

  const loadPatients = useCallback(async () => {
    try {
      const data = await patientService.listPatients();
      const prevIds = prevPatientIdsRef.current;
      if (prevIds.size > 0) {
        const newPatients = data.filter(p => !prevIds.has(p.id) && p.isActive);
        if (newPatients.length === 1) {
          setSelectedPatient(newPatients[0]);
          showToast(`${newPatients[0].name} selecionado(a)`, 'success');
        } else if (newPatients.length > 1) {
          setShowPatientPicker(true);
        }
        prevPatientIdsRef.current = new Set();
      }
      setPatients(data);
    } catch {
      showToast('Erro ao carregar pacientes', 'error');
    }
  }, [showToast]);

  const handleNavigateToNewPatient = useCallback(() => {
    prevPatientIdsRef.current = new Set(patients.map(p => p.id));
    setShowPatientPicker(false);
    setPatientSearch('');
    navigation.navigate('PatientForm', {});
  }, [patients, navigation]);

  const loadDayAppointments = useCallback(async () => {
    try {
      const data = await appointmentService.listAppointments(date);
      setDayAppointments(data);
    } catch {
      showToast('Erro ao carregar horários', 'error');
    }
  }, [date, showToast]);

  const loadAppointment = useCallback(async () => {
    if (!appointmentId) return;
    try {
      const appt = await appointmentService.getAppointment(appointmentId);
      const start = new Date(appt.startAt);
      const time = `${String(start.getUTCHours()).padStart(2, '0')}:${String(start.getUTCMinutes()).padStart(2, '0')}`;
      setSelectedTime(time);
      setNotes(appt.notes || '');
      setSelectedPatient({ id: appt.patientId, name: appt.patientName, phone: null, notes: null, isActive: true });
    } catch {
      showToast('Erro ao carregar agendamento', 'error');
      navigation.goBack();
    }
  }, [appointmentId, showToast, navigation]);

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadPatients(), loadDayAppointments()]);
      if (isEditMode) await loadAppointment();
      setIsLoadingData(false);
    };
    init();
  }, [loadPatients, loadDayAppointments, loadAppointment, isEditMode]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (prevPatientIdsRef.current.size > 0) {
        loadPatients();
      }
    });
    return unsubscribe;
  }, [navigation, loadPatients]);

  const timeSlots = useMemo(
    () => generateTimeSlots(dayAppointments, date, appointmentId),
    [dayAppointments, date, appointmentId]
  );

  const handleDateChange = useCallback((newDate: string) => {
    setDate(newDate);
    setSelectedTime(null);
    setShowDatePicker(false);
  }, []);

  useEffect(() => {
    if (!isLoadingData) {
      loadDayAppointments();
    }
  }, [date]);

  const filteredPatients = patients.filter(
    (p) => p.isActive && p.name.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedPatient) {
      showToast('Selecione um paciente', 'error');
      return;
    }
    if (!selectedTime) {
      showToast('Selecione um horário', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const startAt = buildISODateTime(date, selectedTime);
      const endTime = addMinutesToTime(selectedTime, SCHEDULING_DEFAULTS.SLOT_DURATION_MINUTES);
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
              <Text style={styles.label}>Data *</Text>
              <TouchableOpacity
                style={styles.dateDisplay}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <MaterialIcons name="event" size={20} color={colors.primary} />
                <Text style={styles.dateText}>
                  {formatDateDisplay(date)}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Horário *</Text>
              {isPastDate ? (
                <View style={styles.pastDateWarning}>
                  <MaterialIcons name="warning" size={20} color={colors.warning} />
                  <Text style={styles.pastDateText}>
                    Não é possível agendar em datas passadas
                  </Text>
                </View>
              ) : (
                <View style={styles.slotsGrid}>
                  {timeSlots.map((slot) => (
                    <TouchableOpacity
                      key={slot.time}
                      style={[
                        styles.slotButton,
                        slot.available && styles.slotAvailable,
                        !slot.available && styles.slotOccupied,
                        selectedTime === slot.time && slot.available && styles.slotSelected,
                      ]}
                      onPress={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.slotText,
                          slot.available && styles.slotTextAvailable,
                          !slot.available && styles.slotTextOccupied,
                          selectedTime === slot.time && slot.available && styles.slotTextSelected,
                        ]}
                      >
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {selectedTime && (
                <Text style={styles.durationInfo}>
                  Consulta: {selectedTime} - {addMinutesToTime(selectedTime, SCHEDULING_DEFAULTS.SLOT_DURATION_MINUTES)}
                  {' '}({SCHEDULING_DEFAULTS.SLOT_DURATION_MINUTES} min)
                </Text>
              )}
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
            style={[
              styles.submitButton,
              (isLoading || !selectedTime || isPastDate) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading || !selectedTime || isPastDate}
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
          <View style={[styles.modalContent, { paddingTop: insets.top }]}>
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

            <TouchableOpacity
              style={styles.newPatientButton}
              onPress={handleNavigateToNewPatient}
              activeOpacity={0.7}
            >
              <MaterialIcons name="person-add" size={18} color={colors.primary} />
              <Text style={styles.newPatientButtonText}>Cadastrar novo paciente</Text>
            </TouchableOpacity>

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
                    <Text style={styles.patientItemPhone}>{formatPhone(item.phone)}</Text>
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyPatients}>
                  <Text style={styles.emptyPatientsText}>
                    Nenhum paciente encontrado
                  </Text>
                  <TouchableOpacity
                    style={styles.newPatientButtonEmpty}
                    onPress={handleNavigateToNewPatient}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="person-add" size={16} color={colors.white} />
                    <Text style={styles.newPatientButtonEmptyText}>Cadastrar paciente</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.datePickerOverlay}>
          <View style={styles.datePickerContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Data</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <MaterialIcons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <Calendar
              current={date}
              minDate={getTodayDate()}
              onDayPress={(day: { dateString: string }) => handleDateChange(day.dateString)}
              markedDates={{
                [date]: { selected: true, selectedColor: colors.primary },
              }}
              theme={{
                todayTextColor: colors.primary,
                arrowColor: colors.primary,
                textDayFontWeight: '500',
                textMonthFontWeight: '600',
                textDayHeaderFontWeight: '500',
              }}
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
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: tokens.typography.h2.size,
    fontWeight: tokens.typography.h2.weight,
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: spacing.xxxl,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: tokens.radius.lg,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: tokens.elevation.ios.level1.shadowOffset,
    shadowOpacity: tokens.elevation.ios.level1.shadowOpacity,
    shadowRadius: tokens.elevation.ios.level1.shadowRadius,
    elevation: tokens.elevation.android.level1,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: tokens.typography.caption.size,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: tokens.radius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontSize: tokens.typography.body.size,
    color: colors.textPrimary,
  },
  textArea: {
    height: 80,
    paddingTop: spacing.md,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: tokens.radius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  datePickerContent: {
    backgroundColor: colors.white,
    borderRadius: tokens.radius.xl,
    overflow: 'hidden',
  },
  dateText: {
    flex: 1,
    fontSize: tokens.typography.body.size,
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  slotButton: {
    width: '30%',
    paddingVertical: spacing.md,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  slotAvailable: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
  },
  slotOccupied: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  slotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  slotText: {
    fontSize: tokens.typography.body.size,
    fontWeight: '600',
  },
  slotTextAvailable: {
    color: colors.primary,
  },
  slotTextOccupied: {
    color: colors.textLight,
  },
  slotTextSelected: {
    color: colors.white,
  },
  durationInfo: {
    fontSize: tokens.typography.small.size,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  pastDateWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#FFF8E1',
    borderRadius: tokens.radius.lg,
    padding: spacing.base,
  },
  pastDateText: {
    fontSize: tokens.typography.caption.size,
    color: colors.warning,
    flex: 1,
  },
  pickerButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: tokens.radius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    fontSize: tokens.typography.body.size,
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
    paddingVertical: spacing.lg,
    borderRadius: tokens.radius.lg,
    alignItems: 'center',
    marginTop: spacing.base,
    shadowColor: colors.primary,
    shadowOffset: tokens.elevation.ios.level2.shadowOffset,
    shadowOpacity: 0.3,
    shadowRadius: tokens.elevation.ios.level2.shadowRadius,
    elevation: tokens.elevation.android.level2,
  },
  submitButtonDisabled: {
    opacity: tokens.state.opacity.disabled,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: tokens.typography.h2.size,
    fontWeight: tokens.typography.h2.weight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: tokens.radius.xl,
    borderBottomRightRadius: tokens.radius.xl,
    maxHeight: '70%',
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: tokens.typography.h2.size,
    fontWeight: tokens.typography.h2.weight,
    color: colors.textPrimary,
  },
  searchInput: {
    margin: spacing.base,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: tokens.radius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontSize: tokens.typography.body.size,
    color: colors.textPrimary,
  },
  patientItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  patientItemName: {
    fontSize: tokens.typography.body.size,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  patientItemPhone: {
    fontSize: tokens.typography.small.size,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  emptyPatients: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyPatientsText: {
    fontSize: tokens.typography.caption.size,
    color: colors.textSecondary,
    marginBottom: spacing.base,
  },
  newPatientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  newPatientButtonText: {
    fontSize: tokens.typography.caption.size,
    fontWeight: '500',
    color: colors.primary,
  },
  newPatientButtonEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: tokens.radius.md,
  },
  newPatientButtonEmptyText: {
    fontSize: tokens.typography.caption.size,
    fontWeight: '600',
    color: colors.white,
  },
});

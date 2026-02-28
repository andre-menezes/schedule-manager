import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useAppointmentsStore } from '../stores/appointments-store';
import { useToast } from '../contexts/ToastContext';
import { Badge, ConfirmDialog } from '../components';
import { colors, spacing, tokens } from '../theme';
import type { AppStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'AppointmentDetail'>;
type DetailRouteProp = RouteProp<AppStackParamList, 'AppointmentDetail'>;

const STATUS_CONFIG: Record<string, { label: string; variant: 'primary' | 'green' | 'red' }> = {
  AGENDADO: { label: 'Agendado', variant: 'primary' },
  REALIZADO: { label: 'Realizado', variant: 'green' },
  CANCELADO: { label: 'Cancelado', variant: 'red' },
};

function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function AppointmentDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRouteProp>();
  const { appointmentId } = route.params;
  const { showToast } = useToast();

  const {
    selectedAppointment: appointment,
    isLoading,
    fetchAppointment,
    markAsCompleted,
    markAsCanceled,
    clearSelectedAppointment,
  } = useAppointmentsStore();

  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchAppointment(appointmentId);
      return () => clearSelectedAppointment();
    }, [appointmentId, fetchAppointment, clearSelectedAppointment])
  );

  const handleMarkCompleted = async () => {
    try {
      await markAsCompleted(appointmentId);
      showToast('Consulta marcada como realizada', 'success');
      await fetchAppointment(appointmentId);
    } catch {
      showToast('Erro ao atualizar consulta', 'error');
    }
  };

  const handleConfirmCancel = async () => {
    setShowCancelDialog(false);
    try {
      await markAsCanceled(appointmentId);
      showToast('Consulta cancelada', 'success');
      await fetchAppointment(appointmentId);
    } catch {
      showToast('Erro ao cancelar consulta', 'error');
    }
  };

  const handleEdit = () => {
    navigation.navigate('AppointmentForm', { appointmentId });
  };

  if (isLoading || !appointment) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const statusConfig = STATUS_CONFIG[appointment.status];
  const isEditable = appointment.status === 'AGENDADO';

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
        <Text style={styles.headerTitle}>Detalhes da Consulta</Text>
        {isEditable ? (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <MaterialIcons name="edit" size={22} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.statusRow}>
            {statusConfig && (
              <Badge
                label={statusConfig.label}
                variant={statusConfig.variant}
                size="medium"
              />
            )}
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="person" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Paciente</Text>
              <Text style={styles.infoValue}>{appointment.patientName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialIcons name="event" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Data</Text>
              <Text style={styles.infoValue}>
                {formatDateTime(appointment.startAt)}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Horário</Text>
              <Text style={styles.infoValue}>
                {formatTime(appointment.startAt)} - {formatTime(appointment.endAt)}
              </Text>
            </View>
          </View>

          {appointment.notes && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <MaterialIcons
                  name="notes"
                  size={20}
                  color={colors.textSecondary}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Observações</Text>
                  <Text style={styles.infoValue}>{appointment.notes}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {isEditable && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleMarkCompleted}
              activeOpacity={0.8}
            >
              <MaterialIcons name="check-circle" size={20} color={colors.white} />
              <Text style={styles.completeButtonText}>Marcar como Realizada</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCancelDialog(true)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="cancel" size={20} color={colors.secondary} />
              <Text style={styles.cancelButtonText}>Cancelar Consulta</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <ConfirmDialog
        visible={showCancelDialog}
        title="Cancelar Consulta"
        message="Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita."
        confirmText="Cancelar consulta"
        cancelText="Voltar"
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelDialog(false)}
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
  editButton: {
    padding: spacing.sm,
  },
  headerSpacer: {
    width: spacing.xxxl,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: tokens.radius.lg,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: tokens.elevation.ios.level1.shadowOffset,
    shadowOpacity: tokens.elevation.ios.level1.shadowOpacity,
    shadowRadius: tokens.elevation.ios.level1.shadowRadius,
    elevation: tokens.elevation.android.level1,
  },
  statusRow: {
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: tokens.typography.small.size,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: tokens.typography.body.size,
    fontWeight: '500',
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  completeButton: {
    backgroundColor: colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.base,
    borderRadius: tokens.radius.lg,
    gap: spacing.sm,
  },
  completeButtonText: {
    color: colors.white,
    fontSize: tokens.typography.body.size,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.base,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    borderColor: colors.secondary,
    gap: spacing.sm,
  },
  cancelButtonText: {
    color: colors.secondary,
    fontSize: tokens.typography.body.size,
    fontWeight: '600',
  },
});

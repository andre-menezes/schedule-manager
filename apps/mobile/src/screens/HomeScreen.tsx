import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarProvider, WeekCalendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppointmentsStore } from '../stores/appointments-store';
import { useAuthStore } from '../stores/auth-store';
import { Badge } from '../components';
import { colors } from '../theme/colors';
import type { AppStackParamList } from '../navigation/types';
import type { AppointmentListItem } from '../services/appointments';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

const STATUS_BADGE: Record<string, { label: string; variant: 'primary' | 'green' | 'red' }> = {
  AGENDADO: { label: 'Agendado', variant: 'primary' },
  REALIZADO: { label: 'Realizado', variant: 'green' },
  CANCELADO: { label: 'Cancelado', variant: 'red' },
};

function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatSelectedDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuthStore();
  const {
    appointments,
    selectedDate,
    isLoading,
    setSelectedDate,
    fetchAppointments,
  } = useAppointmentsStore();

  useFocusEffect(
    useCallback(() => {
      fetchAppointments(selectedDate);
    }, [fetchAppointments, selectedDate])
  );

  const handleDayPress = useCallback(
    (date: string) => {
      setSelectedDate(date);
      fetchAppointments(date);
    },
    [setSelectedDate, fetchAppointments]
  );

  const handleAppointmentPress = (item: AppointmentListItem) => {
    navigation.navigate('AppointmentDetail', { appointmentId: item.id });
  };

  const handleCreateAppointment = () => {
    navigation.navigate('AppointmentForm', { date: selectedDate });
  };

  const renderAppointmentItem = ({ item }: { item: AppointmentListItem }) => {
    const badge = STATUS_BADGE[item.status];
    return (
      <TouchableOpacity
        style={styles.appointmentCard}
        onPress={() => handleAppointmentPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.timeColumn}>
          <Text style={styles.timeStart}>{formatTime(item.startAt)}</Text>
          <Text style={styles.timeEnd}>{formatTime(item.endAt)}</Text>
        </View>
        <View style={styles.appointmentInfo}>
          <Text style={styles.patientName}>{item.patientName}</Text>
          {badge && (
            <Badge label={badge.label} variant={badge.variant} size="small" />
          )}
        </View>
        <MaterialIcons name="chevron-right" size={22} color={colors.textLight} />
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="event-available" size={48} color={colors.textLight} />
      <Text style={styles.emptyText}>Nenhum agendamento</Text>
      <Text style={styles.emptySubtext}>
        Toque no botão + para agendar uma consulta
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <View style={styles.welcomeHeader}>
          <Text style={styles.welcomeLabel}>Olá,</Text>
          <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <CalendarProvider date={selectedDate} onDateChanged={handleDayPress}>
        <WeekCalendar
          firstDay={0}
          theme={{
            backgroundColor: colors.white,
            calendarBackground: colors.white,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: colors.white,
            todayTextColor: colors.primary,
            dayTextColor: colors.textPrimary,
            textDisabledColor: colors.textLight,
            dotColor: colors.primary,
            selectedDotColor: colors.white,
            textDayFontWeight: '500',
            textDayHeaderFontWeight: '600',
            textDayHeaderFontSize: 12,
          }}
        />
      </CalendarProvider>

      <View style={styles.dateHeader}>
        <Text style={styles.dateTitle}>{formatSelectedDate(selectedDate)}</Text>
        <Text style={styles.appointmentCount}>
          {appointments.length} {appointments.length === 1 ? 'consulta' : 'consultas'}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointmentItem}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={
            appointments.length === 0 ? styles.emptyListContent : styles.listContent
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateAppointment}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={28} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeHeader: {
    flex: 1,
  },
  welcomeLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.secondary,
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  appointmentCount: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  emptyListContent: {
    flex: 1,
  },
  appointmentCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  timeColumn: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 50,
  },
  timeStart: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timeEnd: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  appointmentInfo: {
    flex: 1,
    gap: 4,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

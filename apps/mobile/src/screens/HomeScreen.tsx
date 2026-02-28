import React, { useCallback, useMemo, useState } from 'react';
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
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppointmentsStore } from '../stores/appointments-store';
import { useAuthStore } from '../stores/auth-store';
import { Badge } from '../components';
import { colors, spacing, borderRadius, tokens } from '../theme';
import type { AppStackParamList } from '../navigation/types';
import type { AppointmentListItem } from '../services/appointments';
import { getAppointmentDates } from '../services/appointments';

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ],
  dayNames: [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-br';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;
type PickerMode = 'none' | 'month' | 'year';

const STATUS_BADGE: Record<
  string,
  { label: string; variant: 'primary' | 'green' | 'red' }
> = {
  AGENDADO: { label: 'Agendado', variant: 'primary' },
  REALIZADO: { label: 'Realizado', variant: 'green' },
  CANCELADO: { label: 'Cancelado', variant: 'red' },
};

const STATUS_STRIP_COLOR: Record<string, string> = {
  AGENDADO: colors.primary,
  REALIZADO: colors.success,
  CANCELADO: colors.secondary,
};

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const MONTH_NAMES_SHORT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

const DAY_NAMES_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getTodayStr(): string {
  return toDateStr(new Date());
}

function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
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

function getMonthFromDate(dateStr: string): string {
  return dateStr.substring(0, 7);
}

function getWeekDays(centerDate: string): string[] {
  const [y, m, d] = centerDate.split('-').map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(toDateStr(new Date(y, m - 1, d - dow + i)));
  }
  return days;
}

function shiftWeek(dateStr: string, weeks: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return toDateStr(new Date(y, m - 1, d + weeks * 7));
}

function changeMonth(dateStr: string, delta: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  const y = date.getFullYear();
  const nm = date.getMonth();
  const maxDay = new Date(y, nm + 1, 0).getDate();
  const m = String(nm + 1).padStart(2, '0');
  const d = String(Math.min(day, maxDay)).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function setMonth(dateStr: string, monthIdx: number): string {
  const [year, , day] = dateStr.split('-').map(Number);
  const maxDay = new Date(year, monthIdx + 1, 0).getDate();
  const m = String(monthIdx + 1).padStart(2, '0');
  const d = String(Math.min(day, maxDay)).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function setYear(dateStr: string, newYear: number): string {
  const [, month, day] = dateStr.split('-').map(Number);
  const maxDay = new Date(newYear, month, 0).getDate();
  const m = String(month).padStart(2, '0');
  const d = String(Math.min(day, maxDay)).padStart(2, '0');
  return `${newYear}-${m}-${d}`;
}

function getDecadeStart(year: number): number {
  return Math.floor(year / 10) * 10;
}

type MarkedDates = Record<
  string,
  {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
  }
>;

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

  const [expanded, setExpanded] = useState(false);
  const [pickerMode, setPickerMode] = useState<PickerMode>('none');
  const [decadeOffset, setDecadeOffset] = useState(0);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  const today = useMemo(() => getTodayStr(), []);
  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);
  const currentMonth = Number(selectedDate.split('-')[1]) - 1;
  const currentYear = Number(selectedDate.split('-')[0]);

  useFocusEffect(
    useCallback(() => {
      fetchAppointments(selectedDate);
    }, [fetchAppointments, selectedDate])
  );

  useFocusEffect(
    useCallback(() => {
      loadMarkedDates(getMonthFromDate(selectedDate));
    }, [selectedDate])
  );

  const buildMarks = (dates: string[], selected: string): MarkedDates => {
    const marks: MarkedDates = {};
    for (const date of dates) {
      marks[date] = { marked: true, dotColor: colors.primary };
    }
    marks[selected] = {
      ...marks[selected],
      selected: true,
      selectedColor: colors.primary,
    };
    return marks;
  };

  const loadMarkedDates = async (month: string) => {
    try {
      const dates = await getAppointmentDates(month);
      setMarkedDates(buildMarks(dates, selectedDate));
    } catch {
      setMarkedDates(buildMarks([], selectedDate));
    }
  };

  const navigateTo = useCallback(
    (date: string) => {
      setSelectedDate(date);
      fetchAppointments(date);
      setMarkedDates(prev => {
        const dotDates = Object.entries(prev)
          .filter(([, v]) => v.marked)
          .map(([k]) => k);
        return buildMarks(dotDates, date);
      });
    },
    [setSelectedDate, fetchAppointments]
  );

  const handleMonthPick = (monthIdx: number) => {
    navigateTo(setMonth(selectedDate, monthIdx));
    setPickerMode('none');
  };

  const handleYearPick = (year: number) => {
    navigateTo(setYear(selectedDate, year));
    setPickerMode('none');
    setDecadeOffset(0);
  };

  const toggleMonthPicker = () => {
    setPickerMode(m => (m === 'month' ? 'none' : 'month'));
    setDecadeOffset(0);
  };

  const toggleYearPicker = () => {
    setPickerMode(m => (m === 'year' ? 'none' : 'year'));
    setDecadeOffset(0);
  };

  const handleAppointmentPress = (item: AppointmentListItem) => {
    navigation.navigate('AppointmentDetail', { appointmentId: item.id });
  };

  const handleCreateAppointment = () => {
    navigation.navigate('AppointmentForm', { date: selectedDate });
  };

  // Decade grid
  const decadeStart = getDecadeStart(currentYear) + decadeOffset * 10;
  const decadeEnd = decadeStart + 9;
  const decadeYears: number[] = [];
  for (let y = decadeStart; y <= decadeEnd; y++) {
    decadeYears.push(y);
  }

  const showCalendar = pickerMode === 'none';

  const renderAppointmentItem = ({ item }: { item: AppointmentListItem }) => {
    const badge = STATUS_BADGE[item.status];
    const stripColor = STATUS_STRIP_COLOR[item.status] ?? colors.textLight;
    return (
      <TouchableOpacity
        style={[styles.appointmentCard, { borderLeftColor: stripColor }]}
        onPress={() => handleAppointmentPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <Text style={styles.timeRange}>
            {formatTime(item.startAt)} - {formatTime(item.endAt)}
          </Text>
          <Text style={styles.patientName}>{item.patientName}</Text>
          {badge && (
            <Badge label={badge.label} variant={badge.variant} size="small" />
          )}
        </View>
        <MaterialIcons
          name="chevron-right"
          size={22}
          color={colors.textLight}
        />
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons
        name="event-available"
        size={48}
        color={colors.textLight}
      />
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

      <View style={styles.calendarCard}>
        {/* Header:  <  [Month v]  [Year v]  > */}
        <View style={styles.navHeader}>
          <TouchableOpacity
            onPress={() => {
              navigateTo(changeMonth(selectedDate, -1));
              setPickerMode('none');
            }}
            hitSlop={8}
          >
            <MaterialIcons
              name="chevron-left"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <View style={styles.navCenter}>
            <TouchableOpacity
              onPress={toggleMonthPicker}
              style={[
                styles.dropdownBtn,
                pickerMode === 'month' && styles.dropdownBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.dropdownText,
                  pickerMode === 'month' && styles.dropdownTextActive,
                ]}
              >
                {MONTH_NAMES[currentMonth]}
              </Text>
              <MaterialIcons
                name={
                  pickerMode === 'month' ? 'arrow-drop-up' : 'arrow-drop-down'
                }
                size={20}
                color={
                  pickerMode === 'month' ? colors.primary : colors.textSecondary
                }
              />
            </TouchableOpacity>

            <Text style={styles.navSeparator}>/</Text>

            <TouchableOpacity
              onPress={toggleYearPicker}
              style={[
                styles.dropdownBtn,
                pickerMode === 'year' && styles.dropdownBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.dropdownText,
                  pickerMode === 'year' && styles.dropdownTextActive,
                ]}
              >
                {currentYear}
              </Text>
              <MaterialIcons
                name={
                  pickerMode === 'year' ? 'arrow-drop-up' : 'arrow-drop-down'
                }
                size={20}
                color={
                  pickerMode === 'year' ? colors.primary : colors.textSecondary
                }
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigateTo(changeMonth(selectedDate, 1));
              setPickerMode('none');
            }}
            hitSlop={8}
          >
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Month picker grid */}
        {pickerMode === 'month' && (
          <View style={styles.pickerGrid}>
            {MONTH_NAMES_SHORT.map((name, idx) => {
              const isActive = idx === currentMonth;
              return (
                <TouchableOpacity
                  key={name}
                  onPress={() => handleMonthPick(idx)}
                  style={[
                    styles.pickerCell,
                    isActive && styles.pickerCellActive,
                  ]}
                  activeOpacity={0.6}
                >
                  <Text
                    style={[
                      styles.pickerCellText,
                      isActive && styles.pickerCellTextActive,
                    ]}
                  >
                    {name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Year picker grid */}
        {pickerMode === 'year' && (
          <>
            <View style={styles.decadeHeader}>
              <TouchableOpacity
                onPress={() => setDecadeOffset(d => d - 1)}
                hitSlop={8}
              >
                <MaterialIcons
                  name="chevron-left"
                  size={22}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
              <Text style={styles.decadeText}>
                {decadeStart} - {decadeEnd}
              </Text>
              <TouchableOpacity
                onPress={() => setDecadeOffset(d => d + 1)}
                hitSlop={8}
              >
                <MaterialIcons
                  name="chevron-right"
                  size={22}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.pickerGrid}>
              {decadeYears.map(year => {
                const isActive = year === currentYear;
                return (
                  <TouchableOpacity
                    key={year}
                    onPress={() => handleYearPick(year)}
                    style={[
                      styles.pickerCell,
                      isActive && styles.pickerCellActive,
                    ]}
                    activeOpacity={0.6}
                  >
                    <Text
                      style={[
                        styles.pickerCellText,
                        isActive && styles.pickerCellTextActive,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* Week strip (collapsed) */}
        {showCalendar && !expanded && (
          <View style={styles.weekStrip}>
            <TouchableOpacity
              onPress={() => navigateTo(shiftWeek(selectedDate, -1))}
              style={styles.weekArrow}
            >
              <MaterialIcons
                name="chevron-left"
                size={20}
                color={colors.textLight}
              />
            </TouchableOpacity>

            <View style={styles.weekDays}>
              {weekDays.map(dayStr => {
                const parts = dayStr.split('-').map(Number);
                const dayNum = parts[2];
                const monthIdx = parts[1] - 1;
                const dow = new Date(parts[0], monthIdx, dayNum).getDay();
                const isSelected = dayStr === selectedDate;
                const isToday = dayStr === today;
                const hasDot = markedDates[dayStr]?.marked;

                return (
                  <TouchableOpacity
                    key={dayStr}
                    onPress={() => navigateTo(dayStr)}
                    style={styles.weekDayCell}
                    activeOpacity={0.6}
                  >
                    <Text
                      style={[
                        styles.weekDayName,
                        isSelected && styles.weekDayNameActive,
                      ]}
                    >
                      {DAY_NAMES_SHORT[dow]}
                    </Text>
                    <View
                      style={[
                        styles.weekDayNumWrap,
                        isSelected && styles.weekDayNumWrapActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.weekDayNum,
                          isToday && !isSelected && styles.weekDayNumToday,
                          isSelected && styles.weekDayNumActive,
                        ]}
                      >
                        {dayNum}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.weekMonthAbbrev,
                        isSelected && styles.weekMonthAbbrevActive,
                      ]}
                    >
                      {MONTH_NAMES_SHORT[monthIdx]}
                    </Text>
                    {hasDot && (
                      <View
                        style={[
                          styles.weekDot,
                          isSelected && styles.weekDotActive,
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              onPress={() => navigateTo(shiftWeek(selectedDate, 1))}
              style={styles.weekArrow}
            >
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={colors.textLight}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Full calendar (expanded) */}
        {showCalendar && expanded && (
          <Calendar
            key={getMonthFromDate(selectedDate)}
            current={selectedDate}
            onDayPress={(day: { dateString: string }) =>
              navigateTo(day.dateString)
            }
            onMonthChange={(month: { dateString: string }) => {
              loadMarkedDates(month.dateString.substring(0, 7));
            }}
            markedDates={markedDates}
            hideArrows
            renderHeader={() => <View />}
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
        )}

        {/* Expand/collapse toggle */}
        {showCalendar && (
          <TouchableOpacity
            onPress={() => setExpanded(v => !v)}
            style={styles.expandToggle}
            hitSlop={8}
          >
            <MaterialIcons
              name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={22}
              color={colors.textLight}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.dateHeader}>
        <Text style={styles.dateTitle}>{formatSelectedDate(selectedDate)}</Text>
        <Text style={styles.appointmentCount}>
          {appointments.length}{' '}
          {appointments.length === 1 ? 'consulta' : 'consultas'}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={item => item.id}
          renderItem={renderAppointmentItem}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={
            appointments.length === 0
              ? styles.emptyListContent
              : styles.listContent
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
  },
  welcomeHeader: { flex: 1 },
  welcomeLabel: {
    fontSize: tokens.typography.body.size,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: tokens.typography.h1.size,
    fontWeight: tokens.typography.h1.weight,
    color: colors.textPrimary,
  },
  logoutButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.secondary,
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: tokens.typography.caption.size,
    fontWeight: '600',
  },

  // Calendar card
  calendarCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.base,
    borderRadius: tokens.radius.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    shadowColor: colors.black,
    shadowOffset: tokens.elevation.ios.level1.shadowOffset,
    shadowOpacity: tokens.elevation.ios.level1.shadowOpacity,
    shadowRadius: tokens.elevation.ios.level1.shadowRadius,
    elevation: tokens.elevation.android.level1,
  },

  // Nav header
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  navCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: tokens.radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  dropdownBtnActive: {
    backgroundColor: '#E8EAFF',
  },
  dropdownText: {
    fontSize: tokens.typography.caption.size,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dropdownTextActive: {
    color: colors.primary,
  },
  navSeparator: {
    fontSize: tokens.typography.caption.size,
    color: colors.textLight,
    marginHorizontal: spacing.xs,
  },

  // Picker grid (month / year)
  pickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  pickerCell: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.base,
  },
  pickerCellActive: {
    backgroundColor: colors.primary,
    borderRadius: tokens.radius.pill,
  },
  pickerCellText: {
    fontSize: tokens.typography.caption.size,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  pickerCellTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  decadeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.sm,
    gap: spacing.base,
  },
  decadeText: {
    fontSize: tokens.typography.caption.size,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  // Expand toggle
  expandToggle: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },

  // Week strip
  weekStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
  weekArrow: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.md,
  },
  weekDays: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weekDayCell: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
    flex: 1,
  },
  weekDayName: {
    fontSize: tokens.typography.small.size,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  weekDayNameActive: { color: colors.primary },
  weekDayNumWrap: {
    width: 34,
    height: 34,
    borderRadius: tokens.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayNumWrapActive: { backgroundColor: colors.primary },
  weekDayNum: {
    fontSize: tokens.typography.body.size,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  weekDayNumToday: { color: colors.primary, fontWeight: '700' },
  weekDayNumActive: { color: colors.white },
  weekMonthAbbrev: {
    fontSize: tokens.typography.small.size,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  weekMonthAbbrevActive: { color: colors.primary },
  weekDot: {
    width: 5,
    height: 5,
    borderRadius: tokens.radius.pill,
    backgroundColor: colors.primary,
    marginTop: spacing.xs,
  },
  weekDotActive: { backgroundColor: colors.primaryLight },

  // Content
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    paddingBottom: spacing.md,
  },
  dateTitle: {
    fontSize: tokens.typography.body.size,
    fontWeight: '600',
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  appointmentCount: {
    fontSize: tokens.typography.small.size,
    color: colors.textSecondary,
  },
  listContent: { paddingHorizontal: spacing.xl, paddingBottom: 80 },
  emptyListContent: { paddingBottom: 80 },
  appointmentCard: {
    backgroundColor: colors.white,
    borderRadius: tokens.radius.lg,
    padding: spacing.base,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 8,
    shadowColor: colors.black,
    shadowOffset: tokens.elevation.ios.level1.shadowOffset,
    shadowOpacity: tokens.elevation.ios.level1.shadowOpacity,
    shadowRadius: tokens.elevation.ios.level1.shadowRadius,
    elevation: tokens.elevation.android.level1,
  },
  cardContent: {
    flex: 1,
    gap: spacing.xs,
  },
  timeRange: {
    fontSize: tokens.typography.small.size,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  patientName: {
    fontSize: tokens.typography.body.size,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxxl,
  },
  emptyText: {
    fontSize: tokens.typography.body.size,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: tokens.typography.caption.size,
    color: colors.textLight,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: tokens.radius.pill,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: tokens.elevation.ios.level2.shadowOffset,
    shadowOpacity: 0.3,
    shadowRadius: tokens.elevation.ios.level2.shadowRadius,
    elevation: tokens.elevation.android.level3,
  },
});

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/auth-store';
import { colors, spacing, borderRadius, tokens } from '../theme';
import type { AppStackParamList } from '../navigation/types';
import * as patientService from '../services/patients';
import type { PatientListItem } from '../services/patients';
import { PatientCard } from '../components';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;
type StatusFilter = 'all' | 'active' | 'inactive';

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'active', label: 'Ativos' },
  { key: 'inactive', label: 'Inativos' },
];

export function WelcomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuthStore();
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadPatients = useCallback(async () => {
    try {
      const data = await patientService.listPatients();
      setPatients(data);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPatients();
    }, [loadPatients])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadPatients();
  };

  const handleNavigateToPatientForm = () => {
    navigation.navigate('PatientForm', {});
  };

  const handleViewPatient = (patient: PatientListItem) => {
    navigation.navigate('PatientForm', { patientId: patient.id });
  };

  const displayedPatients = useMemo(() => {
    const term = search.trim().toLowerCase();
    return patients
      .filter(p => {
        const matchesName = !term || p.name.toLowerCase().includes(term);
        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'active' && p.isActive) ||
          (statusFilter === 'inactive' && !p.isActive);
        return matchesName && matchesStatus;
      })
      .sort((a, b) => {
        if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
        return a.name.localeCompare(b.name, 'pt-BR');
      });
  }, [patients, search, statusFilter]);

  const renderPatientItem = ({ item }: { item: PatientListItem }) => (
    <PatientCard patient={item} onPress={() => handleViewPatient(item)} />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      {search.trim() || statusFilter !== 'all' ? (
        <>
          <MaterialIcons name="search-off" size={40} color={colors.textLight} />
          <Text style={styles.emptyText}>Nenhum paciente encontrado</Text>
          <TouchableOpacity
            onPress={() => { setSearch(''); setStatusFilter('all'); }}
            activeOpacity={0.7}
          >
            <Text style={styles.clearFiltersText}>Limpar filtros</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.emptyText}>Nenhum paciente cadastrado</Text>
          <Text style={styles.emptySubtext}>
            Cadastre seu primeiro paciente clicando no botão acima
          </Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleNavigateToPatientForm}
          activeOpacity={0.8}
        >
          <MaterialIcons name="person-add" size={18} color={colors.white} />
          <Text style={styles.primaryButtonText}>Novo Paciente</Text>
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome..."
            placeholderTextColor={colors.textLight}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
              <MaterialIcons name="close" size={18} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterRow}>
          {STATUS_FILTERS.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, statusFilter === f.key && styles.filterChipActive]}
              onPress={() => setStatusFilter(f.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, statusFilter === f.key && styles.filterChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Meus Pacientes</Text>
            {!isLoading && (
              <Text style={styles.patientCount}>
                {displayedPatients.length}
                {patients.length !== displayedPatients.length ? `/${patients.length}` : ''}
              </Text>
            )}
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <FlatList
              data={displayedPatients}
              keyExtractor={item => item.id}
              renderItem={renderPatientItem}
              ListEmptyComponent={renderEmptyList}
              contentContainerStyle={
                displayedPatients.length === 0 ? styles.emptyListContent : undefined
              }
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                />
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
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
  welcomeHeader: {
    flex: 1,
  },
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.base,
    borderRadius: tokens.radius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: tokens.elevation.ios.level2.shadowOffset,
    shadowOpacity: 0.3,
    shadowRadius: tokens.elevation.ios.level2.shadowRadius,
    elevation: tokens.elevation.android.level2,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: tokens.typography.body.size,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: tokens.radius.lg,
    paddingHorizontal: spacing.md,
    marginTop: spacing.base,
    height: spacing.huge,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: tokens.typography.body.size,
    color: colors.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: tokens.typography.small.size,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  listSection: {
    flex: 1,
    marginTop: spacing.lg,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: tokens.typography.h2.size,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  patientCount: {
    fontSize: tokens.typography.small.size,
    color: colors.textSecondary,
    fontWeight: '500',
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
    paddingHorizontal: spacing.xxl,
    gap: spacing.sm,
  },
  emptyListContent: {
    flex: 1,
  },
  emptyText: {
    fontSize: tokens.typography.body.size,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: tokens.typography.caption.size,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: tokens.typography.caption.lineHeight,
  },
  clearFiltersText: {
    fontSize: tokens.typography.caption.size,
    color: colors.primary,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
});

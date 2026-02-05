import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/auth-store';
import { colors } from '../theme/colors';
import type { AppStackParamList } from '../navigation/types';
import * as patientService from '../services/patients';
import type { PatientListItem } from '../services/patients';
import { PatientCard } from '../components';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export function WelcomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuthStore();
  const [patients, setPatients] = useState<PatientListItem[]>([]);
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

  const renderPatientItem = ({ item }: { item: PatientListItem }) => (
    <PatientCard patient={item} onPress={() => handleViewPatient(item)} />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Nenhum paciente cadastrado</Text>
      <Text style={styles.emptySubtext}>
        Cadastre seu primeiro paciente clicando no botão acima
      </Text>
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
          <Text style={styles.primaryButtonText}>+ Novo Paciente</Text>
        </TouchableOpacity>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Meus Pacientes</Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <FlatList
              data={patients}
              keyExtractor={item => item.id}
              renderItem={renderPatientItem}
              ListEmptyComponent={renderEmptyList}
              contentContainerStyle={
                patients.length === 0 ? styles.emptyListContent : undefined
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  listSection: {
    flex: 1,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
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
  emptyListContent: {
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});

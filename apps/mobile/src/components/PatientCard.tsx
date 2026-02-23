import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import type { PatientListItem } from '../services/patients';

interface PatientCardProps {
  patient: PatientListItem;
  onPress: () => void;
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

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function PatientCard({ patient, onPress }: PatientCardProps) {
  const inactive = !patient.isActive;
  return (
    <View style={[styles.card, inactive && styles.cardInactive]}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, inactive && styles.avatarInactive]}>
          <Text style={styles.avatarText}>{getInitials(patient.name)}</Text>
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.patientName, inactive && styles.patientNameInactive]}>
              {patient.name}
            </Text>
            {inactive && (
              <View style={styles.inactiveBadge}>
                <Text style={styles.inactiveBadgeText}>Inativo</Text>
              </View>
            )}
          </View>
          <Text style={styles.phoneText}>
            Telefone: {patient.phone ? formatPhone(patient.phone) : 'Não informado'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {patient.notes ? (
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Observações:</Text>
          <Text style={styles.notesText} numberOfLines={3}>
            {patient.notes}
          </Text>
        </View>
      ) : (
        <View style={styles.notesSection}>
          <Text style={styles.noNotesText}>Sem observações</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.viewButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.viewButtonText}>VISUALIZAR PACIENTE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardInactive: {
    opacity: 0.65,
    backgroundColor: '#F5F5F5',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarInactive: {
    backgroundColor: colors.textLight,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  patientNameInactive: {
    color: colors.textSecondary,
  },
  inactiveBadge: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  inactiveBadgeText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.white,
  },
  headerInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  notesSection: {
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  noNotesText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  viewButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

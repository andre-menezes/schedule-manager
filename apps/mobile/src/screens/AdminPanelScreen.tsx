import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../stores/auth-store';
import { listUsers, deactivateUser, reactivateUser, type User } from '../services/auth';
import { useToast } from '../contexts/ToastContext';
import { ConfirmDialog } from '../components';
import { colors, spacing, tokens } from '../theme';

export function AdminPanelScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
  const [userToReactivate, setUserToReactivate] = useState<User | null>(null);
  const { user, logout } = useAuthStore();
  const { showToast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      const data = await listUsers();
      setUsers(data);
    } catch {
      showToast('Não foi possível carregar os usuários', 'error');
    }
  }, [showToast]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchUsers();
    setIsRefreshing(false);
  }, [fetchUsers]);

  const handleLogout = async () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  const handleDeactivate = async () => {
    if (!userToDeactivate) return;
    try {
      await deactivateUser(userToDeactivate.id);
      showToast(`${userToDeactivate.name} foi desativado`, 'success');
      setUserToDeactivate(null);
      await fetchUsers();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao desativar usuário';
      showToast(message, 'error');
      setUserToDeactivate(null);
    }
  };

  const handleReactivate = async () => {
    if (!userToReactivate) return;
    try {
      await reactivateUser(userToReactivate.id);
      showToast(`${userToReactivate.name} foi reativado`, 'success');
      setUserToReactivate(null);
      await fetchUsers();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao reativar usuário';
      showToast(message, 'error');
      setUserToReactivate(null);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchUsers();
      setIsLoading(false);
    };
    loadData();
  }, [fetchUsers]);

  const isCurrentUser = (item: User) => item.email === user?.email;
  const isInactive = (item: User) => item.deactivatedAt !== null;

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={[styles.userCard, isInactive(item) && styles.userCardInactive]}>
      <View style={styles.userInfo}>
        <View style={styles.userNameRow}>
          <Text style={[styles.userName, isInactive(item) && styles.userNameInactive]}>
            {item.name}
          </Text>
          {isInactive(item) && (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveBadgeText}>Inativo</Text>
            </View>
          )}
        </View>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      {isCurrentUser(item) ? (
        <View style={styles.youBadge}>
          <Text style={styles.youBadgeText}>Você</Text>
        </View>
      ) : isInactive(item) ? (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setUserToReactivate(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="refresh" size={22} color={colors.success} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setUserToDeactivate(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="delete-outline" size={22} color={colors.secondary} />
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Painel Admin</Text>
          <Text style={styles.headerSubtitle}>
            Olá, {user?.name?.split(' ')[0]}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Usuários cadastrados</Text>
        <Text style={styles.sectionCount}>{users.length} usuários</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum usuário cadastrado</Text>
          </View>
        }
      />

      <ConfirmDialog
        visible={!!userToDeactivate}
        title="Desativar Usuário"
        message={`Tem certeza que deseja desativar ${userToDeactivate?.name}? O usuário não poderá mais acessar o sistema, mas seus dados serão preservados.`}
        confirmText="Desativar"
        cancelText="Cancelar"
        onConfirm={handleDeactivate}
        onCancel={() => setUserToDeactivate(null)}
        destructive
      />

      <ConfirmDialog
        visible={!!userToReactivate}
        title="Reativar Usuário"
        message={`Deseja reativar ${userToReactivate?.name}? O usuário voltará a ter acesso ao sistema.`}
        confirmText="Reativar"
        cancelText="Cancelar"
        onConfirm={handleReactivate}
        onCancel={() => setUserToReactivate(null)}
      />
    </View>
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
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: tokens.typography.h1.size,
    fontWeight: tokens.typography.h1.weight,
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: tokens.typography.caption.size,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing.xs,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: tokens.radius.sm,
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: tokens.typography.caption.size,
    fontWeight: '600',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
  },
  sectionTitle: {
    fontSize: tokens.typography.h2.size,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sectionCount: {
    fontSize: tokens.typography.caption.size,
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  userCard: {
    backgroundColor: colors.surface,
    borderRadius: tokens.radius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: tokens.elevation.ios.level1.shadowOffset,
    shadowOpacity: tokens.elevation.ios.level1.shadowOpacity,
    shadowRadius: tokens.elevation.ios.level1.shadowRadius,
    elevation: tokens.elevation.android.level1,
  },
  userCardInactive: {
    backgroundColor: colors.background,
    opacity: tokens.state.opacity.focus,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  userName: {
    fontSize: tokens.typography.body.size,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  userNameInactive: {
    color: colors.textSecondary,
  },
  userEmail: {
    fontSize: tokens.typography.caption.size,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  inactiveBadge: {
    backgroundColor: tokens.colors.border.default,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: tokens.radius.md,
  },
  inactiveBadgeText: {
    fontSize: tokens.typography.small.size,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  youBadge: {
    backgroundColor: '#E8EAFF',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: tokens.radius.md,
  },
  youBadgeText: {
    fontSize: tokens.typography.small.size,
    color: colors.primary,
    fontWeight: '600',
  },
  actionButton: {
    padding: spacing.sm,
  },
  emptyContainer: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: tokens.typography.body.size,
    color: colors.textLight,
  },
});

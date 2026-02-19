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
import { listUsers, deactivateUser, type User } from '../services/auth';
import { useToast } from '../contexts/ToastContext';
import { ConfirmDialog } from '../components';
import { colors } from '../theme/colors';

export function AdminPanelScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
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

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchUsers();
      setIsLoading(false);
    };
    loadData();
  }, [fetchUsers]);

  const isCurrentUser = (item: User) => item.email === user?.email;

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      {isCurrentUser(item) ? (
        <View style={styles.youBadge}>
          <Text style={styles.youBadgeText}>Você</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setUserToDeactivate(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons
            name="delete-outline"
            size={22}
            color={colors.secondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
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
            tintColor="#007AFF"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sectionCount: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  youBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  youBadgeText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

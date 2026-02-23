import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';
import { Badge } from './Badge';

interface TaskCardProps {
  title: string;
  date?: string;
  time?: string;
  labels?: { label: string; variant: 'primary' | 'orange' | 'red' | 'green' | 'purple' | 'pink' | 'gray' }[];
  isCompleted?: boolean;
  onPress?: () => void;
  onToggleComplete?: () => void;
}

export function TaskCard({
  title,
  date,
  time,
  labels = [],
  isCompleted = false,
  onPress,
  onToggleComplete,
}: TaskCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, isCompleted && styles.cardCompleted]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
        onPress={onToggleComplete}
      >
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, isCompleted && styles.titleCompleted]}>
          {title}
        </Text>
        {(date || time) && (
          <Text style={styles.datetime}>
            {date}{time ? ` • ${time}` : ''}
          </Text>
        )}
      </View>

      {labels.length > 0 && (
        <View style={styles.labels}>
          {labels.map((label, index) => (
            <Badge
              key={index}
              label={label.label}
              variant={label.variant}
              size="small"
              style={styles.badge}
            />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardCompleted: {
    opacity: 0.7,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  datetime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  labels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginLeft: spacing.sm,
  },
  badge: {
    marginLeft: 2,
  },
});

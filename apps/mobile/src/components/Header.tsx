import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, tokens } from '../theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'transparent';
}

export function Header({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  style,
  variant = 'default',
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const isTransparent = variant === 'transparent';

  return (
    <View
      style={[
        styles.header,
        { paddingTop: insets.top + spacing.sm },
        isTransparent && styles.transparent,
        style,
      ]}
    >
      <View style={styles.headerContent}>
        {leftIcon ? (
          <TouchableOpacity style={styles.iconButton} onPress={onLeftPress}>
            {leftIcon}
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}

        <View style={styles.titleContainer}>
          {subtitle && (
            <Text style={[styles.subtitle, isTransparent && styles.textWhite]}>
              {subtitle}
            </Text>
          )}
          <Text style={[styles.title, isTransparent && styles.textWhite]}>
            {title}
          </Text>
        </View>

        {rightIcon ? (
          <TouchableOpacity style={styles.iconButton} onPress={onRightPress}>
            {rightIcon}
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: tokens.typography.h1.size,
    fontWeight: tokens.typography.h1.weight,
    color: colors.white,
  },
  subtitle: {
    fontSize: tokens.typography.small.size,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  textWhite: {
    color: colors.white,
  },
  iconButton: {
    width: spacing.xxxl,
    height: spacing.xxxl,
    borderRadius: spacing.xxxl / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: spacing.xxxl,
  },
});

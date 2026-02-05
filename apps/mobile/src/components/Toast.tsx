import React, { useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
}

const iconMap: Record<ToastType, keyof typeof MaterialIcons.glyphMap> = {
  success: 'check-circle',
  error: 'error',
  info: 'info',
};

const colorMap: Record<ToastType, string> = {
  success: colors.success,
  error: colors.secondary,
  info: colors.primary,
};

export function Toast({
  visible,
  message,
  type = 'success',
  duration = 3000,
  onHide,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.toast, { borderLeftColor: colorMap[type] }]}
        onPress={hideToast}
        activeOpacity={0.9}
      >
        <MaterialIcons
          name={iconMap[type]}
          size={24}
          color={colorMap[type]}
          style={styles.icon}
        />
        <Text style={styles.message}>{message}</Text>
        <MaterialIcons
          name="close"
          size={20}
          color={colors.textLight}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});

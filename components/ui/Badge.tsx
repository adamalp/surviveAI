import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
}

export function Badge({
  label,
  variant = 'default',
  size = 'md',
  style,
}: BadgeProps) {
  const { colors, spacing, borderRadius } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'success':
        return {
          background: colors.successBackground,
          text: colors.success,
          border: colors.success,
        };
      case 'warning':
        return {
          background: colors.warningBackground,
          text: colors.warning,
          border: colors.warning,
        };
      case 'danger':
        return {
          background: colors.dangerBackground,
          text: colors.danger,
          border: colors.danger,
        };
      case 'info':
        return {
          background: colors.infoBackground,
          text: colors.info,
          border: colors.info,
        };
      case 'default':
      default:
        return {
          background: colors.backgroundTertiary,
          text: colors.textSecondary,
          border: colors.border,
        };
    }
  };

  const badgeColors = getColors();
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: badgeColors.background,
          borderColor: badgeColors.border,
          borderRadius: borderRadius.sm,
          paddingHorizontal: isSmall ? spacing.sm : spacing.md,
          paddingVertical: isSmall ? 2 : spacing.xs,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: badgeColors.text,
            fontSize: isSmall ? 10 : 11,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

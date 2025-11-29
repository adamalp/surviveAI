import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';

import { useTheme } from '@/contexts/ThemeContext';
import { useDeviceStore } from '@/store';
import { Badge } from '@/components/ui';
import { CONFIG } from '@/constants/config';

export default function HomeScreen() {
  const { colors, spacing, borderRadius } = useTheme();
  const {
    latitude,
    longitude,
    elevation,
    batteryLevel,
    isCharging,
    isOffline,
    locationLoading,
    locationError,
    updateLocation,
    updateBattery,
    updateNetworkStatus,
  } = useDeviceStore();

  // Initialize device data on mount
  useEffect(() => {
    updateLocation();
    updateBattery();

    // Subscribe to network status
    const unsubscribe = NetInfo.addEventListener((state) => {
      updateNetworkStatus(!state.isConnected);
    });

    // Refresh battery periodically
    const batteryInterval = setInterval(updateBattery, CONFIG.BATTERY_UPDATE_INTERVAL);

    return () => {
      unsubscribe();
      clearInterval(batteryInterval);
    };
  }, []);

  // Format time
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop() || 'Local';
  };

  // Handle quick action presses
  const handleEmergency = (type: 'lost' | 'injury' | 'wildlife') => {
    useDeviceStore.getState().setEmergencyMode(type);
    router.push('/(tabs)/emergency' as any);
  };

  const handleAskAI = () => {
    // Navigate to the assistant tab
    router.push('/(tabs)/assistant' as any);
  };

  const handleSettings = () => {
    router.push('/(tabs)/settings' as any);
  };

  const lowBattery = batteryLevel !== null && batteryLevel < 20;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Status Card */}
        <View
          style={[
            styles.statusCard,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <View style={styles.statusHeader}>
            <View style={styles.statusTitleRow}>
              <FontAwesome name="map-marker" size={16} color={colors.accent} />
              <Text style={[styles.statusTitle, { color: colors.text }]}>CURRENT STATUS</Text>
            </View>
            <View style={styles.statusBadges}>
              {isOffline && (
                <Badge label="OFFLINE" variant="warning" size="sm" />
              )}
              <TouchableOpacity onPress={handleSettings}>
                <FontAwesome name="cog" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Location */}
          <View style={[styles.statusRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>LOCATION</Text>
            {locationLoading ? (
              <Text style={[styles.statusValue, { color: colors.textMuted }]}>ACQUIRING...</Text>
            ) : locationError ? (
              <Text style={[styles.statusValue, { color: colors.danger }]}>UNAVAILABLE</Text>
            ) : latitude && longitude ? (
              <Text style={[styles.statusValue, { color: colors.text }]}>
                {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
              </Text>
            ) : (
              <Text style={[styles.statusValue, { color: colors.textMuted }]}>--</Text>
            )}
          </View>

          {/* Elevation */}
          <View style={[styles.statusRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>ELEVATION</Text>
            <Text style={[styles.statusValue, { color: colors.text }]}>
              {elevation !== null ? `${Math.round(elevation)} M` : '--'}
            </Text>
          </View>

          {/* Time */}
          <View style={[styles.statusRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>TIME</Text>
            <Text style={[styles.statusValue, { color: colors.text }]}>
              {getCurrentTime()} {getTimezone()}
            </Text>
          </View>

          {/* Battery */}
          <View style={[styles.statusRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>BATTERY</Text>
            <View style={styles.batteryRow}>
              {batteryLevel !== null ? (
                <>
                  <FontAwesome
                    name={isCharging ? 'bolt' : batteryLevel > 50 ? 'battery-full' : batteryLevel > 20 ? 'battery-half' : 'battery-empty'}
                    size={14}
                    color={lowBattery ? colors.danger : colors.success}
                  />
                  <Text
                    style={[
                      styles.statusValue,
                      { color: lowBattery ? colors.danger : colors.text },
                    ]}
                  >
                    {batteryLevel}%{isCharging ? ' CHARGING' : ''}
                  </Text>
                </>
              ) : (
                <Text style={[styles.statusValue, { color: colors.textMuted }]}>--</Text>
              )}
            </View>
          </View>

          {/* Low Battery Warning */}
          {lowBattery && (
            <View
              style={[
                styles.warningBanner,
                { backgroundColor: colors.dangerBackground, borderColor: colors.danger },
              ]}
            >
              <FontAwesome name="exclamation-triangle" size={14} color={colors.danger} />
              <Text style={[styles.warningText, { color: colors.danger }]}>
                Low battery. Consider enabling low-power mode.
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          QUICK ACTIONS
        </Text>

        <View style={styles.actionsGrid}>
          {/* I'm Lost */}
          <TouchableOpacity
            style={[
              styles.actionCard,
              { backgroundColor: colors.dangerBackground, borderColor: colors.danger },
            ]}
            onPress={() => handleEmergency('lost')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.danger }]}>
              <FontAwesome name="question-circle" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.actionTitle, { color: colors.danger }]}>I'M LOST</Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
              Get oriented
            </Text>
          </TouchableOpacity>

          {/* I'm Injured */}
          <TouchableOpacity
            style={[
              styles.actionCard,
              { backgroundColor: colors.dangerBackground, borderColor: colors.danger },
            ]}
            onPress={() => handleEmergency('injury')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.danger }]}>
              <FontAwesome name="plus-square" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.actionTitle, { color: colors.danger }]}>I'M INJURED</Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
              First aid help
            </Text>
          </TouchableOpacity>

          {/* Wildlife */}
          <TouchableOpacity
            style={[
              styles.actionCard,
              { backgroundColor: colors.warningBackground, borderColor: colors.warning },
            ]}
            onPress={() => handleEmergency('wildlife')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.warning }]}>
              <FontAwesome name="paw" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.actionTitle, { color: colors.warning }]}>WILDLIFE</Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
              Animal encounter
            </Text>
          </TouchableOpacity>

          {/* Ask AI */}
          <TouchableOpacity
            style={[
              styles.actionCard,
              { backgroundColor: colors.cardBackground, borderColor: colors.accent },
            ]}
            onPress={handleAskAI}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.accent }]}>
              <FontAwesome name="comment" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.actionTitle, { color: colors.accent }]}>ASK AI</Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
              Survival help
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.backgroundTertiary, borderColor: colors.border },
          ]}
        >
          <FontAwesome name="shield" size={20} color={colors.accent} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            All features work offline. Your location and conversations stay on your device.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  statusCard: {
    borderRadius: 4,
    borderWidth: 1,
    padding: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statusBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 12,
  },
  warningText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 8,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    flexGrow: 1,
    borderRadius: 4,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  actionSubtitle: {
    fontSize: 11,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
});

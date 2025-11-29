import { create } from 'zustand';
import * as Location from 'expo-location';
import { DeviceContext, EmergencyType, InjuryType, WildlifeType, EmergencyState } from '@/types';

interface DeviceStore {
  // Location state
  latitude: number | null;
  longitude: number | null;
  elevation: number | null;
  accuracy: number | null;
  locationError: string | null;
  locationLoading: boolean;

  // Battery state
  batteryLevel: number | null;
  isCharging: boolean;

  // Network state
  isOffline: boolean;

  // Emergency state
  emergency: EmergencyState;

  // Actions
  updateLocation: () => Promise<void>;
  updateBattery: () => Promise<void>;
  updateNetworkStatus: (isOffline: boolean) => void;
  setEmergencyMode: (type: EmergencyType | null, subType?: InjuryType | WildlifeType | null) => void;
  clearEmergency: () => void;
  getDeviceContext: () => DeviceContext;
  refreshAll: () => Promise<void>;
}

// Format time as HH:MM
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// Get timezone abbreviation
const getTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  // Initial state
  latitude: null,
  longitude: null,
  elevation: null,
  accuracy: null,
  locationError: null,
  locationLoading: false,

  batteryLevel: null,
  isCharging: false,

  isOffline: false,

  emergency: {
    type: null,
    subType: null,
    isActive: false,
    startedAt: null,
  },

  // Update location using expo-location
  updateLocation: async () => {
    set({ locationLoading: true, locationError: null });

    try {
      // Check/request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        set({
          locationError: 'Location permission denied',
          locationLoading: false,
        });
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      set({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        elevation: location.coords.altitude,
        accuracy: location.coords.accuracy,
        locationLoading: false,
        locationError: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get location';
      set({
        locationError: message,
        locationLoading: false,
      });
    }
  },

  // Update battery status
  // Note: Requires expo-battery to be installed
  updateBattery: async () => {
    try {
      // Dynamic import to handle case where expo-battery isn't installed yet
      const Battery = await import('expo-battery');
      const level = await Battery.getBatteryLevelAsync();
      const state = await Battery.getBatteryStateAsync();

      set({
        batteryLevel: level >= 0 ? Math.round(level * 100) : null,
        isCharging: state === Battery.BatteryState.CHARGING,
      });
    } catch (error) {
      // Battery API may not be available (simulator, etc.)
      console.warn('Battery API not available:', error);
    }
  },

  // Update network status
  updateNetworkStatus: (isOffline: boolean) => {
    set({ isOffline });
  },

  // Set emergency mode
  setEmergencyMode: (type, subType = null) => {
    set({
      emergency: {
        type,
        subType: subType ?? null,
        isActive: type !== null,
        startedAt: type !== null ? Date.now() : null,
      },
    });
  },

  // Clear emergency
  clearEmergency: () => {
    set({
      emergency: {
        type: null,
        subType: null,
        isActive: false,
        startedAt: null,
      },
    });
  },

  // Get formatted device context for AI injection
  getDeviceContext: (): DeviceContext => {
    const state = get();
    const now = new Date();

    return {
      location: {
        latitude: state.latitude,
        longitude: state.longitude,
        elevation_m: state.elevation,
        accuracy_m: state.accuracy,
      },
      time: {
        local_time: formatTime(now),
        timezone: getTimezone(),
      },
      device: {
        battery_percent: state.batteryLevel,
        is_charging: state.isCharging,
      },
      network: {
        is_offline: state.isOffline,
      },
      user_state: {
        emergency_mode: state.emergency.type,
      },
    };
  },

  // Refresh all device data
  refreshAll: async () => {
    const { updateLocation, updateBattery } = get();
    await Promise.all([updateLocation(), updateBattery()]);
  },
}));

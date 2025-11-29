import React, { useState, useEffect, useRef } from 'react';
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
import * as Location from 'expo-location';

import { useTheme } from '@/contexts/ThemeContext';
import { Badge } from '@/components/ui';
import {
  subscribeToCompass,
  getCardinalDirection,
  isCompassAvailable,
  startSOSLoop,
} from '@/lib/hardware';

export default function ToolsScreen() {
  const { colors, spacing, borderRadius } = useTheme();
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [compassAvailable, setCompassAvailable] = useState<boolean | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const sosControllerRef = useRef<{ stop: () => void } | null>(null);

  // Check compass availability and subscribe
  useEffect(() => {
    let subscription: { remove: () => void } | null = null;

    (async () => {
      const available = await isCompassAvailable();
      setCompassAvailable(available);

      if (available) {
        subscription = subscribeToCompass((heading) => {
          setCompassHeading(heading);
        });
      }
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Get location on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(loc);
      } catch (error) {
        setLocationError('Could not get location');
      }
    })();
  }, []);

  // Handle SOS toggle
  const toggleSOS = () => {
    if (sosActive) {
      // Stop SOS
      if (sosControllerRef.current) {
        sosControllerRef.current.stop();
        sosControllerRef.current = null;
      }
      setSosActive(false);
      setFlashlightOn(false);
    } else {
      // Start SOS (simulated - real implementation needs native torch)
      setSosActive(true);
      sosControllerRef.current = startSOSLoop(async (on) => {
        setFlashlightOn(on);
        // TODO: Control actual torch here
      });
    }
  };

  // Cleanup SOS on unmount
  useEffect(() => {
    return () => {
      if (sosControllerRef.current) {
        sosControllerRef.current.stop();
      }
    };
  }, []);

  // Format coordinates for display
  const formatCoordinate = (value: number, isLatitude: boolean) => {
    const direction = isLatitude
      ? value >= 0 ? 'N' : 'S'
      : value >= 0 ? 'E' : 'W';
    const absValue = Math.abs(value);
    const degrees = Math.floor(absValue);
    const minutes = Math.floor((absValue - degrees) * 60);
    const seconds = ((absValue - degrees - minutes / 60) * 3600).toFixed(1);
    return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
  };

  // Get cardinal direction from heading (use imported function)
  const getDirection = (heading: number) => getCardinalDirection(heading);

  const refreshLocation = async () => {
    setLocationError(null);
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc);
    } catch (error) {
      setLocationError('Could not get location');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Compass Section */}
        <View
          style={[
            styles.toolCard,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <View style={styles.toolHeader}>
            <View style={[styles.toolIcon, { backgroundColor: colors.backgroundTertiary }]}>
              <FontAwesome name="compass" size={20} color={colors.accent} />
            </View>
            <Text style={[styles.toolTitle, { color: colors.text }]}>COMPASS</Text>
            <Badge label="HARDWARE" variant="default" size="sm" />
          </View>
          <View style={styles.compassContainer}>
            <View
              style={[
                styles.compassRose,
                { borderColor: colors.accent, backgroundColor: colors.backgroundTertiary },
              ]}
            >
              <Text style={[styles.compassDirection, { color: colors.danger }]}>N</Text>
              <View style={styles.compassCenter}>
                <Text style={[styles.compassHeading, { color: colors.text }]}>
                  {compassHeading !== null ? `${Math.round(compassHeading)}°` : '--°'}
                </Text>
                <Text style={[styles.compassCardinal, { color: colors.accent }]}>
                  {compassHeading !== null ? getDirection(compassHeading) : '--'}
                </Text>
              </View>
            </View>
            <Text style={[styles.compassNote, { color: colors.textMuted }]}>
              {compassAvailable === false
                ? 'Magnetometer not available on this device'
                : compassAvailable === null
                ? 'Checking magnetometer...'
                : 'Live compass data from device magnetometer'}
            </Text>
          </View>
        </View>

        {/* GPS Section */}
        <View
          style={[
            styles.toolCard,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <View style={styles.toolHeader}>
            <View style={[styles.toolIcon, { backgroundColor: colors.backgroundTertiary }]}>
              <FontAwesome name="crosshairs" size={20} color={colors.accent} />
            </View>
            <Text style={[styles.toolTitle, { color: colors.text }]}>GPS POSITION</Text>
            <TouchableOpacity
              style={[styles.refreshButton, { borderColor: colors.border }]}
              onPress={refreshLocation}
            >
              <FontAwesome name="refresh" size={14} color={colors.accent} />
            </TouchableOpacity>
          </View>
          {locationError ? (
            <View
              style={[
                styles.errorBanner,
                { backgroundColor: colors.dangerBackground, borderColor: colors.danger },
              ]}
            >
              <FontAwesome name="exclamation-triangle" size={14} color={colors.danger} />
              <Text style={[styles.errorText, { color: colors.danger }]}>{locationError}</Text>
            </View>
          ) : location ? (
            <View style={styles.coordinatesContainer}>
              <View style={[styles.coordinateRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.coordinateLabel, { color: colors.textSecondary }]}>LAT</Text>
                <Text style={[styles.coordinateValue, { color: colors.text }]}>
                  {formatCoordinate(location.coords.latitude, true)}
                </Text>
              </View>
              <View style={[styles.coordinateRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.coordinateLabel, { color: colors.textSecondary }]}>LNG</Text>
                <Text style={[styles.coordinateValue, { color: colors.text }]}>
                  {formatCoordinate(location.coords.longitude, false)}
                </Text>
              </View>
              {location.coords.altitude !== null && (
                <View style={[styles.coordinateRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.coordinateLabel, { color: colors.textSecondary }]}>ALT</Text>
                  <Text style={[styles.coordinateValue, { color: colors.text }]}>
                    {Math.round(location.coords.altitude)} M
                  </Text>
                </View>
              )}
              <View style={[styles.coordinateRow, { borderBottomWidth: 0 }]}>
                <Text style={[styles.coordinateLabel, { color: colors.textSecondary }]}>ACC</Text>
                <Text style={[styles.coordinateValue, { color: colors.text }]}>
                  ±{Math.round(location.coords.accuracy || 0)} M
                </Text>
              </View>
              <View
                style={[
                  styles.decimalCoords,
                  { backgroundColor: colors.backgroundTertiary, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.decimalCoordsText, { color: colors.accent }]}>
                  {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                ACQUIRING SIGNAL...
              </Text>
            </View>
          )}
        </View>

        {/* Flashlight Section */}
        <View
          style={[
            styles.toolCard,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <View style={styles.toolHeader}>
            <View style={[styles.toolIcon, { backgroundColor: colors.backgroundTertiary }]}>
              <FontAwesome name="lightbulb-o" size={20} color={colors.accent} />
            </View>
            <Text style={[styles.toolTitle, { color: colors.text }]}>SIGNALING</Text>
          </View>
          <View style={styles.flashlightContainer}>
            <TouchableOpacity
              style={[
                styles.flashlightButton,
                { backgroundColor: flashlightOn ? colors.accent : colors.backgroundTertiary, borderColor: flashlightOn ? colors.accent : colors.border },
              ]}
              onPress={() => setFlashlightOn(!flashlightOn)}
            >
              <FontAwesome
                name={flashlightOn ? 'sun-o' : 'moon-o'}
                size={28}
                color={flashlightOn ? '#FFFFFF' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.flashlightText,
                  { color: flashlightOn ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                {flashlightOn ? 'LIGHT ON' : 'LIGHT OFF'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sosButton,
                { backgroundColor: sosActive ? colors.danger : colors.backgroundTertiary, borderColor: sosActive ? colors.danger : colors.border },
              ]}
              onPress={toggleSOS}
            >
              <Text
                style={[
                  styles.sosText,
                  { color: sosActive ? '#FFFFFF' : colors.danger },
                ]}
              >
                SOS
              </Text>
              <Text
                style={[
                  styles.sosSubtext,
                  { color: sosActive ? '#FFFFFF' : colors.textMuted },
                ]}
              >
                {sosActive ? 'ACTIVE' : 'MORSE'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.toolNote, { color: colors.textMuted }]}>
            {sosActive
              ? 'SOS pattern: ... --- ... (morse code)'
              : 'Torch control requires physical device'}
          </Text>
        </View>

        {/* Info Section */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.backgroundTertiary, borderColor: colors.border },
          ]}
        >
          <FontAwesome name="shield" size={20} color={colors.accent} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            These tools work offline using your device's hardware. GPS coordinates can be shared with rescue services even without cell signal.
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
  toolCard: {
    borderRadius: 4,
    borderWidth: 1,
    padding: 16,
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  toolIcon: {
    width: 36,
    height: 36,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    flex: 1,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassContainer: {
    alignItems: 'center',
  },
  compassRose: {
    width: 140,
    height: 140,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  compassDirection: {
    position: 'absolute',
    top: 8,
    fontSize: 16,
    fontWeight: '700',
  },
  compassCenter: {
    alignItems: 'center',
  },
  compassHeading: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  compassCardinal: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  compassNote: {
    fontSize: 11,
    marginTop: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  coordinatesContainer: {
    gap: 0,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  coordinateLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  coordinateValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  decimalCoords: {
    marginTop: 12,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
  },
  decimalCoordsText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
  },
  flashlightContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  flashlightButton: {
    width: 100,
    height: 100,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashlightText: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  sosButton: {
    width: 100,
    height: 100,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosText: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 2,
  },
  sosSubtext: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 1,
  },
  toolNote: {
    fontSize: 11,
    marginTop: 12,
    textAlign: 'center',
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

import { Magnetometer, MagnetometerMeasurement } from 'expo-sensors';
import { Subscription } from 'expo-sensors/build/Pedometer';

// Calculate heading from magnetometer data
const calculateHeading = (measurement: MagnetometerMeasurement): number => {
  const { x, y } = measurement;

  // Calculate angle in radians and convert to degrees
  let heading = Math.atan2(y, x) * (180 / Math.PI);

  // Normalize to 0-360
  if (heading < 0) {
    heading += 360;
  }

  // Adjust so 0 is North (magnetometer returns 0 at East)
  heading = (heading + 90) % 360;

  return Math.round(heading);
};

// Get cardinal direction from heading
export const getCardinalDirection = (heading: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(heading / 45) % 8;
  return directions[index];
};

// Subscribe to compass heading updates
export const subscribeToCompass = (
  onHeading: (heading: number) => void,
  updateInterval: number = 100
): Subscription => {
  // Set update interval
  Magnetometer.setUpdateInterval(updateInterval);

  // Subscribe to magnetometer
  return Magnetometer.addListener((measurement) => {
    const heading = calculateHeading(measurement);
    onHeading(heading);
  });
};

// Check if magnetometer is available
export const isCompassAvailable = async (): Promise<boolean> => {
  return Magnetometer.isAvailableAsync();
};

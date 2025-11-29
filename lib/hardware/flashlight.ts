// SOS morse code pattern: ... --- ...
// Short (dot) = 200ms, Long (dash) = 600ms, Gap between = 200ms

const SHORT = 200; // Duration for dot
const LONG = 600;  // Duration for dash
const GAP = 200;   // Gap between signals
const LETTER_GAP = 600; // Gap between letters (3x GAP)

// SOS pattern delays: [on, off, on, off, ...]
// S: . . .
// O: - - -
// S: . . .
const SOS_PATTERN = [
  // S: ...
  SHORT, GAP, SHORT, GAP, SHORT, LETTER_GAP,
  // O: ---
  LONG, GAP, LONG, GAP, LONG, LETTER_GAP,
  // S: ...
  SHORT, GAP, SHORT, GAP, SHORT, LETTER_GAP * 2, // Longer pause before repeat
];

// Execute SOS pattern with a torch control function
export const flashSOS = async (
  setTorch: (on: boolean) => Promise<void> | void,
  signal: { cancelled: boolean }
): Promise<void> => {
  let isOn = false;

  for (let i = 0; i < SOS_PATTERN.length; i++) {
    if (signal.cancelled) {
      await setTorch(false);
      return;
    }

    // Toggle light
    isOn = i % 2 === 0;
    await setTorch(isOn);

    // Wait for pattern duration
    await sleep(SOS_PATTERN[i]);
  }

  // Turn off at end
  await setTorch(false);
};

// Run SOS pattern in a loop
export const startSOSLoop = (
  setTorch: (on: boolean) => Promise<void> | void
): { stop: () => void } => {
  const signal = { cancelled: false };

  const runLoop = async () => {
    while (!signal.cancelled) {
      await flashSOS(setTorch, signal);
    }
  };

  runLoop();

  return {
    stop: () => {
      signal.cancelled = true;
    },
  };
};

// Sleep helper
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Note: Actual torch control requires native module
// expo-camera has torch support in Camera component
// For standalone torch, consider react-native-torch

export interface FlashlightController {
  turnOn: () => Promise<void>;
  turnOff: () => Promise<void>;
  toggle: () => Promise<void>;
  isOn: () => boolean;
}

// Placeholder controller - implement with native module
export const createFlashlightController = (): FlashlightController => {
  let on = false;

  return {
    turnOn: async () => {
      on = true;
      // TODO: Implement with native torch module
      console.log('Flashlight ON (simulated)');
    },
    turnOff: async () => {
      on = false;
      // TODO: Implement with native torch module
      console.log('Flashlight OFF (simulated)');
    },
    toggle: async () => {
      on = !on;
      // TODO: Implement with native torch module
      console.log(`Flashlight ${on ? 'ON' : 'OFF'} (simulated)`);
    },
    isOn: () => on,
  };
};

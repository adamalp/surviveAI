# SurviveAI

Offline-first survival assistant with on-device AI.

## Tech Stack

- **Framework:** React Native + Expo SDK 54
- **Language:** TypeScript
- **AI:** Cactus SDK (`cactus-react-native`)
- **State:** Zustand
- **Navigation:** Expo Router

## App Structure

### Tabs (4 visible)
- `home.tsx` - Status dashboard, quick actions
- `assistant.tsx` - AI chat interface
- `tools.tsx` - Compass, GPS, flashlight
- `settings.tsx` - App settings

### Hidden Routes
- `emergency.tsx` - Emergency flows (Lost, Injury, Wildlife)
- `index.tsx` - Redirects to home

## Key Files

```
store/
├── chat-store.ts      # Conversations, messages, streaming
├── device-store.ts    # GPS, battery, network, emergency state
└── model-store.ts     # AI model loading

lib/cactus/
├── model.ts           # Model initialization
├── chat.ts            # Completions with context injection
└── constants.ts       # System prompt

lib/hardware/
├── compass.ts         # Magnetometer subscription
├── flashlight.ts      # SOS morse code pattern
└── index.ts           # Exports
```

## Context Injection

Device context is injected into every AI request via `device-store.ts`:

```typescript
// getDeviceContext() returns:
{
  location: { latitude, longitude, elevation_m, accuracy_m },
  time: { local_time, timezone },
  device: { battery_percent, is_charging },
  network: { is_offline },
  user_state: { emergency_mode }
}
```

This is passed to `sendMessage()` and built into the system prompt in `lib/cactus/chat.ts`.

## Navigation Patterns

```typescript
// Navigate to assistant tab
router.push('/(tabs)/assistant' as any);

// Navigate to emergency with state
useDeviceStore.getState().setEmergencyMode('lost');
router.push('/(tabs)/emergency' as any);
```

## Commands

```bash
npx expo start          # Dev server
npx expo start --clear  # Clear cache
npx expo run:ios        # Native iOS build
```

## Key Dependencies

- `cactus-react-native` - On-device LLM
- `expo-location` - GPS
- `expo-sensors` - Magnetometer (compass)
- `expo-battery` - Battery level
- `@react-native-community/netinfo` - Network status
- `react-native-markdown-display` - Render AI responses

## Completion Settings

In `lib/cactus/chat.ts`:
- `maxTokens: 1024` - Response length limit
- Context injection enabled
- Streaming supported via `onToken` callback

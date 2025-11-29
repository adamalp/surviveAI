# SurviveAI

Offline-first survival assistant with on-device AI.

## Tech Stack

- **Framework:** React Native + Expo SDK 54
- **Language:** TypeScript
- **AI:** Cactus SDK (`cactus-react-native`) with Tool Calling & STT
- **State:** Zustand
- **Navigation:** Expo Router

## App Structure

### Tabs (4 visible)
- `index.tsx` - Status dashboard, quick actions
- `chat/` - AI chat interface with voice input
- `tools.tsx` - Compass, GPS, flashlight
- `settings.tsx` - App settings
- `checklists.tsx` - Survival checklists

### Hidden Routes
- `emergency.tsx` - Emergency flows (Lost, Injury, Wildlife)

## Key Files

```
store/
├── chat-store.ts      # Conversations, messages, streaming
├── device-store.ts    # GPS, battery, network, emergency state
├── model-store.ts     # AI model loading
└── stt-store.ts       # Speech-to-text state & recording

lib/cactus/
├── model.ts           # Model initialization
├── chat.ts            # Completions with tool calling & metrics
├── constants.ts       # System prompt
├── tools.ts           # Tool definitions for knowledge lookup
├── stt.ts             # Whisper speech-to-text wrapper
├── quality.ts         # Response quality analysis
└── prompts.ts         # Prompt templates

lib/knowledge/
├── index.ts           # Knowledge search & retrieval
├── types.ts           # Knowledge entry types
├── cache-matcher.ts   # Cached Q&A matching
├── cached-qa.ts       # Pre-cached survival Q&A pairs
├── first-aid.ts       # First aid knowledge (FM 21-76)
├── water.ts           # Water procurement & purification
├── shelter.ts         # Shelter building techniques
├── fire.ts            # Fire starting methods
├── food.ts            # Food procurement
├── navigation.ts      # Land navigation
├── signaling.ts       # Rescue signaling
└── psychology.ts      # Survival psychology

lib/hardware/
├── compass.ts         # Magnetometer subscription
├── flashlight.ts      # SOS morse code pattern
└── index.ts           # Exports

components/
├── chat/
│   ├── MessageBubble.tsx  # Message display with metrics badge
│   ├── VoiceInput.tsx     # Mic button for speech-to-text
│   └── index.ts
└── ui/
    ├── Button.tsx
    ├── Card.tsx
    ├── Badge.tsx
    ├── Input.tsx
    └── IconButton.tsx
```

## Cactus SDK Integration

### Tool Calling
The model can dynamically query the knowledge base using function calling:

```typescript
// lib/cactus/tools.ts
const SURVIVAL_TOOLS: Tool[] = [{
  name: 'lookup_survival_knowledge',
  description: 'Look up survival knowledge from the database',
  parameters: {
    type: 'object',
    properties: {
      topic: { type: 'string' }, // first-aid, water, shelter, fire, etc.
      query: { type: 'string' }, // specific question
    },
    required: ['topic'],
  },
}];
```

When used, responses show a "Knowledge-Enhanced" badge.

### Speech-to-Text
Voice input using Whisper model:

```typescript
// lib/cactus/stt.ts
import { CactusSTT } from 'cactus-react-native';

// Downloads whisper-small model (~50MB) on first use
await downloadSTTModel();
await initializeSTT();
const { text } = await transcribeAudio(audioFilePath);
```

### Performance Metrics
Displayed on assistant messages:

```typescript
interface PerformanceMetrics {
  tokensPerSecond: number;      // e.g., 12.5 tok/s
  timeToFirstTokenMs: number;   // Time to first token
  totalTimeMs: number;          // Total generation time
  totalTokens: number;          // Tokens generated
}
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

## Knowledge Base

Sourced from FM 21-76 Army Survival Manual. Topics:
- `first-aid` - Bleeding, shock, fractures, burns, CPR
- `water` - Finding, collecting, purifying water
- `shelter` - Building shelter types for different climates
- `fire` - Fire starting, materials, techniques
- `food` - Edible plants, hunting, fishing, insects
- `navigation` - Using sun, stars, maps, terrain
- `signaling` - Ground-to-air signals, mirrors, fires
- `psychology` - Survival mindset, stress management

## Navigation Patterns

```typescript
// Navigate to assistant tab
router.push('/(tabs)/chat' as any);

// Navigate to emergency with state
useDeviceStore.getState().setEmergencyMode('lost');
router.push('/(tabs)/emergency' as any);
```

## Commands

```bash
npx expo start          # Dev server
npx expo start --clear  # Clear cache
npx expo run:ios        # Native iOS build (required for Cactus)
npx expo run:android    # Native Android build
```

## Key Dependencies

- `cactus-react-native` - On-device LLM with tool calling & STT
- `expo-location` - GPS
- `expo-sensors` - Magnetometer (compass)
- `expo-battery` - Battery level
- `expo-av` - Audio recording for voice input
- `@react-native-community/netinfo` - Network status
- `react-native-markdown-display` - Render AI responses

## Completion Settings

In `lib/cactus/chat.ts`:
- `maxTokens: 1024` - Response length limit
- Tool calling enabled for knowledge retrieval
- Context injection enabled
- Streaming supported via `onToken` callback
- Performance metrics captured from completion results

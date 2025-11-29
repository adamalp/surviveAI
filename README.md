# SurviveAI

An offline-first mobile survival assistant powered by on-device AI. Get survival guidance, emergency help, and critical tools - all without cell service.

## Features

### AI Survival Assistant
- Natural language survival Q&A powered by on-device LLM
- **Voice Input** - Hands-free queries via speech-to-text (Whisper)
- **Knowledge-Grounded Responses** - Dynamically retrieves from FM 21-76 Army Survival Manual
- Context-aware responses (knows your location, time, battery level)
- Streaming responses with markdown rendering
- Performance metrics display (tokens/sec, generation time)

### Home Dashboard
- Real-time device status (GPS coordinates, elevation, battery, time)
- Quick action buttons for emergency situations
- AI model status and offline indicator

### Emergency Flows
- **I'm Lost** - S.T.O.P. protocol guidance (Sit, Think, Observe, Plan)
- **I'm Injured** - First aid triage (bleeding, fractures, head injuries)
- **Wildlife Encounter** - Animal-specific guidance (bear, cougar, snake)

### Survival Tools
- **Compass** - Real magnetometer data with cardinal directions
- **GPS** - Precise coordinates in multiple formats
- **Flashlight** - Torch control with SOS morse code pattern

### Survival Checklists
- Pre-built checklists for common scenarios
- Create custom checklists
- Track completion progress

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native + Expo SDK 54 |
| AI Inference | Cactus SDK (on-device LLM + STT) |
| Navigation | Expo Router (file-based) |
| State | Zustand |
| Storage | AsyncStorage |

## AI Capabilities

### On-Device LLM
- Runs completely offline - no internet required
- Context injection with device state (GPS, battery, time)
- Tool calling for dynamic knowledge retrieval
- Streaming responses with real-time token display

### Speech-to-Text
- Whisper model for voice transcription
- Auto-downloads on first use (~244MB)
- Hands-free input for emergency situations
- **Note:** Requires real device (iOS simulator not supported)

### Knowledge Base
Embedded survival knowledge from FM 21-76 Army Survival Manual:
- First Aid (bleeding, shock, fractures, burns, CPR)
- Water (finding, collecting, purifying)
- Shelter (building techniques for different climates)
- Fire (starting methods, materials, techniques)
- Food (edible plants, hunting, fishing, insects)
- Navigation (sun, stars, maps, terrain)
- Signaling (ground-to-air signals, mirrors, fires)
- Psychology (survival mindset, stress management)

## Project Structure

```
app/
├── (tabs)/
│   ├── index.tsx         # Status dashboard + quick actions
│   ├── chat/             # AI chat interface with voice input
│   ├── tools.tsx         # Compass, GPS, flashlight
│   ├── checklists.tsx    # Survival checklists
│   ├── settings.tsx      # App configuration
│   ├── emergency.tsx     # Emergency flow screens
│   └── _layout.tsx       # Tab navigation
├── _layout.tsx           # Root layout with theme
└── +not-found.tsx

components/
├── chat/
│   ├── MessageBubble.tsx # Message display with metrics
│   └── VoiceInput.tsx    # Mic button for STT
└── ui/                   # Reusable UI components

lib/
├── cactus/               # AI model wrapper
│   ├── model.ts          # LLM initialization
│   ├── chat.ts           # Completions with tool calling
│   ├── stt.ts            # Speech-to-text wrapper
│   ├── tools.ts          # Tool definitions
│   └── constants.ts      # System prompts
├── knowledge/            # Embedded survival knowledge
│   ├── first-aid.ts
│   ├── water.ts
│   ├── shelter.ts
│   └── ...
└── hardware/             # Device hardware
    ├── compass.ts
    └── flashlight.ts

store/
├── chat-store.ts         # Conversations & messages
├── device-store.ts       # GPS, battery, network state
├── model-store.ts        # AI model loading state
├── stt-store.ts          # Speech-to-text state
└── settings-store.ts     # User preferences
```

## Context Injection

The AI receives real-time device context with every message:

```
CURRENT DEVICE CONTEXT:
- Location: 37.7749, -122.4194
- Elevation: 10m
- Time: 14:30 America/Los_Angeles
- Battery: 85%
- Network: OFFLINE
- EMERGENCY MODE: LOST
```

This enables location-aware, time-appropriate survival advice.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS simulator (required for Cactus SDK)
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

## Requirements

- Node.js 18+
- iOS 15+ or Android 10+
- ~3GB storage for AI model
- ~244MB additional for voice input (Whisper model)

## Offline Architecture

- AI model runs entirely on-device
- Speech-to-text runs on-device (Whisper)
- No network calls for core features
- GPS/compass work without signal
- All data stays on your device
- Embedded knowledge base for survival topics

---

**Built for when you need it most - and there's no signal.**

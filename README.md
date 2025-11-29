# SurviveAI

An offline-first mobile survival assistant powered by on-device AI. Get survival guidance, emergency help, and critical tools - all without cell service.

## Features

### Home Dashboard
- Real-time device status (GPS coordinates, elevation, battery, time)
- Quick action buttons for emergency situations
- Offline/online indicator

### AI Survival Assistant
- Natural language survival Q&A
- Context-aware responses (knows your location, time, battery level)
- Streaming responses with markdown rendering
- Suggested prompts for common survival questions

### Emergency Flows
- **I'm Lost** - S.T.O.P. protocol guidance (Sit, Think, Observe, Plan)
- **I'm Injured** - First aid triage (bleeding, fractures, head injuries)
- **Wildlife Encounter** - Animal-specific guidance (bear, cougar, snake)

### Survival Tools
- **Compass** - Real magnetometer data with cardinal directions
- **GPS** - Precise coordinates in multiple formats
- **Flashlight** - Torch control with SOS morse code pattern

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native + Expo SDK 54 |
| AI Inference | Cactus SDK (on-device LLM) |
| Navigation | Expo Router (file-based) |
| State | Zustand |
| Storage | AsyncStorage |

## Project Structure

```
app/
├── (tabs)/
│   ├── home.tsx          # Status dashboard + quick actions
│   ├── assistant.tsx     # AI chat interface
│   ├── tools.tsx         # Compass, GPS, flashlight
│   ├── settings.tsx      # App configuration
│   ├── emergency.tsx     # Emergency flow screens
│   └── _layout.tsx       # Tab navigation
├── _layout.tsx           # Root layout with theme
└── +not-found.tsx

components/ui/            # Reusable UI components

contexts/
└── ThemeContext.tsx      # Dark/light theme

lib/
├── cactus/               # AI model wrapper
│   ├── model.ts          # Model initialization
│   ├── chat.ts           # Completion with context injection
│   └── constants.ts      # System prompts
└── hardware/             # Device hardware
    ├── compass.ts        # Magnetometer subscription
    └── flashlight.ts     # SOS morse code

store/
├── chat-store.ts         # Conversations & messages
├── device-store.ts       # GPS, battery, network state
├── model-store.ts        # AI model loading state
└── settings-store.ts     # User preferences

types/
└── index.ts              # TypeScript definitions
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

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

## Requirements

- Node.js 18+
- iOS 15+ or Android 10+
- ~3GB storage for AI model

## Offline Architecture

- AI model runs entirely on-device
- No network calls for core features
- GPS/compass work without signal
- All data stays on your device

---

**Built for when you need it most - and there's no signal.**

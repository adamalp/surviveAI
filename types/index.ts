// Conversation types
export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
  preview: string; // Last message preview
}

// Response source types for tracking where answers come from
// 'model' = pure model generation, 'knowledge-grounded' = model with knowledge injection
export type ResponseSource = 'model' | 'knowledge-grounded';

// Performance metrics from model inference
export interface PerformanceMetrics {
  tokensPerSecond: number;
  timeToFirstTokenMs: number;
  totalTimeMs: number;
  totalTokens: number;
}

// Chat types
export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  images?: string[]; // Array of image URIs for vision models
  source?: ResponseSource; // Where the response came from (model or knowledge-grounded)
  knowledgeEntryId?: string; // ID of knowledge entry used for grounding
  metrics?: PerformanceMetrics; // Model inference performance metrics
}

// Model types
export interface ModelInfo {
  name: string;
  filename: string;
  size: number; // bytes
  url: string;
  description: string;
}

export interface ModelState {
  isLoaded: boolean;
  isLoading: boolean;
  loadProgress: number;
  error: string | null;
  currentModel: string | null;
}

// Checklist types
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  description: string;
  category?: string;
  items: ChecklistItem[];
  isBuiltIn: boolean;
  createdAt: number;
}

// Tool types
export interface GPSCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  timestamp: number;
}

export interface CompassData {
  heading: number; // degrees from north
  accuracy: number;
}

// Emergency types
export type EmergencyType = 'lost' | 'injury' | 'wildlife' | 'other';
export type InjuryType = 'bleeding' | 'broken_bone' | 'head_injury' | 'other';
export type WildlifeType = 'bear' | 'cougar' | 'snake' | 'other';

export interface EmergencyState {
  type: EmergencyType | null;
  subType: InjuryType | WildlifeType | null;
  isActive: boolean;
  startedAt: number | null;
}

// Device context types (for AI injection)
export interface DeviceContext {
  location: {
    latitude: number | null;
    longitude: number | null;
    elevation_m: number | null;
    accuracy_m: number | null;
  };
  time: {
    local_time: string;
    timezone: string;
  };
  device: {
    battery_percent: number | null;
    is_charging: boolean;
  };
  network: {
    is_offline: boolean;
  };
  user_state: {
    emergency_mode: EmergencyType | null;
  };
}

// Battery types
export interface BatteryInfo {
  level: number; // 0-1
  isCharging: boolean;
}

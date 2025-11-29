import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';

interface EmergencyInfo {
  title: string;
  icon: string;
  color: string;
}

interface EmptyStateProps {
  emergencyType: 'lost' | 'injury' | 'wildlife' | null;
  onSelectPrompt: (prompt: string) => void;
  colors: any;
}

// Emergency-specific prompts
const EMERGENCY_PROMPTS: Record<string, string[]> = {
  lost: [
    'I\'m lost - what should I do first?',
    'How do I signal for help?',
    'How can I find my way back to civilization?',
    'What are the survival priorities when lost?',
  ],
  injury: [
    'How do I treat a deep cut in the wilderness?',
    'What are the signs of shock and how to treat it?',
    'How do I splint a broken bone?',
    'When should I move vs stay put with an injury?',
  ],
  wildlife: [
    'I encountered a bear - what should I do?',
    'How do I treat a snake bite?',
    'What should I do if attacked by a mountain lion?',
    'How do I avoid attracting wild animals to my camp?',
  ],
  default: [
    'How do I purify water in the wilderness?',
    'What are the signs of hypothermia?',
    'How do I build an emergency shelter?',
    'What should I do if I get lost?',
  ],
};

// Emergency mode display info
const EMERGENCY_INFO: Record<string, EmergencyInfo> = {
  lost: { title: "I'm Lost", icon: 'compass', color: '' },
  injury: { title: 'Injury / Medical', icon: 'medkit', color: '' },
  wildlife: { title: 'Wildlife Encounter', icon: 'paw', color: '' },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  emergencyType,
  onSelectPrompt,
  colors,
}) => {
  // Update emergency info colors dynamically
  const emergencyInfo = useMemo(() => {
    return {
      lost: { ...EMERGENCY_INFO.lost, color: colors.danger },
      injury: { ...EMERGENCY_INFO.injury, color: colors.danger },
      wildlife: { ...EMERGENCY_INFO.wildlife, color: colors.warning },
    };
  }, [colors]);

  const prompts = useMemo(() => {
    if (emergencyType && EMERGENCY_PROMPTS[emergencyType]) {
      return EMERGENCY_PROMPTS[emergencyType];
    }
    return EMERGENCY_PROMPTS.default;
  }, [emergencyType]);

  const currentEmergency = emergencyType ? emergencyInfo[emergencyType] : null;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.icon,
          {
            backgroundColor: currentEmergency
              ? currentEmergency.color + '20'
              : colors.backgroundTertiary,
            borderColor: colors.border,
          },
        ]}
      >
        {currentEmergency ? (
          <Ionicons
            name={currentEmergency.icon as any}
            size={32}
            color={currentEmergency.color}
          />
        ) : (
          <FontAwesome name="leaf" size={32} color={colors.accent} />
        )}
      </View>
      <Text style={[styles.title, { color: colors.text }]}>
        {currentEmergency ? currentEmergency.title : 'Survival Assistant'}
      </Text>
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        {emergencyType
          ? 'Select a question below or describe your situation for immediate guidance.'
          : 'Ask me anything about survival, first aid, navigation, or emergency preparedness.'}
      </Text>
      <View style={styles.suggestions}>
        {prompts.map((prompt, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.suggestion,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
            onPress={() => onSelectPrompt(prompt)}
          >
            <Text style={[styles.suggestionText, { color: colors.accent }]}>
              {prompt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 24,
    lineHeight: 22,
  },
  suggestions: {
    width: '100%',
    paddingHorizontal: 16,
    gap: 10,
  },
  suggestion: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

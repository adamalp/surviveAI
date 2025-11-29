import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useSTTStore } from '@/store/stt-store';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onTranscription, disabled = false }: VoiceInputProps) {
  const { colors, borderRadius, spacing } = useTheme();
  const {
    isRecording,
    isTranscribing,
    isDownloading,
    isInitializing,
    downloadProgress,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useSTTStore();

  // Pulse animation for recording indicator
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim]);

  const handlePress = async () => {
    if (disabled) return;

    try {
      if (isRecording) {
        const text = await stopRecording();
        if (text && text.trim()) {
          onTranscription(text.trim());
        }
      } else {
        await startRecording();
      }
    } catch (err) {
      console.error('Voice input error:', err);
    }
  };

  const handleLongPress = () => {
    if (isRecording) {
      cancelRecording();
    }
  };

  const isLoading = isDownloading || isInitializing || isTranscribing;
  const isDisabled = disabled || isLoading;

  const getIcon = () => {
    if (isTranscribing) {
      return <ActivityIndicator size="small" color={colors.text} />;
    }
    if (isRecording) {
      return <Ionicons name="stop" size={20} color="#FFFFFF" />;
    }
    return <Ionicons name="mic" size={20} color={colors.text} />;
  };

  const getBackgroundColor = () => {
    if (isRecording) return colors.danger;
    if (isDisabled) return colors.border;
    return colors.backgroundTertiary;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: getBackgroundColor(),
            borderRadius: borderRadius.md,
            borderColor: isRecording ? colors.danger : colors.border,
          },
        ]}
        onPress={handlePress}
        onLongPress={handleLongPress}
        disabled={isDisabled}
        activeOpacity={0.7}
        delayLongPress={500}
      >
        {isRecording ? (
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            {getIcon()}
          </Animated.View>
        ) : (
          getIcon()
        )}
      </TouchableOpacity>

      {/* Status indicators */}
      {isRecording && (
        <View style={[styles.statusBadge, { backgroundColor: colors.danger }]}>
          <View style={[styles.recordingDot, { backgroundColor: '#FFFFFF' }]} />
          <Text style={[styles.statusText, { color: '#FFFFFF' }]}>
            Recording...
          </Text>
        </View>
      )}

      {isDownloading && (
        <View style={[styles.statusBadge, { backgroundColor: colors.info }]}>
          <Text style={[styles.statusText, { color: '#FFFFFF' }]}>
            {Math.round(downloadProgress * 100)}%
          </Text>
        </View>
      )}

      {isTranscribing && (
        <View style={[styles.statusBadge, { backgroundColor: colors.accent }]}>
          <Text style={[styles.statusText, { color: '#FFFFFF' }]}>
            Transcribing...
          </Text>
        </View>
      )}

      {error && (
        <View style={[styles.statusBadge, { backgroundColor: colors.danger }]}>
          <Text style={[styles.statusText, { color: '#FFFFFF' }]} numberOfLines={1}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  statusBadge: {
    position: 'absolute',
    bottom: -24,
    left: -40,
    right: -40,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  recordingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
});

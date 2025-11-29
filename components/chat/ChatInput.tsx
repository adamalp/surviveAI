import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatInputProps {
  input: string;
  onInputChange: (text: string) => void;
  onSend: () => void;
  onPickImage: () => void;
  onVoiceInput: () => void;
  selectedImage: string | null;
  onClearImage: () => void;
  isGenerating: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  colors: any;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  onInputChange,
  onSend,
  onPickImage,
  onVoiceInput,
  selectedImage,
  onClearImage,
  isGenerating,
  isRecording,
  isTranscribing,
  colors,
}) => {
  return (
    <>
      {/* Image Preview */}
      {selectedImage && (
        <View style={[styles.imagePreviewContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} resizeMode="cover" />
          <TouchableOpacity
            style={[styles.removeImageButton, { backgroundColor: colors.danger }]}
            onPress={onClearImage}
          >
            <Ionicons name="close" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <View style={[styles.recordingIndicator, { backgroundColor: colors.danger }]}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>Recording...</Text>
        </View>
      )}

      {/* Transcribing indicator */}
      {isTranscribing && (
        <View style={[styles.recordingIndicator, { backgroundColor: colors.accent }]}>
          <ActivityIndicator size="small" color="#FFFFFF" />
          <Text style={styles.recordingText}>Transcribing...</Text>
        </View>
      )}

      {/* Input Area */}
      <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
        {/* Add attachment button */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.backgroundTertiary }]}
          onPress={onPickImage}
          disabled={isGenerating}
        >
          <Ionicons name="add" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Input pill container */}
        <View style={[styles.inputPill, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={input}
            onChangeText={onInputChange}
            placeholder={selectedImage ? "Ask about this image..." : "Ask anything"}
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={1000}
            editable={!isGenerating}
            onSubmitEditing={onSend}
            blurOnSubmit={false}
          />

          {/* Mic button inside input */}
          <TouchableOpacity
            style={[
              styles.micButton,
              isRecording && { backgroundColor: colors.danger, borderRadius: 12 },
            ]}
            onPress={onVoiceInput}
            disabled={isGenerating || isTranscribing}
          >
            {isTranscribing ? (
              <ActivityIndicator size="small" color={colors.textMuted} />
            ) : (
              <Ionicons
                name={isRecording ? 'stop' : 'mic-outline'}
                size={22}
                color={isRecording ? '#FFFFFF' : colors.textMuted}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Send button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: (!input.trim() && !selectedImage) || isGenerating ? colors.textMuted : '#000000' },
          ]}
          onPress={onSend}
          disabled={(!input.trim() && !selectedImage) || isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 22,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  micButton: {
    padding: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    left: 108,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    gap: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  recordingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { useTheme } from '@/contexts/ThemeContext';
import { useChatStore, useDeviceStore, useModelStore } from '@/store';
import { useSTTStore } from '@/store/stt-store';
import { CACTUS_MODELS } from '@/lib/cactus/model';
import { CONFIG } from '@/constants/config';
import {
  MessageBubble,
  ConversationListModal,
  ChatInput,
  EmptyState,
  StreamingBubble,
} from '@/components/chat';

// Emergency mode display info
const EMERGENCY_INFO: Record<string, { title: string; icon: string }> = {
  lost: { title: "I'm Lost", icon: 'compass' },
  injury: { title: 'Injury / Medical', icon: 'medkit' },
  wildlife: { title: 'Wildlife Encounter', icon: 'paw' },
};

export default function AssistantScreen() {
  const { colors, isDark } = useTheme();
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showConversationList, setShowConversationList] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    messages,
    conversations,
    activeConversationId,
    isGenerating,
    isReasoning,
    currentResponse,
    error,
    sendMessage,
    createConversation,
    setActiveConversation,
    deleteConversation,
  } = useChatStore();

  const { getDeviceContext, updateLocation, updateBattery, emergency, clearEmergency } = useDeviceStore();
  const { currentModelId } = useModelStore();
  const { isRecording, isTranscribing, startRecording, stopRecording } = useSTTStore();

  // Check if current model supports vision
  const currentModel = CACTUS_MODELS[currentModelId];
  const supportsVision = currentModel?.supportsVision ?? false;

  // Initialize device data and conversation on mount
  useEffect(() => {
    updateLocation();
    updateBattery();

    if (!activeConversationId || !conversations.find(c => c.id === activeConversationId)) {
      const id = createConversation();
      setActiveConversation(id);
    }
  }, []);

  // Get current conversation's messages
  const conversationMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, CONFIG.SCROLL_TO_BOTTOM_DELAY);
    return () => clearTimeout(timeoutId);
  }, [conversationMessages, currentResponse]);

  // Get current conversation object
  const currentConversation = conversations.find(c => c.id === activeConversationId);

  // Get conversation title
  const getConversationTitle = (): string => {
    if (!currentConversation) return 'New Conversation';
    const convMessages = messages[currentConversation.id] || [];
    const firstUserMessage = convMessages.find(m => m.role === 'user');
    if (firstUserMessage) {
      return firstUserMessage.content.length > 40
        ? firstUserMessage.content.substring(0, 40) + '...'
        : firstUserMessage.content;
    }
    return 'New Conversation';
  };

  // Handlers
  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isGenerating) return;

    const message = input.trim() || (selectedImage ? 'What is in this image?' : '');
    const images = selectedImage ? [selectedImage] : undefined;

    setInput('');
    setSelectedImage(null);

    const context = getDeviceContext();
    await sendMessage(message, context, images);
  };

  const pickImage = async () => {
    if (!supportsVision) {
      Alert.alert(
        'Vision Not Supported',
        'The current model does not support image analysis. Please select the "LFM2 Vision 450M" model in Settings to use this feature.',
        [{ text: 'OK' }]
      );
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photos to use this feature.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleVoiceInput = async () => {
    if (isGenerating) return;

    try {
      if (isRecording) {
        const text = await stopRecording();
        if (text && text.trim()) {
          setInput(text.trim());
        }
      } else {
        await startRecording();
      }
    } catch (err) {
      console.error('Voice input error:', err);
    }
  };

  const handleNewChat = () => {
    const id = createConversation();
    setActiveConversation(id);
    setShowConversationList(false);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    setShowConversationList(false);
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
    if (id === activeConversationId) {
      const newId = createConversation();
      setActiveConversation(newId);
    }
  };

  // Memoize markdown styles
  const markdownStyles = useMemo(
    () => getMarkdownStyles(colors, isDark),
    [colors, isDark]
  );

  // Get emergency color
  const getEmergencyColor = (type: string) => {
    return type === 'wildlife' ? colors.warning : colors.danger;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={[]}
    >
      {/* Conversation Header */}
      <View style={[styles.header, { backgroundColor: colors.backgroundSecondary }]}>
        <TouchableOpacity
          style={[styles.selector, { backgroundColor: colors.backgroundTertiary }]}
          onPress={() => setShowConversationList(true)}
        >
          <FontAwesome name="comments-o" size={16} color={colors.accent} />
          <Text style={[styles.selectorText, { color: colors.text }]} numberOfLines={1}>
            {getConversationTitle()}
          </Text>
          <FontAwesome name="chevron-down" size={12} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.newChatButton, { backgroundColor: colors.accent }]}
          onPress={handleNewChat}
        >
          <FontAwesome name="plus" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Emergency Mode Banner */}
      {emergency.type && EMERGENCY_INFO[emergency.type] && (
        <View style={[styles.emergencyBanner, { backgroundColor: getEmergencyColor(emergency.type) }]}>
          <View style={styles.emergencyContent}>
            <Ionicons name={EMERGENCY_INFO[emergency.type].icon as any} size={20} color="#FFFFFF" />
            <Text style={styles.emergencyText}>{EMERGENCY_INFO[emergency.type].title}</Text>
          </View>
          <TouchableOpacity style={styles.emergencyDismiss} onPress={clearEmergency}>
            <Ionicons name="close" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Conversation List Modal */}
      <ConversationListModal
        visible={showConversationList}
        onClose={() => setShowConversationList(false)}
        conversations={conversations}
        messages={messages}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onNewChat={handleNewChat}
        colors={colors}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {/* Messages List */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          keyboardShouldPersistTaps="handled"
        >
          {conversationMessages.length === 0 && !isGenerating ? (
            <EmptyState
              emergencyType={emergency.type}
              onSelectPrompt={setInput}
              colors={colors}
            />
          ) : (
            <>
              {conversationMessages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  colors={colors}
                  isDark={isDark}
                  markdownStyles={markdownStyles}
                />
              ))}

              {isGenerating && (
                <StreamingBubble
                  currentResponse={currentResponse}
                  isReasoning={isReasoning}
                  colors={colors}
                />
              )}
            </>
          )}
        </ScrollView>

        {/* Error display */}
        {error && (
          <View style={[styles.errorContainer, { backgroundColor: colors.dangerBackground, borderColor: colors.danger }]}>
            <FontAwesome name="exclamation-circle" size={14} color={colors.danger} />
            <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
          </View>
        )}

        {/* Chat Input */}
        <ChatInput
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          onPickImage={pickImage}
          onVoiceInput={handleVoiceInput}
          selectedImage={selectedImage}
          onClearImage={() => setSelectedImage(null)}
          isGenerating={isGenerating}
          isRecording={isRecording}
          isTranscribing={isTranscribing}
          colors={colors}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Generate markdown styles based on theme
const getMarkdownStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    body: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 22,
    },
    heading1: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginTop: 8,
      marginBottom: 4,
    },
    heading2: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginTop: 8,
      marginBottom: 4,
    },
    heading3: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginTop: 6,
      marginBottom: 2,
    },
    paragraph: {
      marginTop: 0,
      marginBottom: 8,
    },
    bullet_list: {
      marginBottom: 8,
    },
    ordered_list: {
      marginBottom: 8,
    },
    list_item: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    bullet_list_icon: {
      color: colors.accent,
      marginRight: 8,
    },
    ordered_list_icon: {
      color: colors.accent,
      marginRight: 8,
    },
    strong: {
      fontWeight: '700',
    },
    em: {
      fontStyle: 'italic',
    },
    code_inline: {
      backgroundColor: colors.backgroundTertiary,
      borderRadius: 2,
      paddingHorizontal: 4,
      paddingVertical: 1,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: 13,
      color: colors.accent,
    },
    code_block: {
      backgroundColor: colors.backgroundTertiary,
      borderRadius: 4,
      padding: 12,
      marginVertical: 8,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: 13,
      color: colors.text,
    },
    fence: {
      backgroundColor: colors.backgroundTertiary,
      borderRadius: 4,
      padding: 12,
      marginVertical: 8,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: 13,
    },
    blockquote: {
      backgroundColor: colors.backgroundTertiary,
      borderLeftColor: colors.accent,
      borderLeftWidth: 3,
      paddingLeft: 12,
      paddingVertical: 4,
      marginVertical: 8,
    },
    link: {
      color: colors.accent,
      textDecorationLine: 'underline',
    },
    hr: {
      backgroundColor: colors.border,
      height: 1,
      marginVertical: 12,
    },
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  selector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10,
  },
  selectorText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  newChatButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emergencyText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  emergencyDismiss: {
    padding: 4,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
    paddingBottom: 8,
    flexGrow: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
});

import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import * as ImagePicker from 'expo-image-picker';

import { useTheme } from '@/contexts/ThemeContext';
import { useChatStore, useDeviceStore, useModelStore } from '@/store';
import { ChatMessage, Conversation } from '@/types';
import { CACTUS_MODELS } from '@/lib/cactus/model';

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
    currentResponse,
    error,
    sendMessage,
    createConversation,
    setActiveConversation,
    deleteConversation,
  } = useChatStore();

  const { getDeviceContext, updateLocation, updateBattery } = useDeviceStore();
  const { currentModelId, isLoaded } = useModelStore();

  // Check if current model supports vision
  const currentModel = CACTUS_MODELS[currentModelId];
  const supportsVision = currentModel?.supportsVision ?? false;

  // Initialize device data and conversation on mount
  useEffect(() => {
    // Ensure we have device context for AI
    updateLocation();
    updateBattery();

    // Create conversation if needed
    if (!activeConversationId || !conversations.find(c => c.id === activeConversationId)) {
      const id = createConversation();
      setActiveConversation(id);
    }
  }, []);

  // Get current conversation's messages
  const conversationMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  // Scroll to bottom when new messages arrive or response updates
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [conversationMessages, currentResponse]);

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isGenerating) return;

    const message = input.trim() || (selectedImage ? 'What is in this image?' : '');
    const images = selectedImage ? [selectedImage] : undefined;

    setInput('');
    setSelectedImage(null);

    // Get device context for AI injection
    const context = getDeviceContext();
    await sendMessage(message, context, images);
  };

  // Pick image from gallery
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

  // Take photo with camera
  const takePhoto = async () => {
    if (!supportsVision) {
      Alert.alert(
        'Vision Not Supported',
        'The current model does not support image analysis. Please select the "LFM2 Vision 450M" model in Settings to use this feature.',
        [{ text: 'OK' }]
      );
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access to use this feature.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Clear selected image
  const clearImage = () => {
    setSelectedImage(null);
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
    // If we deleted the active conversation, create a new one
    if (id === activeConversationId) {
      const newId = createConversation();
      setActiveConversation(newId);
    }
  };

  // Get current conversation object
  const currentConversation = conversations.find(c => c.id === activeConversationId);

  // Get conversation title (first message or default)
  const getConversationTitle = (conv: Conversation): string => {
    const convMessages = messages[conv.id] || [];
    const firstUserMessage = convMessages.find(m => m.role === 'user');
    if (firstUserMessage) {
      // Truncate to 40 characters
      return firstUserMessage.content.length > 40
        ? firstUserMessage.content.substring(0, 40) + '...'
        : firstUserMessage.content;
    }
    return 'New Conversation';
  };

  // Format date for display
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const renderMessage = (item: ChatMessage) => {
    const isUser = item.role === 'user';

    return (
      <View
        key={item.id}
        style={[
          styles.messageBubble,
          isUser
            ? [styles.userBubble, { backgroundColor: colors.accent }]
            : [styles.assistantBubble, { backgroundColor: colors.cardBackground, borderColor: colors.border }],
        ]}
      >
        {/* Show images if present */}
        {item.images && item.images.length > 0 && (
          <View style={styles.messageImageContainer}>
            {item.images.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={styles.messageImage}
                resizeMode="cover"
              />
            ))}
          </View>
        )}
        {isUser ? (
          <Text style={[styles.messageText, styles.userText]}>{item.content}</Text>
        ) : (
          <Markdown style={getMarkdownStyles(colors, isDark)}>{item.content}</Markdown>
        )}
      </View>
    );
  };

  // Suggested prompts for empty chat
  const suggestedPrompts = [
    'How do I purify water in the wilderness?',
    'What are the signs of hypothermia?',
    'How do I build an emergency shelter?',
    'What should I do if I get lost?',
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      {/* Conversation Header */}
      <View style={[styles.conversationHeader, { backgroundColor: colors.backgroundSecondary, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.conversationSelector, { backgroundColor: colors.backgroundTertiary, borderColor: colors.border }]}
          onPress={() => setShowConversationList(true)}
        >
          <FontAwesome name="comments-o" size={16} color={colors.accent} />
          <Text style={[styles.conversationTitle, { color: colors.text }]} numberOfLines={1}>
            {currentConversation ? getConversationTitle(currentConversation) : 'New Conversation'}
          </Text>
          <FontAwesome name="chevron-down" size={12} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerNewChatButton, { backgroundColor: colors.accent }]}
          onPress={handleNewChat}
        >
          <FontAwesome name="plus" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Conversation List Modal */}
      <Modal
        visible={showConversationList}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowConversationList(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.backgroundSecondary, borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Conversations</Text>
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: colors.backgroundTertiary }]}
              onPress={() => setShowConversationList(false)}
            >
              <FontAwesome name="times" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.newConversationButton, { backgroundColor: colors.accent }]}
            onPress={handleNewChat}
          >
            <FontAwesome name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.newConversationText}>New Conversation</Text>
          </TouchableOpacity>

          <ScrollView style={styles.conversationList}>
            {conversations.length === 0 ? (
              <View style={styles.emptyConversations}>
                <FontAwesome name="comments-o" size={40} color={colors.textMuted} />
                <Text style={[styles.emptyConversationsText, { color: colors.textSecondary }]}>
                  No conversations yet
                </Text>
              </View>
            ) : (
              conversations
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map((conv) => (
                  <TouchableOpacity
                    key={conv.id}
                    style={[
                      styles.conversationItem,
                      {
                        backgroundColor: conv.id === activeConversationId ? colors.backgroundTertiary : colors.cardBackground,
                        borderColor: conv.id === activeConversationId ? colors.accent : colors.border,
                      },
                    ]}
                    onPress={() => handleSelectConversation(conv.id)}
                  >
                    <View style={styles.conversationItemContent}>
                      <Text style={[styles.conversationItemTitle, { color: colors.text }]} numberOfLines={2}>
                        {getConversationTitle(conv)}
                      </Text>
                      <Text style={[styles.conversationItemDate, { color: colors.textMuted }]}>
                        {formatDate(conv.updatedAt)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteConversation(conv.id)}
                    >
                      <FontAwesome name="trash-o" size={16} color={colors.danger} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

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
            <View style={styles.emptyContainer}>
              <View
                style={[
                  styles.emptyIcon,
                  { backgroundColor: colors.backgroundTertiary, borderColor: colors.border },
                ]}
              >
                <FontAwesome name="leaf" size={32} color={colors.accent} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Survival Assistant
              </Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Ask me anything about survival, first aid, navigation, or emergency preparedness.
              </Text>
              <View style={styles.suggestionsContainer}>
                {suggestedPrompts.map((prompt, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.suggestion,
                      { backgroundColor: colors.cardBackground, borderColor: colors.border },
                    ]}
                    onPress={() => setInput(prompt)}
                  >
                    <Text style={[styles.suggestionText, { color: colors.accent }]}>
                      {prompt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <>
              {conversationMessages.map(renderMessage)}

              {/* Streaming response */}
              {isGenerating && (
                <View
                  style={[
                    styles.messageBubble,
                    styles.assistantBubble,
                    { backgroundColor: colors.cardBackground, borderColor: colors.border },
                  ]}
                >
                  {currentResponse ? (
                    <Markdown style={getMarkdownStyles(colors, isDark)}>
                      {currentResponse}
                    </Markdown>
                  ) : (
                    <View style={styles.thinkingContainer}>
                      <ActivityIndicator size="small" color={colors.accent} />
                      <Text style={[styles.thinkingText, { color: colors.textSecondary }]}>
                        Thinking...
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Error display */}
        {error && (
          <View
            style={[
              styles.errorContainer,
              { backgroundColor: colors.dangerBackground, borderColor: colors.danger },
            ]}
          >
            <FontAwesome name="exclamation-circle" size={14} color={colors.danger} />
            <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
          </View>
        )}

        {/* Image Preview */}
        {selectedImage && (
          <View style={[styles.imagePreviewContainer, { backgroundColor: colors.backgroundSecondary }]}>
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} resizeMode="cover" />
            <TouchableOpacity
              style={[styles.removeImageButton, { backgroundColor: colors.danger }]}
              onPress={clearImage}
            >
              <Ionicons name="close" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Input Area */}
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.backgroundSecondary, borderTopColor: colors.border },
          ]}
        >
          {/* Image buttons */}
          <TouchableOpacity
            style={[styles.imageButton, { backgroundColor: colors.backgroundTertiary }]}
            onPress={pickImage}
            disabled={isGenerating}
          >
            <Ionicons
              name="image-outline"
              size={22}
              color={supportsVision ? colors.accent : colors.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.imageButton, { backgroundColor: colors.backgroundTertiary }]}
            onPress={takePhoto}
            disabled={isGenerating}
          >
            <Ionicons
              name="camera-outline"
              size={22}
              color={supportsVision ? colors.accent : colors.textMuted}
            />
          </TouchableOpacity>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={input}
            onChangeText={setInput}
            placeholder={selectedImage ? "Ask about this image..." : "Ask a survival question..."}
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={1000}
            editable={!isGenerating}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: (!input.trim() && !selectedImage) || isGenerating ? colors.border : colors.accent },
            ]}
            onPress={handleSend}
            disabled={(!input.trim() && !selectedImage) || isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
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
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
    paddingBottom: 8,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 14,
    marginBottom: 12,
    borderRadius: 18,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    borderWidth: 0,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  thinkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  thinkingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 24,
    lineHeight: 22,
  },
  suggestionsContainer: {
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 24,
    borderTopWidth: 0,
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 120,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  messageImageContainer: {
    marginBottom: 8,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  // Conversation header styles
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0,
    gap: 10,
  },
  conversationSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 0,
    gap: 10,
  },
  conversationTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  headerNewChatButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newConversationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 14,
    borderRadius: 10,
    gap: 8,
  },
  newConversationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  conversationList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyConversations: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyConversationsText: {
    fontSize: 14,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  conversationItemContent: {
    flex: 1,
    gap: 4,
  },
  conversationItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  conversationItemDate: {
    fontSize: 12,
  },
  deleteButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

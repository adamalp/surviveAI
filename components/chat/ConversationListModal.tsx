import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Conversation, ChatMessage } from '@/types';

interface ConversationListModalProps {
  visible: boolean;
  onClose: () => void;
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewChat: () => void;
  colors: any;
}

export const ConversationListModal: React.FC<ConversationListModalProps> = ({
  visible,
  onClose,
  conversations,
  messages,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
  colors,
}) => {
  // Get conversation title from first message
  const getConversationTitle = (conv: Conversation): string => {
    const convMessages = messages[conv.id] || [];
    const firstUserMessage = convMessages.find(m => m.role === 'user');
    if (firstUserMessage) {
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.backgroundSecondary, borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Conversations</Text>
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.backgroundTertiary }]}
            onPress={onClose}
          >
            <FontAwesome name="times" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.newButton, { backgroundColor: colors.accent }]}
          onPress={onNewChat}
        >
          <FontAwesome name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.newButtonText}>New Conversation</Text>
        </TouchableOpacity>

        <ScrollView style={styles.list}>
          {conversations.length === 0 ? (
            <View style={styles.empty}>
              <FontAwesome name="comments-o" size={40} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
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
                    styles.item,
                    {
                      backgroundColor: conv.id === activeConversationId ? colors.backgroundTertiary : colors.cardBackground,
                      borderColor: conv.id === activeConversationId ? colors.accent : colors.border,
                    },
                  ]}
                  onPress={() => onSelectConversation(conv.id)}
                >
                  <View style={styles.itemContent}>
                    <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
                      {getConversationTitle(conv)}
                    </Text>
                    <Text style={[styles.itemDate, { color: colors.textMuted }]}>
                      {formatDate(conv.updatedAt)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDeleteConversation(conv.id)}
                  >
                    <FontAwesome name="trash-o" size={16} color={colors.danger} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 14,
    borderRadius: 10,
    gap: 8,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  itemDate: {
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

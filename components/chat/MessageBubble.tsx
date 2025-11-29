import React, { memo } from 'react';
import { StyleSheet, View, Text, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { ChatMessage, ResponseSource } from '@/types';
import { ThemeColors } from '@/contexts/ThemeContext';

interface MessageBubbleProps {
  message: ChatMessage;
  colors: ThemeColors;
  isDark: boolean;
  markdownStyles: ReturnType<typeof StyleSheet.create>;
}

// Render source badge for assistant messages
// Shows when knowledge grounding was used to improve model accuracy
const SourceBadge = memo(({ source, colors }: { source?: ResponseSource; colors: ThemeColors }) => {
  if (source !== 'knowledge-grounded') return null;

  return (
    <View style={[styles.sourceBadge, { backgroundColor: colors.accent + '15' }]}>
      <Ionicons name="library-outline" size={12} color={colors.accent} />
      <Text style={[styles.sourceText, { color: colors.accent }]}>Knowledge-Enhanced</Text>
    </View>
  );
});

SourceBadge.displayName = 'SourceBadge';

export const MessageBubble = memo(({ message, colors, isDark, markdownStyles }: MessageBubbleProps) => {
  const isUser = message.role === 'user';

  return (
    <View
      style={[
        styles.messageBubble,
        isUser
          ? [styles.userBubble, { backgroundColor: colors.accent }]
          : [styles.assistantBubble, { backgroundColor: colors.cardBackground, borderColor: colors.border }],
      ]}
    >
      {/* Show images if present */}
      {message.images && message.images.length > 0 && (
        <View style={styles.messageImageContainer}>
          {message.images.map((uri, index) => (
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
        <Text style={[styles.messageText, styles.userText]}>{message.content}</Text>
      ) : (
        <>
          <Markdown style={markdownStyles}>{message.content}</Markdown>
          <SourceBadge source={message.source} colors={colors} />
        </>
      )}
    </View>
  );
});

MessageBubble.displayName = 'MessageBubble';

const styles = StyleSheet.create({
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
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '600',
  },
  messageImageContainer: {
    marginBottom: 8,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
});

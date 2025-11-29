import React, { memo } from 'react';
import { StyleSheet, View, Text, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { ChatMessage, ResponseSource, PerformanceMetrics } from '@/types';
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

// Render performance metrics badge
const MetricsBadge = memo(({ metrics, colors }: { metrics?: PerformanceMetrics; colors: ThemeColors }) => {
  if (!metrics || metrics.tokensPerSecond === 0) return null;

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <View style={[styles.metricsBadge, { backgroundColor: colors.backgroundTertiary }]}>
      <Ionicons name="speedometer-outline" size={10} color={colors.textMuted} />
      <Text style={[styles.metricsText, { color: colors.textMuted }]}>
        {metrics.tokensPerSecond.toFixed(1)} tok/s
      </Text>
      <Text style={[styles.metricsSeparator, { color: colors.border }]}>|</Text>
      <Text style={[styles.metricsText, { color: colors.textMuted }]}>
        {metrics.totalTokens} tokens
      </Text>
      <Text style={[styles.metricsSeparator, { color: colors.border }]}>|</Text>
      <Text style={[styles.metricsText, { color: colors.textMuted }]}>
        {formatTime(metrics.totalTimeMs)}
      </Text>
    </View>
  );
});

MetricsBadge.displayName = 'MetricsBadge';

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
          <View style={styles.badgeContainer}>
            <SourceBadge source={message.source} colors={colors} />
            <MetricsBadge metrics={message.metrics} colors={colors} />
          </View>
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
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  metricsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metricsText: {
    fontSize: 10,
    fontWeight: '500',
  },
  metricsSeparator: {
    fontSize: 10,
    marginHorizontal: 2,
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

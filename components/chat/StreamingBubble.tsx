import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

interface StreamingBubbleProps {
  currentResponse: string;
  isReasoning: boolean;
  colors: any;
}

export const StreamingBubble: React.FC<StreamingBubbleProps> = ({
  currentResponse,
  isReasoning,
  colors,
}) => {
  return (
    <View
      style={[
        styles.bubble,
        { backgroundColor: colors.cardBackground, borderColor: colors.border },
      ]}
    >
      {currentResponse ? (
        <Text style={[styles.text, { color: colors.text }]}>
          {currentResponse}
        </Text>
      ) : (
        <View style={styles.thinkingContainer}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={[styles.thinkingText, { color: colors.textSecondary }]}>
            {isReasoning ? 'Reasoning...' : 'Thinking...'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '85%',
    padding: 14,
    marginBottom: 12,
    borderRadius: 18,
    alignSelf: 'flex-start',
    borderWidth: 0,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
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
});

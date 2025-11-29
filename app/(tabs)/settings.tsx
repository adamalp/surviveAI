import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/contexts/ThemeContext';
import { useModelStore, useChatStore } from '@/store';
import { Card, Badge, Button } from '@/components/ui';
import { CACTUS_MODELS, DEFAULT_MODEL_ID, ModelConfig } from '@/lib/cactus/model';

// Get model list sorted by recommended order
const MODEL_LIST = Object.values(CACTUS_MODELS).sort((a, b) => {
  // Sort by quality + speed score, with a preference for quality
  const scoreA = a.quality * 1.5 + a.speed;
  const scoreB = b.quality * 1.5 + b.speed;
  return scoreB - scoreA;
});

export default function SettingsScreen() {
  const { colors, spacing, borderRadius, isDark, toggleTheme, setMode, mode } = useTheme();

  const {
    isLoaded,
    isLoading,
    loadProgress,
    error,
    currentModelId,
    loadedModelId,
    selectModel,
    downloadAndLoad,
  } = useModelStore();

  const { conversations } = useChatStore();

  const currentModel = CACTUS_MODELS[currentModelId];

  const handleSelectModel = (modelId: string) => {
    selectModel(modelId);
  };

  const handleDownload = async () => {
    try {
      await downloadAndLoad();
    } catch (error) {
      Alert.alert('Error', 'Failed to download model. Please check your connection and try again.');
    }
  };

  // Render quality/speed indicator dots
  const renderRating = (value: number, maxValue: number = 5, activeColor: string) => {
    return (
      <View style={styles.ratingContainer}>
        {Array.from({ length: maxValue }, (_, i) => (
          <View
            key={i}
            style={[
              styles.ratingDot,
              { backgroundColor: i < value ? activeColor : colors.border },
            ]}
          />
        ))}
      </View>
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all conversations and chat history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            const { conversations, deleteConversation } = useChatStore.getState();
            for (const conv of conversations) {
              await deleteConversation(conv.id);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Appearance Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Appearance
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons
                name={isDark ? 'moon-outline' : 'sunny-outline'}
                size={22}
                color={colors.accent}
              />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.accentDark }}
              thumbColor={isDark ? colors.accent : colors.textMuted}
            />
          </View>
        </View>

        {/* AI Model Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          AI Model
        </Text>

        {/* Model List */}
        {MODEL_LIST.map((model) => {
          const isSelected = model.id === currentModelId;
          const isCurrentlyLoaded = model.id === loadedModelId && isLoaded;

          return (
            <TouchableOpacity
              key={model.id}
              style={[
                styles.modelCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: isSelected ? colors.accent : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => handleSelectModel(model.id)}
              disabled={isLoading}
            >
              <View style={styles.modelCardHeader}>
                <View style={styles.modelCardLeft}>
                  <View
                    style={[
                      styles.radioOuter,
                      { borderColor: isSelected ? colors.accent : colors.textMuted },
                    ]}
                  >
                    {isSelected && (
                      <View
                        style={[styles.radioInner, { backgroundColor: colors.accent }]}
                      />
                    )}
                  </View>
                  <View style={styles.modelCardInfo}>
                    <View style={styles.modelNameRow}>
                      <Text style={[styles.modelName, { color: colors.text }]}>
                        {model.name}
                      </Text>
                      {model.id === DEFAULT_MODEL_ID && (
                        <View style={[styles.recommendedBadge, { backgroundColor: colors.accent + '20' }]}>
                          <Text style={[styles.recommendedText, { color: colors.accent }]}>
                            Recommended
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.modelSize, { color: colors.textSecondary }]}>
                      {model.size}
                    </Text>
                  </View>
                </View>
                {isCurrentlyLoaded && (
                  <View style={[styles.loadedBadge, { backgroundColor: colors.successBackground }]}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                    <Text style={[styles.loadedText, { color: colors.success }]}>Loaded</Text>
                  </View>
                )}
              </View>

              <Text style={[styles.modelDescription, { color: colors.textSecondary }]}>
                {model.description}
              </Text>

              <View style={styles.modelRatings}>
                <View style={styles.ratingRow}>
                  <Text style={[styles.ratingLabel, { color: colors.textMuted }]}>Quality</Text>
                  {renderRating(model.quality, 5, colors.accent)}
                </View>
                <View style={styles.ratingRow}>
                  <Text style={[styles.ratingLabel, { color: colors.textMuted }]}>Speed</Text>
                  {renderRating(model.speed, 5, colors.info)}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Download/Load button */}
        {isLoading ? (
          <View style={[styles.progressCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: colors.backgroundTertiary }]}>
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: colors.accent, width: `${loadProgress * 100}%` },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                {loadProgress < 0.8
                  ? `Downloading ${currentModel?.name}... ${Math.round(loadProgress * 100)}%`
                  : 'Loading model...'}
              </Text>
            </View>
          </View>
        ) : currentModelId !== loadedModelId || !isLoaded ? (
          <Button
            title={`Download & Load ${currentModel?.name || 'Model'}`}
            onPress={handleDownload}
            variant="primary"
            icon={<Ionicons name="cloud-download-outline" size={18} color="#FFFFFF" />}
            fullWidth
          />
        ) : null}

        {/* Error display */}
        {error && (
          <TouchableOpacity
            style={[
              styles.errorContainer,
              { backgroundColor: colors.dangerBackground, borderColor: colors.danger },
            ]}
            onPress={() => Alert.alert('Error Details', error)}
          >
            <Ionicons name="alert-circle" size={16} color={colors.danger} />
            <Text style={[styles.errorText, { color: colors.danger }]} numberOfLines={3}>
              {error}
            </Text>
            <Text style={[styles.errorHint, { color: colors.danger }]}>Tap for details</Text>
          </TouchableOpacity>
        )}

        {/* Data Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Data
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <View style={styles.dataRow}>
            <Text style={[styles.dataLabel, { color: colors.textSecondary }]}>
              Conversations
            </Text>
            <Text style={[styles.dataValue, { color: colors.text }]}>
              {conversations.length}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.dangerCard,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
          onPress={handleClearAllData}
        >
          <Ionicons name="trash-outline" size={22} color={colors.danger} />
          <View style={styles.dangerInfo}>
            <Text style={[styles.dangerTitle, { color: colors.danger }]}>
              Clear All Data
            </Text>
            <Text style={[styles.dangerDescription, { color: colors.textSecondary }]}>
              Delete all conversations and history
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* About Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          About
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <View style={[styles.aboutRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>
              Version
            </Text>
            <Text style={[styles.aboutValue, { color: colors.text }]}>1.0.0</Text>
          </View>
          <View style={[styles.aboutRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>
              AI Engine
            </Text>
            <Text style={[styles.aboutValue, { color: colors.text }]}>Cactus SDK</Text>
          </View>
          <View style={[styles.aboutRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>
              Offline Mode
            </Text>
            <Badge label="Supported" variant="success" size="sm" />
          </View>
        </View>

        {/* Info Card */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.backgroundTertiary, borderColor: colors.border },
          ]}
        >
          <Ionicons name="shield-checkmark-outline" size={22} color={colors.accent} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            SurviveAI runs entirely on your device. Once the model is downloaded, all features work without internet connection. Your data never leaves your device.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    marginLeft: 4,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  // Model card styles
  modelCard: {
    borderRadius: 12,
    padding: 14,
  },
  modelCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modelCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  modelCardInfo: {
    flex: 1,
  },
  modelNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modelName: {
    fontSize: 16,
    fontWeight: '600',
  },
  modelSize: {
    fontSize: 13,
    marginTop: 2,
  },
  recommendedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: '600',
  },
  loadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  loadedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modelDescription: {
    fontSize: 14,
    marginTop: 10,
    marginLeft: 34,
    lineHeight: 20,
  },
  modelRatings: {
    marginTop: 12,
    marginLeft: 34,
    gap: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingLabel: {
    fontSize: 12,
    width: 50,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  progressContainer: {
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 10,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'column',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  errorHint: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 15,
  },
  dataValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  dangerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  dangerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  dangerDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  aboutLabel: {
    fontSize: 15,
  },
  aboutValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

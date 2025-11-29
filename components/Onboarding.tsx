import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useModelStore } from '@/store/model-store';
import { CACTUS_MODELS } from '@/lib/cactus/model';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface OnboardingStep {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const STEPS: OnboardingStep[] = [
  {
    icon: 'leaf',
    title: 'Welcome to SurviveAI',
    description: 'Your offline-first survival assistant. Get expert guidance on wilderness survival, first aid, and emergency preparedness — even without internet.',
  },
  {
    icon: 'cloud-offline',
    title: '100% Offline AI',
    description: 'Our AI runs entirely on your device. No internet required, no data sent to servers. Perfect for when you\'re off the grid.',
  },
  {
    icon: 'compass',
    title: 'Essential Tools',
    description: 'Compass, GPS coordinates, SOS flashlight, and emergency checklists. Everything you need in one app.',
  },
  {
    icon: 'download',
    title: 'Download AI Model',
    description: 'To use the AI assistant, you\'ll need to download a model. You can do this now or later in Settings.',
  },
];

export const Onboarding: React.FC = () => {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const { completeOnboarding } = useOnboardingStore();
  const { downloadAndLoad, loadProgress, isLoading } = useModelStore();
  const [downloadStarted, setDownloadStarted] = useState(false);

  const isLastStep = currentStep === STEPS.length - 1;
  const step = STEPS[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const handleDownload = async () => {
    setDownloadStarted(true);
    try {
      // Download recommended model (Qwen3 1.7B - best balance of quality and speed)
      // First select the model, then download
      useModelStore.getState().selectModel('qwen3-1.7');
      await downloadAndLoad('qwen3-1.7');
      // Auto-complete after successful download
      setTimeout(() => completeOnboarding(), 500);
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadStarted(false);
    }
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {STEPS.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === currentStep
                ? colors.accent
                : colors.border,
            },
          ]}
        />
      ))}
    </View>
  );

  const renderDownloadSection = () => {
    if (!isLastStep) return null;

    const recommendedModel = CACTUS_MODELS['qwen3-1.7'];

    return (
      <View style={styles.downloadSection}>
        <View style={[styles.modelCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.modelHeader}>
            <Ionicons name="hardware-chip" size={24} color={colors.accent} />
            <View style={styles.modelInfo}>
              <Text style={[styles.modelName, { color: colors.text }]}>
                {recommendedModel.name}
              </Text>
              <Text style={[styles.modelSize, { color: colors.textSecondary }]}>
                {recommendedModel.size} • Recommended for most devices
              </Text>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: colors.accent,
                      width: `${loadProgress * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                {loadProgress < 0.8
                  ? `${Math.round(loadProgress * 125)}% downloading...`
                  : 'Loading model...'}
              </Text>
            </View>
          ) : (
            <Pressable
              style={[styles.downloadButton, { backgroundColor: colors.accent }]}
              onPress={handleDownload}
            >
              <Ionicons name="download" size={20} color="#fff" />
              <Text style={styles.downloadButtonText}>Download Now</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip button */}
      <Pressable style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: colors.textSecondary }]}>
          Skip
        </Text>
      </Pressable>

      {/* Content */}
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.accent + '15' }]}>
          <Ionicons name={step.icon} size={64} color={colors.accent} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          {step.title}
        </Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {step.description}
        </Text>

        {renderDownloadSection()}
      </View>

      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        {renderDots()}

        <Pressable
          style={[
            styles.nextButton,
            { backgroundColor: colors.accent },
            isLoading && styles.disabledButton,
          ]}
          onPress={handleNext}
          disabled={isLoading}
        >
          <Text style={styles.nextButtonText}>
            {isLastStep ? (downloadStarted ? 'Please wait...' : 'Get Started') : 'Next'}
          </Text>
          {!isLastStep && (
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  downloadSection: {
    width: '100%',
    marginTop: 8,
  },
  modelCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  modelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modelInfo: {
    marginLeft: 12,
    flex: 1,
  },
  modelName: {
    fontSize: 17,
    fontWeight: '600',
  },
  modelSize: {
    fontSize: 14,
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

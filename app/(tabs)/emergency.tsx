import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

import { useTheme } from '@/contexts/ThemeContext';
import { useDeviceStore } from '@/store';
import { EmergencyType, InjuryType, WildlifeType } from '@/types';

type FlowStep = 'main' | 'lost' | 'lost-danger' | 'injury' | 'wildlife';

export default function EmergencyScreen() {
  const { colors, spacing } = useTheme();
  const { emergency, setEmergencyMode, clearEmergency } = useDeviceStore();

  // Redirect to assistant - this screen is deprecated
  useEffect(() => {
    router.replace('/(tabs)/assistant' as any);
  }, []);

  const [currentStep, setCurrentStep] = useState<FlowStep>(
    emergency.type ? emergency.type as FlowStep : 'main'
  );
  const [inDanger, setInDanger] = useState<boolean | null>(null);

  const handleAskAI = () => {
    // Navigate to assistant tab for AI help
    router.push('/(tabs)/assistant' as any);
  };

  const handleEmergencySelect = (type: EmergencyType) => {
    setEmergencyMode(type);
    setCurrentStep(type as FlowStep);
  };

  const handleBack = () => {
    clearEmergency();
    setCurrentStep('main');
    setInDanger(null);
  };

  const handleInjurySelect = (type: InjuryType) => {
    setEmergencyMode('injury', type);
  };

  const handleWildlifeSelect = (type: WildlifeType) => {
    setEmergencyMode('wildlife', type);
  };

  // Main emergency selection
  if (currentStep === 'main') {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['bottom']}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <FontAwesome name="exclamation-triangle" size={32} color={colors.danger} />
            <Text style={[styles.headerTitle, { color: colors.text }]}>EMERGENCY HELP</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Select your situation for guided assistance
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            {/* I'm Lost */}
            <TouchableOpacity
              style={[styles.emergencyButton, { backgroundColor: colors.danger }]}
              onPress={() => handleEmergencySelect('lost')}
              activeOpacity={0.8}
            >
              <FontAwesome name="question-circle" size={28} color="#FFFFFF" />
              <Text style={styles.emergencyButtonText}>I'M LOST</Text>
              <Text style={styles.emergencyButtonSubtext}>Don't know where I am</Text>
            </TouchableOpacity>

            {/* Injury / Medical */}
            <TouchableOpacity
              style={[styles.emergencyButton, { backgroundColor: colors.danger }]}
              onPress={() => handleEmergencySelect('injury')}
              activeOpacity={0.8}
            >
              <FontAwesome name="plus-square" size={28} color="#FFFFFF" />
              <Text style={styles.emergencyButtonText}>INJURY / MEDICAL</Text>
              <Text style={styles.emergencyButtonSubtext}>First aid guidance</Text>
            </TouchableOpacity>

            {/* Wildlife Encounter */}
            <TouchableOpacity
              style={[styles.emergencyButton, { backgroundColor: colors.warning }]}
              onPress={() => handleEmergencySelect('wildlife')}
              activeOpacity={0.8}
            >
              <FontAwesome name="paw" size={28} color="#FFFFFF" />
              <Text style={styles.emergencyButtonText}>WILDLIFE ENCOUNTER</Text>
              <Text style={styles.emergencyButtonSubtext}>Animal safety</Text>
            </TouchableOpacity>

            {/* Other Emergency */}
            <TouchableOpacity
              style={[
                styles.emergencyButton,
                { backgroundColor: colors.backgroundTertiary, borderWidth: 1, borderColor: colors.border },
              ]}
              onPress={() => handleAskAI()}
              activeOpacity={0.8}
            >
              <FontAwesome name="comment" size={28} color={colors.accent} />
              <Text style={[styles.emergencyButtonText, { color: colors.text }]}>
                OTHER EMERGENCY
              </Text>
              <Text style={[styles.emergencyButtonSubtext, { color: colors.textSecondary }]}>
                Ask AI for help
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.backgroundTertiary, borderColor: colors.border },
            ]}
          >
            <FontAwesome name="phone" size={16} color={colors.accent} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              If you have cell signal, call 911 for life-threatening emergencies.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Lost Flow
  if (currentStep === 'lost') {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['bottom']}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome name="arrow-left" size={16} color={colors.accent} />
            <Text style={[styles.backText, { color: colors.accent }]}>Back</Text>
          </TouchableOpacity>

          <View style={styles.flowHeader}>
            <View style={[styles.flowIcon, { backgroundColor: colors.danger }]}>
              <FontAwesome name="question-circle" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.flowTitle, { color: colors.text }]}>I'M LOST</Text>
          </View>

          {inDanger === null && (
            <>
              <Text style={[styles.questionText, { color: colors.text }]}>
                Are you in immediate danger?
              </Text>
              <Text style={[styles.questionSubtext, { color: colors.textSecondary }]}>
                (Cliff edge, fast water, fire, severe weather, etc.)
              </Text>

              <View style={styles.choiceButtons}>
                <TouchableOpacity
                  style={[styles.choiceButton, { backgroundColor: colors.danger }]}
                  onPress={() => setInDanger(true)}
                >
                  <Text style={styles.choiceButtonText}>YES</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.choiceButton, { backgroundColor: colors.success }]}
                  onPress={() => setInDanger(false)}
                >
                  <Text style={styles.choiceButtonText}>NO</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {inDanger === true && (
            <View style={styles.guidanceContainer}>
              <View
                style={[
                  styles.warningCard,
                  { backgroundColor: colors.dangerBackground, borderColor: colors.danger },
                ]}
              >
                <FontAwesome name="exclamation-triangle" size={20} color={colors.danger} />
                <Text style={[styles.warningTitle, { color: colors.danger }]}>
                  MOVE TO SAFETY FIRST
                </Text>
                <Text style={[styles.warningText, { color: colors.text }]}>
                  If you can safely move away from immediate danger, do so carefully. Then follow the steps below.
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: colors.accent }]}
                onPress={() => setInDanger(false)}
              >
                <Text style={styles.nextButtonText}>I'M IN A SAFE SPOT NOW</Text>
              </TouchableOpacity>
            </View>
          )}

          {inDanger === false && (
            <View style={styles.guidanceContainer}>
              <Text style={[styles.protocolTitle, { color: colors.accent }]}>
                S.T.O.P. PROTOCOL
              </Text>

              <View style={styles.stepsList}>
                <View style={[styles.stepCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                  <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
                    <Text style={styles.stepNumberText}>S</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, { color: colors.text }]}>SIT DOWN</Text>
                    <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                      Stop moving. Sit down and take a few deep breaths to calm yourself.
                    </Text>
                  </View>
                </View>

                <View style={[styles.stepCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                  <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
                    <Text style={styles.stepNumberText}>T</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, { color: colors.text }]}>THINK</Text>
                    <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                      How did you get here? What landmarks did you pass? Do you have supplies?
                    </Text>
                  </View>
                </View>

                <View style={[styles.stepCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                  <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
                    <Text style={styles.stepNumberText}>O</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, { color: colors.text }]}>OBSERVE</Text>
                    <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                      Look around. Note landmarks, sun position, terrain features, and sounds.
                    </Text>
                  </View>
                </View>

                <View style={[styles.stepCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                  <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
                    <Text style={styles.stepNumberText}>P</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, { color: colors.text }]}>PLAN</Text>
                    <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                      Decide: stay put and signal, or try to retrace your steps if confident.
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.aiButton, { backgroundColor: colors.accent }]}
                onPress={() => handleAskAI()}
              >
                <FontAwesome name="comment" size={18} color="#FFFFFF" />
                <Text style={styles.aiButtonText}>ASK AI FOR MORE HELP</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Injury Flow
  if (currentStep === 'injury') {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['bottom']}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome name="arrow-left" size={16} color={colors.accent} />
            <Text style={[styles.backText, { color: colors.accent }]}>Back</Text>
          </TouchableOpacity>

          <View style={styles.flowHeader}>
            <View style={[styles.flowIcon, { backgroundColor: colors.danger }]}>
              <FontAwesome name="plus-square" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.flowTitle, { color: colors.text }]}>INJURY / MEDICAL</Text>
          </View>

          <Text style={[styles.questionText, { color: colors.text }]}>
            What type of injury?
          </Text>

          <View style={styles.triageButtons}>
            <TouchableOpacity
              style={[styles.triageButton, { backgroundColor: colors.danger }]}
              onPress={() => handleInjurySelect('bleeding')}
            >
              <FontAwesome name="tint" size={24} color="#FFFFFF" />
              <Text style={styles.triageButtonText}>HEAVY BLEEDING</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.triageButton, { backgroundColor: colors.danger }]}
              onPress={() => handleInjurySelect('broken_bone')}
            >
              <FontAwesome name="medkit" size={24} color="#FFFFFF" />
              <Text style={styles.triageButtonText}>BROKEN BONE</Text>
              <Text style={styles.triageButtonSubtext}>Can't walk</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.triageButton, { backgroundColor: colors.danger }]}
              onPress={() => handleInjurySelect('head_injury')}
            >
              <FontAwesome name="user" size={24} color="#FFFFFF" />
              <Text style={styles.triageButtonText}>HEAD INJURY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.triageButton,
                { backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border },
              ]}
              onPress={() => handleInjurySelect('other')}
            >
              <FontAwesome name="ellipsis-h" size={24} color={colors.text} />
              <Text style={[styles.triageButtonText, { color: colors.text }]}>OTHER</Text>
            </TouchableOpacity>
          </View>

          {/* Quick guidance based on selection */}
          {emergency.subType === 'bleeding' && (
            <View style={[styles.quickGuide, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Text style={[styles.quickGuideTitle, { color: colors.danger }]}>
                HEAVY BLEEDING - ACT FAST
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                1. Apply direct pressure with clean cloth
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                2. Keep pressure constant - don't remove cloth
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                3. Elevate wound above heart if possible
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                4. If bleeding through, add more cloth on top
              </Text>
            </View>
          )}

          {emergency.subType === 'broken_bone' && (
            <View style={[styles.quickGuide, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Text style={[styles.quickGuideTitle, { color: colors.danger }]}>
                SUSPECTED FRACTURE
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                1. DO NOT try to move or straighten the limb
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                2. Immobilize the injury in current position
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                3. Apply ice if available (wrapped in cloth)
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                4. Stay calm and wait for help
              </Text>
            </View>
          )}

          {emergency.subType === 'head_injury' && (
            <View style={[styles.quickGuide, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Text style={[styles.quickGuideTitle, { color: colors.danger }]}>
                HEAD INJURY - STAY ALERT
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                1. Keep still - avoid moving head/neck
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                2. Stay awake if possible
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                3. Apply gentle pressure if bleeding
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                4. Watch for confusion, nausea, vision changes
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.aiButton, { backgroundColor: colors.accent }]}
            onPress={() => handleAskAI()}
          >
            <FontAwesome name="comment" size={18} color="#FFFFFF" />
            <Text style={styles.aiButtonText}>ASK AI FOR MORE HELP</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Wildlife Flow
  if (currentStep === 'wildlife') {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['bottom']}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <FontAwesome name="arrow-left" size={16} color={colors.accent} />
            <Text style={[styles.backText, { color: colors.accent }]}>Back</Text>
          </TouchableOpacity>

          <View style={styles.flowHeader}>
            <View style={[styles.flowIcon, { backgroundColor: colors.warning }]}>
              <FontAwesome name="paw" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.flowTitle, { color: colors.text }]}>WILDLIFE ENCOUNTER</Text>
          </View>

          <Text style={[styles.questionText, { color: colors.text }]}>
            What animal?
          </Text>

          <View style={styles.triageButtons}>
            <TouchableOpacity
              style={[styles.triageButton, { backgroundColor: colors.warning }]}
              onPress={() => handleWildlifeSelect('bear')}
            >
              <Text style={[styles.animalEmoji]}>🐻</Text>
              <Text style={styles.triageButtonText}>BEAR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.triageButton, { backgroundColor: colors.warning }]}
              onPress={() => handleWildlifeSelect('cougar')}
            >
              <Text style={[styles.animalEmoji]}>🦁</Text>
              <Text style={styles.triageButtonText}>COUGAR</Text>
              <Text style={styles.triageButtonSubtext}>Mountain Lion</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.triageButton, { backgroundColor: colors.warning }]}
              onPress={() => handleWildlifeSelect('snake')}
            >
              <Text style={[styles.animalEmoji]}>🐍</Text>
              <Text style={styles.triageButtonText}>SNAKE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.triageButton,
                { backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border },
              ]}
              onPress={() => handleWildlifeSelect('other')}
            >
              <FontAwesome name="ellipsis-h" size={24} color={colors.text} />
              <Text style={[styles.triageButtonText, { color: colors.text }]}>OTHER</Text>
            </TouchableOpacity>
          </View>

          {/* Quick guidance based on selection */}
          {emergency.subType === 'bear' && (
            <View style={[styles.quickGuide, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Text style={[styles.quickGuideTitle, { color: colors.warning }]}>
                BEAR ENCOUNTER
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                1. DO NOT RUN - Stay calm
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                2. Make yourself look big, speak firmly
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                3. Back away slowly - don't turn your back
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                4. If attacked: Black bear = fight back, Grizzly = play dead
              </Text>
            </View>
          )}

          {emergency.subType === 'cougar' && (
            <View style={[styles.quickGuide, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Text style={[styles.quickGuideTitle, { color: colors.warning }]}>
                COUGAR / MOUNTAIN LION
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                1. DO NOT RUN - Triggers chase instinct
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                2. Face the animal, make eye contact
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                3. Make yourself look big, yell loudly
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                4. If attacked: FIGHT BACK aggressively
              </Text>
            </View>
          )}

          {emergency.subType === 'snake' && (
            <View style={[styles.quickGuide, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Text style={[styles.quickGuideTitle, { color: colors.warning }]}>
                SNAKE ENCOUNTER
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                1. FREEZE - Most snakes strike when startled
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                2. Slowly back away - give it space
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                3. If bitten: Stay calm, immobilize the bite area
              </Text>
              <Text style={[styles.quickGuideStep, { color: colors.text }]}>
                4. DO NOT: Cut, suck, or apply ice to bite
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.aiButton, { backgroundColor: colors.accent }]}
            onPress={() => handleAskAI()}
          >
            <FontAwesome name="comment" size={18} color="#FFFFFF" />
            <Text style={styles.aiButtonText}>ASK AI FOR MORE HELP</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
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
    gap: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 4,
    gap: 16,
    minHeight: 80,
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    flex: 1,
  },
  emergencyButtonSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    position: 'absolute',
    right: 20,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
  },
  flowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  flowIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flowTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  questionSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  choiceButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  choiceButton: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 4,
    alignItems: 'center',
  },
  choiceButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  guidanceContainer: {
    marginTop: 16,
    gap: 16,
  },
  warningCard: {
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    gap: 8,
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  protocolTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  stepsList: {
    gap: 12,
  },
  stepCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  stepDescription: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 4,
    marginTop: 8,
  },
  aiButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  triageButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  triageButton: {
    width: '47%',
    flexGrow: 1,
    paddingVertical: 20,
    borderRadius: 4,
    alignItems: 'center',
    gap: 4,
  },
  triageButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  triageButtonSubtext: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  animalEmoji: {
    fontSize: 28,
  },
  quickGuide: {
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    gap: 8,
  },
  quickGuideTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  quickGuideStep: {
    fontSize: 14,
    lineHeight: 22,
  },
});

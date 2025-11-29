// Few-shot examples for small on-device models
// These demonstrate the ideal response format and help guide the model

export interface FewShotExample {
  user: string;
  assistant: string;
}

// Examples showing ideal response format - concise, structured, actionable
export const FEW_SHOT_EXAMPLES: FewShotExample[] = [
  {
    user: "How do I stop bleeding from a deep cut?",
    assistant: `**Stop Severe Bleeding:**

1. Apply DIRECT PRESSURE with clean cloth - press hard
2. Hold for 10-15 minutes without lifting
3. If blood soaks through, add more material on top (don't remove first layer)
4. Elevate wound above heart if possible

**Warning signs to watch for:** Pale skin, rapid breathing, confusion, weakness - these indicate dangerous blood loss.

If bleeding won't stop, apply a tourniquet 2-3 inches above the wound.`
  },
  {
    user: "I think I'm lost in the woods. What should I do?",
    assistant: `**S.T.O.P. Protocol:**

1. **Sit down** - Don't panic, don't wander further
2. **Think** - When did you last know where you were?
3. **Observe** - Look for landmarks, trails, water, or high ground
4. **Plan** - Decide: retrace steps or stay put?

**If unsure of direction:** Stay where you are. It's easier for rescuers to find a stationary person.

**Make yourself visible:** Bright colors, signals in clearings, stay near open areas.`
  },
  {
    user: "How do I start a fire without matches?",
    assistant: `**Fire Without Matches:**

**1. Prepare first:**
- Gather tinder (dry leaves, bark shavings, grass)
- Get kindling (small dry twigs)
- Have larger fuel wood ready

**2. Friction method (bow drill):**
- Carve a fireboard with a notch
- Use a spindle and bow to create friction
- Catch ember in tinder bundle and blow gently

**3. Easier alternatives:**
- Flint/steel if available
- Magnifying glass or eyeglasses in sunlight
- Battery + steel wool

**Key:** Have everything ready before starting. Tinder must be completely dry.`
  }
];

// Format few-shot examples for inclusion in prompt
export const formatFewShotExamples = (examples: FewShotExample[] = FEW_SHOT_EXAMPLES): string => {
  return examples.map(ex =>
    `User: ${ex.user}\n\nAssistant: ${ex.assistant}`
  ).join('\n\n---\n\n');
};

import { KnowledgeTopic } from './types';

// Source: FM 21-76 US Army Survival Manual, Chapter 2
export const psychologyKnowledge: KnowledgeTopic = {
  id: 'psychology',
  name: 'Survival Psychology',
  description: 'Mental preparation and stress management for survival situations',
  keywords: ['stress', 'panic', 'fear', 'mindset', 'mental', 'calm', 'psychology', 'attitude', 'will', 'survive', 'scared', 'afraid', 'anxious', 'overwhelmed', 'think', 'focus'],
  entries: [
    {
      id: 'fm-will-to-survive',
      title: 'The Will to Survive',
      priority: 'critical',
      keywords: ['will', 'survive', 'mental', 'attitude', 'mindset', 'give up'],
      content: `THE WILL TO SURVIVE (FM 21-76)

Having survival skills is important. Having the WILL to survive is essential.

People with little survival training have survived life-threatening situations.
People with extensive training have died because they gave up.

The difference is MENTAL ATTITUDE.

Key principles:
1. Accept your situation - denial wastes energy
2. Take inventory - what do you have? What can you do?
3. Make a plan - even a simple plan gives purpose
4. Take action - small successes build confidence
5. Never give up - rescue may be moments away

Your mind is your greatest survival tool.`
    },
    {
      id: 'fm-stress-signs',
      title: 'Recognizing Stress',
      priority: 'high',
      keywords: ['stress', 'signs', 'symptoms', 'distress', 'panic'],
      content: `SIGNS OF DISTRESS (FM 21-76)

Recognize these warning signs in yourself or others:
- Difficulty making decisions
- Angry outbursts
- Forgetfulness
- Low energy level
- Constant worrying
- Making mistakes
- Thoughts about death or suicide
- Trouble getting along with others
- Withdrawing from others
- Hiding from responsibilities

Stress can help you perform at maximum efficiency.
But too much stress leads to panic and poor decisions.

The survivor works WITH stress, not against it.`
    },
    {
      id: 'fm-survival-stressors',
      title: 'Survival Stressors',
      priority: 'high',
      keywords: ['stressors', 'fear', 'injury', 'thirst', 'hunger', 'environment'],
      content: `SURVIVAL STRESSORS (FM 21-76)

Common stressors you will face:

1. INJURY, ILLNESS, DEATH
   - Real possibility you must accept
   - Control this fear to take necessary risks

2. UNCERTAINTY
   - Nothing is guaranteed in survival
   - Accept operating with limited information

3. ENVIRONMENT
   - Heat, cold, rain, wind
   - Terrain challenges
   - Dangerous animals and insects

4. HUNGER AND THIRST
   - Becomes more stressful over time
   - Managing these is psychological too

5. FATIGUE
   - Reduces your ability to cope
   - Rest is a survival priority

6. ISOLATION
   - Being alone is psychologically difficult
   - Stay occupied with survival tasks`
    },
    {
      id: 'fm-fight-or-flight',
      title: 'Fight or Flight Response',
      priority: 'medium',
      keywords: ['fight', 'flight', 'adrenaline', 'body', 'response', 'panic'],
      content: `FIGHT OR FLIGHT RESPONSE (FM 21-76)

When facing danger, your body prepares to fight or flee:
- Heart rate increases
- Breathing speeds up
- Muscles tense
- Senses sharpen
- Blood clotting increases
- Energy is released

This is NORMAL and HELPFUL - use it!

But you cannot maintain this state indefinitely.
Prolonged stress leads to exhaustion.

To manage this response:
1. Breathe slowly and deeply
2. Focus on one task at a time
3. Take action - doing something helps
4. Accept that some fear is normal
5. Channel the energy into useful work`
    },
    {
      id: 'fm-positive-attitude',
      title: 'Maintaining Positive Attitude',
      priority: 'critical',
      keywords: ['positive', 'attitude', 'hope', 'optimism', 'mental', 'morale'],
      content: `POSITIVE ATTITUDE (FM 21-76)

Develop a survival pattern of thinking:

S - Size up the situation
U - Undue haste makes waste
R - Remember where you are
V - Vanquish fear and panic
I - Improvise
V - Value living
A - Act like the natives
L - Learn basic skills

Keep yourself busy with survival tasks.
Small accomplishments build confidence.
Set achievable goals each day.

Tell yourself:
- "I WILL survive"
- "I CAN do this"
- "Help IS coming"

Your attitude determines your survival.`
    },
    {
      id: 'fm-fear-management',
      title: 'Managing Fear and Panic',
      priority: 'critical',
      keywords: ['fear', 'panic', 'scared', 'afraid', 'calm', 'control'],
      content: `MANAGING FEAR AND PANIC (FM 21-76)

Fear is NORMAL. Panic is DANGEROUS.

When you feel panic rising:
1. STOP - Don't run or act rashly
2. BREATHE - Slow, deep breaths
3. THINK - What is the actual threat?
4. OBSERVE - Look around calmly
5. PLAN - What is one small step you can take?

Physical techniques:
- Sit or lie down if possible
- Slow your breathing
- Relax your muscles one by one
- Focus on immediate surroundings

Mental techniques:
- Talk yourself through it
- Break problems into small parts
- Focus on what you CAN control
- Remember your training

Fear sharpens senses and provides energy.
Channel it into productive action.`
    },
  ]
};

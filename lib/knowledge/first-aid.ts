import { KnowledgeTopic } from './types';

export const firstAidKnowledge: KnowledgeTopic = {
  id: 'first-aid',
  name: 'First Aid & Medical',
  description: 'Emergency medical care, wound treatment, and health emergencies',
  keywords: ['injury', 'wound', 'bleeding', 'broken', 'fracture', 'burn', 'bite', 'sting', 'poison', 'cpr', 'choking', 'shock', 'hypothermia', 'hyperthermia', 'heat', 'cold', 'frostbite', 'dehydration', 'pain', 'infection', 'cut', 'bandage', 'splint', 'medical', 'first aid', 'emergency', 'hurt', 'injured'],
  entries: [
    {
      id: 'bleeding-control',
      title: 'Controlling Severe Bleeding',
      priority: 'critical',
      keywords: ['bleeding', 'blood', 'wound', 'cut', 'laceration', 'hemorrhage'],
      content: `STOP SEVERE BLEEDING (Life-threatening):
1. Apply DIRECT PRESSURE with clean cloth/clothing - press hard
2. Keep pressure for 10-15 minutes without lifting
3. If blood soaks through, ADD more material on top (don't remove)
4. Elevate wound above heart if possible
5. For limbs: Apply tourniquet 2-3 inches above wound if bleeding won't stop
   - Tighten until bleeding stops
   - Note the time applied
   - Do NOT remove once applied

Signs of dangerous blood loss: Pale skin, rapid breathing, confusion, weakness`
    },
    {
      id: 'cpr-basics',
      title: 'CPR Basics',
      priority: 'critical',
      keywords: ['cpr', 'not breathing', 'heart stopped', 'unconscious', 'pulse', 'resuscitation'],
      content: `CPR FOR ADULTS (if person is unresponsive and not breathing normally):
1. Call for help if possible
2. Place heel of hand on center of chest (between nipples)
3. Place other hand on top, interlace fingers
4. Push HARD and FAST: 2 inches deep, 100-120 pushes/minute
5. Allow chest to fully rise between compressions
6. Continue until help arrives or person responds

Rhythm: Push to beat of "Stayin' Alive" song
If trained: Give 2 rescue breaths after every 30 compressions`
    },
    {
      id: 'choking',
      title: 'Choking Response',
      priority: 'critical',
      keywords: ['choking', 'cant breathe', 'airway', 'heimlich', 'obstruction'],
      content: `CHOKING (person cannot cough, speak, or breathe):
1. Stand behind person, wrap arms around waist
2. Make fist with one hand, place thumb side against belly (above navel, below ribs)
3. Grab fist with other hand
4. Give quick UPWARD thrusts into abdomen
5. Repeat until object comes out or person becomes unconscious

If alone and choking:
- Make fist, thrust into your own abdomen
- Or lean over chair back and thrust against it`
    },
    {
      id: 'hypothermia',
      title: 'Hypothermia Treatment',
      priority: 'critical',
      keywords: ['cold', 'hypothermia', 'freezing', 'shivering', 'frostbite', 'exposure'],
      content: `HYPOTHERMIA (body temp drops dangerously low):
Signs: Shivering, confusion, slurred speech, drowsiness, weak pulse

Treatment:
1. Get to shelter, out of wind/wet
2. Remove wet clothing, replace with dry
3. Warm the core FIRST (chest, neck, head, groin)
4. Use body heat - skin to skin contact under blankets
5. Give warm (not hot) drinks if conscious
6. Do NOT rub limbs or apply direct heat to extremities

SEVERE hypothermia (no shivering, very confused): Handle GENTLY - sudden movements can cause heart problems`
    },
    {
      id: 'heat-illness',
      title: 'Heat Exhaustion & Heat Stroke',
      priority: 'critical',
      keywords: ['heat', 'hot', 'overheating', 'heat stroke', 'heat exhaustion', 'dehydration', 'sun'],
      content: `HEAT EXHAUSTION:
Signs: Heavy sweating, weakness, cold/pale skin, fast pulse, nausea
Treatment: Move to shade, loosen clothes, cool with wet cloths, sip water

HEAT STROKE (EMERGENCY):
Signs: High body temp (103°F+), hot RED dry skin, rapid pulse, confusion, unconsciousness
Treatment:
1. Move to shade immediately
2. Cool rapidly: immerse in cold water, or cover with wet sheets + fan
3. Focus on head, neck, armpits, groin
4. Do NOT give fluids if unconscious
This is life-threatening - cool the person as quickly as possible`
    },
    {
      id: 'fractures',
      title: 'Broken Bones & Splinting',
      priority: 'high',
      keywords: ['broken', 'fracture', 'bone', 'splint', 'sprain', 'dislocation'],
      content: `SUSPECTED FRACTURE:
Signs: Pain, swelling, deformity, inability to move, grinding sensation

Treatment:
1. Do NOT try to straighten the bone
2. Immobilize the injury - splint in position found
3. Splint should extend past joints above and below injury
4. Use sticks, boards, rolled clothing as splint material
5. Pad between splint and skin
6. Tie firmly but check circulation (fingers/toes should stay pink and warm)

For arms: Also use sling to support
Never remove shoes from suspected ankle/foot fractures`
    },
    {
      id: 'burns',
      title: 'Burn Treatment',
      priority: 'high',
      keywords: ['burn', 'fire', 'scald', 'hot', 'blister'],
      content: `BURN TREATMENT:
1. Remove from heat source, remove clothing/jewelry near burn (unless stuck)
2. Cool with cool (not cold) running water for 10-20 minutes
3. Do NOT use ice, butter, or toothpaste
4. Cover loosely with clean, dry bandage
5. Do NOT pop blisters

Severe burns (large area, face/hands/groin, charred/white skin):
- Keep person warm (burns impair temperature regulation)
- Elevate burned area if possible
- Watch for shock`
    },
    {
      id: 'snake-bite',
      title: 'Snake Bite Response',
      priority: 'high',
      keywords: ['snake', 'bite', 'venom', 'poison', 'reptile'],
      content: `SNAKE BITE:
1. Move away from snake
2. Keep calm - racing heart spreads venom faster
3. Remove jewelry/tight clothing near bite
4. Keep bitten area BELOW heart level
5. Clean wound gently with water
6. Mark the edge of swelling with pen and time

DO NOT:
- Cut the wound
- Suck out venom
- Apply tourniquet
- Apply ice
- Give alcohol or aspirin

Try to remember snake appearance but don't chase it. Get medical help ASAP.`
    },
    {
      id: 'wound-care',
      title: 'Basic Wound Care',
      priority: 'medium',
      keywords: ['wound', 'cut', 'scrape', 'infection', 'clean', 'bandage'],
      content: `CLEANING WOUNDS:
1. Wash your hands first
2. Stop bleeding with pressure
3. Rinse wound with clean water (drinkable water)
4. Remove debris gently
5. Apply thin layer of antibiotic if available
6. Cover with clean bandage
7. Change bandage daily and watch for infection

INFECTION SIGNS (seek help):
- Increasing pain/redness
- Swelling spreading
- Pus or discharge
- Red streaks from wound
- Fever`
    },
    {
      id: 'shock',
      title: 'Treating Shock',
      priority: 'critical',
      keywords: ['shock', 'pale', 'clammy', 'weak', 'trauma'],
      content: `SHOCK (body not getting enough blood flow):
Signs: Pale/gray skin, rapid weak pulse, rapid breathing, confusion, weakness

Treatment:
1. Lay person down
2. Elevate legs 8-12 inches (unless head/spine/leg injury)
3. Keep warm with blankets
4. Do NOT give food or water
5. Loosen tight clothing
6. Keep calm and reassured
7. Monitor breathing

Shock can kill - treat the cause while managing shock symptoms`
    }
  ]
};

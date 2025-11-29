// Pre-computed Q&A cache for common survival questions
// These responses are verified and provide instant, reliable answers

export interface CachedQA {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
  relatedEntryId?: string;
  category: 'water' | 'shelter' | 'fire' | 'first-aid' | 'navigation' | 'signaling' | 'food' | 'general';
}

export const CACHED_QA: CachedQA[] = [
  // ============= WATER =============
  {
    id: 'water-purify-1',
    question: 'How do I purify water in the wilderness?',
    keywords: ['water', 'purify', 'clean', 'drink', 'safe', 'boil', 'filter'],
    category: 'water',
    relatedEntryId: 'water-purification',
    answer: `**Water Purification Methods:**

**1. Boiling (Most Reliable)**
- Bring water to a rolling boil for 1-3 minutes
- At high altitude (>6,500ft): boil for 3+ minutes
- Let cool before drinking

**2. Chemical Treatment**
- Iodine tablets: 2 tablets per liter, wait 30 minutes
- Chlorine drops: follow package directions
- Not effective against all parasites

**3. Solar Disinfection (SODIS)**
- Fill clear plastic bottle
- Leave in direct sunlight for 6+ hours
- Works best with clear water

**4. Filtering**
- Commercial filter or improvised (sand/charcoal/cloth layers)
- Filtering removes particles but may not kill all pathogens
- Filter THEN boil for best results

_Remember: Clear water isn't always safe. Always treat water from unknown sources._`
  },
  {
    id: 'water-find-1',
    question: 'How do I find water in the wilderness?',
    keywords: ['water', 'find', 'source', 'stream', 'river', 'thirsty', 'dehydrated'],
    category: 'water',
    relatedEntryId: 'water-finding',
    answer: `**Finding Water in the Wild:**

**1. Look for natural sources:**
- Follow animal trails downhill - they often lead to water
- Listen for flowing water
- Look for green vegetation in dry areas
- Check low points, valleys, and depressions

**2. Collect morning dew:**
- Tie absorbent cloth around ankles and walk through grass at dawn
- Wring out into container

**3. Collect rainwater:**
- Use any waterproof container
- Set up tarps or large leaves to funnel rain

**4. Solar still (emergency):**
- Dig a hole, place container in center
- Cover with plastic, put rock in center
- Condensation drips into container

**Priority order:** Flowing water > Standing water > Ground water > Dew/Rain

_Always purify water before drinking, even if it looks clean._`
  },

  // ============= SHELTER =============
  {
    id: 'shelter-build-1',
    question: 'How do I build an emergency shelter?',
    keywords: ['shelter', 'build', 'make', 'emergency', 'sleep', 'cold', 'rain', 'debris'],
    category: 'shelter',
    relatedEntryId: 'shelter-building',
    answer: `**Quick Emergency Shelter:**

**Debris Hut (best for cold/rain):**
1. Find a ridge pole (fallen branch, 9-12 ft long)
2. Prop one end on stump or forked branch (waist height)
3. Add ribs on both sides at 45° angle
4. Cover with leaves, bark, branches (thickest = most insulation)
5. Make pile 2-3 feet thick for warmth
6. Fill inside with dry leaves for bedding

**Quick Lean-To:**
1. Find two trees 6-8 feet apart
2. Tie crossbar between them at chest height
3. Lean branches against crossbar at 45°
4. Cover with leaves, bark, pine boughs

**Key principles:**
- Get OFF the ground (most heat loss is downward)
- Small = warmer (less air to heat with body)
- Entrance away from wind
- Insulation underneath is MORE important than on top

_Shelter is priority #1 in cold/wet conditions - build before you're exhausted._`
  },
  {
    id: 'shelter-stay-warm-1',
    question: 'How do I stay warm without a sleeping bag?',
    keywords: ['warm', 'cold', 'freezing', 'sleep', 'night', 'insulation', 'hypothermia'],
    category: 'shelter',
    answer: `**Staying Warm Without Gear:**

**1. Insulate from ground first:**
- Pile dry leaves, pine needles, grass underneath you
- Ground takes more heat than air
- Make pile at least 6 inches thick

**2. Create dead air space:**
- Stuff dry leaves/grass inside clothing
- Wear multiple loose layers, not one tight layer
- Cover head and neck (major heat loss areas)

**3. Use natural insulation:**
- Bury yourself in dry leaves
- Cover with bark or branches
- Create a cocoon effect

**4. Fire safety for warmth:**
- Build reflector wall behind fire (logs or rocks)
- Sleep between fire and reflector
- Keep fire small and maintained rather than big and dying

**5. Body heat tricks:**
- Curl into fetal position to conserve heat
- Keep moving to generate warmth before sleeping
- Eat if you have food - digestion generates heat

_Warning signs of hypothermia: Shivering stops, confusion, drowsiness. Get warm immediately._`
  },

  // ============= FIRE =============
  {
    id: 'fire-start-1',
    question: 'How do I start a fire without matches?',
    keywords: ['fire', 'start', 'matches', 'lighter', 'friction', 'bow drill', 'spark'],
    category: 'fire',
    relatedEntryId: 'fire-starting',
    answer: `**Starting Fire Without Matches:**

**Preparation (DO THIS FIRST):**
- Gather tinder (dry leaves, bark shavings, cattail fluff, birch bark)
- Get kindling (pencil-thick dry twigs)
- Have fuel wood ready (wrist-thick and larger)
- Build a tinder bundle (bird's nest shape)

**Method 1: Friction (Bow Drill)**
1. Make fireboard from dry softwood with a notch
2. Carve spindle from same or similar wood
3. Use bow and socket to spin spindle on fireboard
4. Collect ember in notch, transfer to tinder bundle
5. Blow gently until flames

**Method 2: Flint & Steel**
- Strike steel against flint at 30° angle
- Catch sparks on char cloth or fine tinder
- Transfer ember to tinder bundle

**Method 3: Magnifying Lens**
- Focus sunlight to a pinpoint on dark tinder
- Works with eyeglasses, camera lens, ice lens
- Requires bright sun

**Key to success:** Everything must be COMPLETELY DRY. Have all materials ready before you start.`
  },

  // ============= FIRST AID =============
  {
    id: 'firstaid-bleeding-1',
    question: 'How do I stop severe bleeding?',
    keywords: ['bleeding', 'blood', 'cut', 'wound', 'hemorrhage', 'tourniquet'],
    category: 'first-aid',
    relatedEntryId: 'bleeding-control',
    answer: `**Stop Severe Bleeding (CRITICAL):**

**1. Apply DIRECT PRESSURE immediately**
- Use clean cloth, clothing, or your hand
- Press HARD directly on the wound
- Hold for 10-15 minutes without peeking

**2. If blood soaks through:**
- ADD more material on top (don't remove first layer)
- Continue pressing

**3. Elevate if possible:**
- Raise wound above heart level
- Helps slow blood flow

**4. Tourniquet (for life-threatening limb bleeding):**
- Apply 2-3 inches ABOVE the wound
- Tighten until bleeding stops
- Note the time applied
- Do NOT remove once applied

**Danger signs (shock):**
- Pale or gray skin
- Rapid, weak pulse
- Rapid breathing
- Confusion or anxiety

_For severe bleeding, call emergency services immediately if possible. Keep pressure until help arrives._`
  },
  {
    id: 'firstaid-cpr-1',
    question: 'How do I perform CPR?',
    keywords: ['cpr', 'breathing', 'heart', 'unconscious', 'pulse', 'chest', 'compressions'],
    category: 'first-aid',
    relatedEntryId: 'cpr-basics',
    answer: `**CPR for Adults (unresponsive, not breathing normally):**

**1. Call for help** if possible

**2. Position for compressions:**
- Place heel of hand on CENTER of chest (between nipples)
- Place other hand on top, interlace fingers
- Arms straight, shoulders over hands

**3. Compress:**
- Push HARD and FAST: at least 2 inches deep
- Rate: 100-120 compressions per minute
- Let chest fully rise between compressions
- Minimize interruptions

**4. Rhythm:** Push to the beat of "Stayin' Alive"

**5. If trained in rescue breathing:**
- 30 compressions, then 2 breaths
- Tilt head back, lift chin, pinch nose
- Give breath over 1 second, watch chest rise

**6. Continue until:**
- Person responds
- Help arrives
- You're too exhausted to continue

_CPR keeps blood flowing to the brain. Even hands-only CPR dramatically improves survival chances._`
  },
  {
    id: 'firstaid-hypothermia-1',
    question: 'How do I treat hypothermia?',
    keywords: ['hypothermia', 'cold', 'freezing', 'shivering', 'frostbite', 'exposure'],
    category: 'first-aid',
    relatedEntryId: 'hypothermia',
    answer: `**Treating Hypothermia:**

**Signs:** Shivering, confusion, slurred speech, drowsiness, weak pulse

**Treatment:**
1. **Get to shelter** - out of wind and wet

2. **Remove wet clothing** - replace with dry if available

3. **Warm the CORE first:**
   - Chest, neck, head, groin
   - Use body heat: skin-to-skin contact under blankets
   - Warm (not hot) water bottles to armpits/groin

4. **Give warm drinks** if person is conscious
   - No alcohol (it causes more heat loss)

5. **Do NOT:**
   - Rub limbs (can push cold blood to heart)
   - Apply direct heat to extremities
   - Put in hot bath suddenly

**SEVERE hypothermia (shivering stops, very confused):**
- Handle VERY gently - sudden movements can cause heart problems
- Warm slowly
- Get medical help urgently

_Mild hypothermia can become severe quickly. Act fast and keep the person awake._`
  },
  {
    id: 'firstaid-snakebite-1',
    question: 'What should I do if bitten by a snake?',
    keywords: ['snake', 'bite', 'bitten', 'venom', 'poison', 'reptile'],
    category: 'first-aid',
    relatedEntryId: 'snake-bite',
    answer: `**Snake Bite Response:**

**DO:**
1. Move away from the snake
2. Stay calm - racing heart spreads venom faster
3. Remove jewelry/tight clothing near bite
4. Keep bitten area BELOW heart level
5. Clean wound gently with water if available
6. Mark the edge of swelling with pen and time
7. Get to medical care as fast as safely possible

**DO NOT:**
- Cut the wound
- Suck out venom
- Apply tourniquet (restricts blood flow dangerously)
- Apply ice
- Give alcohol or aspirin
- Chase or try to catch the snake

**Try to remember:**
- Snake size, color, and pattern
- Time of bite
- But don't risk another bite trying to identify it

_Not all snake bites inject venom. Stay calm, immobilize the limb, and seek medical help._`
  },

  // ============= NAVIGATION =============
  {
    id: 'nav-lost-1',
    question: 'What should I do if I get lost?',
    keywords: ['lost', 'found', 'direction', 'navigate', 'trail', 'path'],
    category: 'navigation',
    relatedEntryId: 'lost-protocol',
    answer: `**If You're Lost - S.T.O.P. Protocol:**

**S - SIT DOWN**
- Don't panic
- Don't wander further
- Conserve energy

**T - THINK**
- When did you last know where you were?
- What landmarks do you remember?
- Do you have a map or phone?

**O - OBSERVE**
- Look for landmarks, trails, water, high ground
- Listen for roads, water, people
- Check sun position for basic direction

**P - PLAN**
- Option 1: Retrace steps if confident
- Option 2: Stay put if unsure (easier to be found)

**Make yourself findable:**
- Stay near clearings or high ground
- Create signals (bright objects, fires, ground patterns)
- Blow whistle in 3 short bursts (universal distress signal)

**If you must move:**
- Follow water downstream (often leads to civilization)
- Leave markers showing your direction
- Travel during daylight only

_Most lost people are found within 72 hours if they stay put. Searchers look for stationary targets._`
  },
  {
    id: 'nav-compass-1',
    question: 'How do I use a compass?',
    keywords: ['compass', 'direction', 'north', 'bearing', 'navigate', 'orientation'],
    category: 'navigation',
    relatedEntryId: 'compass-navigation',
    answer: `**Basic Compass Navigation:**

**Parts of a compass:**
- Magnetic needle (red end points NORTH)
- Rotating bezel with degree markings
- Direction of travel arrow
- Baseplate

**Finding direction:**
1. Hold compass flat and level
2. Rotate your body until red needle aligns with N on bezel
3. The direction of travel arrow now points to your heading

**Taking a bearing:**
1. Point direction of travel arrow at your destination
2. Rotate bezel until red needle aligns with N
3. Read the degree number at the index line
4. To follow: keep needle aligned with N while walking

**Important notes:**
- Keep away from metal objects, phones (affect needle)
- Magnetic north ≠ true north (adjust for declination if using map)
- Check direction frequently - small errors compound

**Without a compass:**
- Sun rises in East, sets in West
- At night: follow North Star (in Northern hemisphere)
- Stick shadow method: mark shadow tip, wait 15 min, mark again - line points E-W

_A compass is useless without practice. Learn the basics before you need them._`
  },

  // ============= SIGNALING =============
  {
    id: 'signal-rescue-1',
    question: 'How do I signal for rescue?',
    keywords: ['signal', 'rescue', 'help', 'sos', 'search', 'helicopter', 'plane'],
    category: 'signaling',
    relatedEntryId: 'signaling-basics',
    answer: `**Signaling for Rescue:**

**Universal distress signals:**
- **3 of anything:** 3 fires, 3 whistle blasts, 3 flashes
- **SOS:** ... --- ... (3 short, 3 long, 3 short) with light, sound, or objects

**Visual signals:**
1. **Signal fire:** Create smoke (green branches) by day, bright flame by night
2. **Ground signals:** Large X or SOS (at least 10ft tall) using rocks, logs, or trampled snow
3. **Mirror/reflective:** Flash toward aircraft or distant people
4. **Bright colors:** Spread out bright clothing/gear in clearing

**Sound signals:**
- Whistle: 3 short blasts, pause, repeat
- Yelling: 3 calls, pause, repeat
- Banging: 3 strikes on hollow object

**For aircraft:**
- Stay in clearings/open areas
- Wave both arms above head = need help
- Wave one arm = OK, don't need help
- Create contrast against ground

**At night:**
- Fire is most visible
- Flashlight SOS pattern
- Stay near your signal location

_The key is contrast and repetition. Make signals as large and different from surroundings as possible._`
  },

  // ============= FOOD =============
  {
    id: 'food-edible-1',
    question: 'What plants can I eat in the wild?',
    keywords: ['food', 'eat', 'plant', 'edible', 'forage', 'hungry', 'berry', 'survive'],
    category: 'food',
    relatedEntryId: 'wild-edibles',
    answer: `**Safe Wild Food (when certain of identification):**

**Generally safe plants:**
- Dandelion (all parts edible)
- Cattail (shoots, roots, pollen)
- Clover (flowers and leaves)
- Pine needles (tea - high in Vitamin C)
- Acorns (must be leached of tannins first)

**Universal Edibility Test (if uncertain):**
1. Touch to skin - wait 15 min for reaction
2. Touch to lip - wait 15 min
3. Touch to tongue - wait 15 min
4. Chew, spit out - wait 15 min
5. Swallow small amount - wait 8 hours
6. If no reaction, likely safe

**NEVER eat:**
- Plants with milky sap (except dandelion)
- Umbrella-shaped flower clusters (many are deadly)
- Plants with shiny leaves
- White or yellow berries
- Anything that smells like almonds

**Important:**
- Food is low priority (you can survive weeks without it)
- Focus on water and shelter first
- Bad food decision = vomiting = dehydration = danger

_When in doubt, don't eat it. The calories saved aren't worth the risk of poisoning._`
  },

  // ============= GENERAL =============
  {
    id: 'general-priorities-1',
    question: 'What are the survival priorities?',
    keywords: ['priority', 'first', 'important', 'survive', 'order', 'basic'],
    category: 'general',
    answer: `**Survival Priorities (Rule of 3s):**

**1. IMMEDIATE DANGER (seconds)**
- Get safe from threats
- Stop severe bleeding
- Get out of water/avalanche

**2. SHELTER (3 hours)**
- You can die of exposure in 3 hours
- In cold/wet: shelter is #1 priority
- Get out of wind and rain

**3. WATER (3 days)**
- You can survive ~3 days without water
- Dehydration impairs judgment
- Find and purify water source

**4. FOOD (3 weeks)**
- Lowest priority (you won't starve quickly)
- Focus on shelter and water first
- Don't waste energy foraging early on

**5. RESCUE**
- Once basic needs met, signal for help
- Stay visible, stay put if possible
- Conserve energy

**Key mindset:**
- Stay calm - panic kills
- Think before acting
- Small tasks first (builds confidence)
- Conserve energy for what matters

_Address priorities in order. Don't skip ahead - a fire won't help if you're bleeding out._`
  },
  {
    id: 'general-kit-1',
    question: 'What should be in a survival kit?',
    keywords: ['kit', 'gear', 'pack', 'essentials', 'carry', 'prepare', 'equipment'],
    category: 'general',
    answer: `**Essential Survival Kit:**

**The 10 Essentials:**
1. **Navigation:** Map, compass, GPS
2. **Sun protection:** Sunglasses, sunscreen
3. **Insulation:** Extra clothing layers
4. **Illumination:** Headlamp + extra batteries
5. **First-aid supplies:** Bandages, tape, meds
6. **Fire:** Lighter, matches, fire starter
7. **Repair tools:** Knife, duct tape, cordage
8. **Nutrition:** Extra food for emergency
9. **Hydration:** Water + purification method
10. **Shelter:** Emergency bivy or space blanket

**Minimum pocket kit:**
- Lighter or ferrocerium rod
- Knife or multi-tool
- Cordage (paracord)
- Whistle
- Signal mirror
- Water purification tablets
- Bandana (many uses)

**Add if space allows:**
- Emergency blanket
- Small flashlight
- Fishing line + hooks
- Needle + thread

_The best survival kit is the one you actually carry. Keep it light enough to always have with you._`
  },
];

// Get all cached Q&A
export const getAllCachedQA = (): CachedQA[] => CACHED_QA;

// Get cached Q&A by category
export const getCachedQAByCategory = (category: CachedQA['category']): CachedQA[] => {
  return CACHED_QA.filter(qa => qa.category === category);
};

// Get a specific cached Q&A by ID
export const getCachedQAById = (id: string): CachedQA | undefined => {
  return CACHED_QA.find(qa => qa.id === id);
};

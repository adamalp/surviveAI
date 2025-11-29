import { KnowledgeTopic } from './types';

export const shelterKnowledge: KnowledgeTopic = {
  id: 'shelter',
  name: 'Shelter & Warmth',
  description: 'Building emergency shelters and staying warm',
  keywords: ['shelter', 'warmth', 'cold', 'sleep', 'camp', 'build', 'cover', 'roof', 'tent', 'insulation', 'bed', 'protection', 'wind', 'rain'],
  entries: [
    {
      id: 'shelter-priority',
      title: 'Shelter Priority',
      priority: 'critical',
      keywords: ['shelter', 'priority', 'exposure', 'hypothermia'],
      content: `SHELTER CAN BE YOUR #1 PRIORITY
In cold, wet, or windy conditions, exposure can kill in HOURS.

Rule of 3s:
- 3 hours without shelter in harsh conditions
- 3 days without water
- 3 weeks without food

Build shelter BEFORE you get cold and wet.
Even in warm climates, night temperatures can be dangerous.

Shelter priorities:
1. Protection from precipitation (rain/snow)
2. Protection from wind
3. Insulation from ground (loses heat fastest)
4. Retain body heat`
    },
    {
      id: 'shelter-location',
      title: 'Choosing Shelter Location',
      priority: 'high',
      keywords: ['location', 'site', 'where', 'camp', 'place'],
      content: `WHERE TO BUILD SHELTER:

GOOD locations:
- Natural windbreaks (rock formations, fallen trees)
- High ground (avoids cold air pooling)
- Near resources (water, firewood) but not in flood path
- South-facing slopes (more sun in northern hemisphere)
- Dry, level ground

AVOID:
- Valley bottoms (cold air settles)
- Hilltops (exposed to wind)
- Under dead trees/branches (widowmakers)
- Dry riverbeds (flash flood risk)
- Near insect nests/animal dens
- Under lone tall trees (lightning)
- Cliff edges or unstable slopes`
    },
    {
      id: 'debris-hut',
      title: 'Debris Hut (Best Primitive Shelter)',
      priority: 'high',
      keywords: ['debris', 'hut', 'build', 'primitive', 'leaves'],
      content: `DEBRIS HUT - Warmest primitive shelter:

Materials: Branches, leaves, forest debris

Construction:
1. Find ridgepole (9-12ft long, sturdy branch)
2. Prop one end on stump/rock 3ft high, other end on ground
3. Create ribbing: lean sticks against ridgepole on both sides
4. Cover with small branches, then leaves/debris
5. Pile debris 2-3 FEET thick (this is critical for insulation)
6. Stuff inside with dry leaves for bedding
7. Make entrance small, add door of debris

Size: Just big enough to fit you - smaller = warmer

Test: If you can see light through walls, add more debris.`
    },
    {
      id: 'lean-to',
      title: 'Lean-To Shelter',
      priority: 'medium',
      keywords: ['lean-to', 'tarp', 'quick', 'simple'],
      content: `LEAN-TO SHELTER - Quick and simple:

Materials: Ridgepole, support branches, covering material

Construction:
1. Secure horizontal ridgepole between two trees (5-6ft high)
2. Lean branches against ridgepole at 45° angle
3. Weave smaller branches horizontally
4. Cover with leaves, bark, boughs, or tarp
5. Open side faces away from wind
6. Build fire reflector wall in front to reflect heat

With tarp:
1. Tie one edge to ridgepole
2. Stake other edge to ground
3. Angle to shed rain

Good for: Warm weather, short-term, when fire is available
Weakness: Open front loses heat`
    },
    {
      id: 'insulation',
      title: 'Ground Insulation',
      priority: 'critical',
      keywords: ['insulation', 'ground', 'cold', 'bed', 'mattress'],
      content: `GROUND INSULATION IS CRITICAL

You lose body heat to ground 50x faster than to air.

Build a bed at least 4 inches thick:
- Dry leaves (best - compresses to create air pockets)
- Pine needles
- Grass (dry)
- Evergreen boughs (tips up)
- Cattail fluff
- Bark strips

LAYER technique:
1. Bottom layer: sticks/branches for drainage
2. Middle: bulky debris for insulation
3. Top: soft material for comfort

Test: Lay on it - if you feel cold spots, add more.

Emergency: Even cardboard, newspaper, or your backpack helps.`
    },
    {
      id: 'staying-warm',
      title: 'Staying Warm',
      priority: 'critical',
      keywords: ['warm', 'cold', 'body heat', 'layer', 'fire'],
      content: `STAYING WARM WITHOUT GEAR:

Layer system:
- Trap air between layers (air = insulation)
- Stuff dry leaves/grass between clothing layers
- Tighten collar, cuffs, ankles to trap warm air

Protect heat loss areas:
- Head (30-40% of heat loss) - cover it!
- Neck
- Armpits
- Groin

Stay dry:
- Wet clothing loses 90% of insulating value
- Remove wet clothing, dry by fire if possible
- Brush off snow before it melts

Body heat techniques:
- Light exercise to generate heat (but avoid sweating)
- Eat and drink (digestion generates heat)
- Huddle with others
- Curl into fetal position (reduces surface area)

Fire placement: 6-8 feet away, with reflector wall behind you to bounce heat back.`
    },
    {
      id: 'snow-shelter',
      title: 'Snow Shelters',
      priority: 'high',
      keywords: ['snow', 'igloo', 'quinzhee', 'winter', 'cold'],
      content: `SNOW SHELTERS - Surprisingly warm:

QUINZHEE (pile shelter):
1. Pile snow 6-8ft high, 10ft diameter
2. Let settle 2-3 hours (critical for strength)
3. Insert foot-long sticks around dome
4. Dig entrance tunnel below floor level
5. Hollow inside until you hit sticks (uniform thickness)
6. Poke ventilation hole in roof
7. Cold air sinks out entrance, warm air stays

SNOW TRENCH (quickest):
1. Dig trench body-length, 3ft deep
2. Cover with branches/tarp
3. Pile snow on top
4. Insulate floor with boughs

Snow temperature stays ~32°F inside regardless of outside temp.

CRITICAL: Always poke ventilation hole - carbon dioxide can build up.`
    }
  ]
};

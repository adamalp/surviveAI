import { KnowledgeTopic } from './types';

export const fireKnowledge: KnowledgeTopic = {
  id: 'fire',
  name: 'Fire Starting & Management',
  description: 'Starting fires without matches, fire safety, fire uses',
  keywords: ['fire', 'flame', 'burn', 'match', 'lighter', 'spark', 'friction', 'warmth', 'heat', 'cook', 'signal', 'tinder', 'kindling'],
  entries: [
    {
      id: 'fire-importance',
      title: 'Importance of Fire',
      priority: 'critical',
      keywords: ['fire', 'important', 'survive', 'warmth', 'why'],
      content: `WHY FIRE IS CRITICAL FOR SURVIVAL:

Fire provides:
- WARMTH - prevents hypothermia
- Water purification - boiling kills pathogens
- Cooking - makes food safe and digestible
- Signaling - smoke visible for miles
- Light - extends productive hours
- Protection - deters most predators
- Morale - psychological comfort

FIRE TRIANGLE - needs all three:
- HEAT (ignition source)
- FUEL (wood, debris)
- OXYGEN (air flow)

Remove any one = fire goes out.
Master fire = greatly increase survival odds.`
    },
    {
      id: 'fire-materials',
      title: 'Fire Materials & Preparation',
      priority: 'critical',
      keywords: ['tinder', 'kindling', 'fuel', 'materials', 'gather'],
      content: `GATHER MATERIALS BEFORE STARTING:

1. TINDER (catches spark, burns fast):
- Dry grass, leaves, pine needles
- Birch bark (contains oils)
- Cattail fluff
- Dried moss
- Char cloth
- Dryer lint (from pocket)
- Cotton balls (especially with petroleum jelly)
- Dead, dry inner bark (shredded)

2. KINDLING (grows the flame):
- Small dry twigs (pencil-size and smaller)
- Small split wood
- Dead branches from standing trees
- Feather sticks (shaved curls in stick)

3. FUEL (sustains fire):
- Wrist-thick to arm-thick wood
- Dry standing dead wood (best)
- Split logs (dry inside even if outside wet)

TIP: Wood from standing dead trees is driest. Ground wood absorbs moisture.`
    },
    {
      id: 'fire-structure',
      title: 'Fire Building Structures',
      priority: 'high',
      keywords: ['structure', 'build', 'tepee', 'log cabin', 'lay'],
      content: `FIRE STRUCTURES:

TEPEE (best for starting):
1. Place tinder bundle in center
2. Lean kindling in cone shape around tinder
3. Leave gap on one side for lighting
4. Add larger kindling as fire grows
Good for: Starting, quick heat

LOG CABIN:
1. Place tinder in center
2. Build square of kindling around it (like Lincoln logs)
3. Add progressively larger wood, leaving air gaps
Good for: Longer burning, cooking, coals

LEAN-TO:
1. Push green stick into ground at 30°
2. Place tinder underneath
3. Lean kindling against stick
Good for: Windy conditions (shield tinder)

STAR/INDIAN:
- Arrange logs like spokes of wheel
- Light center, push in as tips burn
Good for: Long night burn, minimal effort

Always start small and build up. Don't smother flame.`
    },
    {
      id: 'fire-friction',
      title: 'Fire by Friction',
      priority: 'high',
      keywords: ['friction', 'bow drill', 'hand drill', 'primitive', 'no matches'],
      content: `BOW DRILL (most reliable primitive method):

Components needed:
- Fireboard: flat, dry softwood (cedar, willow, aspen)
- Spindle: straight, dry hardwood, 8" long, thumb thick
- Bow: curved stick, 2ft long with cord/shoelace
- Socket: hardwood or stone to hold spindle top
- Coal catch: bark or leaf under notch

Steps:
1. Carve depression in fireboard
2. Cut V-notch from edge into depression
3. Place coal catch under notch
4. Loop bow string around spindle
5. Press spindle into depression with socket
6. Bow back and forth, pressing down firmly
7. Friction creates coal in notch
8. Transfer coal to tinder bundle
9. Blow gently until flame

TIP: Practice before emergency. This is difficult and exhausting.
Wood must be completely dry. Spindle and board from same wood works best.`
    },
    {
      id: 'fire-other-methods',
      title: 'Other Fire Starting Methods',
      priority: 'medium',
      keywords: ['flint', 'steel', 'lens', 'battery', 'alternative'],
      content: `ALTERNATIVE FIRE STARTING:

FLINT & STEEL / FERRO ROD:
- Strike steel on flint at 30° angle
- Direct sparks into tinder
- Char cloth catches sparks easily

MAGNIFYING LENS (sunny days):
- Glasses, binoculars, clear water bottle, ice
- Focus sunlight to pinpoint on dark tinder
- Be patient, keep focus steady

BATTERY & STEEL WOOL:
- Touch both battery terminals to steel wool
- Steel wool ignites, transfer to tinder

BATTERY & GUM WRAPPER:
- Cut wrapper thin in middle
- Touch foil ends to both battery terminals
- Paper ignites at thin point

FIRE PLOW:
- Rub hardwood shaft up and down groove in softwood
- Creates friction and coal dust
- Simpler than bow drill but very tiring

CAR BATTERY:
- Touch jumper cables together = sparks
- Direct into tinder bundle`
    },
    {
      id: 'fire-management',
      title: 'Fire Management & Safety',
      priority: 'high',
      keywords: ['maintain', 'safety', 'put out', 'manage', 'control'],
      content: `MANAGING YOUR FIRE:

KEEPING FIRE GOING:
- Add fuel gradually, don't smother
- Use dry hardwood for long-lasting coals
- Bank fire with ash at night (preserves coals)
- Keep extra dry fuel under shelter

FIRE SAFETY:
- Clear 10ft diameter of debris
- Never leave unattended
- Keep water/dirt nearby
- Don't build under low branches
- Consider wind direction for smoke/sparks

EXTINGUISHING:
1. Let fire burn down
2. Spread coals and embers
3. Douse with water (if available)
4. Stir and soak repeatedly
5. Feel with back of hand for heat
6. Cover with dirt when cold

IF NO WATER:
- Mix dirt and sand with coals
- Stir and add more until cold

NEVER bury hot coals - they can smolder for days.`
    },
    {
      id: 'fire-rain',
      title: 'Fire in Wet Conditions',
      priority: 'high',
      keywords: ['rain', 'wet', 'damp', 'humid', 'moisture'],
      content: `FIRE IN WET CONDITIONS:

FINDING DRY MATERIALS:
- Standing dead branches (elevated, dry inside)
- Inner bark of dead trees
- Inside of split logs
- Under dense evergreen canopy
- Materials you kept dry in pack

PREPARING WET WOOD:
- Split larger pieces - inside is dry
- Make feather sticks (shave curls into stick)
- Shave off wet outer layer
- Dry small pieces near small fire first

FIRE LOCATION:
- Under natural shelter (rock overhang, dense canopy)
- Build small roof over fire site first
- Platform of sticks keeps fire off wet ground

TECHNIQUE:
- Start very small, nurture carefully
- Use more tinder than normal
- Gradually add dry kindling
- Wet wood on edge to dry before adding

Keep matches/lighter in waterproof container. Body heat can dry damp tinder.`
    }
  ]
};

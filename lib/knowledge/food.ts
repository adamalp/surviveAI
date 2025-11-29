import { KnowledgeTopic } from './types';

export const foodKnowledge: KnowledgeTopic = {
  id: 'food',
  name: 'Food & Foraging',
  description: 'Finding food, safe foraging, food safety',
  keywords: ['food', 'eat', 'hungry', 'forage', 'plant', 'berry', 'mushroom', 'insect', 'fish', 'trap', 'hunt', 'edible', 'poison'],
  entries: [
    {
      id: 'food-priority',
      title: 'Food Priority',
      priority: 'high',
      keywords: ['food', 'priority', 'starve', 'hungry', 'important'],
      content: `FOOD IS LOWER PRIORITY THAN SHELTER & WATER

Rule of 3s: You can survive ~3 WEEKS without food.

Energy conservation matters more than food gathering:
- Don't expend 500 calories to get 200 calories
- Rest and ration energy in early days
- Focus on shelter, water, signaling first

WHEN TO PRIORITIZE FOOD:
- Rescue not expected soon
- You have adequate water
- Safe food is easily available
- You're confident in identification

WARNING: Eating uses body water for digestion.
If water is scarce, eating increases dehydration.
Proteins especially require more water to process.`
    },
    {
      id: 'universal-edibility-test',
      title: 'Universal Edibility Test',
      priority: 'critical',
      keywords: ['test', 'edible', 'safe', 'check', 'unknown'],
      content: `UNIVERSAL EDIBILITY TEST (for unknown plants):

ONLY use when no other food option. Takes 8+ hours.

1. TEST ONE PLANT PART AT A TIME
   - Separate leaves, stems, roots, flowers, seeds
   - Test each part individually

2. SMELL TEST
   - Strong or unpleasant odor = avoid

3. SKIN TEST
   - Crush and rub on inner wrist
   - Wait 15 minutes for reaction

4. LIP TEST
   - Touch to corner of mouth
   - Wait 15 minutes

5. TONGUE TEST
   - Place on tongue, don't swallow
   - Wait 15 minutes

6. CHEW TEST
   - Chew and hold in mouth
   - Wait 15 minutes, spit out

7. SWALLOW TEST
   - Eat small amount (teaspoon)
   - Wait 8 HOURS, don't eat anything else

If ANY reaction at any stage = STOP, that part is not safe.
Reaction signs: burning, itching, numbness, nausea, rash`
    },
    {
      id: 'plants-avoid',
      title: 'Plants to Avoid',
      priority: 'critical',
      keywords: ['avoid', 'poison', 'toxic', 'dangerous', 'never eat'],
      content: `PLANTS TO ALWAYS AVOID:

WARNING SIGNS (avoid plants with):
- Milky or discolored sap
- Bitter or soapy taste
- Spines, thorns, or fine hairs
- Beans, bulbs, or seeds inside pods
- Shiny leaves
- Umbrella-shaped flower clusters (many are deadly)
- Almond smell (cyanide)
- Three-leafed growth pattern

SPECIFIC DEADLY PLANTS:
- Water hemlock - most poisonous plant in N. America
- Poison hemlock - looks like wild carrot
- Death camas - looks like wild onion
- Castor bean
- Foxglove
- Oleander
- Nightshade family (unless you know tomatoes/peppers)
- Most mushrooms (unless expert-identified)

RULE: When in doubt, don't eat it.
Starvation takes weeks; poison can kill in hours.`
    },
    {
      id: 'safe-plants',
      title: 'Generally Safe Wild Plants',
      priority: 'high',
      keywords: ['safe', 'edible', 'eat', 'forage', 'plant'],
      content: `COMMONLY SAFE WILD PLANTS (still verify by region):

EASY TO IDENTIFY:
- Dandelion - entire plant edible
- Cattail - roots, shoots, pollen
- Clover - flowers and leaves
- Pine - needles for tea, inner bark
- Acorns - must leach tannins first (soak in water)
- Wild berries: blackberries, blueberries, raspberries
- Wood sorrel - sour leaves (small amounts)

CAUTION BERRIES:
- SAFE: aggregate berries (raspberry-type)
- AVOID: white/yellow berries (90% poisonous)
- CAUTION: red berries (50% poisonous)
- SAFER: blue/black berries (mostly edible)

PREPARATION:
- Cook when possible (destroys many toxins)
- Boil roots and tough plants
- Leach bitter plants in several changes of water

Start with small amounts even for "safe" plants.
Individual reactions vary.`
    },
    {
      id: 'insects-protein',
      title: 'Insects as Food',
      priority: 'medium',
      keywords: ['insect', 'bug', 'worm', 'grub', 'protein'],
      content: `INSECTS - HIGHEST PROTEIN, LOWEST EFFORT:

GOOD CHOICES:
- Grubs (beetle larvae) - found in rotting logs
- Ants (remove heads, they bite)
- Grasshoppers/crickets - remove legs, cook
- Earthworms - purge in clean water 24hrs, cook
- Termites - eat raw or roasted

AVOID:
- Brightly colored insects (warning colors)
- Hairy or fuzzy insects
- Insects that sting
- Ticks, flies, mosquitoes (disease carriers)
- Anything with strong odor

PREPARATION:
- Remove legs, wings, heads when practical
- Cook when possible (kills parasites)
- Roasting improves taste significantly
- Can grind into powder, add to other food

Insects are eaten worldwide - psychological barrier only.
6-legged insects are generally safest.`
    },
    {
      id: 'fish-basics',
      title: 'Fishing Basics',
      priority: 'medium',
      keywords: ['fish', 'fishing', 'catch', 'hook', 'water'],
      content: `BASIC FISHING TECHNIQUES:

IMPROVISED HOOKS:
- Safety pins, paperclips bent
- Thorns
- Carved bone or wood (gorge hooks)
- Wire bent into hook shape

IMPROVISED LINE:
- Shoelaces
- Paracord inner strands
- Plant fibers twisted
- Unraveled clothing thread

BAIT:
- Worms, grubs, insects
- Berries
- Small pieces of other fish
- Bright bits of fabric (lure)

TECHNIQUES:
- Dawn and dusk = best fishing times
- Fish in shade during hot days
- Still line while you do other tasks
- Spearing in shallow water
- Trapping in narrow streams

All freshwater fish are safe to eat when cooked.
Saltwater: avoid fish with spines, boxlike bodies.`
    },
    {
      id: 'food-preservation',
      title: 'Food Preservation',
      priority: 'medium',
      keywords: ['preserve', 'store', 'dry', 'smoke', 'keep'],
      content: `PRESERVING FOOD WITHOUT REFRIGERATION:

DRYING (best for long-term):
- Cut meat/fish very thin
- Hang in sun and wind
- Build drying rack over low fire
- Completely dry = won't spoil
- Store in dry container

SMOKING:
- Build smoke rack over smoldering fire
- Use hardwood (hickory, oak, apple)
- Smoke 24-48 hours
- Combines with drying for best results

COLD STORAGE:
- Bury in snow
- Submerge in cold stream (contained)
- Keep in shade, elevated for airflow

FOOD SAFETY RULES:
- When in doubt, throw it out
- Bad smell, slimy texture = spoiled
- Cook meat thoroughly
- Keep raw and cooked separate
- Wash hands before handling food

Cooked food spoils faster than raw in hot weather.`
    }
  ]
};

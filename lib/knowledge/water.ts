import { KnowledgeTopic } from './types';

export const waterKnowledge: KnowledgeTopic = {
  id: 'water',
  name: 'Water Finding & Purification',
  description: 'Finding, collecting, and purifying water for survival',
  keywords: ['water', 'drink', 'thirst', 'dehydration', 'purify', 'filter', 'boil', 'stream', 'river', 'rain', 'dew', 'hydration'],
  entries: [
    {
      id: 'water-priority',
      title: 'Water Priority',
      priority: 'critical',
      keywords: ['water', 'dehydration', 'thirst', 'priority', 'survive'],
      content: `WATER IS YOUR TOP SURVIVAL PRIORITY
- You can survive 3 weeks without food, only 3 DAYS without water
- Dehydration impairs judgment and physical ability
- In hot conditions or with exertion, you may need 1+ gallon per day

Signs of dehydration:
- Dark yellow urine
- Headache, dizziness
- Dry mouth, no tears
- Fatigue, confusion

RULE: Always purify water unless absolutely certain it's safe`
    },
    {
      id: 'finding-water',
      title: 'Finding Water Sources',
      priority: 'critical',
      keywords: ['find', 'source', 'where', 'locate', 'water'],
      content: `WHERE TO FIND WATER:

Natural sources (best to worst):
1. Springs - usually cleanest
2. Streams/creeks - flowing water is better than still
3. Rivers - larger = more diluted contaminants
4. Lakes/ponds - still water, higher risk
5. Puddles - last resort, always purify

Look for:
- Green vegetation in dry areas
- Animal tracks converging (lead to water)
- Insects (especially bees) - usually within 3 miles of water
- Low ground, valleys, canyon bottoms
- Rock crevices after rain

Collect:
- Rainwater (safest natural source)
- Morning dew on grass (wipe with cloth, wring out)
- Snow/ice (melt first - eating frozen wastes body heat)`
    },
    {
      id: 'water-purification',
      title: 'Water Purification Methods',
      priority: 'critical',
      keywords: ['purify', 'clean', 'boil', 'filter', 'safe', 'treatment'],
      content: `MAKING WATER SAFE TO DRINK:

1. BOILING (most reliable)
   - Bring to rolling boil for 1 minute
   - At high altitude (>6,500ft): boil 3 minutes
   - Let cool before drinking

2. FILTERING (removes particles, not all pathogens)
   - Commercial filter if available
   - Improvised: layers of sand, gravel, charcoal, cloth
   - Filter BEFORE boiling for best results

3. CHEMICAL TREATMENT
   - Water purification tablets (follow instructions)
   - Household bleach: 2 drops per quart, wait 30 min
   - Iodine: 5 drops per quart, wait 30 min

4. SOLAR DISINFECTION (SODIS)
   - Fill clear plastic bottle with water
   - Lay in direct sun for 6+ hours (2 days if cloudy)
   - UV rays kill pathogens

Best practice: Filter + Boil when possible`
    },
    {
      id: 'water-avoid',
      title: 'Water to Avoid',
      priority: 'high',
      keywords: ['avoid', 'dangerous', 'contaminated', 'unsafe'],
      content: `WATER SOURCES TO AVOID OR BE CAUTIOUS WITH:

AVOID completely:
- Water with chemical smell or unusual color
- Water near industrial areas or mines
- Stagnant water with algae bloom (blue-green)
- Salt water (ocean) - makes dehydration worse

USE WITH EXTREME CAUTION (always purify):
- Water downstream from settlements
- Still/stagnant pools
- Water with dead animals nearby
- Flood water

DO NOT DRINK:
- Urine (myth - it's a diuretic, speeds dehydration)
- Blood (also a diuretic)
- Alcohol (dehydrates)
- Seawater (accelerates dehydration)`
    },
    {
      id: 'water-collection',
      title: 'Water Collection Methods',
      priority: 'medium',
      keywords: ['collect', 'gather', 'catch', 'rain', 'dew', 'solar still'],
      content: `WATER COLLECTION TECHNIQUES:

RAIN COLLECTION:
- Use any clean container
- Spread tarp/plastic to funnel into container
- Rainwater is generally safe to drink without treatment

DEW COLLECTION:
- Early morning, before sunrise
- Tie absorbent cloth around ankles, walk through grass
- Wring out into container
- Can collect 1+ liter per hour in good conditions

SOLAR STILL (emergency):
1. Dig hole 3ft wide, 2ft deep
2. Place container in center
3. Cover with plastic sheet
4. Weight center so it dips over container
5. Seal edges with soil
6. Moisture condenses on plastic, drips into container
7. Yields ~1 liter/day depending on conditions

TRANSPIRATION BAG:
1. Put plastic bag over leafy branch (green leaves)
2. Seal opening around branch
3. Sun draws moisture from leaves into bag
4. Works best on hot sunny days`
    },
    {
      id: 'conserving-water',
      title: 'Conserving Body Water',
      priority: 'high',
      keywords: ['conserve', 'save', 'ration', 'sweat', 'hot'],
      content: `CONSERVING YOUR BODY'S WATER:

Reduce water loss:
- Stay in shade during hottest hours (10am-4pm)
- Avoid exertion in heat - rest during day, move at night
- Keep clothes ON - protects from sun, slows evaporation
- Breathe through nose, not mouth
- Avoid talking excessively
- Don't eat if you don't have water (digestion uses water)

DO NOT:
- Ration water to the point of dehydration
- Wait until you're thirsty to drink
- Drink ice-cold water rapidly (can cause cramps)

RULE: Drink when you have water available. Ration sweat, not water.`
    }
  ]
};

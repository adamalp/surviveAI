import { KnowledgeTopic } from './types';

export const navigationKnowledge: KnowledgeTopic = {
  id: 'navigation',
  name: 'Navigation & Finding Direction',
  description: 'Finding direction without compass, navigation techniques',
  keywords: ['direction', 'navigate', 'compass', 'north', 'south', 'east', 'west', 'lost', 'sun', 'stars', 'map', 'trail', 'path', 'find way'],
  entries: [
    {
      id: 'lost-first-steps',
      title: 'First Steps When Lost',
      priority: 'critical',
      keywords: ['lost', 'help', 'panic', 'found', 'rescue'],
      content: `WHEN YOU REALIZE YOU'RE LOST - STOP

S.T.O.P. method:
- SIT down, take a breath
- THINK about your situation calmly
- OBSERVE your surroundings
- PLAN your next move

If you're expected somewhere:
- Usually STAY PUT - searchers will look for you
- Make yourself visible and audible (bright clothing, whistle, fire)
- Conserve energy

If you must move:
- Mark your location (cairn, torn cloth)
- Travel downhill - water flows to civilization
- Follow water downstream
- Leave trail markers for rescuers

Never travel at night unless emergency. Rest, prepare to signal.`
    },
    {
      id: 'sun-navigation',
      title: 'Finding Direction with Sun',
      priority: 'high',
      keywords: ['sun', 'direction', 'north', 'south', 'shadow', 'daytime'],
      content: `USING THE SUN FOR DIRECTION:

SHADOW-TIP METHOD (most accurate):
1. Place stick in ground (3ft tall)
2. Mark tip of shadow with rock
3. Wait 15-30 minutes
4. Mark new shadow tip
5. Draw line between marks
6. This line runs EAST-WEST
7. First mark = West, Second mark = East
8. Stand with first mark on left = facing North

WATCH METHOD:
1. Point hour hand at sun
2. Halfway between hour hand and 12 = South (Northern hemisphere)
3. Use 1 o'clock instead of 12 during daylight saving

GENERAL RULES (Northern Hemisphere):
- Sun rises in East
- Sun sets in West
- Midday sun is due South
- Shadows point North at midday`
    },
    {
      id: 'star-navigation',
      title: 'Finding Direction with Stars',
      priority: 'high',
      keywords: ['stars', 'night', 'north star', 'polaris', 'constellation'],
      content: `USING STARS FOR DIRECTION:

FINDING NORTH (Northern Hemisphere):
1. Find Big Dipper (7 stars shaped like ladle)
2. Find two "pointer stars" at end of ladle bowl
3. Draw line through them, extend 5x the distance
4. This points to North Star (Polaris)
5. North Star marks true North

Backup - use Cassiopeia:
- Shaped like W or M
- Opposite side of North Star from Big Dipper
- North Star is directly between them

SOUTHERN HEMISPHERE:
1. Find Southern Cross (4 bright stars in cross)
2. Extend long axis 4.5x its length
3. Drop line straight down to horizon = South

MOON TRICK:
- Crescent moon: draw line from horn tips to horizon
- In Northern hemisphere, this roughly marks South`
    },
    {
      id: 'natural-indicators',
      title: 'Natural Direction Indicators',
      priority: 'medium',
      keywords: ['nature', 'moss', 'trees', 'plants', 'natural'],
      content: `NATURAL DIRECTION CLUES (less reliable, use multiple):

MOSS:
- Often grows on NORTH side of trees (Northern hemisphere)
- Actually grows on shaded, moist side - not always reliable

SNOW/VEGETATION:
- Snow melts faster on south-facing slopes
- Vegetation often denser on south side
- North slopes are shadier, moister

TREES:
- Fuller growth on south side (more sun)
- Tree rings wider on south side
- Spider webs often on south side (warm)

ANT HILLS:
- Often built on south side of trees (warmth)

WIND:
- Learn prevailing wind direction in your region
- Bent/shaped trees show dominant wind direction

WARNING: These are general indicators only. Use multiple methods and cross-reference with sun/stars.`
    },
    {
      id: 'travel-techniques',
      title: 'Travel & Path-Finding',
      priority: 'medium',
      keywords: ['travel', 'walking', 'path', 'trail', 'route'],
      content: `TRAVELING IN WILDERNESS:

STAYING ON COURSE:
- Pick distant landmark in direction of travel
- Walk toward it, pick new landmark before reaching it
- Look back frequently - memorize return route
- Travel on ridgelines when possible (better visibility)

AVOIDING CIRCLES:
- People naturally walk in circles (dominant leg)
- Pick landmarks and walk toward them
- Check direction regularly (sun, stars)
- Use straight line of three trees as guide

FOLLOWING WATER:
- Streams lead to rivers, rivers to civilization
- BUT: may lead to impassable terrain
- Water sources attract animals and insects

TRAIL SIGNS:
- Blazes (paint marks on trees)
- Cairns (stacked rocks)
- Worn paths in vegetation
- Footprints on muddy ground

LEAVING MARKERS:
- Bend branches in direction of travel
- Stack rocks (cairns)
- Scratch arrows on trees/rocks
- Bright cloth tied to branches`
    },
    {
      id: 'terrain-navigation',
      title: 'Reading Terrain',
      priority: 'medium',
      keywords: ['terrain', 'hill', 'valley', 'mountain', 'river'],
      content: `UNDERSTANDING TERRAIN:

FINDING CIVILIZATION:
- Follow water downstream
- Head toward lower elevations
- Look for clearings (may indicate roads/settlements)
- Smoke = people
- Listen for: traffic, trains, aircraft, machinery

HIGH GROUND ADVANTAGES:
- Better cell signal
- Better visibility for signals
- Can spot landmarks, water, trails
- BUT: more exposed to weather

RIVER TRAVEL:
- Downstream = eventually reaches people
- CAUTION: waterfalls, rapids, impassable canyon
- Scout ahead from high ground when possible
- May need to leave river temporarily

READING DISTANCE:
- Underestimate distance in clear weather
- Overestimate in fog/rain
- Uphill takes 3x longer than flat ground
- Dense brush cuts speed by 50-75%`
    }
  ]
};

import { KnowledgeTopic } from './types';

export const signalingKnowledge: KnowledgeTopic = {
  id: 'signaling',
  name: 'Signaling & Rescue',
  description: 'Emergency signals, rescue techniques, attracting help',
  keywords: ['signal', 'rescue', 'help', 'sos', 'emergency', 'helicopter', 'plane', 'search', 'found', 'mirror', 'whistle', 'smoke', 'flare'],
  entries: [
    {
      id: 'signaling-priority',
      title: 'Signaling Priority',
      priority: 'critical',
      keywords: ['signal', 'priority', 'rescue', 'found'],
      content: `BEING FOUND IS OFTEN YOUR BEST OPTION

If people know you're missing:
- Search and rescue will be looking
- Stay where you are if safe
- Focus energy on signaling, not traveling
- You're harder to find if you're moving

RULE OF 3s FOR SIGNALS:
- 3 of anything = distress signal
- 3 fires, 3 whistle blasts, 3 mirror flashes
- Spacing: visible but obviously grouped

Make yourself VISIBLE and AUDIBLE
Keep signal materials ready at all times`
    },
    {
      id: 'ground-signals',
      title: 'Ground-to-Air Signals',
      priority: 'high',
      keywords: ['ground', 'air', 'signal', 'helicopter', 'plane', 'symbol'],
      content: `GROUND SIGNALS FOR AIRCRAFT:

Make signals AT LEAST 10ft tall for visibility from air.
Use contrast: dark materials on light ground, or vice versa.

INTERNATIONAL SYMBOLS:
V = Need assistance
X = Need medical help
I = Need supplies
→ = Traveling this direction
LL = All is well

BUILD SIGNALS WITH:
- Rocks, logs, branches (arranged)
- Trenches dug in snow/sand
- Colored fabric/gear spread out
- Trampled patterns in grass/snow

SIGNAL LOCATIONS:
- Open areas (clearings, beaches, ridges)
- Avoid under tree canopy
- Near your shelter but visible

Movement catches eye - wave arms, fabric when you hear aircraft.`
    },
    {
      id: 'signal-fire',
      title: 'Signal Fires',
      priority: 'high',
      keywords: ['fire', 'smoke', 'signal', 'beacon'],
      content: `SIGNAL FIRES:

SET UP 3 FIRES in triangle (100ft apart) - international distress signal.

FOR SMOKE (daytime):
- Build fire, then add green branches/leaves
- Rubber, plastic create dark smoke (use sparingly)
- Oil on fire creates black smoke
- Green vegetation creates white smoke
- Contrast with background (dark smoke vs clouds, white vs dark trees)

FOR FLAME (nighttime):
- Build on elevated position if possible
- Keep dry fuel ready to quickly grow fire
- Pitch, birch bark burn bright

SIGNAL FIRE KIT:
- Keep dry tinder and kindling ready
- Have fire materials prepared before you need them
- Practice quick ignition

One well-placed signal fire is better than multiple weak ones.`
    },
    {
      id: 'mirror-signal',
      title: 'Signal Mirror',
      priority: 'high',
      keywords: ['mirror', 'reflection', 'flash', 'shine'],
      content: `SIGNAL MIRROR (visible 10+ miles):

IMPROVISED MIRRORS:
- Any shiny surface: CD, phone screen, belt buckle
- Polished aluminum, tin can lid
- Rear view mirror, makeup compact

TECHNIQUE:
1. Hold mirror near face
2. Extend other arm, make V with fingers
3. Put target (aircraft) in V
4. Reflect sunlight through V toward target
5. Flash repeatedly (sets of 3)

WITHOUT AIMING HOLE:
1. Hold mirror to face, see reflection of sun
2. Extend arm toward target
3. Tilt mirror to flash sun reflection at target

TIMING:
- Aim at aircraft as soon as you hear it
- Continue flashing until it passes
- Aircraft may not acknowledge but often see you

Even hazy sun provides enough light. Practice beforehand.`
    },
    {
      id: 'sound-signals',
      title: 'Sound Signals',
      priority: 'medium',
      keywords: ['whistle', 'sound', 'shout', 'noise', 'yell'],
      content: `SOUND SIGNALS:

WHISTLE:
- 3 blasts = distress signal
- Carries further than voice (up to 1 mile)
- Saves energy vs shouting
- Every survival kit should have one

VOICE:
- Shout "HELP" in sets of 3
- Use megaphone effect (cupped hands)
- Yodel carries well in mountains
- Best during still air (morning/evening)

IMPROVISED NOISE:
- Bang rocks together
- Hit hollow log (carries far)
- Clap sticks together
- Car horn if available

PATTERN:
- Always use sets of 3
- Pause to listen for response
- Repeat every few minutes when rescue is near

NIGHT:
- Sound carries better in still night air
- Periodic signals help searchers home in`
    },
    {
      id: 'aircraft-response',
      title: 'Responding to Aircraft',
      priority: 'high',
      keywords: ['aircraft', 'helicopter', 'plane', 'respond', 'approach'],
      content: `WHEN AIRCRAFT APPROACHES:

IMMEDIATELY:
- Get to open area
- Wave brightly colored items
- Flash mirror toward aircraft
- Make yourself as visible as possible

BODY SIGNALS:
- Both arms up in Y = "Yes, need help"
- One arm up, one down = "No, all OK"
- Lying flat = "Need medical help"
- Wave single arm overhead = "Pick me up"

HELICOPTER LANDING:
- Clear area of loose debris (blows everywhere)
- Stay clear until rotors stop or pilot signals
- Approach from front where pilot can see you
- Never approach from rear (tail rotor kills)
- Stay low, hold loose items

ACKNOWLEDGE:
- If aircraft dips wings or circles, they've seen you
- Stay put, help is coming
- Keep signaling in case they need to relocate you`
    },
    {
      id: 'personal-locator',
      title: 'Electronic Signaling',
      priority: 'medium',
      keywords: ['phone', 'gps', 'beacon', 'plb', 'electronic'],
      content: `ELECTRONIC DISTRESS SIGNALS:

CELL PHONE:
- Get to high ground for signal
- Text uses less signal than voice
- Emergency calls may connect on any network
- Turn off when not using (save battery)
- Share location if possible before battery dies

PLB (Personal Locator Beacon):
- Sends GPS location to rescue services
- Works anywhere via satellite
- One button activation
- Register before trip

SATELLITE MESSENGER:
- Two-way messaging without cell service
- Garmin inReach, SPOT, etc.
- Requires subscription

IF NO SIGNAL:
- Move to high ground
- Clear line of sight to sky
- Try again at different times
- Airplane mode saves battery for emergency

Phone flashlight for nighttime visual signal.
Phone screen reflects for improvised mirror.`
    }
  ]
};

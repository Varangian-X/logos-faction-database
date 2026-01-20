// Comprehensive Handbook Content
export const HANDBOOK_ENTRIES = [
  // GETTING STARTED
  {
    entry_id: 'welcome',
    title: 'Welcome to Nova Roma',
    category: 'getting_started',
    order: 1,
    icon: 'BookOpen',
    summary: 'Introduction to the world and basic gameplay',
    keywords: ['introduction', 'welcome', 'basics', 'start'],
    content: `# Welcome to Nova Roma

Welcome, Operative, to the year 30,492 of the Imperial Calendar. You find yourself in **Nova Roma**, the heart of the Constantinople Megastructure - a sprawling vertical city that reaches from the depths of the Cisterns to the golden spires of Chrysopolis.

## Your Role
You are an independent operative navigating the complex web of Byzantine intrigue, faction politics, and galactic conspiracies. Your choices will shape not only your destiny but the fate of entire star systems.

## Core Concepts
- **Turn-Based Progression**: Time advances through turns, with each action having consequences
- **Faction Relations**: Six major factions vie for power - your relationships with them define opportunities
- **Multiple Playstyles**: Combat, diplomacy, espionage, investigation - choose your path
- **Mastery System**: Specialize and unlock powerful abilities in your preferred approach
- **Dynamic World**: Events unfold, factions clash, and your actions create cascading effects

## Getting Started
1. Explore your surroundings and familiarize yourself with available locations
2. Talk to NPCs to gather intel and understand faction dynamics
3. Take on quests to earn resources and build reputation
4. Develop your character's skills and augmentations
5. Make meaningful choices that shape the narrative

Your journey begins now. Glory to the Empire.`
  },

  {
    entry_id: 'basic_navigation',
    title: 'Navigation & Interface',
    category: 'getting_started',
    order: 2,
    icon: 'Map',
    summary: 'How to navigate the world and use the interface',
    keywords: ['navigation', 'interface', 'UI', 'movement', 'travel'],
    content: `# Navigation & Interface

## World Navigation
The game world is divided into distinct **Locations** across multiple tiers of the Constantinople Megastructure.

### Traveling Between Locations
1. Access the **Location Map** from the main game screen
2. Click on any discovered location to view details
3. Select "Travel Here" to move to that location
4. Travel may require resources or have time costs

### Location Tiers
- **Chrysopolis**: Upper city, home to elites and the Ecclesiarchy
- **Mese**: Middle districts, merchant quarters and diplomatic centers
- **The Cisterns**: Lower depths, home to outcasts and secrets

## Main Interface Elements
- **Resource Bar**: Displays Credits, Intel, Influence, and Reputation
- **Turn Counter**: Shows current turn and year
- **Action Panel**: Lists available actions for the current turn
- **Faction Panel**: Tracks relationships with major factions
- **Character Sheet**: Access your stats, skills, and augmentations

## Taking Actions
Each turn, you can select actions from the Action Panel:
- **Exploration**: Discover new locations and secrets
- **Missions**: Accept quests from factions
- **Diplomacy**: Engage with NPCs and factions
- **Combat**: Engage in tactical battles
- **Investigation**: Research and gather intelligence
- **Character Development**: Train skills or install augmentations`
  },

  {
    entry_id: 'resources',
    title: 'Resources & Economy',
    category: 'getting_started',
    order: 3,
    icon: 'Coins',
    summary: 'Understanding Credits, Intel, Influence, and Reputation',
    keywords: ['resources', 'credits', 'intel', 'influence', 'reputation', 'economy'],
    content: `# Resources & Economy

## Primary Resources

### Credits (₵)
**Imperial Currency** - Used for purchases, bribes, and services.
- Earned through missions, trade, and faction rewards
- Spent on augmentations, equipment, and information
- Can be invested in your personal housing for long-term benefits

### Intel (📊)
**Information Assets** - Represents secrets, data, and intelligence.
- Gained through investigation, espionage, and informants
- Used for intrigue operations and accessing restricted information
- Essential for diplomatic negotiations and covert actions

### Influence (👑)
**Political Capital** - Your sway over Imperial affairs.
- Earned through major achievements and faction leadership
- Opens exclusive opportunities and high-level missions
- Can be spent to manipulate world events

### Reputation (⭐)
**Overall Standing** - How the galaxy views you (0-100).
- Increases with successful missions and positive actions
- Unlocks new dialogue options and opportunities
- Affects how NPCs and factions respond to you

## Faction Standing
Each of the six major factions tracks your relationship separately (-100 to +100):
- **Hostile** (-100 to -50): Faction actively opposes you
- **Unfriendly** (-49 to -1): Limited opportunities, hostile NPCs
- **Neutral** (0 to 24): Standard access
- **Friendly** (25 to 49): Better prices, additional missions
- **Honored** (50 to 74): Exclusive missions, significant discounts
- **Revered** (75 to 100): Faction champion, maximum benefits

## Resource Management Tips
- Balance short-term spending with long-term investments
- Intel is precious - use it strategically
- Faction reputation is hard to change - choose sides carefully
- Influence is rare - save it for critical moments`
  },

  // COMBAT SYSTEM
  {
    entry_id: 'combat_basics',
    title: 'Combat Basics',
    category: 'combat',
    order: 1,
    icon: 'Swords',
    summary: 'Introduction to tactical turn-based combat',
    keywords: ['combat', 'fighting', 'battle', 'tactics', 'basics'],
    content: `# Combat Basics

Combat in Nova Roma is **turn-based and tactical**, rewarding strategic thinking over quick reflexes.

## Combat Flow
1. **Encounter Start**: Combat begins when you engage enemies or are ambushed
2. **Your Turn**: Spend Action Points to perform actions
3. **Enemy Turn**: Enemies take their actions
4. **Turn End**: Status effects process, Action Points reset
5. **Victory/Defeat**: Combat ends when one side is defeated or flees

## Action Points (AP)
You have **4 Action Points per turn** (can be modified by skills/effects).

### AP Costs
- **Basic Attack**: 2 AP
- **Tactical Shot**: 2 AP
- **Aggressive Strike**: 3 AP
- **Defensive Counter**: 2 AP
- **Abilities**: 3-5 AP
- **Take Cover**: 1 AP
- **Use Item**: 1 AP

## Combat Actions
- **Aggressive Strike**: High damage, lower accuracy (3 AP)
- **Tactical Shot**: Balanced damage and accuracy (2 AP)
- **Defensive Counter**: Lower damage, reduces incoming damage (2 AP)
- **Aimed Shot**: Guaranteed hit, moderate damage (4 AP)
- **Hack Systems**: Disable enemy augmentations (3 AP, requires Hacking skill)
- **Use Augmentation**: Special abilities from cybernetics (3 AP)

## Health and Damage
- Monitor both your health and enemy health bars
- Damage is influenced by skills, augmentations, and status effects
- Critical hits deal extra damage based on bonuses
- Some attacks ignore armor or have guaranteed hits

## Combat Strategy
- **Manage your AP wisely** - don't waste points on low-value actions
- **Use cover** when outnumbered or low on health
- **Apply status effects** to weaken enemies over time
- **Target weaknesses** - some enemies are vulnerable to specific damage types
- **Know when to flee** - retreating is sometimes the smart choice`
  },

  {
    entry_id: 'action_points',
    title: 'Action Point System',
    category: 'combat',
    subcategory: 'mechanics',
    order: 2,
    icon: 'Zap',
    summary: 'Deep dive into Action Points and turn economy',
    keywords: ['action points', 'AP', 'turn', 'economy', 'combat'],
    related_entries: ['combat_basics', 'status_effects'],
    content: `# Action Point System

Action Points (AP) govern what you can do each turn in combat.

## Base AP
- **Default**: 4 AP per turn
- **Haste Status**: +2 AP (temporary)
- **Slow Status**: -1 AP (temporary)
- **Combat Skill Level 7+**: +1 permanent AP

## Action Costs
Different actions cost different amounts of AP:

### Attacks (2-5 AP)
- Basic Attack: 2 AP
- Tactical Shot: 2 AP
- Defensive Counter: 2 AP
- Aggressive Strike: 3 AP
- Hack Systems: 3 AP
- Use Augmentation: 3 AP
- Aimed Shot: 4 AP
- Ultimate Ability: 5 AP

### Utility (1-2 AP)
- Take Cover: 1 AP
- Use Item: 1 AP
- Move Position: 1 AP
- Environmental Interaction: 2 AP

## AP Management Strategies

### Efficient Spending
- **Don't waste AP**: If you have 1 AP left, use Take Cover or an item
- **Plan ahead**: Consider what you'll need next turn
- **Combo actions**: Some abilities synergize (e.g., Take Cover → Counter)

### AP Manipulation
Ways to gain extra AP:
- **Haste effect**: Gives +2 AP for 2 turns
- **Energized status**: +1 bonus AP
- **Reflex augmentation**: Permanent +1 AP
- **High combat skill**: +1 AP at level 7+

Ways enemies can reduce your AP:
- **Slow effect**: -1 AP
- **Stunned**: Cannot act (0 effective AP)
- **Ambush encounters**: -2 AP first turn

## Turn Planning
Think of combat as a resource management puzzle:
1. Identify threats (which enemy is most dangerous?)
2. Calculate AP needed to address them
3. Consider defensive actions vs. offensive pressure
4. Save AP for critical moments (don't blow everything turn 1)

## Advanced Techniques
- **AP Banking**: Sometimes it's better to Take Cover and save strength
- **Burst Turns**: Save up status effects, then unleash everything
- **Tempo Control**: Force enemies to waste their turns responding to you`
  },

  {
    entry_id: 'status_effects',
    title: 'Status Effects',
    category: 'combat',
    subcategory: 'mechanics',
    order: 3,
    icon: 'Flame',
    summary: 'All buffs, debuffs, and damage-over-time effects',
    keywords: ['status', 'effects', 'buffs', 'debuffs', 'conditions'],
    related_entries: ['combat_basics', 'action_points'],
    content: `# Status Effects

Status effects can dramatically alter combat outcomes. Master them to gain the edge.

## Damage Over Time (DoT)

### 🔥 Burning
- **Effect**: 8 damage per turn for 3 turns
- **Applied by**: Fire abilities, explosive barrels
- **Counter**: Use medical items or wait it out

### 💉 Bleeding
- **Effect**: 5 damage per turn for 4 turns
- **Applied by**: Cutting weapons, certain abilities
- **Counter**: Medical items, healing abilities

### ☠️ Poisoned
- **Effect**: 6 damage per turn for 5 turns, healing reduced by 50%
- **Applied by**: Toxic vents, poison weapons
- **Counter**: Antidotes, medical station

## Control Effects

### ⚡ Stunned
- **Effect**: Cannot take actions for 1 turn
- **Applied by**: Electrical attacks, certain abilities
- **Counter**: High resistance, avoid electrical hazards
- **Most dangerous status** - leaves you completely vulnerable

## Debuffs (Negative Effects)

### 🚫 Disarmed
- **Effect**: Damage reduced by 50% for 2 turns
- **Applied by**: Disabling attacks
- **Counter**: Switch to abilities or defensive play

### ⬇️ Weakened
- **Effect**: -30% damage dealt, -20 defense for 3 turns
- **Applied by**: Hack Systems ability, certain enemies
- **Counter**: Wait it out or use cleansing items

### 👁️ Blinded
- **Effect**: -40% accuracy for 2 turns
- **Applied by**: Flash grenades, certain abilities
- **Counter**: Use abilities with guaranteed hits

### 🐌 Slowed
- **Effect**: -1 AP, -15% evasion for 3 turns
- **Applied by**: Slow fields, certain abilities
- **Counter**: Movement abilities, cleanse effects

## Buffs (Positive Effects)

### 🛡️ Fortified
- **Effect**: +30 defense, -20% incoming damage for 3 turns
- **Applied by**: Take Cover, defensive abilities
- **Strategy**: Stack with high defense builds

### ⚡ Haste
- **Effect**: +2 AP, +20% evasion for 2 turns
- **Applied by**: Speed augmentations, ally abilities
- **Strategy**: Extremely powerful - use for burst damage

### 💪 Empowered
- **Effect**: +40% damage, +15% crit chance for 3 turns
- **Applied by**: Offensive abilities, augmentations
- **Strategy**: Combine with high-damage attacks

### 💚 Regenerating
- **Effect**: Heal 10 HP per turn for 4 turns
- **Applied by**: Medical items, healing abilities
- **Strategy**: Use early in combat for sustained benefit

### 🛡️ Shielded
- **Effect**: Absorbs 30 damage for 2 turns
- **Applied by**: Shield abilities, protective gear
- **Strategy**: Can block DoT effects

## Special Effects

### 🎯 Marked
- **Effect**: +25% incoming damage, cannot evade for 3 turns
- **Applied by**: Targeting abilities
- **Counter**: Kill the marker or hide

### 👻 Invisible
- **Effect**: Cannot be targeted, +50% crit chance for 2 turns
- **Applied by**: Stealth abilities, smoke
- **Strategy**: Use for guaranteed high-damage attacks

### ⚠️ Overloaded
- **Effect**: +50% damage but take 5 damage per turn for 3 turns
- **Applied by**: High-risk augmentations
- **Strategy**: High risk, high reward - finish fights quickly

## Status Effect Strategies
- **Stack DoTs**: Apply multiple bleeding/burning effects
- **Time your buffs**: Don't use Empowered if you're out of AP
- **Cleanse debuffs**: Keep items that remove negative effects
- **Exploit enemy status**: Attack Marked or Weakened enemies
- **Duration awareness**: Effects expire - plan around this`
  },

  {
    entry_id: 'encounter_types',
    title: 'Encounter Types',
    category: 'combat',
    subcategory: 'advanced',
    order: 4,
    icon: 'Target',
    summary: 'Different combat scenarios and their unique mechanics',
    keywords: ['encounters', 'ambush', 'boss', 'siege', 'duel'],
    related_entries: ['combat_basics'],
    content: `# Encounter Types

Not all combat is created equal. Different encounter types have unique mechanics and challenges.

## Standard Encounter
- Single enemy, normal conditions
- Base difficulty
- Standard rewards

## 🎯 Ambush
**Enemy gets the drop on you**
- Enemy attacks first (free turn)
- You start with -2 AP first turn
- Limited cover available
- **Strategy**: Survive first turn, then turn the tables

## 👑 Boss Fight
**Powerful unique enemies with multiple phases**
- 2.5x health, 1.5x damage
- Phase transitions at 66% and 33% HP
- New abilities unlock each phase
- Environmental hazards active
- **Strategy**: Manage resources across phases, adapt to new abilities

## ⚔️ Elite Encounter
**Highly skilled single opponent**
- Elite-only abilities
- +1 enemy AP per turn
- Improved AI (adapts to your tactics)
- Better loot rewards
- **Strategy**: Expect intelligent counterplay, avoid patterns

## 🌊 Horde
**Wave after wave of enemies**
- 3 waves, 2 enemies per wave
- Waves arrive every 2 turns
- Difficulty escalates each wave
- **Strategy**: Don't burn all resources early, pace yourself

## 🏰 Defensive Siege
**Protect an objective**
- Objective has 100 HP
- Enemies spawn on a timer
- Must survive 15 turns
- Cannot flee
- **Strategy**: Position strategically, prioritize threats to objective

## 🗡️ Assassination
**Eliminate target before they escape**
- Primary target + 2 bodyguards
- Target flees at turn 10
- Stealth approach possible
- **Strategy**: Focus target first or eliminate guards for easier fight

## ⚔️ Honor Duel
**One-on-one combat**
- No companions allowed
- Cannot use items (abilities okay)
- +25 reputation on victory
- Special rewards
- **Strategy**: Pure skill test - your build vs. theirs

## 🛡️ Survival
**Survive for a set number of turns**
- Enemies spawn continuously (every 2 turns)
- Must survive 12 turns
- Cannot flee
- Difficulty escalates over time
- **Strategy**: Efficiency is key - conserve resources

## 🚶 Escort Mission
**Protect NPC to extraction point**
- NPC has 50 HP
- NPC cannot fight
- Must reach extraction (distance: 10)
- Ambush points at turns 3 and 7
- **Strategy**: Keep NPC protected, manage positioning

## Encounter Rewards
Rewards scale with encounter difficulty:
- **Boss**: 2.5x rewards, special loot
- **Elite**: 1.8x rewards
- **Horde/Survival**: 1.5-2x rewards
- **Duel**: +25 reputation, special rewards

Performance bonuses:
- **Fast victory** (≤5 turns): +30% rewards
- **Low damage taken** (<30): +20% rewards
- **Perfect victory** (no damage): +50% rewards`
  },

  {
    entry_id: 'environmental_combat',
    title: 'Environmental Interactions',
    category: 'combat',
    subcategory: 'advanced',
    order: 5,
    icon: 'Map',
    summary: 'Using the environment to your advantage',
    keywords: ['environment', 'cover', 'hazards', 'barrels', 'turrets'],
    related_entries: ['combat_basics'],
    content: `# Environmental Interactions

The battlefield is more than just you and your enemies. Use the environment to gain tactical advantages.

## Interactive Objects

### 💥 Explosive Barrel
- **Health**: 10 HP
- **Effect**: 20-35 area damage, applies Burning status
- **Radius**: 2 tiles
- **Cost**: 2 AP to destroy
- **Strategy**: Position enemies near barrels, then detonate

### 🧱 Cover Wall
- **Provides**: +30 defense when behind it
- **Health**: 40 HP (destructible)
- **Cost**: 1 AP to use
- **Strategy**: Use when outnumbered or low HP

### ⚡ Electrical Panel
- **Hackable**: Requires Hacking skill
- **Health**: 15 HP
- **Hack Effect**: 15-25 area damage, applies Stunned
- **Cost**: 2 AP to hack, 2 AP to destroy
- **Strategy**: Hack to stun multiple enemies

### ☣️ Toxic Vent
- **Toggleable**: Can be turned on/off
- **Effect**: Applies Poisoned status to anyone in area
- **Damage**: 5 per turn
- **Cost**: 2 AP to toggle
- **Strategy**: Activate when enemies are in range, deactivate when you need to move through

### 🏥 Medical Station
- **Single Use**: Only works once
- **Healing**: 30-50 HP
- **Removes**: Bleeding, Poisoned status
- **Cost**: 1 AP to use
- **Strategy**: Save for emergencies

### 🔫 Automated Turret
- **Hackable**: Can be taken control of
- **Health**: 25 HP
- **Damage**: 10-15 per turn
- **Cost**: 3 AP to hack
- **Strategy**: Hack early, let it provide supporting fire

## Terrain Types

### Open Ground
- No bonuses or penalties
- Standard movement cost
- Most common terrain

### Dense Cover
- +35 defense bonus
- Blocks line of sight for some attacks
- Standard movement cost

### Elevated Position
- +15 accuracy, +10% damage
- Good defensive position
- Costs 2 AP to reach

### Hazardous Terrain
- 5 damage per turn standing on it
- Applies Slowed status
- Costs 2 AP to move through
- **Avoid unless necessary**

### Smoke Cloud
- -30% accuracy for attacks through it
- +25% evasion
- Blocks line of sight
- Temporary (3 turns)
- Created by smoke grenades

### Electrified Floor
- 8 damage per turn
- 30% chance to Stun
- **Very dangerous** - avoid or deactivate

## Environmental Strategies

### Offensive Use
1. **Explosive Chaining**: Destroy one barrel near others for chain reaction
2. **Hack and Control**: Take over turrets for free damage
3. **Hazard Activation**: Turn on vents when enemies are near

### Defensive Use
1. **Cover Hopping**: Move between cover positions
2. **Healing Points**: Know where medical stations are
3. **Chokepoints**: Force enemies through hazardous terrain

### Map Awareness
- **Scout first**: Identify interactive objects before engaging
- **Positioning**: Control high ground and cover
- **Escape routes**: Know where you can retreat if needed

## Location-Specific Environments

### The Deep Cisterns
- High cover availability
- Toxic vents common
- Low visibility
- Hazardous terrain frequent

### Fortress Praetoria
- Turrets and automated defenses
- Medical stations available
- Open ground (ranged favored)
- Elevated positions

### Varangian Enclave
- Explosive barrels
- Medium cover
- Favors melee combat
- Straightforward terrain`
  },

  // DIPLOMACY
  {
    entry_id: 'diplomacy_basics',
    title: 'Diplomacy & Negotiation',
    category: 'diplomacy',
    order: 1,
    icon: 'Handshake',
    summary: 'The art of negotiation and political maneuvering',
    keywords: ['diplomacy', 'negotiation', 'persuasion', 'factions'],
    content: `# Diplomacy & Negotiation

In Nova Roma, words can be as powerful as weapons. Master diplomacy to shape the political landscape.

## Faction Relations
Your standing with each faction is tracked separately:
- **Range**: -100 (Hostile) to +100 (Revered)
- **Every action has consequences** - factions remember
- **Alliances matter** - helping one faction may anger their rivals

## Diplomatic Negotiations
Multi-turn negotiations with specific goals:

### Negotiation Types
1. **Trade Agreement**: Economic benefits, requires 25+ reputation
2. **Alliance**: Military cooperation, requires 50+ reputation
3. **Non-Aggression Pact**: Peace treaty, requires 40+ reputation
4. **Vassalization**: Ultimate control, requires 75+ reputation

### Negotiation Mechanics
- **Duration**: 3-5 turns depending on type
- **Stages**: Progress through multiple stages
- **Goodwill**: Track negotiation success (+/- 100)
- **Actions**: Choose tactics each turn

### Negotiation Actions
- **Offer Compromise**: +10 goodwill, safe option
- **Issue Threat**: High risk, high reward
- **Sweeten Deal**: Costs credits/intel, +15 goodwill
- **Appeal to Honor**: Uses reputation, variable success
- **Present Evidence**: Costs intel, strong effect

### Success Factors
- Your negotiation skill level
- Current faction standing
- Resources available (credits, intel)
- Accumulated goodwill
- Random chance

## NPC Dialogue
Conversations with individual NPCs:

### Relationship System
Each NPC tracks their opinion of you:
- **-100 to -50**: Hostile
- **-49 to 0**: Unfriendly
- **1 to 24**: Neutral
- **25 to 49**: Friendly
- **50 to 100**: Allied

### Dialogue Choices
- **Direct**: Straightforward, predictable
- **Charming**: Use charisma, can backfire
- **Intimidating**: Force compliance, damages relationship
- **Deceptive**: Lie, requires high skill
- **Insightful**: Use information you've gathered

### Unlocking Dialogue
Special options unlock based on:
- Your skills (Negotiation, Investigation)
- Your reputation
- Your faction standing
- Your mastery levels
- Previous conversations
- World events

## Diplomatic Strategy Tips
1. **Build relationships slowly** - rushing damages trust
2. **Information is power** - gather intel before negotiations
3. **Choose sides carefully** - you can't please everyone
4. **Track grudges** - factions remember betrayals
5. **Use intermediaries** - some NPCs can help smooth relations`
  },

  {
    entry_id: 'intrigue_operations',
    title: 'Intrigue & Covert Operations',
    category: 'diplomacy',
    subcategory: 'advanced',
    order: 2,
    icon: 'Eye',
    summary: 'Espionage, sabotage, and covert actions',
    keywords: ['intrigue', 'espionage', 'sabotage', 'covert', 'spy'],
    related_entries: ['diplomacy_basics'],
    content: `# Intrigue & Covert Operations

Sometimes the direct approach isn't the answer. Intrigue operations let you work from the shadows.

## Intrigue Actions
Covert operations against factions:

### Sabotage Operations
**Weaken Infrastructure**
- **Cost**: 50 intel
- **Success**: Based on Espionage skill
- **Effect**: -10 faction power, -20 faction resources
- **Detection**: 30% base chance
- **Duration**: 3 turns

**Steal Resources**
- **Cost**: 40 intel
- **Effect**: Gain 200 credits, -15 faction resources
- **Detection**: 40% chance
- **Duration**: 2 turns

### Espionage Operations
**Plant Informant**
- **Cost**: 60 intel
- **Effect**: +3 intel per turn for 5 turns
- **Detection**: 25% chance
- **Duration**: 5 turns

**Intercept Communications**
- **Cost**: 70 intel
- **Effect**: Reveal faction plans, +50 intel
- **Detection**: 35% chance
- **Duration**: 3 turns

### Manipulation
**Spread Disinformation**
- **Cost**: 50 intel
- **Effect**: -15 faction reputation with another faction
- **Detection**: 45% chance
- **Duration**: 2 turns

**Incite Unrest**
- **Cost**: 80 intel
- **Effect**: -20 faction morale, civil unrest
- **Detection**: 50% chance
- **Duration**: 4 turns

## Detection & Consequences
If your intrigue operation is detected:
- **Reputation loss**: -30 to -50 with target faction
- **Counter-operation**: Faction may retaliate
- **Intel loss**: 30 intel penalty
- **Relationship damage**: May trigger faction hostility

### Reducing Detection Risk
- **High Espionage skill**: -10% detection per level above 3
- **Stealth augmentations**: -15% detection
- **Insider contacts**: -20% detection
- **Timing**: Operations during world events are safer

## Counter-Intrigue
Factions can conduct operations against you:
- **Theft**: Lose credits or intel
- **Sabotage**: Temporary stat penalties
- **Assassination attempts**: Combat encounter
- **Frame jobs**: Reputation damage with other factions

### Defense
- High Investigation skill reveals incoming operations
- Loyal companions can help detect threats
- Strong faction alliances deter attacks
- Counter-intelligence spending (intel cost)

## Intrigue Strategy
1. **Build espionage mastery** - reduces detection risk
2. **Target weak factions** - easier operations
3. **Time operations carefully** - use world events as cover
4. **Maintain plausible deniability** - diversify targets
5. **Prepare for consequences** - keep resources for damage control

## Advanced Techniques
- **Proxy Wars**: Turn factions against each other
- **Information Arbitrage**: Sell intel to multiple factions
- **False Flag Operations**: Make it look like another faction
- **Deep Cover**: Long-term infiltration (requires high skill)`
  },

  // CHARACTER & PROGRESSION
  {
    entry_id: 'skills_system',
    title: 'Skills & Progression',
    category: 'character',
    order: 1,
    icon: 'TrendingUp',
    summary: 'How to develop and master skills',
    keywords: ['skills', 'progression', 'leveling', 'XP'],
    content: `# Skills & Progression

Your character develops through use and practice. Every action builds expertise.

## Core Skills

### Combat
- **Primary**: Damage, accuracy in combat
- **Level up by**: Fighting, using combat abilities
- **Max level**: 10
- **Key bonuses**: +5% damage per level, +1 AP at level 7

### Negotiation
- **Primary**: Persuasion, diplomatic success
- **Level up by**: Dialogue choices, negotiations
- **Max level**: 10
- **Key bonuses**: +10% persuasion per level, auto-unlock options at high levels

### Espionage
- **Primary**: Stealth, intrigue success
- **Level up by**: Covert operations, stealth missions
- **Max level**: 10
- **Key bonuses**: -10% detection per level, guaranteed escape at level 9

### Investigation
- **Primary**: Uncovering secrets, research
- **Level up by**: Investigating, discovering lore
- **Max level**: 10
- **Key bonuses**: +15% lore discovery per level, reveal patterns at level 8

### Hacking
- **Primary**: Technology manipulation
- **Level up by**: Hacking systems, tech missions
- **Max level**: 10
- **Key bonuses**: +3% hack success per level, unlock advanced systems at level 6

### Engineering
- **Primary**: Crafting, repairs
- **Level up by**: Crafting items, using tech
- **Max level**: 10
- **Key bonuses**: -10% crafting cost per level, unlock recipes

## Skill Progression
- **XP gain**: Every action using a skill grants XP
- **Level requirements**: Exponential (100, 250, 500, 1000, etc.)
- **Skill points**: Earned at certain story milestones
- **Specialization**: Focus on 2-3 skills for best results

## Skill Unlocks
Each skill has special abilities unlocked at certain levels:

### Example: Combat Skill
- **Level 3**: Aggressive Strike ability
- **Level 5**: Defensive Counter improvements
- **Level 7**: +1 Action Point per turn
- **Level 9**: Devastating Blow ability

## Mastery System
Beyond skills, you develop **Mastery** in playstyles:
- **Combat Mastery**: Warfare and tactics
- **Negotiation Mastery**: Diplomacy and persuasion
- **Espionage Mastery**: Stealth and covert ops
- **Investigation Mastery**: Knowledge and research
- **Leadership Mastery**: Commanding others

### Mastery Levels
Each mastery has 4 levels with escalating requirements:
1. **Level 1**: Practitioner
2. **Level 2**: Expert (500 mastery XP)
3. **Level 3**: Master (1500 mastery XP)
4. **Level 4**: Legend (3500 mastery XP)

### Mastery Benefits
- **Passive bonuses**: Permanent stat increases
- **Unique abilities**: Special moves exclusive to masters
- **Dialogue unlocks**: New conversation options
- **Quest access**: Master-level questlines
- **Faction benefits**: Special recognition

## Character Development Tips
1. **Specialize**: Master 2-3 skills rather than spreading thin
2. **Synergize**: Combine compatible skills (Combat + Hacking, Negotiation + Investigation)
3. **Use what you learn**: Skills only improve through use
4. **Balance growth**: Don't ignore secondary skills entirely
5. **Plan ahead**: Consider your desired playstyle`
  },

  {
    entry_id: 'augmentations',
    title: 'Augmentations & Cybernetics',
    category: 'character',
    order: 2,
    icon: 'Cpu',
    summary: 'Cybernetic enhancements and their effects',
    keywords: ['augmentations', 'cybernetics', 'implants', 'upgrades'],
    related_entries: ['skills_system'],
    content: `# Augmentations & Cybernetics

Enhance your body with Imperial technology. Augmentations provide permanent bonuses and new abilities.

## Augmentation Types

### Combat Augmentations
**Subdermal Armor**
- **Effect**: +15 defense, -20% physical damage taken
- **Cost**: 500 credits
- **Type**: Defensive

**Neural Reflex Booster**
- **Effect**: +1 Action Point, +10% evasion
- **Cost**: 800 credits
- **Type**: Utility

**Weapon Implants**
- **Effect**: +20% damage, built-in weapon
- **Cost**: 600 credits
- **Type**: Offensive

### Social Augmentations
**Enhanced Pheromones**
- **Effect**: +25% persuasion success
- **Cost**: 400 credits
- **Type**: Social

**Lie Detector Implant**
- **Effect**: Reveal NPC deception, +10% investigation
- **Cost**: 500 credits
- **Type**: Utility

**Voice Modulator**
- **Effect**: Mimic voices, +15% intimidation
- **Cost**: 450 credits
- **Type**: Social

### Cognitive Augmentations
**Neural Processor**
- **Effect**: +50% hacking success, +20% investigation
- **Cost**: 700 credits
- **Type**: Utility

**Perfect Memory**
- **Effect**: Never forget information, auto-unlock lore
- **Cost**: 600 credits
- **Type**: Cognitive

**Tactical Analyzer**
- **Effect**: See enemy stats in combat, +15% accuracy
- **Cost**: 550 credits
- **Type**: Combat/Utility

### Utility Augmentations
**Oxygen Recycler**
- **Effect**: Breathe in any environment
- **Cost**: 300 credits
- **Type**: Survival

**Stealth Skin**
- **Effect**: +30% stealth, -20% detection in intrigue
- **Cost**: 650 credits
- **Type**: Espionage

**Metabolic Booster**
- **Effect**: +15% healing received, toxin resistance
- **Cost**: 400 credits
- **Type**: Survival

## Augmentation Mechanics
- **Installation**: Visit augmentation clinics in major cities
- **Cost**: Ranges from 300 to 1000 credits
- **Limits**: No mechanical limit, but high cost balances
- **Removal**: Can be removed for 50% refund
- **Stacking**: Effects stack additively

## Rare Augmentations
Special augmentations available through specific quests or faction rewards:

**Ecclesiarchy**: Divine Interface (faith-based abilities)
**Praetorians**: Tactical Command Node (leadership bonuses)
**Agentes in Rebus**: Shadow Cloak (invisibility ability)
**Scrinium Barbarorum**: Xeno-Tech Adapter (alien tech compatibility)

## Choosing Augmentations
Match augmentations to your playstyle:
- **Combat Build**: Subdermal Armor + Neural Reflex + Weapon Implants
- **Diplomat Build**: Pheromones + Lie Detector + Voice Modulator
- **Stealth Build**: Stealth Skin + Neural Processor + Oxygen Recycler
- **Hybrid Build**: Mix and match based on needs

## Augmentation Strategy
1. **Prioritize synergies**: Choose augments that work together
2. **Consider costs**: Save credits for key augmentations
3. **Early game**: Focus on general utility augments
4. **Late game**: Specialize with powerful faction-specific augments
5. **Don't over-augment**: Balance augments with skill development`
  },

  // WORLD STATE
  {
    entry_id: 'world_events',
    title: 'World Events & Dynamics',
    category: 'world_state',
    order: 1,
    icon: 'Globe',
    summary: 'How the world changes and reacts to your actions',
    keywords: ['world', 'events', 'dynamics', 'consequences'],
    content: `# World Events & Dynamics

The galaxy doesn't wait for you. Events unfold, factions clash, and your actions create ripples across star systems.

## World Event System
Events trigger based on:
- **Turn count**: Certain events happen at specific times
- **Faction power**: When factions grow too strong or weak
- **Player actions**: Your choices can trigger events
- **Random chance**: Some events are unpredictable
- **World state**: Combinations of conditions

## Event Types

### Faction Events
**Faction War**: Two factions go to war
- **Effect**: Territory changes, mission opportunities
- **Duration**: 10-15 turns
- **Your role**: Choose a side or stay neutral

**Political Coup**: Leadership change in a faction
- **Effect**: Faction personality shifts
- **Your role**: Support or oppose the coup

**Economic Boom/Crash**: Resource fluctuations
- **Effect**: Price changes, quest rewards modified
- **Duration**: 5-10 turns

### Galactic Events
**Alien Incursion**: External threat
- **Effect**: All factions unite temporarily
- **Opportunity**: Gain favor with multiple factions

**Technology Breakthrough**: New tech discovered
- **Effect**: New augmentations/equipment available
- **Opportunity**: Access before others

**Imperial Decree**: Orders from the Emperor
- **Effect**: New laws, restrictions, or opportunities
- **Duration**: Permanent or turn-limited

## Cascading Effects
Your actions trigger chains of consequences:

### Example Chain
1. You sabotage Merchant Houses
2. → Merchant Houses lose resources (-15%)
3. → Trade prices increase (+20%)
4. → Praetorians sense weakness
5. → Praetorians attack Merchant Houses (faction war event)
6. → Other factions must choose sides
7. → Territory changes hands
8. → New questlines unlock

## Consequence Tracking
The game tracks your significant actions:
- **Faction help/harm**: Major actions recorded
- **Betrayals**: Factions never forget
- **Alliances**: Your coalitions matter
- **World changes**: Your impact on events

### Pending Consequences
Some consequences are delayed:
- **Short-term** (3-5 turns): Minor ripples
- **Medium-term** (10-15 turns): Significant changes
- **Long-term** (20+ turns): World-altering events

## Managing World State
Tips for navigating the dynamic world:
1. **Stay informed**: Read world event notifications
2. **Anticipate consequences**: Think ahead before major actions
3. **Build alliances**: Friends help during crises
4. **Diversify relationships**: Don't rely on one faction
5. **Adapt quickly**: Events can change everything

## World State Indicators
Track the health of the world:
- **Faction Power Levels**: Who's winning?
- **Territory Control**: Who owns what?
- **Economic Status**: Boom or bust?
- **Stability**: How chaotic is the galaxy?
- **Your Influence**: How much do you matter?`
  },

  // GLOSSARY
  {
    entry_id: 'glossary_terms',
    title: 'Game Terms Glossary',
    category: 'glossary',
    order: 1,
    icon: 'BookText',
    summary: 'Definitions of key game terms',
    keywords: ['glossary', 'terms', 'definitions'],
    content: `# Game Terms Glossary

## A

**Action Points (AP)**: Resource spent to perform actions in combat. Default 4 per turn.

**Adaptive AI**: Enemy behavior system that learns from and counters player tactics.

**Augmentation**: Cybernetic enhancement providing permanent bonuses or abilities.

## B

**Boss Fight**: Special encounter with a powerful unique enemy that has multiple phases.

**Branching Paths**: Quest or dialogue options that lead to different outcomes.

## C

**Cascading Effects**: Chain reactions where one event triggers multiple consequences.

**Combat Encounter**: Turn-based tactical battle against enemies.

**Credits (₵)**: Primary currency used for purchases and services.

**Crit/Critical Hit**: Attack that deals bonus damage based on crit chance.

## D

**DoT (Damage over Time)**: Status effect that deals damage each turn (Burning, Bleeding, Poisoned).

**Debuff**: Negative status effect that weakens a character.

## E

**Elite Encounter**: Combat against a highly skilled enemy with improved AI.

**Environmental Interaction**: Using objects in combat (barrels, turrets, cover).

**Espionage**: Covert operations and stealth-based actions.

## F

**Faction Standing**: Your relationship with a major faction (-100 to +100).

**Fortified**: Buff status that increases defense and reduces damage taken.

## G

**Goodwill**: Measure of success in diplomatic negotiations.

## H

**Haste**: Buff status providing +2 Action Points and increased evasion.

**Horde Encounter**: Combat against waves of enemies.

## I

**Intel**: Resource representing information and secrets.

**Influence**: Political capital used for high-level actions.

**Intrigue Operation**: Covert action against a faction (sabotage, espionage, manipulation).

## L

**Loyalty**: Companion's dedication to you (0-100).

## M

**Marked**: Debuff causing increased damage taken and preventing evasion.

**Mastery**: Advanced progression system for playstyles (Combat, Negotiation, etc.).

## N

**NPC (Non-Player Character)**: Characters you interact with in the world.

## P

**Phase Transition**: When a boss enters a new phase with new abilities.

## R

**Reputation**: Overall standing in the galaxy (0-100).

**Revered**: Highest faction standing tier (75-100).

## S

**Status Effect**: Temporary condition affecting combat (buffs, debuffs, DoT).

**Stunned**: Control effect preventing all actions for one turn.

## T

**Turn**: Unit of time progression; each action advances the game state.

**Tier**: Social level in the Constantinople Megastructure (Chrysopolis, Mese, Cisterns).

## W

**World Event**: Dynamic occurrence affecting the game world (wars, economic changes, etc.).

**World State**: Current condition of factions, economy, and political landscape.

## X

**XP (Experience Points)**: Progress toward leveling up skills.`
  },

  {
    entry_id: 'glossary_factions',
    title: 'Faction Glossary',
    category: 'glossary',
    order: 2,
    icon: 'Users',
    summary: 'Guide to the six major factions',
    keywords: ['factions', 'ecclesiarchy', 'praetorians', 'varangians', 'merchants', 'agents'],
    content: `# Faction Glossary

## The Six Major Factions

### ⛪ Ecclesiarchy
**The Church of the Logos**

- **Philosophy**: Religious authority, divine mandate
- **Strengths**: Faith-based influence, zealot troops
- **Weaknesses**: Dogmatic, slow to adapt
- **Territory**: Cathedral districts, holy sites
- **Tactics**: Mass fanaticism, divine sacrifice, buff abilities
- **Relations**: Rivals with Agentes in Rebus (secular vs. sacred)
- **Opportunities**: Divine missions, sacred artifacts, moral authority

### 🛡️ Neo-Praetorian Guard
**Elite Military Force**

- **Philosophy**: Military discipline, order through strength
- **Strengths**: Superior training, heavy armor, formations
- **Weaknesses**: Rigid hierarchy, expensive
- **Territory**: Fortress Praetoria, military installations
- **Tactics**: Shield walls, coordinated assaults, defensive formations
- **Relations**: Rivals with Varangians (order vs. chaos)
- **Opportunities**: Elite training, military contracts, tactical support

### ⚔️ Varangian Guard
**Honor-Bound Warriors**

- **Philosophy**: Personal honor, warrior culture, glory in battle
- **Strengths**: Ferocious combat, high morale, melee excellence
- **Weaknesses**: Impulsive, poor coordination, barbaric reputation
- **Territory**: Varangian Enclave, warrior halls
- **Tactics**: Berserker charges, honor duels, escalating rage
- **Relations**: Rivals with Praetorians (honor vs. discipline)
- **Opportunities**: Honor duels, saga fame, warrior bonds

### 💰 Merchant Houses
**Economic Powerhouses**

- **Philosophy**: Profit above all, market control
- **Strengths**: Wealth, information networks, mercenaries
- **Weaknesses**: Defensive, flee when losing, purely transactional
- **Territory**: Trade districts, markets, corporate towers
- **Tactics**: Hired reinforcements, defensive formations, economic warfare
- **Relations**: Generally neutral, prioritize profit
- **Opportunities**: Trade deals, exclusive goods, economic manipulation

### 🕵️ Agentes in Rebus
**Imperial Intelligence**

- **Philosophy**: Information is power, shadows over light
- **Strengths**: Intelligence networks, stealth, assassination
- **Weaknesses**: Distrust, small numbers, paranoid
- **Territory**: Hidden safehouses, surveillance stations
- **Tactics**: Ambush, stealth, retreat and regroup, assassination protocols
- **Relations**: Rivals with everyone (trust no one)
- **Opportunities**: Black ops, deep intel, covert assets

### 🔬 Scrinium Barbarorum
**Xenologists and Researchers**

- **Philosophy**: Knowledge through study, embrace the alien
- **Strengths**: Xeno-technology, forbidden knowledge, research breakthroughs
- **Weaknesses**: Weak combat, isolated, heretical reputation
- **Territory**: Research stations, xenological archives
- **Tactics**: Xeno-tech weapons, experimental tactics, unpredictable
- **Relations**: Tolerated but mistrusted by all
- **Opportunities**: Alien artifacts, forbidden knowledge, expeditions

## Faction Dynamics

### Natural Alliances
- Ecclesiarchy + Praetorians (Order and Faith)
- Merchant Houses + Agentes (Business and Information)
- Scrinium + No one (Too strange)

### Natural Rivalries
- Ecclesiarchy vs. Agentes (Sacred vs. Secular)
- Praetorians vs. Varangians (Discipline vs. Honor)
- Everyone vs. Scrinium (Xenophobia)

### Power Balance
The six factions maintain a delicate balance:
- No single faction can dominate alone
- Alliances shift based on circumstances
- Your actions tip the scales
- Wars reshape the landscape

## Choosing Your Factions
**Consider**:
- Which philosophy matches your playstyle?
- What bonuses do you need most?
- Who are natural enemies of your choices?
- Can you balance multiple relationships?

**Remember**:
- You can't please everyone
- Some factions will always oppose each other
- Betrayals have lasting consequences
- Reputation takes time to build but seconds to destroy`
  }
];
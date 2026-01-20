# Logos Imperium - Project Development Guide

## 🎮 Project Overview

**Logos Imperium** is a deep, strategic RPG where players command fleets, manage economies, recruit companions, and navigate a procedurally-generated galaxy. The game emphasizes emergent gameplay through interconnected systems.

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4 + Custom sci-fi theme
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **State Management**: React Context + Custom Hooks
- **Routing**: Wouter (lightweight client-side routing)

## 📁 Project Structure

```
logos-imperium-app/
├── client/
│   ├── public/
│   │   └── images/          # Static game assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── game-systems/    # All 193 game system components
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── layouts/         # Layout wrappers
│   │   │   └── shared/          # Reusable UI elements
│   │   ├── contexts/
│   │   │   ├── GameStateContext.tsx    # Global game state
│   │   │   └── ThemeContext.tsx        # Theme management
│   │   ├── hooks/
│   │   │   └── [custom hooks]
│   │   ├── pages/
│   │   │   ├── MainMenu.tsx            # Game initialization
│   │   │   ├── GameHub.tsx             # Central dashboard
│   │   │   ├── FleetManagement.tsx     # Fleet command
│   │   │   ├── CompanionPanel.tsx      # Companion management
│   │   │   ├── EconomicDashboard.tsx   # Market & resources
│   │   │   ├── CharacterSheet.tsx      # Player progression
│   │   │   └── NotFound.tsx            # 404 page
│   │   ├── lib/
│   │   │   └── [utility functions]
│   │   ├── App.tsx                     # Main app component
│   │   ├── main.tsx                    # Entry point
│   │   └── index.css                   # Global styles
│   └── index.html
├── DESIGN_VISION.md          # Design philosophy & roadmap
├── PROJECT_GUIDE.md          # This file
└── package.json
```

## 🎨 Design Philosophy: Command Center Aesthetic

The game uses a **military command interface** aesthetic with:

### Color Palette
- **Primary Background**: Deep space blue (`#0F172A`)
- **Accent**: Cyan/Electric blue (`#00D9FF`)
- **Secondary**: Purple (`#8B5CF6`) for factions/status
- **Tertiary**: Gold (`#FBBF24`) for rewards
- **Neutral**: Slate grays (`#1E293B` to `#E2E8F0`)

### Visual Language
- **Glowing borders** and accents
- **Subtle grid patterns** in backgrounds
- **Animated data displays** with progress bars
- **Holographic/translucent panels**
- **Monospace fonts** for technical data
- **Uppercase tracking** for labels

### Custom CSS Classes
- `.glow-cyan` - Cyan glowing effect
- `.tech-panel` - Tech-styled card container
- `.tech-button` - Tech-styled button
- `.grid-bg` - Grid pattern background
- `.holographic` - Translucent panel effect
- `.data-text` - Monospace data styling

## 🎮 Game Systems

### 1. Fleet Management System
**File**: `FleetManagement.tsx`
- Build and customize spacecraft
- Fleet formations and tactical positioning
- Ship veterancy and crew management
- Doctrine system for strategic bonuses

**Related Components**: 
- `FleetSystem.jsx`
- `FleetManagementHub.jsx`
- `ShipDesignerUI.jsx`
- `FleetFormationsSystem.jsx`

### 2. Combat System
**Status**: Framework ready, components available
- Tactical grid-based combat
- Real-time fleet battles
- Environmental interactions
- Detailed combat logging

**Related Components**:
- `TacticalCombatSystem.jsx`
- `DetailedCombatSimulator.jsx`
- `CombatSystemHub.jsx`
- `TacticalFleetCombat.jsx`

### 3. Economic System
**File**: `EconomicDashboard.tsx`
- Trade routes and market manipulation
- Resource management and production
- Infrastructure development
- Faction economics integration

**Related Components**:
- `EconomicSystem.jsx`
- `MarketInterface.jsx`
- `TradeRouteManager.jsx`
- `MarketManipulation.jsx`

### 4. Companion System
**File**: `CompanionPanel.tsx`
- Recruit diverse companions with unique personalities
- Dynamic dialogue and relationship tracking
- Skill trees and mastery perks
- Proactive advice and quest generation

**Related Components**:
- `CompanionAIEngine.jsx`
- `CompanionPanel.jsx`
- `CompanionQuestSystem.jsx`
- `CompanionRecruitmentSystem.jsx`

### 5. Procedural Content
**Status**: Components ready for integration
- Infinite quest generation
- Dynamic location discovery
- Event cascades and emergent storytelling
- Personality-based quest variation

**Related Components**:
- `ProceduralContentManager.jsx`
- `ProceduralQuestGenerator.jsx`
- `ProceduralLocationGenerator.jsx`
- `ProceduralEventGenerator.jsx`

### 6. Character Progression
**File**: `CharacterSheet.tsx`
- Skill trees with mastery perks
- Trait system affecting gameplay
- Stress meter for mental state
- Achievement tracking

**Related Components**:
- `SkillTreeSystem.jsx`
- `SkillTreeUI.jsx`
- `StressMeterSystem.jsx`
- `StressMeterUI.jsx`

## 🔧 State Management

### GameStateContext
Located in `client/src/contexts/GameStateContext.tsx`

**Available Functions**:
```typescript
const { gameState, updateGameState, addResources, startNewGame, advanceTurn, togglePause } = useGameState();
```

**Game State Structure**:
```typescript
{
  playerName: string;
  playerId: string;
  credits: number;
  metal: number;
  energy: number;
  research: number;
  fleetSize: number;
  companionCount: number;
  level: number;
  experience: number;
  turn: number;
  stress: number;
  morale: number;
  reputation: number;
  // ... and more
}
```

## 🚀 Getting Started

### Installation
```bash
cd /home/ubuntu/logos-imperium-app
pnpm install
pnpm dev
```

### Development Workflow
1. **Create new page** in `client/src/pages/`
2. **Add route** in `App.tsx`
3. **Use GameStateContext** for global state
4. **Apply design tokens** from `index.css`
5. **Import game components** from `components/`

### Adding New Pages
```typescript
// client/src/pages/NewPage.tsx
import { useGameState } from '@/contexts/GameStateContext';
import { Card } from '@/components/ui/card';

export default function NewPage() {
  const { gameState } = useGameState();
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 grid-bg">
      {/* Your content */}
    </div>
  );
}
```

Then add to `App.tsx`:
```typescript
import NewPage from "./pages/NewPage";

// In Router component:
<Route path="/game/new-page" component={NewPage} />
```

## 📊 Integrating Game Components

### Example: Adding Fleet AI
```typescript
// In FleetManagement.tsx
import { EnhancedFleetAI } from '@/components/EnhancedFleetAI';

// Use in your component
<EnhancedFleetAI fleetData={selectedFleet} />
```

### Example: Using Procedural Generation
```typescript
// In GameHub.tsx
import { ProceduralContentManager } from '@/components/ProceduralContentManager';

const contentManager = new ProceduralContentManager();
const newQuests = contentManager.generateProceduralQuests(gameState);
```

## 🎯 Development Roadmap

### Phase 1: Foundation ✅
- [x] Project initialization
- [x] Design system implementation
- [x] Main menu and game initialization
- [x] Basic game state management
- [x] Core page templates

### Phase 2: Core Systems Integration (Next)
- [ ] Integrate FleetSystem components
- [ ] Implement combat interface
- [ ] Connect economic systems
- [ ] Activate companion AI
- [ ] Add procedural content generation

### Phase 3: Advanced Features
- [ ] Market manipulation mechanics
- [ ] Advanced AI systems
- [ ] Faction integration
- [ ] Skill tree interactions

### Phase 4: Polish & Optimization
- [ ] Visual effects and animations
- [ ] Performance optimization
- [ ] Save/load system
- [ ] Tutorial and onboarding

### Phase 5: Content & Balance
- [ ] Quest generation
- [ ] Difficulty scaling
- [ ] Achievement system
- [ ] Endgame content

## 🛠️ Common Tasks

### Update Game State
```typescript
const { updateGameState } = useGameState();

updateGameState({
  credits: 100000,
  stress: 50,
  // ... other updates
});
```

### Add Resources
```typescript
const { addResources } = useGameState();

addResources({
  credits: 5000,
  metal: 500,
  energy: 200,
});
```

### Advance Game Turn
```typescript
const { advanceTurn } = useGameState();

advanceTurn(); // Increases turn, adds passive resources, increases stress
```

## 📝 Styling Guidelines

### Using Tech Classes
```jsx
// Tech panel
<Card className="tech-panel border-cyan-500/30">
  {/* content */}
</Card>

// Tech button
<Button className="tech-button" variant="outline">
  Action
</Button>

// Glowing effect
<div className="glow-cyan">
  {/* content */}
</div>
```

### Color Usage
```jsx
// Cyan accent
<p className="text-cyan-300">Important text</p>

// Purple for secondary
<p className="text-purple-300">Secondary info</p>

// Gold for rewards
<p className="text-amber-300">Rewards</p>

// Data text
<p className="data-text">Technical info</p>
```

## 🔗 Useful Resources

- **Tailwind CSS**: https://tailwindcss.com/
- **shadcn/ui**: https://ui.shadcn.com/
- **Radix UI**: https://www.radix-ui.com/
- **Framer Motion**: https://www.framer.com/motion/
- **React Hooks**: https://react.dev/reference/react

## 📞 Support & Troubleshooting

### Dev Server Issues
```bash
# Restart dev server
pnpm dev

# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build Issues
```bash
# Check TypeScript
pnpm check

# Build for production
pnpm build
```

## 🎓 Architecture Decisions

1. **Context API over Redux**: Simpler for this project scope
2. **Wouter over React Router**: Lightweight, perfect for static sites
3. **Tailwind CSS**: Rapid styling with design tokens
4. **shadcn/ui**: Accessible, customizable components
5. **Monospace fonts for data**: Reinforces command center aesthetic

## 📈 Performance Tips

1. Use `React.memo()` for expensive components
2. Implement `useCallback()` for event handlers
3. Lazy load routes with dynamic imports
4. Optimize images in `public/images/`
5. Use CSS classes instead of inline styles

## 🚀 Deployment

The project is ready for deployment to Manus hosting:
1. Create a checkpoint
2. Click "Publish" in the Management UI
3. Configure custom domain if needed

## 📄 License

Logos Imperium © 2025. All rights reserved.

---

**Last Updated**: January 5, 2026
**Version**: 1.0.0

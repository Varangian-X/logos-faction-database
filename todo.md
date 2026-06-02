# Faction Tracker Game Engine Integration TODO

## Phase 1: Combat Encounter System
- [x] Create encounter generation logic based on faction Military Strength
- [x] Implement relationship-based interdiction frequency
- [x] Add Neo-Praetorian Justiciar-Class Cutter encounters
- [x] Create encounter difficulty scaling based on faction power
- [x] Add random encounter tables for each major faction

## Phase 2: Byzantine Pendulum Tactical Mechanics
- [x] Implement Stasis vs Plasticity alignment system
- [x] Create Tactical Heat calculation based on alignment
- [x] Build AI behavior modifiers for Stasis factions (defensive, predictable)
- [x] Build AI behavior modifiers for Plasticity factions (aggressive, adaptive)
- [x] Add visual indicators for Byzantine Pendulum state

## Phase 3: Mission Outcome & Faction Standing
- [x] Create faction standing update system
- [x] Implement reputation changes based on mission success/failure
- [x] Add faction relationship cascades (enemy of my enemy logic)
- [x] Build mission statistics screen with faction impact display
- [x] Add notification system for faction standing changes

## Phase 4: Faction Intelligence Interface
- [x] Create unified "Faction Intelligence" tab
- [x] Embed GM Dashboard visualizations
- [x] Add player faction standing display
- [x] Show active faction conflicts and opportunities
- [x] Implement seamless navigation between modules

## Phase 5: Market Integration Preparation
- [x] Export faction Economic Power API
- [x] Create faction discount/penalty calculation functions
- [x] Build faction conflict price modifier system
- [x] Document API for Dynamic Market module integration

## Phase 6: Testing & Polish
- [x] Test combat encounter generation
- [x] Test tactical heat mechanics in combat
- [x] Test mission outcome and faction standing updates
- [x] Verify all navigation functions work
- [x] Final checkpoint for player testing

## Integration Complete

All core gameplay systems implemented and ready for player testing:

✅ Combat Encounter System (combatEncounters.ts)
✅ Byzantine Pendulum Tactical Mechanics (byzantinePendulum.ts)
✅ Mission Outcome & Faction Standing (factionStanding.ts)
✅ Faction Intelligence Interface (FactionIntelligence.tsx)
✅ Market Integration API (marketIntegration.ts)

Ready for Dynamic Market module integration when complete.

## Dynamic Market Module Development

### Phase 1: Market Item Catalog
- [x] Define item categories (weapons, ships, resources, tech)
- [x] Assign faction affiliations to items
- [x] Set base prices and rarity tiers
- [x] Add item descriptions and metadata

### Phase 2: Dynamic Market UI
- [x] Create market interface component
- [x] Display items with faction badges
- [x] Show price breakdowns (base, discount, conflict, pendulum)
- [x] Add filtering by category and faction

### Phase 3: Faction Pricing Integration
- [x] Integrate calculateFactionPriceModifiers()
- [x] Show availability locks for hostile factions
- [x] Display exclusive items for allied factions
- [x] Add real-time price updates based on Byzantine Pendulum

### Phase 4: Transaction System
- [x] Implement shopping cart
- [x] Add purchase confirmation with faction impact preview
- [x] Track player credits/resources
- [ ] Generate transaction history (future enhancement)

### Phase 5: Testing & Polish
- [x] Test all pricing scenarios
- [x] Verify faction relationship effects
- [x] Test Byzantine Pendulum volatility
- [x] Save final checkpoint

## Dynamic Market Complete

Fully functional faction-driven market with:
✅ 20+ items across 5 categories (weapons, ships, resources, technology, equipment)
✅ Faction-specific items with alliance requirements
✅ Real-time price modifiers based on player faction standings
✅ Byzantine Pendulum market volatility
✅ Shopping cart with transaction validation
✅ Availability locks for hostile factions
✅ Exclusive items for allied factions
✅ Complete price breakdown UI showing all modifiers


## Cartography Integration

- [x] Copy Cartography HTML to webdev public folder
- [x] Create Cartography.tsx page component with iframe
- [x] Add /cartography route to App.tsx
- [x] Add CARTOGRAPHY navigation link to Home.tsx header
- [x] Test Cartography functionality (all 92 nodes, 15 assets displaying correctly)
- [x] Verify identical functionality to standalone version
- [x] Add prominent back button to Cartography page
- [x] Test back button navigation (returns to Faction Tracker home)

### Cartography Integration Complete

✅ Cartography app fully integrated into webdev project
✅ Accessible via /cartography route
✅ All UI controls functional (search, filters, asset roster, regional survey, etc.)
✅ Navigation link added to main header
✅ Prominent "BACK TO TRACKER" button in top-left corner
✅ Back button fully functional - returns to Faction Tracker home
✅ Ready for deployment to logosdb.club domain


## Dynamic Market - Notion Integration

### Phase 1: Backend Notion Integration
- [ ] Create tRPC procedure to fetch Factions from Notion Registry
- [ ] Create tRPC procedure to fetch Resources from Notion Registry
- [ ] Implement caching layer (5-minute refresh)
- [ ] Add error handling and fallback to static data
- [ ] Test Notion MCP connectivity

### Phase 2: Database Schema Updates
- [ ] Update MarketItem interface to include Notion resource ID
- [ ] Add market status field (Inflationary, Depressed, Concern, Expected)
- [ ] Add market trends field
- [ ] Add market nodes field
- [ ] Add strategic value field

### Phase 3: Dynamic Market UI Redesign
- [ ] Replace hardcoded items with Notion data
- [ ] Display live market status with color coding
- [ ] Show market trends and strategic value
- [ ] Filter by market nodes/locations
- [ ] Add market status indicators (Inflationary/Depressed)

### Phase 4: Faction Integration
- [ ] Link resources to factions from Notion Registry
- [ ] Apply faction-specific pricing modifiers
- [ ] Show faction availability restrictions
- [ ] Display faction alignment effects on pricing

### Phase 5: Testing & Deployment
- [ ] Test live data fetching from Notion
- [ ] Verify faction pricing calculations
- [ ] Test market status updates
- [ ] Create checkpoint and deploy


## Dynamic Market - Notion Integration (COMPLETE)

### Phase 1: Market State Data Structure
- [x] Create MarketStateSnapshot interface with JSON serialization
- [x] Implement export/import JSON functionality
- [x] Add price modifier calculations
- [x] Create filtering and search utilities
- [x] Add state validation

### Phase 2: Notion API Integration
- [x] Create Notion API service for push-back
- [x] Implement page content generation
- [x] Add Notion database fetching
- [x] Create Notion configuration validation
- [x] Add error handling

### Phase 3: Market State Manager Component
- [x] Create React component for export/import
- [x] Add Notion push-back dialog
- [x] Implement file upload/download
- [x] Add state validation UI
- [x] Create status indicators

### Phase 4: Dynamic Market Integration
- [x] Add MarketStateManager to DynamicMarket page
- [x] Integrate market state management
- [x] Add collapsible UI section
- [x] Wire up state import/export handlers

### Phase 5: Testing & Deployment
- [x] Create comprehensive vitest tests (22 tests - all passing)
- [x] Test serialization/deserialization
- [x] Test price calculations
- [x] Test item filtering
- [x] Test export/import workflow
- [ ] Create checkpoint and deploy

## Notion Integration Complete

✅ JSON state snapshots with full data preservation
✅ Export/import functionality for market data
✅ Notion page push-back with rich formatting
✅ URL-based image references (no embedded images)
✅ Market state validation and error handling
✅ 22 comprehensive vitest tests (100% passing)
✅ Collapsible UI in Dynamic Market page
✅ Ready for production use


## Notion Schemas Integration - Phase 2

### Phase 1: Notion API Client
- [x] Create notionClient.ts with fetch functions
- [x] Implement fetchNotionFactions() for Factions Registry
- [x] Implement fetchNotionResources() for Resources Registry
- [x] Add token validation and error handling
- [x] Create NotionFaction and NotionResource types

### Phase 2: Schema Mapping
- [x] Create notionMarketMapper.ts
- [x] Map Notion Resources to MarketItems
- [x] Map Notion Factions to faction data
- [x] Implement market status modifiers (Inflationary, Depressed, etc.)
- [x] Create price calculation with modifiers
- [x] Add filtering utilities (by node, value, trend)

### Phase 3: React Integration
- [x] Create useNotionMarketSync hook
- [x] Implement token authentication
- [x] Add auto-sync capability
- [x] Create search and filter functions
- [x] Add localStorage persistence

### Phase 4: UI Components
- [x] Create NotionMarketConfig component
- [x] Add token input dialog
- [x] Implement sync button with loading states
- [x] Add authentication status display
- [x] Show last sync timestamp
- [x] Integrate into Dynamic Market page

### Phase 5: Testing
- [x] Create notionIntegration.test.ts
- [x] Write 12 comprehensive tests
- [x] Test all mapping functions
- [x] Test price calculations
- [x] Test filtering logic
- [x] All tests passing (12/12)

## Notion Schemas Integration Complete

✅ Live Notion Factions Registry integration
✅ Live Notion Resources Registry integration
✅ Automatic schema mapping to market items
✅ Market status modifiers (Inflationary/Depressed/etc.)
✅ Strategic value to rarity mapping
✅ Market node and trend filtering
✅ NotionMarketConfig UI component
✅ useNotionMarketSync React hook
✅ Token authentication with localStorage
✅ 12 comprehensive vitest tests (100% passing)
✅ Ready to connect to your Notion databases

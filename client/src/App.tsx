import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GameStateProvider } from "./contexts/GameStateContext";
import MainMenu from "./pages/MainMenu";
import GameHub from "./pages/GameHub";
import EconomicDashboard from "./pages/EconomicDashboard";
import FactionCommand from "./pages/FactionCommand";
import { 
  CompanionPanelPage, 
  IntelAnalytics, 
  WorldMap, 
  CitizenProfile, 
  CharacterSheet, 
  TacticalBattle, 
  CharacterSkirmish,
  FleetManagement
} from "./pages/Placeholders";
// Note: TacticalBattle.tsx is the TypeScript version

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainMenu} />
      <Route path="/game" component={GameHub} />
        <Route path="/game/combat" component={CharacterSkirmish} />
      <Route path="/game/companions" component={CompanionPanelPage} />
      <Route path="/game/economy" component={EconomicDashboard} />
      <Route path="/game/intel" component={IntelAnalytics} />
      <Route path="/game/world" component={WorldMap} />
      <Route path="/intel-analytics" component={IntelAnalytics} />
      <Route path="/faction-command" component={FactionCommand} />
      <Route path="/citizen-profile" component={CitizenProfile} />    <Route path="/game/character" component={CharacterSheet} />
      <Route path="/game/battle" component={TacticalBattle} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <GameStateProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </GameStateProvider>
    </ErrorBoundary>
  );
}

export default App;

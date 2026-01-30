import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CampaignProvider } from "./contexts/CampaignContext";
import Home from "./pages/Home";
import Network from "./pages/Network";
import Timeline from "./pages/Timeline";
import Map from "./pages/Map";
import Campaign from "./pages/Campaign";
import GMDashboard from "./pages/GMDashboard";
import FactionIntelligence from "./pages/FactionIntelligence";
import DynamicMarket from "./pages/DynamicMarket";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/network" component={Network} />
      <Route path="/timeline" component={Timeline} />
      <Route path="/map" component={Map} />
      <Route path="/campaign" component={Campaign} />
      <Route path="/gm-dashboard" component={GMDashboard} />
      <Route path="/faction-intelligence" component={FactionIntelligence} />
      <Route path="/market" component={DynamicMarket} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <CampaignProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CampaignProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

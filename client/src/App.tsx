import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ContestPage from "./pages/ContestPage";
import ReportPage from "./pages/ReportPage";
import Admin from "./pages/Admin";

function Routes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/contest/:slug" component={ContestPage} />
      <Route path="/report/:slug" component={ReportPage} />
      <Route path="/admin" component={Admin} />
      <Route path="/404" component={NotFound} />
      {/* Fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

const routerBase = import.meta.env.BASE_URL === "/"
  ? ""
  : import.meta.env.BASE_URL.replace(/\/+$/, "");

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <WouterRouter base={routerBase}>
              <Routes />
          </WouterRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

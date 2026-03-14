import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator";
import Concierge from "./pages/Concierge";
import Sop from "./pages/Sop";
import Results from "./pages/Results";
import Layout from "./components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";

// Route guard: /sop is only accessible when logged in
function ProtectedSop() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect to Manus login, return to /sop after auth
      // Store intended destination so we can redirect after login
      sessionStorage.setItem("postLoginRedirect", "/sop");
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || !isAuthenticated) {
    return (
      <div className="container py-24 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-6" />
        <p className="font-body text-sm text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  return <Sop />;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/simulator" component={Simulator} />
        <Route path="/concierge" component={Concierge} />
        <Route path="/sop" component={ProtectedSop} />
        <Route path="/results/:token" component={Results} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster richColors position="top-center" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

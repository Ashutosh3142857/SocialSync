import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Schedule from "@/pages/schedule";
import Posts from "@/pages/posts";
import Analytics from "@/pages/analytics";
import Connections from "@/pages/connections";
import Settings from "@/pages/settings";
import PremiumFeatures from "@/pages/premium-features";
import MainLayout from "@/layouts/main-layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/posts" component={Posts} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/connections" component={Connections} />
      <Route path="/settings" component={Settings} />
      <Route path="/premium-features" component={PremiumFeatures} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Router />
      </MainLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

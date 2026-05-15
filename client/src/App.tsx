import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";

import AdminDashboard from "@/pages/AdminDashboard";
import ChildrenManagement from "@/pages/ChildrenManagement";
import FinancesManagement from "@/pages/FinancesManagement";
import AdvancedFinances from "@/pages/AdvancedFinances";
import FamilyWall from "@/pages/FamilyWall";
import SelectChild from "@/pages/SelectChild";
import ChildTasks from "@/pages/ChildTasks";
import AdminLogin from "@/pages/AdminLogin";
import AdminPanelPremium from "./pages/AdminPanelPremium";
import ChildTasksImproved from "@/pages/ChildTasksImproved";
import Welcome from "@/pages/Welcome";
import FamilyDashboard from "@/pages/FamilyDashboard";
import SplashScreen from "@/pages/SplashScreen";
import FamilyHub from "@/pages/FamilyHub";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FamilyWallProvider } from "./contexts/FamilyWallContext";

function Router() {
  return (
    <Switch>
      {/* New AAA Gaming routes */}
      <Route path={"/"} component={SplashScreen} />
      <Route path={"/hub"} component={FamilyHub} />
      <Route path={"/welcome"} component={Welcome} />
      <Route path={"/select-child"} component={SelectChild} />
      <Route path={"/child/:childId/tasks"} component={(props: any) => (
        <ChildTasks childId={parseInt(props.params.childId)} />
      )} />
      <Route path={"/child/:childId/tasks-improved"} component={(props: any) => (
        <ChildTasksImproved childId={parseInt(props.params.childId)} />
      )} />
      {/* Admin routes */}
      <Route path={"/dashboard"} component={AdminDashboard} />
      <Route path={"/dashboard/children"} component={ChildrenManagement} />
      <Route path={"/dashboard/finances"} component={FinancesManagement} />
      <Route path={"/dashboard/finances-advanced"} component={AdvancedFinances} />
      <Route path={"/family-wall"} component={() => <FamilyWall childId={1} familyId={1} />} />
      <Route path={"/admin/login"} component={AdminLogin} />
      <Route path="/admin/panel" component={AdminPanelPremium} />
      <Route path="/admin/dashboard" component={FamilyDashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <FamilyWallProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </FamilyWallProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

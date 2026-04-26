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
import AdminPanel from "@/pages/AdminPanel";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={SelectChild} />
      <Route path={"/child/:childId/tasks"} component={(props: any) => (
        <ChildTasks childId={parseInt(props.params.childId)} />
      )} />
      <Route path={"/dashboard"} component={AdminDashboard} />
      <Route path={"/dashboard/children"} component={ChildrenManagement} />
      <Route path={"/dashboard/finances"} component={FinancesManagement} />
      <Route path={"/dashboard/finances-advanced"} component={AdvancedFinances} />
      <Route path={"/family-wall"} component={() => <FamilyWall childId={1} familyId={1} />} />
      <Route path={"/admin/login"} component={AdminLogin} />
      <Route path={"/admin/tasks"} component={AdminPanel} />
      <Route path={"/admin/dashboard"} component={AdminPanel} />
      <Route path={"/admin/family-wall"} component={AdminPanel} />
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
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

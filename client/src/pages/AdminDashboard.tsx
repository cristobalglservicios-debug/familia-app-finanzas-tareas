import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [familyId, setFamilyId] = useState(1); // TODO: Get from context or user

  const childrenQuery = trpc.children.list.useQuery(
    { familyId },
    { enabled: isAuthenticated }
  );

  const expensesQuery = trpc.expenses.listByMonth.useQuery(
    {
      familyId,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    },
    { enabled: isAuthenticated }
  );

  const categoriesQuery = trpc.categories.list.useQuery(
    { familyId },
    { enabled: isAuthenticated }
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-8 border border-border">
          <h1 className="heading-primary mb-2">Bienvenida, Ana</h1>
          <p className="text-muted-foreground font-light">
            Aquí puedes gestionar las finanzas del hogar y las actividades de tus hijos.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Hijos Registrados
            </h3>
            <p className="text-3xl font-black text-foreground">
              {childrenQuery.data?.length || 0}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Gastos Este Mes
            </h3>
            <p className="text-3xl font-black text-foreground">
              ${expensesQuery.data?.reduce((sum, e) => sum + parseFloat(e.amount), 0).toFixed(2) || "0.00"}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Categorías
            </h3>
            <p className="text-3xl font-black text-foreground">
              {categoriesQuery.data?.length || 0}
            </p>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => setLocation("/dashboard/finances")}
            className="bg-primary text-primary-foreground hover:opacity-90 py-6 font-semibold"
          >
            Registrar Gasto
          </Button>
          <Button
            onClick={() => setLocation("/dashboard/children")}
            className="bg-secondary text-secondary-foreground hover:opacity-90 py-6 font-semibold"
          >
            Gestionar Hijos
          </Button>
          <Button
            onClick={() => setLocation("/dashboard/finances")}
            className="bg-accent text-accent-foreground hover:opacity-90 py-6 font-semibold"
          >
            Ver Finanzas
          </Button>
        </div>

        {/* Recent Expenses */}
        <div>
          <h2 className="heading-secondary mb-4">Gastos Recientes</h2>
          <Card className="p-6">
            {expensesQuery.isLoading ? (
              <p className="text-muted-foreground">Cargando...</p>
            ) : expensesQuery.data && expensesQuery.data.length > 0 ? (
              <div className="space-y-3">
                {expensesQuery.data.slice(0, 5).map((expense) => (
                  <div
                    key={expense.id}
                    className="flex justify-between items-center py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-foreground">
                        {expense.description || "Gasto"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-black text-primary">
                      ${parseFloat(expense.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No hay gastos registrados</p>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, TrendingUp, DollarSign, Calendar } from "lucide-react";

export default function FinancesManagement() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [familyId] = useState(1); // TODO: Get from context
  const [showForm, setShowForm] = useState(false);
  const [currentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const expensesQuery = trpc.expenses.listByMonth.useQuery(
    {
      familyId,
      year: currentMonth.getFullYear(),
      month: currentMonth.getMonth() + 1,
    },
    { enabled: isAuthenticated }
  );

  const categoriesQuery = trpc.categories.list.useQuery(
    { familyId },
    { enabled: isAuthenticated }
  );

  const createExpenseMutation = trpc.expenses.create.useMutation({
    onSuccess: () => {
      toast.success("¡Gasto registrado exitosamente!");
      setFormData({
        categoryId: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowForm(false);
      expensesQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Error al registrar gasto");
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId || !formData.amount) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    createExpenseMutation.mutate({
      familyId,
      categoryId: parseInt(formData.categoryId),
      amount: formData.amount,
      date: new Date(formData.date),
      description: formData.description,
    });
  };

  if (!isAuthenticated) return null;

  const totalExpenses =
    expensesQuery.data?.reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0;

  // Calculate expenses by category
  const expensesByCategory: Record<string, number> = {};
  expensesQuery.data?.forEach((expense) => {
    const categoryId = expense.categoryId.toString();
    expensesByCategory[categoryId] =
      (expensesByCategory[categoryId] || 0) + parseFloat(expense.amount);
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="heading-primary mb-2">Gestión de Finanzas</h1>
            <p className="text-muted-foreground font-light">
              Registra y monitorea los gastos del hogar
            </p>
          </div>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Registrar Gasto
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-light mb-2">
                  Gastos Este Mes
                </p>
                <p className="text-3xl font-black text-foreground">
                  ${totalExpenses.toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-primary/30" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-light mb-2">
                  Transacciones
                </p>
                <p className="text-3xl font-black text-foreground">
                  {expensesQuery.data?.length || 0}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-secondary/30" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-light mb-2">
                  Categorías
                </p>
                <p className="text-3xl font-black text-foreground">
                  {categoriesQuery.data?.length || 0}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-accent/30" />
            </div>
          </Card>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="p-6 border-2 border-primary">
            <h2 className="heading-secondary mb-6">Registrar Nuevo Gasto</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="category" className="font-semibold mb-2 block">
                  Categoría *
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesQuery.data?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount" className="font-semibold mb-2 block">
                  Monto *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="border-border"
                />
              </div>

              <div>
                <Label htmlFor="description" className="font-semibold mb-2 block">
                  Descripción
                </Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Ej: Compra en supermercado"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="border-border"
                />
              </div>

              <div>
                <Label htmlFor="date" className="font-semibold mb-2 block">
                  Fecha
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="border-border"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={createExpenseMutation.isPending}
                  className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
                >
                  {createExpenseMutation.isPending
                    ? "Procesando..."
                    : "Registrar Gasto"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Expenses by Category */}
        {categoriesQuery.data && categoriesQuery.data.length > 0 && (
          <div>
            <h2 className="heading-secondary mb-4">Gastos por Categoría</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoriesQuery.data.map((category) => {
                const amount = expensesByCategory[category.id.toString()] || 0;
                const percentage =
                  totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                return (
                  <Card key={category.id} className="p-4 border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">
                        {category.name}
                      </h3>
                      <p className="font-black text-primary">
                        ${amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 font-light">
                      {percentage.toFixed(1)}% del total
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Expenses */}
        <div>
          <h2 className="heading-secondary mb-4">Gastos Recientes</h2>
          <Card className="p-6">
            {expensesQuery.isLoading ? (
              <p className="text-muted-foreground">Cargando gastos...</p>
            ) : expensesQuery.data && expensesQuery.data.length > 0 ? (
              <div className="space-y-3">
                {expensesQuery.data.map((expense) => {
                  const category = categoriesQuery.data?.find(
                    (c) => c.id === expense.categoryId
                  );
                  return (
                    <div
                      key={expense.id}
                      className="flex justify-between items-center py-3 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-semibold text-foreground">
                          {expense.description || category?.name || "Gasto"}
                        </p>
                        <p className="text-sm text-muted-foreground font-light">
                          {new Date(expense.date).toLocaleDateString("es-ES", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <p className="font-black text-primary">
                        ${parseFloat(expense.amount).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground font-light">
                No hay gastos registrados
              </p>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

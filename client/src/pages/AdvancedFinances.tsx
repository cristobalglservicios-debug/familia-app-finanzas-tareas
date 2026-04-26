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
import { Plus, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react";

export default function AdvancedFinances() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [familyId] = useState(1); // TODO: Get from context
  const [currentMonth] = useState(new Date());
  const [showFixedPaymentForm, setShowFixedPaymentForm] = useState(false);
  const [fixedPaymentForm, setFixedPaymentForm] = useState({
    categoryId: "",
    name: "",
    amount: "",
    dueDay: "",
    frequency: "monthly" as "monthly" | "quarterly" | "yearly",
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

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  // Calculate weekly budget
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  
  const weekExpenses = expensesQuery.data
    ?.filter((e) => {
      const expenseDate = new Date(e.date);
      return expenseDate >= weekStart && expenseDate <= today;
    })
    .reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0;

  const totalExpenses =
    expensesQuery.data?.reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0;

  // Sample fixed payments
  const fixedPayments = [
    { id: 1, name: "Renta", amount: 1500, dueDay: 1, status: "paid" },
    { id: 2, name: "Luz", amount: 150, dueDay: 15, status: "pending" },
    { id: 3, name: "Internet", amount: 80, dueDay: 20, status: "pending" },
    { id: 4, name: "Agua", amount: 60, dueDay: 10, status: "paid" },
  ];

  const totalFixedPayments = fixedPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidFixedPayments = fixedPayments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="heading-primary mb-2">Finanzas Avanzadas</h1>
          <p className="text-muted-foreground font-light">
            Gestiona presupuestos semanales, pagos fijos y gastos compartidos
          </p>
        </div>

        {/* Weekly Budget Section */}
        <div>
          <h2 className="heading-secondary mb-4">Presupuesto Semanal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-light mb-2">
                    Límite Semanal
                  </p>
                  <p className="text-3xl font-black text-foreground">$500.00</p>
                </div>
                <TrendingUp className="w-12 h-12 text-primary/30" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-light mb-2">
                    Gastado Esta Semana
                  </p>
                  <p className="text-3xl font-black text-foreground">
                    ${weekExpenses.toFixed(2)}
                  </p>
                </div>
                <AlertCircle className="w-12 h-12 text-secondary/30" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-light mb-2">
                    Disponible
                  </p>
                  <p className="text-3xl font-black text-foreground">
                    ${(500 - weekExpenses).toFixed(2)}
                  </p>
                </div>
                <CheckCircle2 className="w-12 h-12 text-accent/30" />
              </div>
            </Card>
          </div>

          {/* Weekly Budget Progress */}
          <Card className="p-6 mt-4 border-border">
            <div className="flex justify-between items-center mb-3">
              <p className="font-semibold text-foreground">Progreso de Gasto</p>
              <p className="text-sm text-muted-foreground">
                {((weekExpenses / 500) * 100).toFixed(0)}%
              </p>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  weekExpenses / 500 > 0.8 ? "bg-destructive" : "bg-primary"
                }`}
                style={{ width: `${Math.min((weekExpenses / 500) * 100, 100)}%` }}
              />
            </div>
          </Card>
        </div>

        {/* Fixed Payments Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="heading-secondary">Pagos Fijos</h2>
            <Button
              onClick={() => setShowFixedPaymentForm(!showFixedPaymentForm)}
              className="bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Agregar Pago
            </Button>
          </div>

          {showFixedPaymentForm && (
            <Card className="p-6 mb-6 border-2 border-primary">
              <h3 className="heading-secondary mb-4">Nuevo Pago Fijo</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fp-name" className="font-semibold mb-2 block">
                      Nombre del Pago
                    </Label>
                    <Input
                      id="fp-name"
                      placeholder="Ej: Renta"
                      value={fixedPaymentForm.name}
                      onChange={(e) =>
                        setFixedPaymentForm({ ...fixedPaymentForm, name: e.target.value })
                      }
                      className="border-border"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fp-amount" className="font-semibold mb-2 block">
                      Monto
                    </Label>
                    <Input
                      id="fp-amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={fixedPaymentForm.amount}
                      onChange={(e) =>
                        setFixedPaymentForm({ ...fixedPaymentForm, amount: e.target.value })
                      }
                      className="border-border"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fp-day" className="font-semibold mb-2 block">
                      Día del Mes
                    </Label>
                    <Input
                      id="fp-day"
                      type="number"
                      min="1"
                      max="31"
                      placeholder="15"
                      value={fixedPaymentForm.dueDay}
                      onChange={(e) =>
                        setFixedPaymentForm({ ...fixedPaymentForm, dueDay: e.target.value })
                      }
                      className="border-border"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fp-freq" className="font-semibold mb-2 block">
                      Frecuencia
                    </Label>
                    <Select
                      value={fixedPaymentForm.frequency}
                      onValueChange={(value: any) =>
                        setFixedPaymentForm({ ...fixedPaymentForm, frequency: value })
                      }
                    >
                      <SelectTrigger className="border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Mensual</SelectItem>
                        <SelectItem value="quarterly">Trimestral</SelectItem>
                        <SelectItem value="yearly">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => {
                      toast.success("Pago fijo agregado");
                      setShowFixedPaymentForm(false);
                    }}
                    className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
                  >
                    Guardar
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowFixedPaymentForm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Fixed Payments List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fixedPayments.map((payment) => (
              <Card key={payment.id} className="p-4 border-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{payment.name}</p>
                    <p className="text-sm text-muted-foreground font-light">
                      Vence el día {payment.dueDay}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      payment.status === "paid"
                        ? "bg-primary/20 text-primary"
                        : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {payment.status === "paid" ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Pagado
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        Pendiente
                      </>
                    )}
                  </span>
                </div>
                <p className="text-2xl font-black text-foreground">
                  ${payment.amount.toFixed(2)}
                </p>
              </Card>
            ))}
          </div>

          {/* Fixed Payments Summary */}
          <Card className="p-6 mt-4 border-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground font-light mb-1">
                  Total Pagos Fijos
                </p>
                <p className="text-2xl font-black text-foreground">
                  ${totalFixedPayments.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-light mb-1">
                  Pagados Este Mes
                </p>
                <p className="text-2xl font-black text-primary">
                  ${paidFixedPayments.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Monthly Summary */}
        <div>
          <h2 className="heading-secondary mb-4">Resumen del Mes</h2>
          <Card className="p-6 border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground font-light mb-2">
                  Gastos Totales
                </p>
                <p className="text-3xl font-black text-foreground">
                  ${totalExpenses.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-light mb-2">
                  Pagos Fijos
                </p>
                <p className="text-3xl font-black text-secondary">
                  ${totalFixedPayments.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-light mb-2">
                  Total Comprometido
                </p>
                <p className="text-3xl font-black text-accent">
                  ${(totalExpenses + totalFixedPayments).toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

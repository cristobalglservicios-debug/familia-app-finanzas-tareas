import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit2,
  Trash2,
  LogOut,
  Users,
  BarChart3,
  MessageSquare,
  Save,
  X,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: number;
  title: string;
  description: string;
  points: number;
  frequency: string;
  category: string;
}

interface Child {
  id: number;
  name: string;
  age: number;
  tasks: Task[];
}

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

interface FixedPayment {
  id: number;
  title: string;
  amount: number;
  dueDate: number;
  paid: boolean;
}

const children: Child[] = [
  {
    id: 1,
    name: "Fabio",
    age: 15,
    tasks: [
      {
        id: 1,
        title: "Hacer la cama",
        description: "Ordena tu cama cada mañana",
        points: 10,
        frequency: "daily",
        category: "routine",
      },
      {
        id: 2,
        title: "Terminar tareas escolares",
        description: "Completa todas tus tareas de la escuela",
        points: 25,
        frequency: "daily",
        category: "study",
      },
      {
        id: 3,
        title: "Ayudar en la cocina",
        description: "Ayuda a preparar la cena",
        points: 20,
        frequency: "daily",
        category: "household",
      },
    ],
  },
  {
    id: 2,
    name: "Frida",
    age: 11,
    tasks: [
      {
        id: 1,
        title: "Hacer la cama",
        description: "Ordena tu cama cada mañana",
        points: 10,
        frequency: "daily",
        category: "routine",
      },
      {
        id: 2,
        title: "Tareas de la escuela",
        description: "Completa todas tus tareas",
        points: 20,
        frequency: "daily",
        category: "study",
      },
    ],
  },
  {
    id: 3,
    name: "Julieta",
    age: 10,
    tasks: [
      {
        id: 1,
        title: "Hacer la cama",
        description: "Ordena tu cama cada mañana",
        points: 10,
        frequency: "daily",
        category: "routine",
      },
    ],
  },
];

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"tasks" | "finances">("tasks");
  const [childrenData, setChildrenData] = useState<Child[]>(children);
  const [selectedChildId, setSelectedChildId] = useState(1);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, title: "Supermercado", amount: 150, category: "alimentacion", date: "2026-04-25" },
    { id: 2, title: "Gasolina", amount: 80, category: "transporte", date: "2026-04-24" },
  ]);
  const [fixedPayments, setFixedPayments] = useState<FixedPayment[]>([
    { id: 1, title: "Renta", amount: 1200, dueDate: 1, paid: true },
    { id: 2, title: "Luz", amount: 150, dueDate: 15, paid: false },
    { id: 3, title: "Internet", amount: 60, dueDate: 10, paid: true },
    { id: 4, title: "Agua", amount: 80, dueDate: 20, paid: false },
  ]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    points: 10,
    frequency: "daily",
    category: "routine",
  });
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: 0,
    category: "alimentacion",
  });
  const [weeklyBudget, setWeeklyBudget] = useState(500);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const selectedChild = childrenData.find((c) => c.id === selectedChildId);
  const selectedChildTasks = selectedChild?.tasks || [];

  // Calcular gastos
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const expensesByCategory = expenses.reduce(
    (acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error("El título de la tarea es requerido");
      return;
    }

    const task: Task = {
      id: Math.max(...selectedChildTasks.map((t) => t.id), 0) + 1,
      ...newTask,
    };

    setChildrenData((prev) =>
      prev.map((child) =>
        child.id === selectedChildId
          ? { ...child, tasks: [...child.tasks, task] }
          : child
      )
    );

    setNewTask({
      title: "",
      description: "",
      points: 10,
      frequency: "daily",
      category: "routine",
    });
    setShowNewTaskForm(false);
    toast.success("Tarea agregada exitosamente");
  };

  const handleAddExpense = () => {
    if (!newExpense.title.trim() || newExpense.amount <= 0) {
      toast.error("Completa todos los campos correctamente");
      return;
    }

    const expense: Expense = {
      id: Math.max(...expenses.map((e) => e.id), 0) + 1,
      ...newExpense,
      date: new Date().toISOString().split("T")[0],
    };

    setExpenses([...expenses, expense]);
    setNewExpense({ title: "", amount: 0, category: "alimentacion" });
    toast.success("Gasto registrado");
  };

  const handleDeleteTask = (taskId: number) => {
    setChildrenData((prev) =>
      prev.map((child) =>
        child.id === selectedChildId
          ? {
              ...child,
              tasks: child.tasks.filter((t) => t.id !== taskId),
            }
          : child
      )
    );
    toast.success("Tarea eliminada");
  };

  const handleDeleteExpense = (expenseId: number) => {
    setExpenses(expenses.filter((e) => e.id !== expenseId));
    toast.success("Gasto eliminado");
  };

  const handleTogglePayment = (paymentId: number) => {
    setFixedPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId ? { ...p, paid: !p.paid } : p
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    toast.success("Sesión cerrada");
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/40 to-secondary/40 p-6 md:p-8 border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="heading-primary mb-1">Panel de Papás</h1>
              <p className="text-muted-foreground font-light">
                Gestiona tareas y finanzas del hogar
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border">
            <Button
              onClick={() => setActiveTab("tasks")}
              className={`px-4 py-2 font-semibold border-b-2 transition-all ${
                activeTab === "tasks"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              variant="ghost"
            >
              <Users className="w-4 h-4 mr-2" />
              Tareas
            </Button>
            <Button
              onClick={() => setActiveTab("finances")}
              className={`px-4 py-2 font-semibold border-b-2 transition-all ${
                activeTab === "finances"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              variant="ghost"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Finanzas
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* TAREAS TAB */}
        {activeTab === "tasks" && (
          <>
            {/* Child Selection */}
            <div className="mb-8">
              <h2 className="heading-secondary mb-4">Selecciona un Hijo</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {childrenData.map((child) => (
                  <Card
                    key={child.id}
                    onClick={() => setSelectedChildId(child.id)}
                    className={`p-4 border-2 cursor-pointer transition-all ${
                      selectedChildId === child.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <h3 className="font-semibold text-lg mb-1">{child.name}</h3>
                    <p className="text-muted-foreground font-light mb-2">
                      {child.age} años
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {child.tasks.length} tareas
                    </p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tasks Management */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="heading-secondary">
                  Tareas de {selectedChild?.name}
                </h2>
                <Button
                  onClick={() => setShowNewTaskForm(!showNewTaskForm)}
                  className="bg-primary text-primary-foreground hover:opacity-90 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nueva Tarea
                </Button>
              </div>

              {/* New Task Form */}
              {showNewTaskForm && (
                <Card className="p-6 mb-6 border-2 border-primary/30">
                  <h3 className="font-semibold text-lg mb-4">Crear Nueva Tarea</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Título
                      </label>
                      <Input
                        placeholder="Ej: Lavar los platos"
                        value={newTask.title}
                        onChange={(e) =>
                          setNewTask({ ...newTask, title: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Descripción
                      </label>
                      <Input
                        placeholder="Ej: Lava todos los platos después de comer"
                        value={newTask.description}
                        onChange={(e) =>
                          setNewTask({ ...newTask, description: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1">
                          Puntos
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={newTask.points}
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              points: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-1">
                          Frecuencia
                        </label>
                        <select
                          value={newTask.frequency}
                          onChange={(e) =>
                            setNewTask({ ...newTask, frequency: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-border rounded-md"
                        >
                          <option value="daily">Diaria</option>
                          <option value="weekly">Semanal</option>
                          <option value="monthly">Mensual</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleAddTask}
                        className="flex-1 bg-primary text-primary-foreground hover:opacity-90 gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Guardar Tarea
                      </Button>
                      <Button
                        onClick={() => setShowNewTaskForm(false)}
                        variant="outline"
                        className="flex-1 gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Tasks List */}
              <div className="space-y-3">
                {selectedChildTasks.length === 0 ? (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground font-light">
                      No hay tareas aún. ¡Crea la primera!
                    </p>
                  </Card>
                ) : (
                  selectedChildTasks.map((task) => (
                    <Card
                      key={task.id}
                      className="p-4 border-2 border-border hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">
                            {task.title}
                          </h3>
                          <p className="text-muted-foreground font-light mb-2">
                            {task.description}
                          </p>
                          <div className="flex gap-4 text-sm">
                            <span className="font-semibold text-primary">
                              {task.points} pts
                            </span>
                            <span className="text-muted-foreground capitalize">
                              {task.frequency}
                            </span>
                            <span className="text-muted-foreground capitalize">
                              {task.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleDeleteTask(task.id)}
                            variant="destructive"
                            size="sm"
                            className="gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* FINANZAS TAB */}
        {activeTab === "finances" && (
          <>
            {/* Presupuesto Semanal */}
            <div className="mb-8">
              <h2 className="heading-secondary mb-4">Presupuesto Semanal</h2>
              <Card className="p-6 border-2 border-primary/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-muted-foreground font-light mb-1">
                      Presupuesto Disponible
                    </p>
                    <p className="heading-primary text-primary">
                      ${weeklyBudget - totalExpenses}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground font-light mb-1">
                      Gastado esta semana
                    </p>
                    <p className="heading-primary text-secondary">
                      ${totalExpenses}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-border rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-full transition-all"
                    style={{
                      width: `${Math.min((totalExpenses / weeklyBudget) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {Math.round((totalExpenses / weeklyBudget) * 100)}% del presupuesto
                </p>
              </Card>
            </div>

            {/* Gastos */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="heading-secondary">Registrar Gasto</h2>
              </div>
              <Card className="p-6 mb-6 border-2 border-primary/30">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Descripción
                    </label>
                    <Input
                      placeholder="Ej: Supermercado"
                      value={newExpense.title}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Monto
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={newExpense.amount}
                        onChange={(e) =>
                          setNewExpense({
                            ...newExpense,
                            amount: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Categoría
                      </label>
                      <select
                        value={newExpense.category}
                        onChange={(e) =>
                          setNewExpense({
                            ...newExpense,
                            category: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-border rounded-md"
                      >
                        <option value="alimentacion">Alimentación</option>
                        <option value="servicios">Servicios</option>
                        <option value="transporte">Transporte</option>
                        <option value="ocio">Ocio</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddExpense}
                    className="w-full bg-primary text-primary-foreground hover:opacity-90 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Registrar Gasto
                  </Button>
                </div>
              </Card>

              {/* Gastos por Categoría */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {Object.entries(expensesByCategory).map(([category, amount]) => (
                  <Card key={category} className="p-4 text-center">
                    <p className="text-muted-foreground font-light text-sm mb-1 capitalize">
                      {category}
                    </p>
                    <p className="heading-secondary text-primary">${amount}</p>
                  </Card>
                ))}
              </div>

              {/* Lista de Gastos */}
              <div className="space-y-2">
                {expenses.map((expense) => (
                  <Card
                    key={expense.id}
                    className="p-3 flex items-center justify-between border-border hover:border-primary/50"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{expense.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {expense.category} • {expense.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-primary">${expense.amount}</p>
                      <Button
                        onClick={() => handleDeleteExpense(expense.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pagos Fijos */}
            <div>
              <h2 className="heading-secondary mb-4">Pagos Fijos del Mes</h2>
              <div className="space-y-3">
                {fixedPayments.map((payment) => (
                  <Card
                    key={payment.id}
                    className={`p-4 border-2 cursor-pointer transition-all ${
                      payment.paid
                        ? "border-green-300 bg-green-50"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleTogglePayment(payment.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold">{payment.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Vence el día {payment.dueDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">${payment.amount}</p>
                        <p
                          className={`text-xs font-semibold ${
                            payment.paid ? "text-green-600" : "text-orange-600"
                          }`}
                        >
                          {payment.paid ? "✓ Pagado" : "Pendiente"}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

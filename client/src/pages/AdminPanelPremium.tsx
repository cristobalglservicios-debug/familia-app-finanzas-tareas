import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useFamilyWall } from "@/contexts/FamilyWallContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  LogOut,
  Users,
  DollarSign,
  MessageSquare,
  Save,
  X,
  TrendingUp,
  Image,
  XCircle,
  ArrowUp,
  ArrowDown,
  Calendar,
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

export default function AdminPanelPremium() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"tasks" | "finances" | "wall">("tasks");
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
  const [editingBudget, setEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(500);
  const [budgetPeriod, setBudgetPeriod] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');

  const [newWallPost, setNewWallPost] = useState("");
  const [newWallImages, setNewWallImages] = useState<string[]>([]);
  const { posts: wallPosts, addPost: addWallPost } = useFamilyWall();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const selectedChild = childrenData.find((c) => c.id === selectedChildId);
      if (selectedChild) {
        const updatedChildren = childrenData.map((c) =>
          c.id === selectedChildId
            ? {
                ...c,
                tasks: [
                  ...c.tasks,
                  {
                    ...newTask,
                    id: Math.max(...c.tasks.map((t) => t.id), 0) + 1,
                  },
                ],
              }
            : c
        );
        setChildrenData(updatedChildren);
        setNewTask({
          title: "",
          description: "",
          points: 10,
          frequency: "daily",
          category: "routine",
        });
        setShowNewTaskForm(false);
        toast.success("Tarea agregada exitosamente");
      }
    }
  };

  const handleDeleteTask = (taskId: number) => {
    const updatedChildren = childrenData.map((c) =>
      c.id === selectedChildId
        ? { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) }
        : c
    );
    setChildrenData(updatedChildren);
    toast.success("Tarea eliminada");
  };

  const handleAddExpense = () => {
    if (newExpense.title.trim() && newExpense.amount > 0) {
      setExpenses([
        ...expenses,
        {
          id: Math.max(...expenses.map((e) => e.id), 0) + 1,
          ...newExpense,
          date: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewExpense({ title: "", amount: 0, category: "alimentacion" });
      toast.success("Gasto registrado");
    }
  };

  const handleTogglePayment = (paymentId: number) => {
    setFixedPayments(
      fixedPayments.map((p) =>
        p.id === paymentId ? { ...p, paid: !p.paid } : p
      )
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setNewWallImages([...newWallImages, event.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setNewWallImages(newWallImages.filter((_, i) => i !== index));
  };

  const handleSaveBudget = () => {
    setWeeklyBudget(tempBudget);
    setEditingBudget(false);
    toast.success('Presupuesto actualizado');
  };

  const getPendingPayments = () => {
    return fixedPayments.filter(p => !p.paid);
  };

  const getTotalPendingPayments = () => {
    return getPendingPayments().reduce((sum, p) => sum + p.amount, 0);
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const expensesByCategory = expenses.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const selectedChild = childrenData.find((c) => c.id === selectedChildId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/3 to-secondary/3">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-primary/50 via-secondary/30 to-accent/30 p-8 sticky top-0 z-40 border-b border-primary/20 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="heading-primary text-4xl mb-1">Panel de Papás</h1>
              <p className="text-muted-foreground font-light">Gestiona finanzas, tareas y el muro familiar</p>
            </div>
            <Button
              onClick={() => {
                localStorage.removeItem("adminLoggedIn");
                setLocation("/welcome");
              }}
              className="gap-2 bg-red-500/20 text-red-600 hover:bg-red-500/30 border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </Button>
          </div>

          {/* Premium Tabs */}
          <div className="flex gap-2 flex-wrap items-center">
            <Button
              onClick={() => setLocation("/admin/dashboard")}
              className="gap-2 bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white font-semibold"
            >
              📊 Dashboard Familia
            </Button>
            <div className="flex gap-1 bg-background/40 backdrop-blur p-1 rounded-lg w-fit">
              {[
                { id: "tasks", label: "Tareas", icon: Users },
                { id: "finances", label: "Finanzas", icon: DollarSign },
                { id: "wall", label: "Muro", icon: MessageSquare },
              ].map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`gap-2 transition-all ${
                    activeTab === id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Finances Tab - Premium Design */}
        {activeTab === "finances" && (
          <div className="space-y-8">
            {/* KPI Cards - Premium */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Presupuesto */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                <Card className="relative p-8 border border-primary/30 hover:border-primary/60 transition-all hover:shadow-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <button
                      onClick={() => {
                        setEditingBudget(!editingBudget);
                        setTempBudget(weeklyBudget);
                      }}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      {editingBudget ? 'Cancelar' : 'Editar'}
                    </button>
                  </div>
                  <p className="text-muted-foreground font-light text-sm mb-2">Presupuesto Semanal</p>
                  {editingBudget ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={tempBudget}
                        onChange={(e) => setTempBudget(parseFloat(e.target.value) || 0)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSaveBudget}
                        size="sm"
                        className="bg-primary text-primary-foreground"
                      >
                        Guardar
                      </Button>
                    </div>
                  ) : (
                    <p className="text-4xl font-black text-primary">${weeklyBudget}</p>
                  )}
                </Card>
              </div>

              {/* Gastos */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                <Card className="relative p-8 border border-secondary/30 hover:border-secondary/60 transition-all hover:shadow-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center">
                      <ArrowUp className="w-6 h-6 text-secondary" />
                    </div>
                  </div>
                  <p className="text-muted-foreground font-light text-sm mb-2">Gastos Registrados</p>
                  <p className="text-4xl font-black text-secondary">${totalExpenses.toFixed(2)}</p>
                </Card>
              </div>

              {/* Disponible */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                <Card className="relative p-8 border border-green-300/30 hover:border-green-300/60 transition-all hover:shadow-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/30 to-green-500/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-muted-foreground font-light text-sm mb-2">Disponible</p>
                  <p className="text-4xl font-black text-green-600">${(weeklyBudget - totalExpenses).toFixed(2)}</p>
                </Card>
              </div>

              {/* Pagos Pendientes */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                <Card className="relative p-8 border border-red-300/30 hover:border-red-300/60 transition-all hover:shadow-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/30 to-red-500/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <p className="text-muted-foreground font-light text-sm mb-2">Pagos Pendientes</p>
                  <p className="text-4xl font-black text-red-600">${getTotalPendingPayments().toFixed(2)}</p>
                </Card>
              </div>
            </div>

            {/* Período Selector */}
            <div className="flex gap-3">
              {[
                { value: 'weekly', label: 'Semanal' },
                { value: 'biweekly', label: 'Quincenal' },
                { value: 'monthly', label: 'Mensual' },
              ].map(({ value, label }) => (
                <Button
                  key={value}
                  onClick={() => setBudgetPeriod(value as any)}
                  className={`flex-1 transition-all ${
                    budgetPeriod === value
                      ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Registrar Gasto - Premium */}
            <Card className="p-8 border border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h3 className="heading-secondary text-2xl mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Registrar Gasto
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Descripción</label>
                  <Input
                    placeholder="Ej: Supermercado, Gasolina..."
                    value={newExpense.title}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, title: e.target.value })
                    }
                    className="border-primary/30 focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Monto</label>
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
                      className="border-primary/30 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Categoría</label>
                    <select
                      value={newExpense.category}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-primary/30 rounded-md focus:border-primary bg-background"
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
                  className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg gap-2 py-6 text-base font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Registrar Gasto
                </Button>
              </div>
            </Card>

            {/* Gastos por Categoría */}
            <div>
              <h3 className="heading-secondary text-2xl mb-6">Gastos por Categoría</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(expensesByCategory).map(([category, amount]) => (
                  <Card key={category} className="p-6 border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
                    <p className="text-muted-foreground font-light text-sm mb-2">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </p>
                    <p className="heading-secondary text-2xl text-primary">${amount.toFixed(2)}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pagos Fijos */}
            <div>
              <h3 className="heading-secondary text-2xl mb-6">Pagos Fijos</h3>
              <div className="space-y-3">
                {fixedPayments.map((payment) => (
                  <Card
                    key={payment.id}
                    className={`p-6 border transition-all cursor-pointer hover:shadow-lg ${
                      payment.paid
                        ? 'border-green-300/50 bg-green-50/30'
                        : 'border-red-300/50 bg-red-50/30'
                    }`}
                    onClick={() => handleTogglePayment(payment.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{payment.title}</h4>
                        <p className="text-muted-foreground font-light text-sm">
                          Vencimiento: día {payment.dueDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="heading-secondary text-2xl">${payment.amount.toFixed(2)}</p>
                        <p className={`text-xs font-semibold ${payment.paid ? 'text-green-600' : 'text-red-600'}`}>
                          {payment.paid ? '✓ Pagado' : '⏳ Pendiente'}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="space-y-6">
            {/* Child Selection */}
            <div>
              <h2 className="heading-secondary text-2xl mb-4">Selecciona un hijo</h2>
              <div className="grid grid-cols-3 gap-3">
                {childrenData.map((child) => (
                  <Button
                    key={child.id}
                    onClick={() => setSelectedChildId(child.id)}
                    className={`py-6 transition-all font-semibold ${
                      selectedChildId === child.id
                        ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {child.name} ({child.age}a)
                  </Button>
                ))}
              </div>
            </div>

            {/* Tasks List */}
            {selectedChild && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-secondary text-2xl">Tareas de {selectedChild.name}</h2>
                  <Button
                    onClick={() => setShowNewTaskForm(!showNewTaskForm)}
                    className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Nueva Tarea
                  </Button>
                </div>

                {/* New Task Form */}
                {showNewTaskForm && (
                  <Card className="p-6 mb-6 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Título</label>
                        <Input
                          placeholder="Ej: Hacer la cama"
                          value={newTask.title}
                          onChange={(e) =>
                            setNewTask({ ...newTask, title: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Descripción</label>
                        <Input
                          placeholder="Ej: Ordena tu cama"
                          value={newTask.description}
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Puntos</label>
                          <Input
                            type="number"
                            min="1"
                            value={newTask.points}
                            onChange={(e) =>
                              setNewTask({
                                ...newTask,
                                points: parseInt(e.target.value) || 10,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Frecuencia</label>
                          <select
                            value={newTask.frequency}
                            onChange={(e) =>
                              setNewTask({
                                ...newTask,
                                frequency: e.target.value,
                              })
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
                          className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Guardar
                        </Button>
                        <Button
                          onClick={() => setShowNewTaskForm(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Tasks Grid */}
                <div className="space-y-3">
                  {selectedChild.tasks.map((task) => (
                    <Card
                      key={task.id}
                      className="p-6 border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{task.title}</h3>
                          <p className="text-muted-foreground font-light">{task.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {task.points} pts • {task.frequency}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleDeleteTask(task.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wall Tab */}
        {activeTab === "wall" && (
          <div className="space-y-6">
            <Card className="p-8 border border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h3 className="heading-secondary text-2xl mb-6">Publicar en el Muro Familiar</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Mensaje</label>
                  <textarea
                    placeholder="Escribe un mensaje motivador..."
                    value={newWallPost}
                    onChange={(e) => setNewWallPost(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg resize-none focus:border-primary focus:ring-1 focus:ring-primary"
                    rows={4}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Fotos (opcional)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="wall-image-upload"
                  />
                  <label
                    htmlFor="wall-image-upload"
                    className="block w-full p-6 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:border-primary/60 transition-all text-center"
                  >
                    <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-semibold">Haz clic para subir fotos</p>
                  </label>
                </div>

                {/* Image Preview */}
                {newWallImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {newWallImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img} alt={`Preview ${idx}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => {
                    if (newWallPost.trim()) {
                      addWallPost({
                        childId: 0,
                        childName: "Papás",
                        author: 'parent',
                        title: "Mensaje familiar",
                        description: newWallPost,
                        images: newWallImages,
                      });
                      setNewWallPost("");
                      setNewWallImages([]);
                      toast.success("¡Publicación compartida!");
                    }
                  }}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg py-6 text-base font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Publicar en el Muro
                </Button>
              </div>
            </Card>

            {/* Wall Posts */}
            <div className="space-y-4">
              <h3 className="heading-secondary text-2xl">Muro Familiar</h3>
              {wallPosts.map((post) => (
                <Card key={post.id} className="p-6 border border-border hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                      {post.childName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{post.childName}</h4>
                      <p className="text-muted-foreground text-sm">{post.timestamp}</p>
                      <p className="mt-2">{post.description}</p>
                      {post.images && post.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-3">
                          {post.images.map((img, idx) => (
                            <img key={idx} src={img} alt={`Post ${idx}`} className="w-full h-20 object-cover rounded-lg" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

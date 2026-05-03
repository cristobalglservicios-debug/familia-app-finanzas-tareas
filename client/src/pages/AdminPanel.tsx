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
  Image,
  XCircle,
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

interface WallPost {
  id: number;
  childId: number;
  childName: string;
  title: string;
  description: string;
  images: string[];
  likes: number;
  comments: Array<{ id: number; author: string; text: string; emoji: string }>;
  timestamp: string;
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
  const [wallPosts, setWallPosts] = useState<WallPost[]>([
    {
      id: 1,
      childId: 1,
      childName: "Fabio",
      title: "¡Completé todas mis tareas! 🎉",
      description: "Hoy fue un día increíble, completé todas mis tareas y gané 55 puntos",
      images: [],
      likes: 12,
      comments: [
        { id: 1, author: "Frida", text: "¡Qué bien! 🙌", emoji: "👏" },
        { id: 2, author: "Mamá", text: "¡Muy orgullosa de ti!", emoji: "❤️" },
      ],
      timestamp: "Hace 2 horas",
    },
  ]);
  const [newWallPost, setNewWallPost] = useState("");
  const [newWallImages, setNewWallImages] = useState<string[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      setLocation("/admin-login");
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
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/40 to-secondary/40 p-6 sticky top-0 z-40 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="heading-primary">Panel de Papás</h1>
            <Button
              onClick={() => {
                localStorage.removeItem("adminLoggedIn");
                setLocation("/");
              }}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Salir
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
            <Button
              onClick={() => setActiveTab("wall")}
              className={`px-4 py-2 font-semibold border-b-2 transition-all ${
                activeTab === "wall"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              variant="ghost"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Muro Familiar
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <>
            <div className="space-y-6">
              {/* Child Selection */}
              <div>
                <h2 className="heading-secondary mb-3">Selecciona un hijo</h2>
                <div className="grid grid-cols-3 gap-3">
                  {childrenData.map((child) => (
                    <Button
                      key={child.id}
                      onClick={() => setSelectedChildId(child.id)}
                      className={`py-4 transition-all ${
                        selectedChildId === child.id
                          ? "bg-primary text-primary-foreground"
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
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="heading-secondary">Tareas de {selectedChild.name}</h2>
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
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-1">
                            Título
                          </label>
                          <Input
                            placeholder="Ej: Hacer la cama"
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
                                  points: parseInt(e.target.value) || 10,
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
                        className="p-4 border-2 border-border hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{task.title}</h3>
                            <p className="text-muted-foreground font-light">
                              {task.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {task.points} pts • {task.frequency}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleDeleteTask(task.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Finances Tab */}
        {activeTab === "finances" && (
          <>
            <div className="space-y-6">
              {/* Budget Overview */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-6 border-2 border-primary/30">
                  <p className="text-muted-foreground font-light text-sm mb-1">
                    Presupuesto Semanal
                  </p>
                  <p className="heading-secondary text-primary">${weeklyBudget}</p>
                </Card>
                <Card className="p-6 border-2 border-secondary/30">
                  <p className="text-muted-foreground font-light text-sm mb-1">
                    Gastos Registrados
                  </p>
                  <p className="heading-secondary text-secondary">${totalExpenses.toFixed(2)}</p>
                </Card>
                <Card className="p-6 border-2 border-accent/30">
                  <p className="text-muted-foreground font-light text-sm mb-1">
                    Disponible
                  </p>
                  <p className="heading-secondary text-accent">
                    ${(weeklyBudget - totalExpenses).toFixed(2)}
                  </p>
                </Card>
              </div>

              {/* Add Expense */}
              <Card className="p-6 border-2 border-primary/30">
                <h3 className="font-semibold text-lg mb-4">Registrar Gasto</h3>
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

              {/* Expenses by Category */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Gastos por Categoría</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(expensesByCategory).map(([category, amount]) => (
                    <Card key={category} className="p-4 border-2 border-border">
                      <p className="text-muted-foreground font-light text-sm mb-1">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </p>
                      <p className="heading-secondary text-primary">${amount.toFixed(2)}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Fixed Payments */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Pagos Fijos del Mes</h3>
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
            </div>
          </>
        )}

        {/* Wall Tab */}
        {activeTab === "wall" && (
          <>
            <div className="space-y-6">
              {/* New Post */}
              <Card className="p-6 border-2 border-primary/30">
                <h3 className="font-semibold text-lg mb-3">Publica un mensaje para la familia</h3>
                <textarea
                  placeholder="¡Comparte un mensaje de motivación o celebra los logros de tus hijos!"
                  value={newWallPost}
                  onChange={(e) => setNewWallPost(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg mb-3 font-light"
                  rows={3}
                />

                {/* Image Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Agregar Fotos</label>
                  <div className="flex gap-2 mb-3">
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
                      className="flex-1 px-4 py-2 border-2 border-dashed border-primary/50 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                    >
                      <Image className="w-4 h-4" />
                      Seleccionar fotos
                    </label>
                  </div>

                  {/* Image Preview */}
                  {newWallImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {newWallImages.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={img}
                            alt={`Preview ${idx}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
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
                </div>

                <Button
                  onClick={() => {
                    if (newWallPost.trim() || newWallImages.length > 0) {
                      toast.success("¡Publicación compartida! 🎉");
                      setNewWallPost("");
                      setNewWallImages([]);
                    }
                  }}
                  className="w-full bg-primary text-primary-foreground hover:opacity-90"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Publicar
                </Button>
              </Card>

              {/* Posts */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Muro Familiar</h3>
                {wallPosts.map((post) => (
                  <Card key={post.id} className="p-6 border-2 border-border hover:border-primary/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {post.childName[0]}
                      </div>
                      <div>
                        <p className="font-semibold">{post.childName}</p>
                        <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                      </div>
                    </div>

                    <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                    <p className="text-muted-foreground font-light mb-4">{post.description}</p>

                    {/* Images */}
                    {post.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {post.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Post ${idx}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}

                    {/* Interactions */}
                    <div className="flex gap-6 mb-4 pb-4 border-b border-border">
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        ❤️ <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        💬 <span className="text-sm">{post.comments.length}</span>
                      </button>
                    </div>

                    {/* Comments */}
                    <div className="space-y-3 mb-4">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="p-3 bg-background rounded-lg">
                          <p className="font-semibold text-sm mb-1">{comment.author}</p>
                          <p className="text-sm text-muted-foreground">{comment.text} {comment.emoji}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Escribe un comentario..."
                        className="flex-1 px-3 py-2 border border-border rounded-lg text-sm"
                      />
                      <Button variant="outline" size="sm">
                        😊
                      </Button>
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

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
  const [childrenData, setChildrenData] = useState<Child[]>(children);
  const [selectedChildId, setSelectedChildId] = useState(1);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    points: 10,
    frequency: "daily",
    category: "routine",
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const selectedChild = childrenData.find((c) => c.id === selectedChildId);
  const selectedChildTasks = selectedChild?.tasks || [];

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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="heading-primary mb-1">Panel de Papás</h1>
              <p className="text-muted-foreground font-light">
                Gestiona tareas, finanzas y supervisa a tus hijos
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

          {/* Navigation Tabs */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setLocation("/admin/dashboard")}
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              onClick={() => setLocation("/admin/tasks")}
              className="bg-secondary text-secondary-foreground hover:opacity-90"
            >
              <Users className="w-4 h-4 mr-2" />
              Tareas
            </Button>
            <Button
              onClick={() => setLocation("/admin/family-wall")}
              className="bg-accent text-accent-foreground hover:opacity-90"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Muro Familiar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 md:p-8">
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
                        onClick={() => setEditingTaskId(task.id)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
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
      </div>
    </div>
  );
}

import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  CheckCircle2,
  Circle,
  Zap,
  Trophy,
  Flame,
  Star,
  Gift,
  ArrowRight,
} from "lucide-react";

interface ChildTasksProps {
  childId?: number;
  childName?: string;
}

const childrenData: Record<number, any> = {
  1: {
    name: "Fabio",
    age: 15,
    totalPoints: 2450,
    currentLevel: 5,
    currentStreak: 7,
    longestStreak: 12,
    avatarColor: "#A8D5E2",
  },
  2: {
    name: "Frida",
    age: 11,
    totalPoints: 1890,
    currentLevel: 4,
    currentStreak: 5,
    longestStreak: 9,
    avatarColor: "#F5C6D8",
  },
  3: {
    name: "Julieta",
    age: 10,
    totalPoints: 1650,
    currentLevel: 3,
    currentStreak: 3,
    longestStreak: 8,
    avatarColor: "#D4F1D4",
  },
};

export default function ChildTasks({ childId = 1 }: ChildTasksProps) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [completedToday, setCompletedToday] = useState(0);
  const [celebrationActive, setCelebrationActive] = useState(false);

  const childStats = childrenData[childId] || childrenData[1];

  const tasksByChild: Record<number, any[]> = {
    1: [
      {
        id: 1,
        title: "Hacer la cama",
        description: "Ordena tu cama cada mañana",
        points: 10,
        frequency: "daily",
        completed: true,
        category: "routine",
      },
      {
        id: 2,
        title: "Terminar tareas escolares",
        description: "Completa todas tus tareas de la escuela",
        points: 25,
        frequency: "daily",
        completed: true,
        category: "study",
      },
      {
        id: 3,
        title: "Ayudar en la cocina",
        description: "Ayuda a preparar la cena",
        points: 20,
        frequency: "daily",
        completed: false,
        category: "household",
      },
      {
        id: 4,
        title: "Estudiar para examen",
        description: "Dedica 1 hora a estudiar",
        points: 35,
        frequency: "daily",
        completed: false,
        category: "learning",
      },
      {
        id: 5,
        title: "Lavar el coche",
        description: "Lava el coche de la familia",
        points: 100,
        frequency: "weekly",
        completed: false,
        category: "special",
      },
    ],
    2: [
      {
        id: 1,
        title: "Hacer la cama",
        description: "Ordena tu cama cada mañana",
        points: 10,
        frequency: "daily",
        completed: true,
        category: "routine",
      },
      {
        id: 2,
        title: "Tareas de la escuela",
        description: "Completa todas tus tareas",
        points: 20,
        frequency: "daily",
        completed: true,
        category: "study",
      },
      {
        id: 3,
        title: "Ayudar a mamá",
        description: "Ayuda en la cocina o limpieza",
        points: 15,
        frequency: "daily",
        completed: false,
        category: "household",
      },
      {
        id: 4,
        title: "Leer 20 minutos",
        description: "Lee un libro o revista",
        points: 12,
        frequency: "daily",
        completed: false,
        category: "learning",
      },
      {
        id: 5,
        title: "Pasear al perro",
        description: "Saca al perro a pasear",
        points: 30,
        frequency: "daily",
        completed: false,
        category: "special",
      },
    ],
    3: [
      {
        id: 1,
        title: "Hacer la cama",
        description: "Ordena tu cama cada mañana",
        points: 10,
        frequency: "daily",
        completed: true,
        category: "routine",
      },
      {
        id: 2,
        title: "Tareas de la escuela",
        description: "Completa todas tus tareas",
        points: 15,
        frequency: "daily",
        completed: true,
        category: "study",
      },
      {
        id: 3,
        title: "Ayudar en casa",
        description: "Ayuda a recoger la sala",
        points: 12,
        frequency: "daily",
        completed: false,
        category: "household",
      },
      {
        id: 4,
        title: "Leer 15 minutos",
        description: "Lee un cuento o revista",
        points: 10,
        frequency: "daily",
        completed: false,
        category: "learning",
      },
      {
        id: 5,
        title: "Jugar con hermanos",
        description: "Comparte tiempo con la familia",
        points: 20,
        frequency: "daily",
        completed: false,
        category: "special",
      },
    ],
  };

  const tasks = tasksByChild[childId] || tasksByChild[1];

  const rewards = [
    {
      id: 1,
      title: "30 min de iPad",
      cost: 50,
      icon: "📱",
      available: true,
    },
    {
      id: 2,
      title: "Película con la familia",
      cost: 150,
      icon: "🎬",
      available: true,
    },
    {
      id: 3,
      title: "Salida especial",
      cost: 300,
      icon: "🎡",
      available: true,
    },
    {
      id: 4,
      title: "Postre favorito",
      cost: 100,
      icon: "🍰",
      available: true,
    },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const handleCompleteTask = (taskId: number) => {
    setCompletedToday(completedToday + 1);
    setCelebrationActive(true);
    toast.success("¡Tarea completada! 🎉 +25 puntos");
    setTimeout(() => setCelebrationActive(false), 2000);
  };

  if (!isAuthenticated) return null;

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const pointsEarned = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.points, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background pb-20">
      {/* Celebration Animation */}
      {celebrationActive && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="text-6xl animate-bounce">🎉</div>
          <div className="text-6xl animate-bounce" style={{ animationDelay: "0.1s" }}>
            ⭐
          </div>
          <div className="text-6xl animate-bounce" style={{ animationDelay: "0.2s" }}>
            🎊
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-primary/40 to-secondary/40 p-6 md:p-8 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-lg"
                style={{ backgroundColor: childStats.avatarColor }}
              >
                {childStats.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="heading-primary mb-1">{childStats.name}</h1>
                <p className="text-muted-foreground font-light">
                  {childStats.age} años • Nivel {childStats.currentLevel}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setLocation("/family-wall")}
                className="bg-secondary text-secondary-foreground hover:opacity-90"
              >
                Ver Muro
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => {
                  localStorage.removeItem("selectedChildId");
                  setLocation("/");
                }}
                variant="outline"
              >
                Cambiar Niño
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-3">
            <Card className="p-3 bg-white/50 border-border">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Puntos</p>
                  <p className="font-black text-lg text-foreground">
                    {childStats.totalPoints}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-3 bg-white/50 border-border">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">Nivel</p>
                  <p className="font-black text-lg text-foreground">
                    {childStats.currentLevel}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-3 bg-white/50 border-border">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-destructive" />
                <div>
                  <p className="text-xs text-muted-foreground">Racha</p>
                  <p className="font-black text-lg text-foreground">
                    {childStats.currentStreak}d
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-3 bg-white/50 border-border">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Hoy</p>
                  <p className="font-black text-lg text-foreground">
                    {completedCount}/{totalTasks}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Streak Bonus Banner */}
        {childStats.currentStreak >= 3 && (
          <Card className="p-4 mb-6 bg-gradient-to-r from-destructive/20 to-destructive/10 border-destructive/30">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-destructive" />
              <div>
                <p className="font-semibold text-foreground">
                  ¡Racha de {childStats.currentStreak} días! 🔥
                </p>
                <p className="text-sm text-muted-foreground font-light">
                  Ganas +50 puntos bonus si completas todas las tareas hoy
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Tasks Section */}
        <div className="mb-8">
          <h2 className="heading-secondary mb-4">Tareas de Hoy</h2>
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className={`p-4 border-2 transition-all cursor-pointer hover:shadow-md ${
                  task.completed
                    ? "bg-primary/10 border-primary/30"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>

                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        task.completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-sm text-muted-foreground font-light">
                      {task.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="font-black text-primary">+{task.points}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Daily Summary */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="heading-secondary">Resumen del Día</h3>
            <span className="text-3xl font-black text-primary">
              {pointsEarned} pts
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all"
              style={{ width: `${(completedCount / totalTasks) * 100}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-3 font-light">
            {completedCount} de {totalTasks} tareas completadas
          </p>
        </Card>

        {/* Rewards Store */}
        <div>
          <h2 className="heading-secondary mb-4">Tienda de Recompensas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((reward) => {
              const canAfford = childStats.totalPoints >= reward.cost;
              return (
                <Card
                  key={reward.id}
                  className={`p-4 border-2 transition-all ${
                    canAfford
                      ? "border-primary/50 hover:border-primary cursor-pointer"
                      : "border-muted opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{reward.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground">
                          {reward.title}
                        </p>
                      </div>
                    </div>
                    <Gift className="w-5 h-5 text-secondary" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="font-black text-primary">
                        {reward.cost}
                      </span>
                    </div>
                    <Button
                      onClick={() => {
                        if (canAfford) {
                          toast.success(
                            `¡${reward.title} canjeado! 🎉`
                          );
                        } else {
                          toast.error("No tienes suficientes puntos");
                        }
                      }}
                      disabled={!canAfford}
                      className={
                        canAfford
                          ? "bg-secondary text-secondary-foreground hover:opacity-90"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }
                      size="sm"
                    >
                      {canAfford ? "Canjear" : "No hay puntos"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

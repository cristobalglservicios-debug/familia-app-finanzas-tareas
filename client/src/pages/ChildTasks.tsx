import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  RotateCcw,
} from "lucide-react";

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

interface Task {
  id: number;
  title: string;
  description: string;
  points: number;
  frequency: string;
  completed: boolean;
  category: string;
}

export default function ChildTasks({ childId = 1 }: { childId: number }) {
  const [, setLocation] = useLocation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [celebratingTaskId, setCelebratingTaskId] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);

  const childStats = childrenData[childId] || childrenData[1];

  const tasksByChild: Record<number, Task[]> = {
    1: [
      {
        id: 1,
        title: "Hacer la cama",
        description: "Ordena tu cama cada mañana",
        points: 10,
        frequency: "daily",
        completed: false,
        category: "routine",
      },
      {
        id: 2,
        title: "Terminar tareas escolares",
        description: "Completa todas tus tareas de la escuela",
        points: 25,
        frequency: "daily",
        completed: false,
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
        completed: false,
        category: "routine",
      },
      {
        id: 2,
        title: "Tareas de la escuela",
        description: "Completa todas tus tareas",
        points: 20,
        frequency: "daily",
        completed: false,
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
        completed: false,
        category: "routine",
      },
      {
        id: 2,
        title: "Tareas de la escuela",
        description: "Completa todas tus tareas",
        points: 15,
        frequency: "daily",
        completed: false,
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

  useEffect(() => {
    setTasks(tasksByChild[childId] || tasksByChild[1]);
  }, [childId]);

  const handleCompleteTask = (taskId: number, points: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    if (!tasks.find((t) => t.id === taskId)?.completed) {
      setCelebratingTaskId(taskId);
      setCelebrationActive(true);
      setTotalPoints((prev) => prev + points);
      toast.success(`¡Tarea completada! +${points} puntos 🎉`);
      setTimeout(() => {
        setCelebrationActive(false);
        setCelebratingTaskId(null);
      }, 2000);
    }
  };

  const handleReset = () => {
    setTasks((prevTasks) => prevTasks.map((task) => ({ ...task, completed: false })));
    setTotalPoints(0);
    toast.info("Tareas reiniciadas");
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = (completedCount / totalTasks) * 100;

  const rewards = [
    {
      id: 1,
      title: "30 min de iPad",
      cost: 50,
      icon: "📱",
    },
    {
      id: 2,
      title: "Película con la familia",
      cost: 150,
      icon: "🎬",
    },
    {
      id: 3,
      title: "Salida especial",
      cost: 300,
      icon: "🎡",
    },
    {
      id: 4,
      title: "Postre favorito",
      cost: 100,
      icon: "🍰",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background pb-20">
      {/* Celebration Animation */}
      {celebrationActive && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="text-8xl animate-bounce" style={{ animationDuration: "0.6s" }}>
            🎉
          </div>
          <div
            className="text-8xl animate-bounce absolute"
            style={{ animationDelay: "0.1s", animationDuration: "0.6s", left: "20%" }}
          >
            ⭐
          </div>
          <div
            className="text-8xl animate-bounce absolute"
            style={{ animationDelay: "0.2s", animationDuration: "0.6s", right: "20%" }}
          >
            🎊
          </div>
          <div
            className="text-6xl animate-bounce absolute"
            style={{ animationDelay: "0.3s", animationDuration: "0.6s", bottom: "30%" }}
          >
            ✨
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-primary/40 to-secondary/40 p-6 md:p-8 border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-lg transform hover:scale-110 transition-transform"
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
            <Card className="p-3 bg-white/50 border-border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Puntos Hoy</p>
                  <p className="font-black text-lg text-foreground">{totalPoints}</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 bg-white/50 border-border hover:shadow-md transition-shadow">
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

            <Card className="p-3 bg-white/50 border-border hover:shadow-md transition-shadow">
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

            <Card className="p-3 bg-white/50 border-border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Progreso</p>
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
          <Card className="p-4 mb-6 bg-gradient-to-r from-destructive/20 to-destructive/10 border-destructive/30 animate-pulse">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-destructive animate-bounce" />
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="heading-secondary">Tareas de Hoy</h2>
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 p-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg border border-primary/30">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">
                Progreso del día
              </span>
              <span className="text-sm font-black text-primary">
                {Math.round(completionPercentage)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card
                key={task.id}
                onClick={() => handleCompleteTask(task.id, task.points)}
                className={`p-4 border-2 transition-all cursor-pointer transform hover:scale-102 ${
                  task.completed
                    ? "bg-primary/15 border-primary/50 shadow-md"
                    : "border-border hover:border-primary/50 hover:shadow-md"
                } ${
                  celebratingTaskId === task.id
                    ? "scale-105 shadow-lg border-primary"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompleteTask(task.id, task.points);
                    }}
                    className="mt-1 flex-shrink-0 transition-transform hover:scale-125"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-8 h-8 text-primary animate-bounce" />
                    ) : (
                      <Circle className="w-8 h-8 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>

                  <div className="flex-1">
                    <p
                      className={`font-semibold text-lg ${
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

                  <div className="flex items-center gap-2 flex-shrink-0 bg-primary/10 px-3 py-2 rounded-lg">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="font-black text-primary text-lg">
                      +{task.points}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Rewards Store */}
        <div>
          <h2 className="heading-secondary mb-4">Tienda de Recompensas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((reward) => {
              const totalPointsAvailable = childStats.totalPoints + totalPoints;
              const canAfford = totalPointsAvailable >= reward.cost;
              return (
                <Card
                  key={reward.id}
                  className={`p-4 border-2 transition-all cursor-pointer hover:shadow-lg ${
                    canAfford
                      ? "border-primary/50 hover:border-primary hover:scale-105 transform"
                      : "border-muted opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{reward.icon}</span>
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
                      <span className="font-black text-primary text-lg">
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

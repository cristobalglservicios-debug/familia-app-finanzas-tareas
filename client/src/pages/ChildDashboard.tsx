import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Zap, Flame, Trophy } from "lucide-react";

interface ChildDashboardProps {
  childId: number;
}

export default function ChildDashboard({ childId }: ChildDashboardProps) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showCelebration, setShowCelebration] = useState(false);

  const childStatsQuery = trpc.gamification.getChildStats.useQuery(
    { childId },
    { enabled: isAuthenticated }
  );

  const tasksQuery = trpc.tasks.listByChild.useQuery(
    { childId },
    { enabled: isAuthenticated }
  );

  const completeTaskMutation = trpc.gamification.completeTask.useMutation({
    onSuccess: (data) => {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);
      toast.success(
        `¡Excelente! Ganaste ${data.pointsEarned} puntos${data.streakBonus > 0 ? ` + ${data.streakBonus} de bonificación` : ""}!`
      );
      tasksQuery.refetch();
      childStatsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Error al completar la tarea");
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated || !childStatsQuery.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  const stats = childStatsQuery.data;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header con información del niño */}
      <div className="bg-gradient-to-r from-primary/30 to-secondary/30 p-6 md:p-8 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white"
              style={{ backgroundColor: stats.avatarColor || "#A8D5E2" }}
            >
              {stats.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="heading-primary mb-1">{stats.name}</h1>
              <p className="text-muted-foreground font-light">{stats.age} años</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/50 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-muted-foreground">Puntos</span>
              </div>
              <p className="text-2xl font-black text-foreground">{stats.totalPoints}</p>
            </div>

            <div className="bg-white/50 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-secondary" />
                <span className="text-sm font-semibold text-muted-foreground">Nivel</span>
              </div>
              <p className="text-2xl font-black text-foreground">{stats.currentLevel}</p>
            </div>

            <div className="bg-white/50 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-semibold text-muted-foreground">Racha</span>
              </div>
              <p className="text-2xl font-black text-foreground">{stats.currentStreak} días</p>
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <div className="celebration-pulse text-6xl">🎉</div>
          <div className="celebration-pulse text-6xl ml-8">⭐</div>
          <div className="celebration-pulse text-6xl ml-4">✨</div>
        </div>
      )}

      {/* Tasks Section */}
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <h2 className="heading-secondary mb-6">Mis Tareas de Hoy</h2>

        {tasksQuery.isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando tareas...</p>
          </div>
        ) : tasksQuery.data && tasksQuery.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasksQuery.data.map((task) => (
              <Card
                key={task.id}
                className="p-6 hover:shadow-md transition-shadow border-2 border-border"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-black text-foreground mb-1">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-muted-foreground font-light">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="bg-primary/20 rounded-lg px-3 py-1 ml-4">
                    <p className="font-black text-primary text-sm">
                      +{task.pointsValue} pts
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() =>
                    completeTaskMutation.mutate({
                      taskId: task.id,
                      childId,
                    })
                  }
                  disabled={completeTaskMutation.isPending}
                  className="w-full bg-primary text-primary-foreground hover:opacity-90"
                >
                  {completeTaskMutation.isPending ? "Procesando..." : "Marcar Completada"}
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground font-light mb-4">
              No hay tareas para hoy. ¡Buen trabajo!
            </p>
            <div className="text-4xl">🎊</div>
          </Card>
        )}
      </div>
    </div>
  );
}

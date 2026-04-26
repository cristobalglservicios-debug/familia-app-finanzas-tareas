import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Gift, Smartphone, MapPin, Candy, Star } from "lucide-react";

interface RewardsStoreProps {
  childId: number;
  familyId: number;
}

const categoryIcons: Record<string, React.ReactNode> = {
  screen_time: <Smartphone className="w-6 h-6" />,
  outing: <MapPin className="w-6 h-6" />,
  treat: <Candy className="w-6 h-6" />,
  privilege: <Star className="w-6 h-6" />,
  other: <Gift className="w-6 h-6" />,
};

export default function RewardsStore({ childId, familyId }: RewardsStoreProps) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const childStatsQuery = trpc.gamification.getChildStats.useQuery(
    { childId },
    { enabled: isAuthenticated }
  );

  const rewardsQuery = trpc.rewards.list.useQuery(
    { familyId },
    { enabled: isAuthenticated }
  );

  const redeemMutation = trpc.rewards.redeem.useMutation({
    onSuccess: (data) => {
      toast.success(`¡Canjeado! Te quedan ${data.remainingPoints} puntos`);
      childStatsQuery.refetch();
      rewardsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Error al canjear recompensa");
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
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary/30 to-primary/30 p-6 md:p-8 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-primary mb-2">Tienda de Recompensas</h1>
          <div className="flex items-center gap-4 mt-6">
            <div className="bg-white/50 backdrop-blur rounded-lg px-6 py-3">
              <p className="text-sm text-muted-foreground font-light mb-1">Tus Puntos</p>
              <p className="text-3xl font-black text-primary">{stats.totalPoints}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {rewardsQuery.isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando recompensas...</p>
          </div>
        ) : rewardsQuery.data && rewardsQuery.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rewardsQuery.data.map((reward) => {
              const canAfford = stats.totalPoints >= reward.pointsCost;
              return (
                <Card
                  key={reward.id}
                  className={`p-6 border-2 transition-all ${
                    canAfford
                      ? "border-primary hover:shadow-lg"
                      : "border-muted opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-primary">
                      {categoryIcons[reward.category || "other"] || categoryIcons.other}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-foreground mb-1">
                        {reward.title}
                      </h3>
                      {reward.description && (
                        <p className="text-sm text-muted-foreground font-light">
                          {reward.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-secondary/20 rounded-lg px-4 py-2">
                      <p className="font-black text-secondary">
                        {reward.pointsCost} pts
                      </p>
                    </div>
                    {reward.quantity && (
                      <p className="text-sm text-muted-foreground font-light">
                        Quedan: {reward.quantity}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() =>
                      redeemMutation.mutate({
                        rewardId: reward.id,
                        childId,
                      })
                    }
                    disabled={!canAfford || redeemMutation.isPending}
                    className={`w-full ${
                      canAfford
                        ? "bg-secondary text-secondary-foreground hover:opacity-90"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {redeemMutation.isPending
                      ? "Procesando..."
                      : canAfford
                        ? "Canjear"
                        : "Puntos Insuficientes"}
                  </Button>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground font-light">
              No hay recompensas disponibles
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

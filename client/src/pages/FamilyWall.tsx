import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Heart, MessageCircle, Share2, Upload, Zap, Trophy } from "lucide-react";

interface FamilyWallProps {
  childId: number;
  familyId: number;
}

export default function FamilyWall({ childId, familyId }: FamilyWallProps) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showPostForm, setShowPostForm] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState<"achievement" | "photo" | "message" | "evidence">("message");

  const childStatsQuery = trpc.gamification.getChildStats.useQuery(
    { childId },
    { enabled: isAuthenticated }
  );

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
      <div className="bg-gradient-to-r from-primary/30 to-secondary/30 p-6 md:p-8 border-b border-border">
        <div className="max-w-2xl mx-auto">
          <h1 className="heading-primary mb-4">Muro Familiar</h1>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-white"
              style={{ backgroundColor: stats.avatarColor || "#A8D5E2" }}
            >
              {stats.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-foreground">{stats.name}</p>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-primary" />
                  {stats.totalPoints} pts
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-secondary" />
                  Nivel {stats.currentLevel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-6 md:p-8">
        {/* Post Form */}
        {showPostForm && (
          <Card className="p-6 mb-6 border-2 border-primary">
            <h2 className="heading-secondary mb-4">Compartir con la Familia</h2>
            <div className="space-y-4">
              <div>
                <label className="font-semibold mb-2 block text-sm">
                  Tipo de Publicación
                </label>
                <div className="flex gap-2 flex-wrap">
                  {(["achievement", "photo", "message", "evidence"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setPostType(type)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        postType === type
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-border"
                      }`}
                    >
                      {type === "achievement" && "🏆 Logro"}
                      {type === "photo" && "📸 Foto"}
                      {type === "message" && "💬 Mensaje"}
                      {type === "evidence" && "✅ Evidencia"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="content" className="font-semibold mb-2 block text-sm">
                  ¿Qué quieres compartir?
                </label>
                <Textarea
                  id="content"
                  placeholder="Escribe tu mensaje aquí..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="border-border min-h-24"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (postContent.trim()) {
                      toast.success("¡Publicación compartida! 🎉");
                      setPostContent("");
                      setShowPostForm(false);
                    } else {
                      toast.error("Escribe algo para compartir");
                    }
                  }}
                  className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
                >
                  Publicar
                </Button>
                <Button
                  onClick={() => setShowPostForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {!showPostForm && (
          <Button
            onClick={() => setShowPostForm(true)}
            className="w-full mb-6 bg-secondary text-secondary-foreground hover:opacity-90 py-6 font-semibold"
          >
            + Compartir con la Familia
          </Button>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {/* Sample posts - In production, these would come from the database */}
          <Card className="p-6 hover:shadow-lg transition-shadow border-border">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary">
                J
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Juan</p>
                <p className="text-xs text-muted-foreground">Hace 2 horas</p>
              </div>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                🏆 Logro
              </span>
            </div>

            <p className="text-foreground mb-4 font-light">
              ¡Completé todas mis tareas esta semana! 🎉 Mantuve mi racha de 7 días.
            </p>

            <div className="flex gap-4 text-muted-foreground text-sm">
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <Heart className="w-4 h-4" />
                <span>24</span>
              </button>
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>3</span>
              </button>
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-border">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center font-black text-secondary">
                M
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">María</p>
                <p className="text-xs text-muted-foreground">Hace 5 horas</p>
              </div>
              <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-semibold">
                📸 Foto
              </span>
            </div>

            <p className="text-foreground mb-4 font-light">
              ¡Ayudé a mamá a limpiar la casa! Fue divertido 🧹✨
            </p>

            <div className="flex gap-4 text-muted-foreground text-sm">
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <Heart className="w-4 h-4" />
                <span>18</span>
              </button>
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>5</span>
              </button>
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-border">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-black text-accent">
                S
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Sofía</p>
                <p className="text-xs text-muted-foreground">Hace 1 día</p>
              </div>
              <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-semibold">
                ✅ Evidencia
              </span>
            </div>

            <p className="text-foreground mb-4 font-light">
              Terminé mis tareas de la escuela y estudié para el examen 📚
            </p>

            <div className="flex gap-4 text-muted-foreground text-sm">
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <Heart className="w-4 h-4" />
                <span>32</span>
              </button>
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>8</span>
              </button>
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

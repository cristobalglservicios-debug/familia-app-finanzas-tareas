import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Star, Trophy, Heart, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useFamilyWall } from "@/contexts/FamilyWallContext";

interface Task {
  id: number;
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

interface Reward {
  id: number;
  title: string;
  cost: number;
  icon: string;
  redeemed: boolean;
}

interface Badge {
  id: number;
  name: string;
  icon: string;
  unlocked: boolean;
  requirement: string;
}

interface WallPost {
  id: number;
  childId: number;
  childName: string;
  title: string;
  description: string;
  image?: string;
  likes: number;
  comments: Array<{ id: number; author: string; text: string; emoji: string }>;
  timestamp: string;
}

const childrenData = {
  1: {
    name: "Fabio",
    age: 15,
    color: "from-blue-400 to-blue-600",
    points: 2450,
    level: 5,
    nextLevelPoints: 3000,
    tasks: [
      { id: 1, title: "Hacer la cama", description: "Ordena tu cama", points: 10, completed: false },
      { id: 2, title: "Terminar tareas", description: "Completa tus tareas", points: 25, completed: true },
      { id: 3, title: "Ayudar en cocina", description: "Prepara la cena", points: 20, completed: false },
    ],
    badges: [
      { id: 1, name: "Principiante", icon: "🌱", unlocked: true, requirement: "10 puntos" },
      { id: 2, name: "Campeón", icon: "🏆", unlocked: true, requirement: "500 puntos" },
      { id: 3, name: "Leyenda", icon: "👑", unlocked: false, requirement: "5000 puntos" },
    ],
    rewards: [
      { id: 1, title: "30 min iPad", cost: 50, icon: "📱", redeemed: false },
      { id: 2, title: "Película", cost: 100, icon: "🎬", redeemed: false },
      { id: 3, title: "Salida al parque", cost: 150, icon: "🎡", redeemed: false },
    ],
  },
  2: {
    name: "Frida",
    age: 11,
    color: "from-pink-400 to-pink-600",
    points: 1890,
    level: 4,
    nextLevelPoints: 2500,
    tasks: [
      { id: 1, title: "Hacer la cama", description: "Ordena tu cama", points: 10, completed: true },
      { id: 2, title: "Tareas escolares", description: "Completa tus tareas", points: 20, completed: false },
      { id: 3, title: "Limpiar cuarto", description: "Ordena tu cuarto", points: 15, completed: true },
    ],
    badges: [
      { id: 1, name: "Principiante", icon: "🌱", unlocked: true, requirement: "10 puntos" },
      { id: 2, name: "Campeón", icon: "🏆", unlocked: true, requirement: "500 puntos" },
      { id: 3, name: "Leyenda", icon: "👑", unlocked: false, requirement: "5000 puntos" },
    ],
    rewards: [
      { id: 1, title: "20 min Tablet", cost: 40, icon: "📱", redeemed: false },
      { id: 2, title: "Helado", cost: 75, icon: "🍦", redeemed: false },
      { id: 3, title: "Juego nuevo", cost: 120, icon: "🎮", redeemed: false },
    ],
  },
  3: {
    name: "Julieta",
    age: 10,
    color: "from-green-400 to-green-600",
    points: 1650,
    level: 3,
    nextLevelPoints: 2000,
    tasks: [
      { id: 1, title: "Hacer la cama", description: "Ordena tu cama", points: 10, completed: false },
      { id: 2, title: "Tareas", description: "Completa tus tareas", points: 15, completed: true },
      { id: 3, title: "Leer", description: "Lee 20 minutos", points: 20, completed: false },
    ],
    badges: [
      { id: 1, name: "Principiante", icon: "🌱", unlocked: true, requirement: "10 puntos" },
      { id: 2, name: "Campeón", icon: "🏆", unlocked: false, requirement: "500 puntos" },
      { id: 3, name: "Leyenda", icon: "👑", unlocked: false, requirement: "5000 puntos" },
    ],
    rewards: [
      { id: 1, title: "15 min Tablet", cost: 30, icon: "📱", redeemed: false },
      { id: 2, title: "Caramelos", cost: 50, icon: "🍬", redeemed: false },
      { id: 3, title: "Juguete", cost: 100, icon: "🧸", redeemed: false },
    ],
  },
};



export default function ChildTasksImproved({ childId = 1 }: { childId: number }) {
  const [, setLocation] = useLocation();
  const [currentChildId, setCurrentChildId] = useState(childId);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [celebrationEmojis, setCelebrationEmojis] = useState<Array<{ id: string; emoji: string; x: number; y: number }>>([]);
  const [showRewards, setShowRewards] = useState(false);
  const [showWall, setShowWall] = useState(false);
  const { posts: wallPosts, addPost: addWallPost } = useFamilyWall();
  const [newPostText, setNewPostText] = useState("");

  const child = childrenData[currentChildId as keyof typeof childrenData];
  const progressPercentage = (child.points / child.nextLevelPoints) * 100;
  const completedCount = completedTasks.length;
  const totalTasks = child.tasks.length;

  const handleCompleteTask = (taskId: number) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
      const task = child.tasks.find((t) => t.id === taskId);
      if (task) {
        // Celebración con emojis
        const emojis = ["🎉", "⭐", "🌟", "✨", "🎊"];
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            setCelebrationEmojis((prev) => [
              ...prev,
              {
                id: Math.random().toString(),
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                x: Math.random() * 80 + 10,
                y: Math.random() * 60 + 20,
              },
            ]);
          }, i * 100);
        }
        toast.success(`¡+${task.points} puntos! 🎉`);
      }
    }
  };

  const handleRedeemReward = (reward: Reward) => {
    if (child.points >= reward.cost) {
      toast.success(`¡Canjeaste ${reward.title}! 🎁`);
    } else {
      toast.error(`Necesitas ${reward.cost - child.points} puntos más`);
    }
  };

  const handlePostWall = () => {
    if (newPostText.trim()) {
      const childData = childrenData[currentChildId as keyof typeof childrenData];
      addWallPost({
        childId: currentChildId,
        childName: childData.name,
        author: 'child',
        title: newPostText.split('\n')[0] || "Mi logro",
        description: newPostText,
        images: [],
      });
      toast.success("¡Publicación compartida! 🎉");
      setNewPostText("");
    }
  };

  if (showWall) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/40 to-secondary/40 p-6 sticky top-0 z-40 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <Button
                onClick={() => setShowWall(false)}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Volver
              </Button>
              <h1 className="heading-primary">Muro Familiar</h1>
            </div>
          </div>
        </div>

        {/* Wall Posts */}
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* New Post */}
          <Card className="p-6 border-2 border-primary/30">
            <h3 className="font-semibold mb-3">Comparte tu logro</h3>
            <textarea
              placeholder="¿Qué lograste hoy? ¡Comparte con la familia!"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              className="w-full p-3 border border-border rounded-lg mb-3 font-light"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                onClick={handlePostWall}
                className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
              >
                Publicar
              </Button>
              <Button variant="outline" className="flex-1">
                📸 Foto
              </Button>
            </div>
          </Card>

          {/* Posts */}
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

              {/* Interactions */}
              <div className="flex gap-6 mb-4 pb-4 border-b border-border">
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{post.comments.length}</span>
                </button>
              </div>

              {/* Comments */}
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-background rounded-lg">
                    <p className="font-semibold text-sm mb-1">{comment.author}</p>
                    <p className="text-sm text-muted-foreground">{comment.text} {comment.emoji}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="mt-4 flex gap-2">
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
    );
  }

  if (showRewards) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/40 to-secondary/40 p-6 sticky top-0 z-40 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowRewards(false)}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Volver
              </Button>
              <h1 className="heading-primary">Tienda de Recompensas</h1>
            </div>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="max-w-4xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {child.rewards.map((reward) => (
              <Card
                key={reward.id}
                className="p-6 border-2 border-border hover:border-primary/50 transition-all"
              >
                <div className="text-4xl mb-3">{reward.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{reward.title}</h3>
                <p className="text-muted-foreground font-light mb-4">
                  Cuesta {reward.cost} puntos
                </p>
                <Button
                  onClick={() => handleRedeemReward(reward)}
                  className={`w-full ${
                    child.points >= reward.cost
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                  disabled={child.points < reward.cost}
                >
                  {child.points >= reward.cost ? "Canjear" : "No tienes suficientes puntos"}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background pb-20">
      {/* Celebration Emojis */}
      {celebrationEmojis.map((item) => (
        <div
          key={item.id}
          className="fixed text-4xl pointer-events-none animate-bounce"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animation: "bounce 1s ease-out forwards",
          }}
        >
          {item.emoji}
        </div>
      ))}

      {/* Header */}
      <div className={`bg-gradient-to-r ${child.color} p-6 text-white sticky top-0 z-40 border-b border-border`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setLocation("/")}
                variant="ghost"
                className="text-white hover:bg-white/20"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-black">{child.name}</h1>
                <p className="text-white/80 font-light">{child.age} años</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Nivel</p>
              <p className="text-4xl font-black">{child.level}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-white/80 mt-1">
            {child.points} / {child.nextLevelPoints} puntos
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center border-2 border-primary/30">
            <p className="text-muted-foreground font-light text-sm mb-1">Puntos</p>
            <p className="heading-secondary text-primary">{child.points}</p>
          </Card>
          <Card className="p-4 text-center border-2 border-secondary/30">
            <p className="text-muted-foreground font-light text-sm mb-1">Racha</p>
            <p className="heading-secondary text-secondary">7 días</p>
          </Card>
          <Card className="p-4 text-center border-2 border-accent/30">
            <p className="text-muted-foreground font-light text-sm mb-1">Insignias</p>
            <p className="heading-secondary text-accent">
              {child.badges.filter((b) => b.unlocked).length}/{child.badges.length}
            </p>
          </Card>
        </div>

        {/* Badges */}
        <div>
          <h2 className="heading-secondary mb-4">Insignias</h2>
          <div className="flex gap-4">
            {child.badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg text-center transition-all ${
                  badge.unlocked
                    ? "bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30"
                    : "bg-muted border-2 border-muted-foreground/30 opacity-50"
                }`}
              >
                <p className="text-3xl mb-2">{badge.icon}</p>
                <p className="font-semibold text-sm">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.requirement}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div>
          <h2 className="heading-secondary mb-4">
            Tareas de Hoy ({completedCount}/{totalTasks})
          </h2>
          <div className="space-y-3">
            {child.tasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id);
              return (
                <Card
                  key={task.id}
                  onClick={() => handleCompleteTask(task.id)}
                  className={`p-4 border-2 cursor-pointer transition-all transform hover:scale-105 ${
                    isCompleted
                      ? "border-green-400 bg-green-50 opacity-60"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg ${isCompleted ? "line-through" : ""}`}>
                        {task.title}
                      </h3>
                      <p className="text-muted-foreground font-light">{task.description}</p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                          isCompleted
                            ? "bg-green-400 text-white"
                            : "bg-primary/20 text-primary border-2 border-primary"
                        }`}
                      >
                        {isCompleted ? "✓" : "+"}
                      </div>
                      <p className="text-sm font-semibold text-primary mt-1">{task.points} pts</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => setShowRewards(true)}
            className="bg-secondary text-secondary-foreground hover:opacity-90 py-6 text-lg font-semibold gap-2"
          >
            <Trophy className="w-5 h-5" />
            Tienda
          </Button>
          <Button
            onClick={() => setShowWall(true)}
            className="bg-accent text-accent-foreground hover:opacity-90 py-6 text-lg font-semibold gap-2"
          >
            <Share2 className="w-5 h-5" />
            Muro
          </Button>
        </div>

        {/* Change Child */}
        <div>
          <h3 className="font-semibold mb-3">Cambiar a otro hermano</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(childrenData).map(([id, data]) => (
              <Button
                key={id}
                onClick={() => setCurrentChildId(parseInt(id))}
                className={`py-4 transition-all ${
                  currentChildId === parseInt(id)
                    ? `bg-gradient-to-r ${data.color} text-white`
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {data.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

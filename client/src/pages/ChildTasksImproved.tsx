import { useLocation } from "wouter";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Star, Trophy, Flame, Zap, Gift, Crown, Target, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useFamilyWall } from "@/contexts/FamilyWallContext";
import { soundEngine } from "@/lib/sounds";
import { Particle, createConfettiParticles, createStarParticles, createFireParticles, createCoinParticles, createSparkleParticles } from "@/lib/particles";
import ParticleCanvas from "@/components/ParticleCanvas";
import StreakDisplay from "@/components/StreakDisplay";
import XPBar from "@/components/XPBar";

interface Task {
  id: number;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  category: 'routine' | 'study' | 'household' | 'learning' | 'special';
  icon: string;
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

const categoryColors: Record<string, string> = {
  routine: "from-blue-400 to-cyan-400",
  study: "from-purple-400 to-indigo-500",
  household: "from-green-400 to-emerald-500",
  learning: "from-amber-400 to-orange-500",
  special: "from-pink-400 to-rose-500",
};

const categoryIcons: Record<string, string> = {
  routine: "🌅",
  study: "📚",
  household: "🏠",
  learning: "🧠",
  special: "⭐",
};

const childrenData = {
  1: {
    name: "Fabio",
    age: 15,
    color: "from-blue-500 via-indigo-500 to-purple-600",
    bgColor: "from-blue-50 via-indigo-50 to-purple-50",
    avatarEmoji: "🦊",
    points: 2450,
    level: 5,
    nextLevelPoints: 3000,
    currentStreak: 7,
    longestStreak: 12,
    tasks: [
      { id: 1, title: "Hacer la cama", description: "Ordena tu cama cada mañana", points: 10, completed: false, category: "routine" as const, icon: "🛏️" },
      { id: 2, title: "Terminar tareas escolares", description: "Completa todas tus tareas de la escuela", points: 25, completed: false, category: "study" as const, icon: "📝" },
      { id: 3, title: "Ayudar en la cocina", description: "Ayuda a preparar la cena", points: 20, completed: false, category: "household" as const, icon: "🍳" },
      { id: 4, title: "Estudiar para examen", description: "Dedica 1 hora a estudiar", points: 35, completed: false, category: "learning" as const, icon: "📖" },
      { id: 5, title: "Lavar el coche", description: "Lava el coche de la familia", points: 100, completed: false, category: "special" as const, icon: "🚗" },
    ],
    badges: [
      { id: 1, name: "Principiante", icon: "🌱", unlocked: true, requirement: "Completa tu primera tarea" },
      { id: 2, name: "Constante", icon: "🔥", unlocked: true, requirement: "Racha de 3 días" },
      { id: 3, name: "Campeón", icon: "🏆", unlocked: true, requirement: "500 puntos totales" },
      { id: 4, name: "Imparable", icon: "⚡", unlocked: true, requirement: "Racha de 7 días" },
      { id: 5, name: "Leyenda", icon: "👑", unlocked: false, requirement: "5000 puntos totales" },
      { id: 6, name: "Mítico", icon: "🌟", unlocked: false, requirement: "Racha de 30 días" },
    ],
    rewards: [
      { id: 1, title: "30 min de iPad", cost: 50, icon: "📱", redeemed: false },
      { id: 2, title: "Película con familia", cost: 150, icon: "🎬", redeemed: false },
      { id: 3, title: "Salida especial", cost: 300, icon: "🎡", redeemed: false },
      { id: 4, title: "Postre favorito", cost: 100, icon: "🍰", redeemed: false },
    ],
  },
  2: {
    name: "Frida",
    age: 11,
    color: "from-pink-500 via-rose-500 to-red-500",
    bgColor: "from-pink-50 via-rose-50 to-red-50",
    avatarEmoji: "🦋",
    points: 1890,
    level: 4,
    nextLevelPoints: 2500,
    currentStreak: 5,
    longestStreak: 9,
    tasks: [
      { id: 1, title: "Hacer la cama", description: "Ordena tu cama cada mañana", points: 10, completed: false, category: "routine" as const, icon: "🛏️" },
      { id: 2, title: "Tareas de la escuela", description: "Completa todas tus tareas", points: 20, completed: false, category: "study" as const, icon: "📝" },
      { id: 3, title: "Ayudar a mamá", description: "Ayuda en la cocina o limpieza", points: 15, completed: false, category: "household" as const, icon: "🧹" },
      { id: 4, title: "Leer 20 minutos", description: "Lee un libro o revista", points: 12, completed: false, category: "learning" as const, icon: "📚" },
      { id: 5, title: "Pasear al perro", description: "Saca al perro a pasear", points: 30, completed: false, category: "special" as const, icon: "🐕" },
    ],
    badges: [
      { id: 1, name: "Principiante", icon: "🌱", unlocked: true, requirement: "Completa tu primera tarea" },
      { id: 2, name: "Constante", icon: "🔥", unlocked: true, requirement: "Racha de 3 días" },
      { id: 3, name: "Campeón", icon: "🏆", unlocked: true, requirement: "500 puntos totales" },
      { id: 4, name: "Imparable", icon: "⚡", unlocked: false, requirement: "Racha de 7 días" },
      { id: 5, name: "Leyenda", icon: "👑", unlocked: false, requirement: "5000 puntos totales" },
      { id: 6, name: "Mítico", icon: "🌟", unlocked: false, requirement: "Racha de 30 días" },
    ],
    rewards: [
      { id: 1, title: "20 min Tablet", cost: 40, icon: "📱", redeemed: false },
      { id: 2, title: "Helado", cost: 75, icon: "🍦", redeemed: false },
      { id: 3, title: "Juego nuevo", cost: 120, icon: "🎮", redeemed: false },
      { id: 4, title: "Pijamada", cost: 200, icon: "🎉", redeemed: false },
    ],
  },
  3: {
    name: "Julieta",
    age: 10,
    color: "from-green-500 via-emerald-500 to-teal-500",
    bgColor: "from-green-50 via-emerald-50 to-teal-50",
    avatarEmoji: "🌸",
    points: 1650,
    level: 3,
    nextLevelPoints: 2000,
    currentStreak: 3,
    longestStreak: 8,
    tasks: [
      { id: 1, title: "Hacer la cama", description: "Ordena tu cama cada mañana", points: 10, completed: false, category: "routine" as const, icon: "🛏️" },
      { id: 2, title: "Tareas de la escuela", description: "Completa todas tus tareas", points: 15, completed: false, category: "study" as const, icon: "📝" },
      { id: 3, title: "Ayudar en casa", description: "Ayuda a recoger la sala", points: 12, completed: false, category: "household" as const, icon: "🧸" },
      { id: 4, title: "Leer 15 minutos", description: "Lee un cuento o revista", points: 10, completed: false, category: "learning" as const, icon: "📖" },
      { id: 5, title: "Jugar con hermanos", description: "Comparte tiempo con la familia", points: 20, completed: false, category: "special" as const, icon: "🎲" },
    ],
    badges: [
      { id: 1, name: "Principiante", icon: "🌱", unlocked: true, requirement: "Completa tu primera tarea" },
      { id: 2, name: "Constante", icon: "🔥", unlocked: true, requirement: "Racha de 3 días" },
      { id: 3, name: "Campeón", icon: "🏆", unlocked: false, requirement: "500 puntos totales" },
      { id: 4, name: "Imparable", icon: "⚡", unlocked: false, requirement: "Racha de 7 días" },
      { id: 5, name: "Leyenda", icon: "👑", unlocked: false, requirement: "5000 puntos totales" },
      { id: 6, name: "Mítico", icon: "🌟", unlocked: false, requirement: "Racha de 30 días" },
    ],
    rewards: [
      { id: 1, title: "15 min Tablet", cost: 30, icon: "📱", redeemed: false },
      { id: 2, title: "Caramelos", cost: 50, icon: "🍬", redeemed: false },
      { id: 3, title: "Juguete nuevo", cost: 100, icon: "🧸", redeemed: false },
      { id: 4, title: "Parque", cost: 150, icon: "🎠", redeemed: false },
    ],
  },
};

type ViewMode = 'tasks' | 'rewards' | 'wall' | 'streak';

export default function ChildTasksImproved({ childId = 1 }: { childId: number }) {
  const [, setLocation] = useLocation();
  const [currentChildId, setCurrentChildId] = useState(childId);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('tasks');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [comboCount, setComboCount] = useState(0);
  const [lastCompleteTime, setLastCompleteTime] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAllComplete, setShowAllComplete] = useState(false);
  const [pointsAnimation, setPointsAnimation] = useState<{ points: number; x: number; y: number } | null>(null);
  const { posts: wallPosts, addPost: addWallPost } = useFamilyWall();
  const [newPostText, setNewPostText] = useState("");

  const child = childrenData[currentChildId as keyof typeof childrenData];
  const totalPoints = child.points + earnedPoints;
  const progressPercentage = (totalPoints / child.nextLevelPoints) * 100;
  const completedCount = completedTasks.length;
  const totalTasks = child.tasks.length;
  const allComplete = completedCount === totalTasks;

  // Check for combo (tasks completed within 10 seconds of each other)
  const checkCombo = useCallback(() => {
    const now = Date.now();
    if (now - lastCompleteTime < 10000 && lastCompleteTime > 0) {
      setComboCount(prev => prev + 1);
      return comboCount + 1;
    } else {
      setComboCount(1);
      return 1;
    }
  }, [lastCompleteTime, comboCount]);

  const handleCompleteTask = (taskId: number, event?: React.MouseEvent) => {
    if (completedTasks.includes(taskId)) return;

    const task = child.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const combo = checkCombo();
    const bonusMultiplier = combo >= 3 ? 1.5 : combo >= 2 ? 1.2 : 1;
    const finalPoints = Math.round(task.points * bonusMultiplier);

    setCompletedTasks([...completedTasks, taskId]);
    setEarnedPoints(prev => prev + finalPoints);
    setLastCompleteTime(Date.now());

    // Sound effects
    soundEngine.playTaskComplete();
    if (combo >= 2) {
      setTimeout(() => soundEngine.playCombo(combo), 200);
    }

    // Points animation
    if (event) {
      setPointsAnimation({ points: finalPoints, x: event.clientX, y: event.clientY });
      setTimeout(() => setPointsAnimation(null), 1500);
    }

    // Particles
    const originX = event ? event.clientX : window.innerWidth / 2;
    const originY = event ? event.clientY : window.innerHeight / 2;
    
    const newParticles = [
      ...createConfettiParticles(15, originX, originY),
      ...createStarParticles(5, originX, originY),
    ];
    
    if (combo >= 3) {
      newParticles.push(...createCoinParticles(8, originX, originY));
    }

    setParticles(prev => [...prev, ...newParticles]);

    // Toast with combo info
    if (combo >= 3) {
      toast.success(`🔥 COMBO x${combo}! +${finalPoints} puntos (x${bonusMultiplier} bonus)`, {
        style: { background: 'linear-gradient(135deg, #FF6B35, #F7C948)', color: 'white', fontWeight: 'bold' }
      });
    } else if (combo >= 2) {
      toast.success(`⚡ ¡Doble! +${finalPoints} puntos`, {
        style: { background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }
      });
    } else {
      toast.success(`✨ +${finalPoints} puntos`);
    }

    // Check if all tasks complete
    if (completedTasks.length + 1 === totalTasks) {
      setTimeout(() => {
        setShowAllComplete(true);
        soundEngine.playAllComplete();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        setParticles(prev => [
          ...prev,
          ...createConfettiParticles(50, centerX, centerY),
          ...createStarParticles(20, centerX, centerY),
          ...createSparkleParticles(15, centerX, centerY),
        ]);
        setTimeout(() => setShowAllComplete(false), 4000);
      }, 500);
    }

    // Check for level up
    if (totalPoints + finalPoints >= child.nextLevelPoints && totalPoints < child.nextLevelPoints) {
      setTimeout(() => {
        setShowLevelUp(true);
        soundEngine.playLevelUp();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 3;
        setParticles(prev => [
          ...prev,
          ...createConfettiParticles(60, centerX, centerY),
          ...createStarParticles(30, centerX, centerY),
          ...createCoinParticles(20, centerX, centerY),
        ]);
        setTimeout(() => setShowLevelUp(false), 3000);
      }, 800);
    }
  };

  const handleRedeemReward = (reward: Reward) => {
    if (totalPoints >= reward.cost) {
      soundEngine.playRewardRedeem();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setParticles(prev => [
        ...prev,
        ...createCoinParticles(15, centerX, centerY),
        ...createSparkleParticles(10, centerX, centerY),
      ]);
      toast.success(`🎁 ¡Canjeaste "${reward.title}"!`, {
        style: { background: 'linear-gradient(135deg, #11998e, #38ef7d)', color: 'white', fontWeight: 'bold' }
      });
    } else {
      soundEngine.playError();
      toast.error(`Necesitas ${reward.cost - totalPoints} puntos más`);
    }
  };

  const handlePostWall = () => {
    if (newPostText.trim()) {
      addWallPost({
        childId: currentChildId,
        childName: child.name,
        author: 'child',
        title: newPostText.split('\n')[0] || "Mi logro",
        description: newPostText,
        images: [],
      });
      soundEngine.playTap();
      toast.success("¡Publicación compartida! 🎉");
      setNewPostText("");
    }
  };

  // ==================== STREAK VIEW ====================
  if (viewMode === 'streak') {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${child.bgColor} pb-24`}>
        <ParticleCanvas particles={particles} onParticlesUpdate={setParticles} />
        
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`bg-gradient-to-r ${child.color} p-6 text-white sticky top-0 z-40 shadow-xl`}
        >
          <div className="max-w-lg mx-auto flex items-center gap-4">
            <Button onClick={() => setViewMode('tasks')} variant="ghost" className="text-white hover:bg-white/20" size="sm">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6" />
              <h1 className="text-2xl font-black">Mi Racha</h1>
            </div>
          </div>
        </motion.div>

        <div className="max-w-lg mx-auto p-6 space-y-6">
          {/* Epic Streak Display */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <StreakDisplay
              currentStreak={child.currentStreak}
              longestStreak={child.longestStreak}
            />
          </motion.div>

          {/* Streak Calendar (last 7 days) */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-5 border-2 border-border/50 shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Últimos 7 días
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, i) => {
                  const isActive = i < child.currentStreak;
                  const isToday = i === 0;
                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                      className={`aspect-square rounded-xl flex items-center justify-center text-2xl relative ${
                        isActive
                          ? 'bg-gradient-to-br from-orange-400 to-red-500 shadow-lg'
                          : 'bg-muted/50 border-2 border-dashed border-muted-foreground/20'
                      }`}
                    >
                      {isActive ? '🔥' : '○'}
                      {isToday && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                <span>Hoy</span>
                <span>Hace 7 días</span>
              </div>
            </Card>
          </motion.div>

          {/* Streak Milestones */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-5 border-2 border-border/50 shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Hitos de Racha
              </h3>
              <div className="space-y-3">
                {[
                  { days: 3, name: "En Racha", emoji: "⚡", reward: "+50% bonus" },
                  { days: 7, name: "Imparable", emoji: "🔥", reward: "+100% bonus" },
                  { days: 14, name: "Heroico", emoji: "🛡️", reward: "+200% bonus" },
                  { days: 21, name: "Épico", emoji: "⭐", reward: "+300% bonus" },
                  { days: 30, name: "Legendario", emoji: "👑", reward: "+400% bonus" },
                ].map((milestone, i) => {
                  const achieved = child.currentStreak >= milestone.days;
                  return (
                    <motion.div
                      key={milestone.days}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        achieved
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'
                          : 'bg-muted/30 border border-border opacity-60'
                      }`}
                    >
                      <span className="text-2xl">{achieved ? milestone.emoji : '🔒'}</span>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{milestone.name}</p>
                        <p className="text-xs text-muted-foreground">{milestone.days} días consecutivos</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        achieved ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
                      }`}>
                        {achieved ? '✓ Logrado' : milestone.reward}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Nav */}
        <BottomNav viewMode={viewMode} setViewMode={setViewMode} childColor={child.color} />
      </div>
    );
  }

  // ==================== REWARDS VIEW ====================
  if (viewMode === 'rewards') {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${child.bgColor} pb-24`}>
        <ParticleCanvas particles={particles} onParticlesUpdate={setParticles} />
        
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`bg-gradient-to-r ${child.color} p-6 text-white sticky top-0 z-40 shadow-xl`}
        >
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button onClick={() => setViewMode('tasks')} variant="ghost" className="text-white hover:bg-white/20" size="sm">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <Gift className="w-6 h-6" />
                  <h1 className="text-2xl font-black">Tienda</h1>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                <Zap className="w-4 h-4" />
                <span className="font-black">{totalPoints.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-lg mx-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            {child.rewards.map((reward, i) => {
              const canAfford = totalPoints >= reward.cost;
              return (
                <motion.div
                  key={reward.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                >
                  <Card
                    className={`p-5 border-2 transition-all cursor-pointer relative overflow-hidden ${
                      canAfford
                        ? 'border-primary/50 hover:border-primary hover:shadow-xl hover:scale-105 transform'
                        : 'border-muted opacity-60'
                    }`}
                    onClick={() => handleRedeemReward(reward)}
                  >
                    {canAfford && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    <div className="relative z-10">
                      <motion.span
                        className="text-5xl block mb-3"
                        animate={canAfford ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        {reward.icon}
                      </motion.span>
                      <h3 className="font-bold text-sm mb-2">{reward.title}</h3>
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="font-black text-primary">{reward.cost}</span>
                      </div>
                      {!canAfford && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Faltan {reward.cost - totalPoints} pts
                        </p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        <BottomNav viewMode={viewMode} setViewMode={setViewMode} childColor={child.color} />
      </div>
    );
  }

  // ==================== WALL VIEW ====================
  if (viewMode === 'wall') {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${child.bgColor} pb-24`}>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`bg-gradient-to-r ${child.color} p-6 text-white sticky top-0 z-40 shadow-xl`}
        >
          <div className="max-w-lg mx-auto flex items-center gap-4">
            <Button onClick={() => setViewMode('tasks')} variant="ghost" className="text-white hover:bg-white/20" size="sm">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <h1 className="text-2xl font-black">Muro Familiar</h1>
            </div>
          </div>
        </motion.div>

        <div className="max-w-lg mx-auto p-6 space-y-4">
          {/* New Post */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <Card className="p-5 border-2 border-primary/30 shadow-lg">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span className="text-xl">{child.avatarEmoji}</span>
                Comparte tu logro
              </h3>
              <textarea
                placeholder="¿Qué lograste hoy? ¡Comparte con la familia! 🎉"
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                className="w-full p-3 border-2 border-border rounded-xl mb-3 font-light focus:border-primary focus:outline-none transition-colors resize-none"
                rows={3}
              />
              <Button
                onClick={handlePostWall}
                className={`w-full bg-gradient-to-r ${child.color} text-white font-bold shadow-lg`}
                disabled={!newPostText.trim()}
              >
                Publicar ✨
              </Button>
            </Card>
          </motion.div>

          {/* Posts */}
          {wallPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.1 }}
            >
              <Card className="p-5 border-2 border-border/50 hover:border-primary/30 transition-all shadow-sm hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md">
                    {post.childName[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{post.childName}</p>
                    <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                  </div>
                </div>
                <p className="text-foreground mb-3">{post.description}</p>
                <div className="flex gap-4 text-muted-foreground">
                  <button className="flex items-center gap-1 text-sm hover:text-red-500 transition-colors">
                    ❤️ {post.likes}
                  </button>
                  <button className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                    💬 {post.comments.length}
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <BottomNav viewMode={viewMode} setViewMode={setViewMode} childColor={child.color} />
      </div>
    );
  }

  // ==================== MAIN TASKS VIEW ====================
  return (
    <div className={`min-h-screen bg-gradient-to-b ${child.bgColor} pb-24`}>
      <ParticleCanvas particles={particles} onParticlesUpdate={setParticles} />

      {/* Points Animation Popup */}
      <AnimatePresence>
        {pointsAnimation && (
          <motion.div
            className="fixed z-[200] pointer-events-none font-black text-2xl text-primary"
            style={{ left: pointsAnimation.x - 30, top: pointsAnimation.y - 20 }}
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -60, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            +{pointsAnimation.points}
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Complete Celebration */}
      <AnimatePresence>
        {showAllComplete && (
          <motion.div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm mx-4"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <motion.span
                className="text-7xl block mb-4"
                animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🏆
              </motion.span>
              <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                ¡MISIÓN CUMPLIDA!
              </h2>
              <p className="text-muted-foreground mb-4">
                Completaste todas las tareas de hoy
              </p>
              <div className="flex items-center justify-center gap-2 text-2xl font-black text-primary">
                <Zap className="w-6 h-6" />
                +{earnedPoints} puntos ganados
              </div>
              {child.currentStreak >= 3 && (
                <p className="mt-3 text-sm text-orange-500 font-bold">
                  🔥 ¡Racha de {child.currentStreak + 1} días! ¡Sigue así!
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`bg-gradient-to-r ${child.color} p-6 pb-8 text-white sticky top-0 z-40 shadow-2xl`}
      >
        <div className="max-w-lg mx-auto">
          {/* Top row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button onClick={() => setLocation("/")} variant="ghost" className="text-white hover:bg-white/20" size="sm">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <motion.span
                className="text-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {child.avatarEmoji}
              </motion.span>
              <div>
                <h1 className="text-2xl font-black">{child.name}</h1>
                <p className="text-white/70 text-sm">{child.age} años</p>
              </div>
            </div>
            
            {/* Streak badge in header */}
            <StreakDisplay
              currentStreak={child.currentStreak}
              longestStreak={child.longestStreak}
              compact={true}
            />
          </div>

          {/* XP Bar */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <XPBar
              currentXP={totalPoints}
              maxXP={child.nextLevelPoints}
              level={child.level}
              showLevelUp={showLevelUp}
            />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto p-4 space-y-4 -mt-2">
        {/* Quick Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card className="p-3 text-center border-2 border-border/50 shadow-md hover:shadow-lg transition-shadow">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }}>
              <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
            </motion.div>
            <p className="text-xs text-muted-foreground">Hoy</p>
            <p className="font-black text-lg text-foreground">{earnedPoints}</p>
          </Card>
          <Card
            className="p-3 text-center border-2 border-orange-200 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setViewMode('streak')}
          >
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}>
              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
            </motion.div>
            <p className="text-xs text-muted-foreground">Racha</p>
            <p className="font-black text-lg text-orange-500">{child.currentStreak}d 🔥</p>
          </Card>
          <Card className="p-3 text-center border-2 border-border/50 shadow-md hover:shadow-lg transition-shadow">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>
              <Star className="w-6 h-6 text-purple-500 mx-auto mb-1" />
            </motion.div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-black text-lg text-foreground">{totalPoints.toLocaleString()}</p>
          </Card>
        </motion.div>

        {/* Streak Bonus Banner */}
        {child.currentStreak >= 3 && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Card
              className="p-4 border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg cursor-pointer"
              onClick={() => setViewMode('streak')}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-3xl">🔥</span>
                </motion.div>
                <div className="flex-1">
                  <p className="font-black text-orange-700">
                    ¡Racha de {child.currentStreak} días!
                  </p>
                  <p className="text-sm text-orange-600/80">
                    Completa todas las tareas para mantenerla
                  </p>
                </div>
                <ChevronLeft className="w-5 h-5 text-orange-400 rotate-180" />
              </div>
            </Card>
          </motion.div>
        )}

        {/* Combo indicator */}
        <AnimatePresence>
          {comboCount >= 2 && Date.now() - lastCompleteTime < 10000 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-center"
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-black shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                ⚡ COMBO x{comboCount} ⚡
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 border-2 border-border/50 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Progreso del día
              </span>
              <span className="font-black text-primary">
                {completedCount}/{totalTasks}
              </span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${child.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / totalTasks) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            {allComplete && (
              <motion.p
                className="text-center text-sm font-bold text-green-600 mt-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🎉 ¡Todas completadas! ¡Eres increíble!
              </motion.p>
            )}
          </Card>
        </motion.div>

        {/* Tasks */}
        <div>
          <h2 className="font-black text-xl mb-3 flex items-center gap-2">
            <span className="text-xl">📋</span>
            Tareas de Hoy
          </h2>
          <div className="space-y-3">
            {child.tasks.map((task, i) => {
              const isCompleted = completedTasks.includes(task.id);
              return (
                <motion.div
                  key={task.id}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.08, type: "spring" }}
                >
                  <Card
                    onClick={(e) => handleCompleteTask(task.id, e as any)}
                    className={`p-4 border-2 cursor-pointer transition-all transform active:scale-95 ${
                      isCompleted
                        ? 'border-green-300 bg-green-50/80 shadow-md'
                        : 'border-border/50 hover:border-primary/50 hover:shadow-lg shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Task icon with category color */}
                      <motion.div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${
                          isCompleted
                            ? 'bg-green-400'
                            : `bg-gradient-to-br ${categoryColors[task.category]}`
                        }`}
                        animate={isCompleted ? { rotate: [0, 360] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {isCompleted ? '✓' : task.icon}
                      </motion.div>

                      {/* Task info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-base ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{task.description}</p>
                      </div>

                      {/* Points */}
                      <motion.div
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-black text-sm ${
                          isCompleted
                            ? 'bg-green-100 text-green-600'
                            : 'bg-primary/10 text-primary'
                        }`}
                        animate={!isCompleted ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        {task.points}
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Badges Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="font-black text-xl mb-3 flex items-center gap-2">
            <span className="text-xl">🏅</span>
            Insignias
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {child.badges.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + i * 0.08, type: "spring" }}
              >
                <Card
                  className={`p-3 text-center border-2 transition-all ${
                    badge.unlocked
                      ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-md'
                      : 'border-muted bg-muted/30 opacity-50'
                  }`}
                >
                  <motion.span
                    className="text-3xl block mb-1"
                    animate={badge.unlocked ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  >
                    {badge.unlocked ? badge.icon : '🔒'}
                  </motion.span>
                  <p className="font-bold text-xs">{badge.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{badge.requirement}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Change Child */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="font-bold text-sm mb-2 text-muted-foreground">Cambiar perfil</h3>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(childrenData).map(([id, data]) => (
              <Button
                key={id}
                onClick={() => {
                  setCurrentChildId(parseInt(id));
                  setCompletedTasks([]);
                  setEarnedPoints(0);
                  soundEngine.playTap();
                }}
                className={`py-3 transition-all text-sm ${
                  currentChildId === parseInt(id)
                    ? `bg-gradient-to-r ${data.color} text-white shadow-lg`
                    : "bg-white text-foreground border-2 border-border hover:border-primary/50"
                }`}
                variant={currentChildId === parseInt(id) ? "default" : "outline"}
              >
                <span className="mr-1">{data.avatarEmoji}</span>
                {data.name}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav viewMode={viewMode} setViewMode={setViewMode} childColor={child.color} />
    </div>
  );
}

// ==================== BOTTOM NAVIGATION ====================
function BottomNav({ viewMode, setViewMode, childColor }: { viewMode: ViewMode; setViewMode: (v: ViewMode) => void; childColor: string }) {
  const items = [
    { id: 'tasks' as ViewMode, icon: Target, label: 'Tareas', emoji: '📋' },
    { id: 'streak' as ViewMode, icon: Flame, label: 'Racha', emoji: '🔥' },
    { id: 'rewards' as ViewMode, icon: Gift, label: 'Tienda', emoji: '🎁' },
    { id: 'wall' as ViewMode, icon: Sparkles, label: 'Muro', emoji: '✨' },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t-2 border-border shadow-2xl"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
        {items.map((item) => {
          const isActive = viewMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setViewMode(item.id);
                soundEngine.playTap();
              }}
              className={`flex flex-col items-center gap-0.5 py-2 px-4 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-b from-primary/10 to-primary/5 scale-110'
                  : 'hover:bg-muted/50'
              }`}
            >
              <motion.span
                className="text-xl"
                animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {item.emoji}
              </motion.span>
              <span className={`text-[10px] font-bold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className={`w-6 h-1 rounded-full bg-gradient-to-r ${childColor}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

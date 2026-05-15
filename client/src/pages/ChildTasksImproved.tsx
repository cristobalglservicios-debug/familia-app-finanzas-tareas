import { useLocation } from "wouter";
import { useState, useCallback } from "react";
import { ChevronLeft, Flame, Zap, Gift, Target, Sparkles, Trophy, Star, Shield } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { soundEngine } from "@/lib/sounds";
import { Particle, createConfettiParticles, createStarParticles, createCoinParticles, createSparkleParticles } from "@/lib/particles";
import ParticleCanvas from "@/components/ParticleCanvas";

// ============ DATA ============
const childrenData: Record<number, ChildData> = {
  1: {
    name: "Hijo", age: 15, role: "Fuerza", emoji: "👦",
    color: "#06b6d4", colorFrom: "from-cyan-500", colorTo: "to-teal-600",
    points: 310, level: 5, nextLevelPoints: 500, currentStreak: 7, longestStreak: 12,
    tasks: [
      { id: 1, title: "Barrer y Trapear", description: "Toda la casa", points: 10, icon: "🧹", category: "household" },
      { id: 2, title: "Su Cuarto", description: "Ordenar y limpiar", points: 10, icon: "🛏️", category: "routine" },
      { id: 3, title: "Acomodar Hamaca", description: "Enrollar hamaca", points: 10, icon: "🪢", category: "routine" },
      { id: 4, title: "Sofá Cama", description: "Armar sofá cama", points: 10, icon: "🛋️", category: "household" },
    ],
    rewards: [
      { id: 1, title: "30 min Gaming", cost: 50, icon: "🎮" },
      { id: 2, title: "Película", cost: 100, icon: "🎬" },
      { id: 3, title: "Salida especial", cost: 200, icon: "🎡" },
      { id: 4, title: "Postre favorito", cost: 80, icon: "🍰" },
    ],
    badges: [
      { id: 1, name: "Novato", icon: "🌱", unlocked: true, req: "1ra tarea" },
      { id: 2, name: "Constante", icon: "🔥", unlocked: true, req: "Racha 3d" },
      { id: 3, name: "Campeón", icon: "🏆", unlocked: true, req: "500 pts" },
      { id: 4, name: "Imparable", icon: "⚡", unlocked: true, req: "Racha 7d" },
      { id: 5, name: "Leyenda", icon: "👑", unlocked: false, req: "5000 pts" },
      { id: 6, name: "Mítico", icon: "🌟", unlocked: false, req: "Racha 30d" },
    ],
  },
  2: {
    name: "Hija", age: 12, role: "Digital/Ventas", emoji: "👧",
    color: "#f59e0b", colorFrom: "from-amber-500", colorTo: "to-orange-600",
    points: 290, level: 4, nextLevelPoints: 500, currentStreak: 5, longestStreak: 9,
    tasks: [
      { id: 1, title: "Doblar Ropa", description: "Toda la ropa limpia", points: 10, icon: "👕", category: "household" },
      { id: 2, title: "Fotos Venta", description: "Fotografiar productos", points: 10, icon: "📸", category: "special" },
      { id: 3, title: "Postear Marketplace", description: "Publicar en redes", points: 10, icon: "📱", category: "special" },
    ],
    rewards: [
      { id: 1, title: "20 min Tablet", cost: 40, icon: "📱" },
      { id: 2, title: "Helado", cost: 60, icon: "🍦" },
      { id: 3, title: "Juego nuevo", cost: 120, icon: "🎮" },
      { id: 4, title: "Pijamada", cost: 150, icon: "🎉" },
    ],
    badges: [
      { id: 1, name: "Novato", icon: "🌱", unlocked: true, req: "1ra tarea" },
      { id: 2, name: "Constante", icon: "🔥", unlocked: true, req: "Racha 3d" },
      { id: 3, name: "Campeón", icon: "🏆", unlocked: true, req: "500 pts" },
      { id: 4, name: "Imparable", icon: "⚡", unlocked: false, req: "Racha 7d" },
      { id: 5, name: "Leyenda", icon: "👑", unlocked: false, req: "5000 pts" },
      { id: 6, name: "Mítico", icon: "🌟", unlocked: false, req: "Racha 30d" },
    ],
  },
  3: {
    name: "Hija", age: 10, role: "Brigada", emoji: "🧒",
    color: "#10b981", colorFrom: "from-emerald-500", colorTo: "to-green-600",
    points: 260, level: 3, nextLevelPoints: 500, currentStreak: 3, longestStreak: 8,
    tasks: [
      { id: 1, title: "Sacudir Polvo", description: "Muebles y estantes", points: 10, icon: "🧹", category: "household" },
      { id: 2, title: "Etiquetar Cajas", description: "Poner etiquetas", points: 10, icon: "🏷️", category: "routine" },
      { id: 3, title: "Pasillo/Escaleras", description: "Limpiar y ordenar", points: 10, icon: "🪜", category: "household" },
    ],
    rewards: [
      { id: 1, title: "15 min Tablet", cost: 30, icon: "📱" },
      { id: 2, title: "Caramelos", cost: 40, icon: "🍬" },
      { id: 3, title: "Juguete nuevo", cost: 100, icon: "🧸" },
      { id: 4, title: "Parque", cost: 120, icon: "🎠" },
    ],
    badges: [
      { id: 1, name: "Novato", icon: "🌱", unlocked: true, req: "1ra tarea" },
      { id: 2, name: "Constante", icon: "🔥", unlocked: true, req: "Racha 3d" },
      { id: 3, name: "Campeón", icon: "🏆", unlocked: false, req: "500 pts" },
      { id: 4, name: "Imparable", icon: "⚡", unlocked: false, req: "Racha 7d" },
      { id: 5, name: "Leyenda", icon: "👑", unlocked: false, req: "5000 pts" },
      { id: 6, name: "Mítico", icon: "🌟", unlocked: false, req: "Racha 30d" },
    ],
  },
};

interface ChildData {
  name: string; age: number; role: string; emoji: string;
  color: string; colorFrom: string; colorTo: string;
  points: number; level: number; nextLevelPoints: number;
  currentStreak: number; longestStreak: number;
  tasks: { id: number; title: string; description: string; points: number; icon: string; category: string }[];
  rewards: { id: number; title: string; cost: number; icon: string }[];
  badges: { id: number; name: string; icon: string; unlocked: boolean; req: string }[];
}

type ViewMode = 'tasks' | 'streak' | 'rewards' | 'badges';

// ============ MAIN COMPONENT ============
export default function ChildTasksImproved({ childId = 1 }: { childId: number }) {
  const [, setLocation] = useLocation();
  const [currentChildId, setCurrentChildId] = useState(childId);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('tasks');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [comboCount, setComboCount] = useState(0);
  const [lastCompleteTime, setLastCompleteTime] = useState(0);
  const [showAllComplete, setShowAllComplete] = useState(false);
  const [pointsAnim, setPointsAnim] = useState<{ pts: number; x: number; y: number } | null>(null);

  const child = childrenData[currentChildId as keyof typeof childrenData];
  const totalPoints = child.points + earnedPoints;
  const completedCount = completedTasks.length;
  const totalTasks = child.tasks.length;
  const allComplete = completedCount === totalTasks;
  const xpPercent = Math.min((totalPoints / child.nextLevelPoints) * 100, 100);

  const checkCombo = useCallback(() => {
    const now = Date.now();
    if (now - lastCompleteTime < 10000 && lastCompleteTime > 0) {
      setComboCount(prev => prev + 1);
      return comboCount + 1;
    }
    setComboCount(1);
    return 1;
  }, [lastCompleteTime, comboCount]);

  const handleComplete = (taskId: number, e?: React.MouseEvent) => {
    if (completedTasks.includes(taskId)) return;
    const task = child.tasks.find(t => t.id === taskId);
    if (!task) return;

    const combo = checkCombo();
    const mult = combo >= 3 ? 1.5 : combo >= 2 ? 1.2 : 1;
    const pts = Math.round(task.points * mult);

    setCompletedTasks([...completedTasks, taskId]);
    setEarnedPoints(prev => prev + pts);
    setLastCompleteTime(Date.now());
    soundEngine.playTaskComplete();

    if (combo >= 2) setTimeout(() => soundEngine.playCombo(combo), 200);

    if (e) {
      setPointsAnim({ pts, x: e.clientX, y: e.clientY });
      setTimeout(() => setPointsAnim(null), 1500);
      setParticles(prev => [
        ...prev,
        ...createConfettiParticles(12, e.clientX, e.clientY),
        ...createStarParticles(4, e.clientX, e.clientY),
        ...(combo >= 3 ? createCoinParticles(6, e.clientX, e.clientY) : []),
      ]);
    }

    if (combo >= 3) {
      toast.success(`COMBO x${combo}! +${pts} pts (x${mult})`, { style: { background: '#1a1a2e', color: '#f59e0b', border: '1px solid #f59e0b44', fontWeight: 'bold' } });
    } else {
      toast.success(`+${pts} pts`, { style: { background: '#1a1a2e', color: '#fff', border: '1px solid #333' } });
    }

    if (completedTasks.length + 1 === totalTasks) {
      setTimeout(() => {
        setShowAllComplete(true);
        soundEngine.playAllComplete();
        const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        setParticles(prev => [...prev, ...createConfettiParticles(50, cx, cy), ...createStarParticles(20, cx, cy), ...createSparkleParticles(15, cx, cy)]);
        setTimeout(() => setShowAllComplete(false), 4000);
      }, 500);
    }
  };

  const streakTier = getStreakTier(child.currentStreak);

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-24">
      <ParticleCanvas particles={particles} onParticlesUpdate={setParticles} />

      {/* Points animation */}
      <AnimatePresence>
        {pointsAnim && (
          <motion.div className="fixed z-[200] pointer-events-none font-black text-2xl" style={{ left: pointsAnim.x - 30, top: pointsAnim.y - 20, color: child.color }}
            initial={{ opacity: 1, y: 0, scale: 0.5 }} animate={{ opacity: 0, y: -60, scale: 1.5 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
            +{pointsAnim.pts}
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Complete Celebration */}
      <AnimatePresence>
        {showAllComplete && (
          <motion.div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-[#12121a] rounded-3xl p-8 shadow-2xl text-center max-w-sm mx-4 border border-gray-700"
              initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 200 }}>
              <motion.span className="text-7xl block mb-4" animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 1, repeat: Infinity }}>🏆</motion.span>
              <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">MISIÓN CUMPLIDA</h2>
              <p className="text-gray-400 mb-4">Todas las tareas completadas</p>
              <div className="flex items-center justify-center gap-2 text-2xl font-black" style={{ color: child.color }}>
                <Zap className="w-6 h-6" /> +{earnedPoints} pts
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== HEADER ===== */}
      <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(180deg, ${child.color}33, transparent)` }} />
        <div className="relative px-5 pt-5 pb-4">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => { soundEngine.playTap(); setLocation("/hub"); }} className="text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <motion.div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${child.colorFrom} ${child.colorTo} flex items-center justify-center text-lg shadow-lg`}
                style={{ boxShadow: `0 4px 20px ${child.color}44` }}
                animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                {child.emoji}
              </motion.div>
              <div>
                <h1 className="font-black text-lg leading-tight">{child.name} <span className="text-gray-500 font-normal text-sm">({child.age})</span></h1>
                <p className="text-xs text-gray-500">{child.role}</p>
              </div>
            </div>
            {/* Streak badge */}
            <motion.div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10"
              animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-black text-orange-400">{child.currentStreak}</span>
            </motion.div>
          </div>

          {/* XP Bar */}
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border-2 flex items-center justify-center font-black text-sm" style={{ borderColor: child.color, color: child.color }}>
                {child.level}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-400 font-bold">Nivel {child.level}</span>
                  <span className="text-gray-500">{totalPoints} / {child.nextLevelPoints} XP</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(to right, ${child.color}, ${child.color}aa)` }}
                    initial={{ width: 0 }} animate={{ width: `${xpPercent}%` }} transition={{ duration: 1 }}>
                    <motion.div className="w-full h-full opacity-40" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
                      animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== TAB NAV ===== */}
      <div className="px-5 mb-4">
        <div className="flex gap-1 bg-[#12121a] rounded-xl p-1 border border-gray-800/50">
          {([
            { id: 'tasks' as ViewMode, label: 'Tareas', icon: '📋' },
            { id: 'streak' as ViewMode, label: 'Racha', icon: '🔥' },
            { id: 'rewards' as ViewMode, label: 'Tienda', icon: '🎁' },
            { id: 'badges' as ViewMode, label: 'Logros', icon: '🏅' },
          ]).map((tab) => (
            <button key={tab.id} onClick={() => { soundEngine.playTap(); setViewMode(tab.id); }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                viewMode === tab.id
                  ? 'text-white border' : 'text-gray-500 hover:text-gray-300'
              }`}
              style={viewMode === tab.id ? { background: `${child.color}15`, borderColor: `${child.color}44` } : {}}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="px-5">
        <AnimatePresence mode="wait">
          {/* TASKS VIEW */}
          {viewMode === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-[#12121a] rounded-xl p-3 border border-gray-800/50 text-center">
                  <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                  <p className="text-lg font-black">{earnedPoints}</p>
                  <p className="text-[10px] text-gray-500">Hoy</p>
                </div>
                <div className="bg-[#12121a] rounded-xl p-3 border border-orange-500/20 text-center cursor-pointer" onClick={() => setViewMode('streak')}>
                  <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                  <p className="text-lg font-black text-orange-400">{child.currentStreak}d</p>
                  <p className="text-[10px] text-gray-500">Racha</p>
                </div>
                <div className="bg-[#12121a] rounded-xl p-3 border border-gray-800/50 text-center">
                  <Target className="w-4 h-4 mx-auto mb-1" style={{ color: child.color }} />
                  <p className="text-lg font-black">{completedCount}/{totalTasks}</p>
                  <p className="text-[10px] text-gray-500">Tareas</p>
                </div>
              </div>

              {/* Combo indicator */}
              <AnimatePresence>
                {comboCount >= 2 && Date.now() - lastCompleteTime < 10000 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-center mb-3">
                    <motion.span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white px-4 py-2 rounded-full font-black text-sm border border-purple-500/30"
                      animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
                      ⚡ COMBO x{comboCount} ⚡
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress bar */}
              <div className="mb-4 bg-[#12121a] rounded-xl p-3 border border-gray-800/50">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-400 font-bold">Progreso del día</span>
                  <span className="font-black" style={{ color: child.color }}>{Math.round((completedCount / totalTasks) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: child.color }}
                    initial={{ width: 0 }} animate={{ width: `${(completedCount / totalTasks) * 100}%` }} transition={{ duration: 0.5 }} />
                </div>
                {allComplete && (
                  <motion.p className="text-center text-xs font-bold mt-2" style={{ color: child.color }}
                    animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                    🎉 ¡Todas completadas!
                  </motion.p>
                )}
              </div>

              {/* Task Cards */}
              <div className="space-y-2">
                {child.tasks.map((task, i) => {
                  const done = completedTasks.includes(task.id);
                  return (
                    <motion.div key={task.id} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.06 }}>
                      <motion.div
                        onClick={(e) => handleComplete(task.id, e)}
                        className={`relative overflow-hidden rounded-xl border cursor-pointer transition-all ${
                          done ? 'border-green-500/30 bg-green-500/5' : 'border-gray-800/50 bg-[#12121a] hover:border-gray-700 active:scale-[0.98]'
                        }`}
                        whileTap={!done ? { scale: 0.97 } : {}}
                      >
                        <div className="flex items-center gap-3 p-3.5">
                          <motion.div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${done ? 'bg-green-500/20' : ''}`}
                            style={!done ? { background: `${child.color}15`, border: `1px solid ${child.color}33` } : {}}
                            animate={done ? { rotate: [0, 360] } : {}} transition={{ duration: 0.5 }}>
                            {done ? '✓' : task.icon}
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-bold text-sm ${done ? 'line-through text-gray-500' : 'text-white'}`}>{task.title}</h3>
                            <p className="text-xs text-gray-500 truncate">{task.description}</p>
                          </div>
                          <motion.div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black ${
                            done ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'text-white border'
                          }`} style={!done ? { background: `${child.color}15`, borderColor: `${child.color}33`, color: child.color } : {}}
                            animate={!done ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}>
                            <Zap className="w-3 h-3" /> {task.points}
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STREAK VIEW */}
          {viewMode === 'streak' && (
            <motion.div key="streak" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
              {/* Epic streak card */}
              <div className="relative overflow-hidden rounded-2xl border border-gray-800/50">
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${streakTier.colorHex}22, transparent)` }} />
                {/* Fire particles */}
                {child.currentStreak >= 3 && (
                  <div className="absolute inset-0 overflow-hidden">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <motion.div key={i} className="absolute w-2 h-2 rounded-full"
                        style={{ background: i % 2 === 0 ? '#FFD700' : '#FF6347', left: `${10 + i * 9}%`, bottom: '0%' }}
                        animate={{ y: [0, -60 - Math.random() * 40], opacity: [0.7, 0], scale: [1, 0.3] }}
                        transition={{ duration: 1.2 + Math.random(), repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                  </div>
                )}
                <div className="relative p-6 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{streakTier.name}</p>
                  <motion.span className="text-7xl font-black block mb-1" style={{ color: streakTier.colorHex }}
                    initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                    {child.currentStreak}
                  </motion.span>
                  <p className="text-gray-400 text-sm">días consecutivos</p>
                  {streakTier.multiplier > 1 && (
                    <motion.span className="inline-block mt-2 text-xs font-black px-3 py-1 rounded-full border"
                      style={{ color: streakTier.colorHex, borderColor: `${streakTier.colorHex}44`, background: `${streakTier.colorHex}11` }}
                      animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      x{streakTier.multiplier} BONUS
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Calendar */}
              <div className="bg-[#12121a] rounded-xl p-4 border border-gray-800/50">
                <h3 className="text-sm font-bold text-gray-300 mb-3">Últimos 7 días</h3>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const active = i < child.currentStreak;
                    return (
                      <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08, type: "spring" }}
                        className={`aspect-square rounded-xl flex items-center justify-center text-lg ${
                          active ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30' : 'bg-gray-800/30 border border-gray-800/50'
                        }`}>
                        {active ? '🔥' : '○'}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-[#12121a] rounded-xl p-4 border border-gray-800/50">
                <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-400" /> Hitos</h3>
                <div className="space-y-2">
                  {[
                    { days: 3, name: "En Racha", emoji: "⚡", bonus: "+50%" },
                    { days: 7, name: "Imparable", emoji: "🔥", bonus: "+100%" },
                    { days: 14, name: "Heroico", emoji: "🛡️", bonus: "+200%" },
                    { days: 21, name: "Épico", emoji: "⭐", bonus: "+300%" },
                    { days: 30, name: "Legendario", emoji: "👑", bonus: "+400%" },
                  ].map((m, i) => {
                    const achieved = child.currentStreak >= m.days;
                    return (
                      <motion.div key={m.days} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                          achieved ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-gray-800/50 opacity-50'
                        }`}>
                        <span className="text-xl">{achieved ? m.emoji : '🔒'}</span>
                        <div className="flex-1">
                          <p className="font-bold text-xs text-white">{m.name}</p>
                          <p className="text-[10px] text-gray-500">{m.days} días</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          achieved ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'text-gray-500'
                        }`}>{achieved ? '✓' : m.bonus}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* REWARDS VIEW */}
          {viewMode === 'rewards' && (
            <motion.div key="rewards" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-300 flex items-center gap-2"><Gift className="w-5 h-5" style={{ color: child.color }} /> Tienda</h2>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-black text-yellow-400">{totalPoints}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {child.rewards.map((reward, i) => {
                  const canAfford = totalPoints >= reward.cost;
                  return (
                    <motion.div key={reward.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08, type: "spring" }}
                      onClick={() => {
                        if (canAfford) { soundEngine.playRewardRedeem(); toast.success(`¡Canjeaste "${reward.title}"!`, { style: { background: '#1a1a2e', color: '#10b981', border: '1px solid #10b98133' } }); }
                        else { soundEngine.playError(); toast.error(`Faltan ${reward.cost - totalPoints} pts`, { style: { background: '#1a1a2e', color: '#ef4444', border: '1px solid #ef444433' } }); }
                      }}
                      className={`relative overflow-hidden rounded-xl border p-4 cursor-pointer transition-all ${
                        canAfford ? 'border-gray-700 bg-[#12121a] hover:border-gray-600 active:scale-95' : 'border-gray-800/50 bg-[#12121a] opacity-50'
                      }`}>
                      {canAfford && <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at 50% 50%, ${child.color}, transparent 70%)` }} />}
                      <motion.span className="text-4xl block mb-2" animate={canAfford ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 3, repeat: Infinity }}>{reward.icon}</motion.span>
                      <h3 className="font-bold text-xs text-white mb-1">{reward.title}</h3>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" style={{ color: child.color }} />
                        <span className="font-black text-xs" style={{ color: child.color }}>{reward.cost}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* BADGES VIEW */}
          {viewMode === 'badges' && (
            <motion.div key="badges" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h2 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400" /> Insignias</h2>
              <div className="grid grid-cols-3 gap-3">
                {child.badges.map((badge, i) => (
                  <motion.div key={badge.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08, type: "spring" }}
                    className={`text-center p-4 rounded-xl border ${
                      badge.unlocked ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-gray-800/50 bg-[#12121a] opacity-40'
                    }`}>
                    <motion.span className="text-3xl block mb-2" animate={badge.unlocked ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}>
                      {badge.unlocked ? badge.icon : '🔒'}
                    </motion.span>
                    <p className="font-bold text-[10px] text-white">{badge.name}</p>
                    <p className="text-[9px] text-gray-500 mt-0.5">{badge.req}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Child switcher */}
        <div className="mt-6 mb-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-2">Cambiar perfil</p>
          <div className="flex gap-2">
            {Object.entries(childrenData).map(([id, data]) => (
              <button key={id} onClick={() => { setCurrentChildId(parseInt(id)); setCompletedTasks([]); setEarnedPoints(0); soundEngine.playTap(); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                  currentChildId === parseInt(id)
                    ? 'text-white' : 'text-gray-500 border-gray-800/50 bg-[#12121a] hover:border-gray-700'
                }`}
                style={currentChildId === parseInt(id) ? { background: `${data.color}15`, borderColor: `${data.color}44`, color: data.color } : {}}>
                <span>{data.emoji}</span> {data.name} ({data.age})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ HELPERS ============
function getStreakTier(streak: number) {
  if (streak >= 30) return { name: "LEGENDARIO", colorHex: "#a855f7", multiplier: 5 };
  if (streak >= 21) return { name: "ÉPICO", colorHex: "#f59e0b", multiplier: 4 };
  if (streak >= 14) return { name: "HEROICO", colorHex: "#6366f1", multiplier: 3 };
  if (streak >= 7) return { name: "IMPARABLE", colorHex: "#ef4444", multiplier: 2 };
  if (streak >= 3) return { name: "EN RACHA", colorHex: "#f97316", multiplier: 1.5 };
  return { name: "INICIANDO", colorHex: "#6b7280", multiplier: 1 };
}

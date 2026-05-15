import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Flame, Zap, Target, Clock, Shield, Trophy, Star, TrendingUp } from "lucide-react";
import { soundEngine } from "@/lib/sounds";

// ============ FAMILY DATA ============
const familyMembers = [
  {
    id: "papa",
    name: "Papá",
    role: "Logistics",
    emoji: "👨",
    color: "#6366f1",
    colorFrom: "from-indigo-500",
    colorTo: "to-blue-600",
    glowColor: "shadow-indigo-500/40",
    tasks: ["Armado de estantes", "Sacar Basura", "Bodega"],
    taskIcons: ["🔧", "🗑️", "📦"],
    points: 380,
    maxPoints: 500,
    streak: 4,
    completedToday: 2,
    totalTasks: 3,
    level: 6,
  },
  {
    id: "mama",
    name: "Mamá",
    role: "Curadora/Supervisora",
    emoji: "👩",
    color: "#ec4899",
    colorFrom: "from-pink-500",
    colorTo: "to-rose-600",
    glowColor: "shadow-pink-500/40",
    tasks: ["Cocina", "Inventario Ropa", "Juez de Checklists"],
    taskIcons: ["🍳", "👗", "✅"],
    points: 420,
    maxPoints: 500,
    streak: 6,
    completedToday: 3,
    totalTasks: 3,
    level: 7,
  },
  {
    id: "hijo",
    name: "Hijo",
    age: 15,
    role: "Fuerza",
    emoji: "👦",
    color: "#06b6d4",
    colorFrom: "from-cyan-500",
    colorTo: "to-teal-600",
    glowColor: "shadow-cyan-500/40",
    tasks: ["Barrer y Trapear", "Su Cuarto", "Hamaca", "Sofá Cama"],
    taskIcons: ["🧹", "🛏️", "🪢", "🛋️"],
    points: 310,
    maxPoints: 500,
    streak: 7,
    completedToday: 2,
    totalTasks: 4,
    level: 5,
    childId: 1,
  },
  {
    id: "hija12",
    name: "Hija",
    age: 12,
    role: "Digital/Ventas",
    emoji: "👧",
    color: "#f59e0b",
    colorFrom: "from-amber-500",
    colorTo: "to-orange-600",
    glowColor: "shadow-amber-500/40",
    tasks: ["Doblar Ropa", "Fotos Venta", "Postear Marketplace"],
    taskIcons: ["👕", "📸", "📱"],
    points: 290,
    maxPoints: 500,
    streak: 5,
    completedToday: 1,
    totalTasks: 3,
    level: 4,
    childId: 2,
    bonusText: "+20 per Sale",
  },
  {
    id: "hija10",
    name: "Hija",
    age: 10,
    role: "Brigada",
    emoji: "🧒",
    color: "#10b981",
    colorFrom: "from-emerald-500",
    colorTo: "to-green-600",
    glowColor: "shadow-emerald-500/40",
    tasks: ["Sacudir Polvo", "Etiquetar Cajas", "Pasillo/Escaleras"],
    taskIcons: ["🧹", "🏷️", "🪜"],
    points: 260,
    maxPoints: 500,
    streak: 3,
    completedToday: 1,
    totalTasks: 3,
    level: 3,
    childId: 3,
    bonusText: "+20 per Sale",
  },
];

const weeklyGoal = 500;
const familyTotalPoints = familyMembers.reduce((sum, m) => sum + m.points, 0);
const familyAvgPoints = Math.round(familyTotalPoints / familyMembers.length);

// Schedule data
const schedule = [
  { time: "16:00", activity: "Baile (Lun/Mié)", color: "#ec4899" },
  { time: "16:30", activity: "HORA DE APORTE", color: "#f59e0b", highlight: true },
  { time: "17:30", activity: "Actividades libres", color: "#6366f1" },
  { time: "18:00", activity: "Baile", color: "#ec4899" },
  { time: "18:30", activity: "Baile (Lun/Mié)", color: "#ec4899" },
  { time: "20:00", activity: "REVISIÓN & DESBLOQUEO", color: "#10b981", highlight: true },
];

// Rules
const rules = [
  { id: 1, text: "Pasillo vacío", icon: "🚪", photo: "Foto 1" },
  { id: 2, text: "Hamaca enrollada", icon: "🪢", photo: "Foto 2" },
  { id: 3, text: "Bodega organizada", icon: "📦", photo: "Foto 5" },
  { id: 4, text: "WiFi/Controles bajo checklist", icon: "📶", penalty: "-20 PTS" },
];

export default function FamilyHub() {
  const [, setLocation] = useLocation();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'rules'>('overview');

  const handleMemberClick = (member: typeof familyMembers[0]) => {
    soundEngine.playTap();
    if (selectedMember === member.id) {
      // Navigate to their tasks if they have a childId
      if (member.childId) {
        setLocation(`/child/${member.childId}/tasks-improved`);
      }
      setSelectedMember(null);
    } else {
      setSelectedMember(member.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative overflow-hidden"
      >
        {/* Header bg gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 to-transparent" />
        <div className="relative px-5 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => { soundEngine.playTap(); setLocation("/welcome"); }} className="text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight">
                <span className="text-white">HOME</span>
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">SYNC</span>
              </h1>
              <p className="text-[10px] text-gray-500 tracking-[0.3em] uppercase">Mudanza & Orden</p>
            </div>
            <div className="w-6" />
          </div>

          {/* Weekly Goal Gauge */}
          <WeeklyGauge points={familyAvgPoints} goal={weeklyGoal} />
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="px-5 mb-4">
        <div className="flex gap-1 bg-[#12121a] rounded-xl p-1 border border-gray-800/50">
          {[
            { id: 'overview' as const, label: 'Equipo', icon: '👥' },
            { id: 'schedule' as const, label: 'Horario', icon: '🕐' },
            { id: 'rules' as const, label: 'Reglas', icon: '📋' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { soundEngine.playTap(); setActiveTab(tab.id); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {familyMembers.map((member, i) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  index={i}
                  isSelected={selectedMember === member.id}
                  onClick={() => handleMemberClick(member)}
                />
              ))}

              {/* Family Stats */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-3 mt-6"
              >
                <StatCard icon={<Zap className="w-4 h-4" />} label="Total Pts" value={familyTotalPoints.toString()} color="text-yellow-400" />
                <StatCard icon={<Flame className="w-4 h-4" />} label="Mejor Racha" value="7d" color="text-orange-400" />
                <StatCard icon={<Trophy className="w-4 h-4" />} label="Completado" value={`${Math.round((familyMembers.reduce((s, m) => s + m.completedToday, 0) / familyMembers.reduce((s, m) => s + m.totalTasks, 0)) * 100)}%`} color="text-emerald-400" />
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-2"
            >
              <h2 className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Cronograma de Pantallas
                <span className="text-xs text-gray-500 ml-auto">Lun - Vie</span>
              </h2>
              {schedule.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                    item.highlight
                      ? 'bg-gradient-to-r from-[#1a1a2e] to-[#16162a] border-indigo-500/30'
                      : 'bg-[#12121a] border-gray-800/50'
                  }`}
                >
                  <div className="text-sm font-mono font-bold text-gray-400 w-14">{item.time}</div>
                  <div className="w-1 h-8 rounded-full" style={{ background: item.color }} />
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${item.highlight ? 'text-white' : 'text-gray-300'}`}>
                      {item.activity}
                    </p>
                  </div>
                  {item.highlight && (
                    <motion.div
                      className="w-2 h-2 rounded-full bg-green-400"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'rules' && (
            <motion.div
              key="rules"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <h2 className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                Reglas Innegociables
              </h2>
              {rules.map((rule, i) => (
                <motion.div
                  key={rule.id}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#12121a] border border-gray-800/50 hover:border-red-500/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center text-2xl border border-red-500/20">
                    {rule.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-white">{rule.text}</p>
                    {rule.photo && (
                      <p className="text-xs text-gray-500 mt-0.5">📷 {rule.photo} requerida</p>
                    )}
                  </div>
                  {rule.penalty && (
                    <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                      {rule.penalty}
                    </span>
                  )}
                </motion.div>
              ))}

              {/* Rewards section */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Recompensas al cumplir
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: "📺", label: "Pantallas" },
                    { icon: "▶️", label: "YouTube" },
                    { icon: "💰", label: "Dinero" },
                    { icon: "⭐", label: "Bonus" },
                  ].map((reward, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                      className="text-center p-3 rounded-xl bg-[#12121a] border border-gray-800/50"
                    >
                      <span className="text-2xl block mb-1">{reward.icon}</span>
                      <span className="text-[10px] text-gray-500">{reward.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============ MEMBER CARD COMPONENT ============
function MemberCard({ member, index, isSelected, onClick }: {
  member: typeof familyMembers[0];
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const progressPercent = (member.completedToday / member.totalTasks) * 100;
  const pointsPercent = (member.points / member.maxPoints) * 100;

  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
    >
      <motion.div
        onClick={onClick}
        className={`relative overflow-hidden rounded-2xl border cursor-pointer transition-all ${
          isSelected
            ? `border-[${member.color}]/50 shadow-lg ${member.glowColor}`
            : 'border-gray-800/50 hover:border-gray-700'
        }`}
        whileTap={{ scale: 0.98 }}
        layout
      >
        {/* Card background */}
        <div className="absolute inset-0 bg-[#12121a]" />
        <div className="absolute inset-0 opacity-5 bg-gradient-to-r" style={{
          background: `linear-gradient(135deg, ${member.color}22, transparent)`,
        }} />

        <div className="relative p-4">
          {/* Top row: Avatar + Info + Stats */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <motion.div
              className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${member.colorFrom} ${member.colorTo} flex items-center justify-center text-2xl shadow-lg`}
              style={{ boxShadow: `0 4px 20px ${member.color}33` }}
              animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {member.emoji}
              {/* Level badge */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-md bg-[#0a0a0f] border border-gray-700 flex items-center justify-center">
                <span className="text-[10px] font-black text-white">{member.level}</span>
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base">{member.name}</h3>
                {member.age && <span className="text-xs text-gray-500">({member.age})</span>}
              </div>
              <p className="text-xs text-gray-500 font-medium">{member.role}</p>
            </div>

            {/* Right stats */}
            <div className="flex items-center gap-3">
              {/* Streak */}
              {member.streak >= 3 && (
                <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-1 rounded-lg border border-orange-500/20">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-xs font-bold text-orange-400">{member.streak}</span>
                </div>
              )}
              {/* Points */}
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-sm font-black text-white">{member.points}</span>
                </div>
                <span className="text-[10px] text-gray-500">/ {member.maxPoints}</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(to right, ${member.color}, ${member.color}cc)` }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
            <span className="text-[10px] font-bold text-gray-400">
              {member.completedToday}/{member.totalTasks}
            </span>
          </div>

          {/* Expanded content */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-3 mt-3 border-t border-gray-800/50">
                  {/* Tasks list */}
                  <div className="grid grid-cols-2 gap-2">
                    {member.tasks.map((task, ti) => (
                      <motion.div
                        key={ti}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: ti * 0.05 }}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                          ti < member.completedToday
                            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                            : 'bg-gray-800/30 border border-gray-800/50 text-gray-400'
                        }`}
                      >
                        <span>{member.taskIcons[ti]}</span>
                        <span className="truncate font-medium">{task}</span>
                        {ti < member.completedToday && <span className="ml-auto">✓</span>}
                      </motion.div>
                    ))}
                  </div>
                  {member.bonusText && (
                    <div className="mt-2 text-center">
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                        🏷️ {member.bonusText}
                      </span>
                    </div>
                  )}
                  {member.childId && (
                    <motion.button
                      className="w-full mt-3 py-2.5 rounded-xl text-sm font-bold text-white border transition-all"
                      style={{
                        background: `linear-gradient(135deg, ${member.color}22, ${member.color}11)`,
                        borderColor: `${member.color}44`,
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Ver Tareas Completas →
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============ WEEKLY GAUGE COMPONENT ============
function WeeklyGauge({ points, goal }: { points: number; goal: number }) {
  const percentage = Math.min((points / goal) * 100, 100);
  const angle = (percentage / 100) * 180 - 90; // -90 to 90 degrees

  // Color based on percentage
  const getColor = (pct: number) => {
    if (pct >= 80) return '#10b981';
    if (pct >= 60) return '#f59e0b';
    if (pct >= 40) return '#f97316';
    return '#ef4444';
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="relative bg-[#12121a] rounded-2xl p-5 border border-gray-800/50 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 opacity-10" style={{
        background: `radial-gradient(circle at 50% 80%, ${getColor(percentage)}, transparent 70%)`,
      }} />

      <div className="relative flex items-center gap-5">
        {/* Gauge */}
        <div className="relative w-28 h-16">
          <svg viewBox="0 0 120 70" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 10 65 A 50 50 0 0 1 110 65"
              fill="none"
              stroke="#1f1f2e"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Colored segments */}
            <path d="M 10 65 A 50 50 0 0 1 35 22" fill="none" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
            <path d="M 35 22 A 50 50 0 0 1 60 15" fill="none" stroke="#f97316" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
            <path d="M 60 15 A 50 50 0 0 1 85 22" fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
            <path d="M 85 22 A 50 50 0 0 1 110 65" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
            {/* Needle */}
            <motion.line
              x1="60"
              y1="65"
              x2="60"
              y2="25"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ transformOrigin: '60px 65px' }}
              initial={{ rotate: -90 }}
              animate={{ rotate: angle }}
              transition={{ duration: 1.5, type: "spring", stiffness: 50 }}
            />
            {/* Center dot */}
            <circle cx="60" cy="65" r="4" fill="white" />
          </svg>
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Meta Semanal</p>
          <div className="flex items-baseline gap-1">
            <motion.span
              className="text-3xl font-black"
              style={{ color: getColor(percentage) }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {points}
            </motion.span>
            <span className="text-gray-500 text-sm font-bold">/ {goal} pts</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-bold">Promedio familiar</span>
          </div>
        </div>

        {/* Reward icons */}
        <div className="flex flex-col gap-1">
          {['📺', '▶️', '💰', '⭐'].map((icon, i) => (
            <motion.span
              key={i}
              className={`text-lg ${percentage >= (i + 1) * 25 ? 'opacity-100' : 'opacity-20'}`}
              animate={percentage >= (i + 1) * 25 ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              {icon}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============ STAT CARD COMPONENT ============
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-[#12121a] rounded-xl p-3 border border-gray-800/50 text-center">
      <div className={`${color} flex justify-center mb-1`}>{icon}</div>
      <p className="text-lg font-black text-white">{value}</p>
      <p className="text-[10px] text-gray-500 font-medium">{label}</p>
    </div>
  );
}

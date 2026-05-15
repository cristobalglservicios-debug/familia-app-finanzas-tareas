import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Zap, Crown, Shield, Star } from "lucide-react";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  onStreakAnimation?: () => void;
  compact?: boolean;
}

// Streak tiers with epic names
const getStreakTier = (streak: number) => {
  if (streak >= 30) return { name: "LEGENDARIO", color: "from-purple-500 via-pink-500 to-red-500", icon: Crown, emoji: "👑", multiplier: 5 };
  if (streak >= 21) return { name: "ÉPICO", color: "from-yellow-400 via-orange-500 to-red-500", icon: Star, emoji: "⚡", multiplier: 4 };
  if (streak >= 14) return { name: "HEROICO", color: "from-blue-400 via-purple-500 to-pink-500", icon: Shield, emoji: "🛡️", multiplier: 3 };
  if (streak >= 7) return { name: "IMPARABLE", color: "from-orange-400 via-red-500 to-pink-500", icon: Flame, emoji: "🔥", multiplier: 2 };
  if (streak >= 3) return { name: "EN RACHA", color: "from-yellow-400 to-orange-500", icon: Zap, emoji: "⚡", multiplier: 1.5 };
  return { name: "INICIANDO", color: "from-gray-400 to-gray-500", icon: Flame, emoji: "💪", multiplier: 1 };
};

export default function StreakDisplay({ currentStreak, longestStreak, onStreakAnimation, compact = false }: StreakDisplayProps) {
  const [showFlames, setShowFlames] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const tier = getStreakTier(currentStreak);
  const TierIcon = tier.icon;
  const flameInterval = useRef<NodeJS.Timeout>(null as unknown as NodeJS.Timeout);

  useEffect(() => {
    if (currentStreak >= 3) {
      setShowFlames(true);
      // Pulse animation every few seconds
      flameInterval.current = setInterval(() => {
        setPulseCount(p => p + 1);
      }, 3000);
    }
    return () => {
      if (flameInterval.current) clearInterval(flameInterval.current);
    };
  }, [currentStreak]);

  if (compact) {
    return (
      <motion.div
        className={`relative flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${tier.color} text-white font-bold shadow-lg`}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {currentStreak >= 3 && (
          <motion.div
            className="absolute -inset-1 rounded-full opacity-30 blur-sm"
            style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        <TierIcon className="w-5 h-5" />
        <span className="text-lg">{currentStreak}</span>
        <span className="text-xs opacity-80">días</span>
        {currentStreak >= 7 && (
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
            x{tier.multiplier}
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Background with animated gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-90`} />
      
      {/* Animated fire particles in background */}
      {showFlames && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: i % 2 === 0 ? '#FFD700' : '#FF6347',
                left: `${10 + (i * 8)}%`,
                bottom: '0%',
              }}
              animate={{
                y: [0, -80 - Math.random() * 60],
                opacity: [0.8, 0],
                scale: [1, 0.3],
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <TierIcon className="w-8 h-8" />
            </motion.div>
            <div>
              <motion.p
                className="text-xs font-bold uppercase tracking-wider opacity-80"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {tier.name}
              </motion.p>
              <p className="text-sm opacity-70">Racha actual</p>
            </div>
          </div>
          
          {/* Multiplier badge */}
          {tier.multiplier > 1 && (
            <motion.div
              className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-sm font-black">x{tier.multiplier} BONUS</span>
            </motion.div>
          )}
        </div>

        {/* Big streak number */}
        <div className="flex items-end gap-2 mb-4">
          <motion.span
            className="text-7xl font-black leading-none"
            key={currentStreak}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            {currentStreak}
          </motion.span>
          <span className="text-2xl font-bold opacity-70 mb-2">días</span>
          <motion.span
            className="text-4xl mb-2"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          >
            {tier.emoji}
          </motion.span>
        </div>

        {/* Progress to next tier */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1 opacity-80">
            <span>Progreso al siguiente nivel</span>
            <span>{getNextTierInfo(currentStreak)}</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/80 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressToNextTier(currentStreak)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between pt-3 border-t border-white/20">
          <div className="text-center">
            <p className="text-xs opacity-70">Mejor racha</p>
            <p className="font-black text-lg">{longestStreak} días</p>
          </div>
          <div className="text-center">
            <p className="text-xs opacity-70">Bonus puntos</p>
            <p className="font-black text-lg">+{Math.round((tier.multiplier - 1) * 100)}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs opacity-70">Rango</p>
            <p className="font-black text-lg">{tier.emoji} {tier.name}</p>
          </div>
        </div>
      </div>

      {/* Glow effect */}
      {currentStreak >= 7 && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: `0 0 30px rgba(255, 100, 0, 0.3), 0 0 60px rgba(255, 50, 0, 0.1)`,
          }}
          animate={{
            boxShadow: [
              '0 0 30px rgba(255, 100, 0, 0.3), 0 0 60px rgba(255, 50, 0, 0.1)',
              '0 0 50px rgba(255, 100, 0, 0.5), 0 0 80px rgba(255, 50, 0, 0.2)',
              '0 0 30px rgba(255, 100, 0, 0.3), 0 0 60px rgba(255, 50, 0, 0.1)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

function getNextTierInfo(streak: number): string {
  if (streak >= 30) return "¡MÁXIMO NIVEL!";
  if (streak >= 21) return `${30 - streak} días para LEGENDARIO`;
  if (streak >= 14) return `${21 - streak} días para ÉPICO`;
  if (streak >= 7) return `${14 - streak} días para HEROICO`;
  if (streak >= 3) return `${7 - streak} días para IMPARABLE`;
  return `${3 - streak} días para EN RACHA`;
}

function getProgressToNextTier(streak: number): number {
  if (streak >= 30) return 100;
  if (streak >= 21) return ((streak - 21) / 9) * 100;
  if (streak >= 14) return ((streak - 14) / 7) * 100;
  if (streak >= 7) return ((streak - 7) / 7) * 100;
  if (streak >= 3) return ((streak - 3) / 4) * 100;
  return (streak / 3) * 100;
}

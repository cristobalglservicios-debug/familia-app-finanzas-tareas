import { motion } from "framer-motion";
import { Star, ChevronUp } from "lucide-react";

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  showLevelUp?: boolean;
}

const levelNames: Record<number, string> = {
  1: "Novato",
  2: "Aprendiz",
  3: "Explorador",
  4: "Guerrero",
  5: "Campeón",
  6: "Héroe",
  7: "Maestro",
  8: "Leyenda",
  9: "Mítico",
  10: "Supremo",
};

const levelColors: Record<number, string> = {
  1: "from-gray-400 to-gray-500",
  2: "from-green-400 to-green-600",
  3: "from-blue-400 to-blue-600",
  4: "from-purple-400 to-purple-600",
  5: "from-orange-400 to-red-500",
  6: "from-pink-400 to-red-600",
  7: "from-yellow-400 to-orange-500",
  8: "from-indigo-400 via-purple-500 to-pink-500",
  9: "from-cyan-400 via-blue-500 to-purple-600",
  10: "from-yellow-300 via-red-500 to-purple-600",
};

export default function XPBar({ currentXP, maxXP, level, showLevelUp = false }: XPBarProps) {
  const percentage = Math.min((currentXP / maxXP) * 100, 100);
  const levelName = levelNames[level] || "Supremo";
  const colorClass = levelColors[Math.min(level, 10)] || levelColors[10];

  return (
    <div className="relative">
      {/* Level Up Animation */}
      {showLevelUp && (
        <motion.div
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], y: [20, 0, -10, -30], scale: [0.5, 1.2, 1, 0.8] }}
          transition={{ duration: 2 }}
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-black text-lg shadow-2xl flex items-center gap-2">
            <ChevronUp className="w-6 h-6" />
            ¡NIVEL {level}!
            <ChevronUp className="w-6 h-6" />
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-3">
        {/* Level Badge */}
        <motion.div
          className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}
          animate={showLevelUp ? { scale: [1, 1.3, 1], rotate: [0, 360] } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-white font-black text-xl">{level}</span>
          {/* Glow ring */}
          {level >= 5 && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/50"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* XP Bar */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-bold text-foreground">{levelName}</span>
            <span className="text-xs text-muted-foreground font-semibold">
              {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
            </span>
          </div>
          
          <div className="relative w-full h-4 bg-muted rounded-full overflow-hidden border border-border">
            {/* Background shimmer */}
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            
            {/* XP fill */}
            <motion.div
              className={`h-full bg-gradient-to-r ${colorClass} rounded-full relative`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Shine effect on bar */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
              
              {/* Pulse at the end */}
              {percentage > 5 && (
                <motion.div
                  className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 rounded-full"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          </div>

          {/* Next level info */}
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">
              {Math.round(percentage)}% completado
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Star className="w-3 h-3" />
              Siguiente: {levelNames[level + 1] || "¡MÁXIMO!"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

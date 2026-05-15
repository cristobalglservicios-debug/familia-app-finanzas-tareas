import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface StreakCelebrationProps {
  show: boolean;
  streakCount: number;
  onComplete?: () => void;
}

/**
 * Full-screen streak celebration animation
 * Shows when a streak milestone is reached
 */
export default function StreakCelebration({ show, streakCount, onComplete }: StreakCelebrationProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (show) {
      setPhase(1);
      const t1 = setTimeout(() => setPhase(2), 800);
      const t2 = setTimeout(() => setPhase(3), 2000);
      const t3 = setTimeout(() => {
        setPhase(0);
        onComplete?.();
      }, 4000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [show, onComplete]);

  const getMilestoneInfo = (streak: number) => {
    if (streak >= 30) return { title: "¡LEGENDARIO!", subtitle: "30 días de racha", emoji: "👑", color: "from-purple-600 via-pink-500 to-red-500" };
    if (streak >= 21) return { title: "¡ÉPICO!", subtitle: "21 días de racha", emoji: "⚡", color: "from-yellow-500 via-orange-500 to-red-500" };
    if (streak >= 14) return { title: "¡HEROICO!", subtitle: "14 días de racha", emoji: "🛡️", color: "from-blue-500 via-purple-500 to-pink-500" };
    if (streak >= 7) return { title: "¡IMPARABLE!", subtitle: "7 días de racha", emoji: "🔥", color: "from-orange-500 via-red-500 to-pink-500" };
    if (streak >= 3) return { title: "¡EN RACHA!", subtitle: "3 días seguidos", emoji: "⚡", color: "from-yellow-400 to-orange-500" };
    return { title: "¡PRIMER DÍA!", subtitle: "¡Empezaste!", emoji: "💪", color: "from-green-400 to-blue-500" };
  };

  const info = getMilestoneInfo(streakCount);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Radial burst */}
          {phase >= 1 && (
            <motion.div
              className={`absolute w-[200vw] h-[200vh] bg-gradient-radial ${info.color} opacity-20`}
              initial={{ scale: 0 }}
              animate={{ scale: 1, opacity: [0.3, 0] }}
              transition={{ duration: 1.5 }}
            />
          )}

          {/* Fire ring */}
          {phase >= 2 && streakCount >= 7 && (
            <>
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`ring-${i}`}
                  className="absolute w-4 h-4 rounded-full"
                  style={{
                    background: i % 2 === 0 ? '#FF6347' : '#FFD700',
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: Math.cos((i / 20) * Math.PI * 2) * 150,
                    y: Math.sin((i / 20) * Math.PI * 2) * 150,
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}

          {/* Main content */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.3 }}
          >
            {/* Emoji */}
            <motion.div
              className="text-8xl mb-4"
              animate={{
                scale: [1, 1.4, 1],
                rotate: [0, 15, -15, 0],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {info.emoji}
            </motion.div>

            {/* Streak number */}
            <motion.div
              className="relative mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <span className={`text-8xl font-black bg-gradient-to-b ${info.color} bg-clip-text text-transparent`}>
                {streakCount}
              </span>
              <motion.span
                className="absolute -top-2 -right-8 text-3xl"
                animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🔥
              </motion.span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className={`text-4xl font-black bg-gradient-to-r ${info.color} bg-clip-text text-transparent mb-2`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {info.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-white/80 text-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {info.subtitle}
            </motion.p>

            {/* Bonus info */}
            {phase >= 3 && (
              <motion.div
                className="mt-6 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <span className="text-white font-bold">
                  ¡Bonus de puntos activado! ✨
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Floating emojis */}
          {phase >= 2 && (
            <>
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={`float-${i}`}
                  className="absolute text-3xl"
                  initial={{
                    x: (Math.random() - 0.5) * window.innerWidth,
                    y: window.innerHeight / 2 + 100,
                    opacity: 0,
                  }}
                  animate={{
                    y: -100,
                    opacity: [0, 1, 0],
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    delay: i * 0.15,
                    ease: "easeOut",
                  }}
                >
                  {['🔥', '⭐', '✨', '💫', '🌟', '⚡'][i % 6]}
                </motion.div>
              ))}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

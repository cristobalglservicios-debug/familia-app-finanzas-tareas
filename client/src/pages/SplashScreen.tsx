import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { soundEngine } from "@/lib/sounds";

export default function SplashScreen() {
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Cinematic sequence
    const t0 = setTimeout(() => setPhase(1), 300);    // Logo appears
    const t1 = setTimeout(() => setPhase(2), 1500);   // Title text
    const t2 = setTimeout(() => setPhase(3), 2800);   // Subtitle + glow
    const t3 = setTimeout(() => setShowContent(true), 3500); // Buttons
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleEnter = (path: string) => {
    soundEngine.playTap();
    setPhase(10); // exit animation
    setTimeout(() => setLocation(path), 600);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex flex-col items-center justify-center">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Animated orbs */}
      {[
        { color: '#6366f1', x: '20%', y: '30%', size: 300, delay: 0 },
        { color: '#ec4899', x: '75%', y: '60%', size: 250, delay: 1 },
        { color: '#06b6d4', x: '50%', y: '20%', size: 200, delay: 2 },
        { color: '#f59e0b', x: '30%', y: '70%', size: 180, delay: 0.5 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[100px] opacity-20"
          style={{
            background: orb.color,
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}

      {/* Scan lines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
      }} />

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-lg w-full"
        animate={phase === 10 ? { opacity: 0, scale: 0.9 } : {}}
        transition={{ duration: 0.5 }}
      >
        {/* Logo icon */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 12 }}
              className="mb-6 inline-block"
            >
              <div className="relative">
                {/* Outer glow ring */}
                <motion.div
                  className="absolute -inset-4 rounded-3xl opacity-40 blur-xl"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899, #06b6d4)' }}
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                {/* Logo container */}
                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                  <span className="text-5xl">🏠</span>
                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-1">
                <span className="bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent">
                  HOME
                </span>
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SYNC
                </span>
              </h1>
              <motion.div
                className="h-[2px] mx-auto bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: '80%' }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtitle */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mt-4 mb-10"
            >
              <p className="text-gray-400 text-lg font-light tracking-widest uppercase">
                Mudanza & Orden
              </p>
              <p className="text-gray-500 text-sm mt-1 font-light">
                Plan Familiar Gamificado
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-4"
            >
              {/* Family Hub Button */}
              <motion.button
                onClick={() => handleEnter("/hub")}
                className="w-full group relative overflow-hidden rounded-xl p-[1px]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl" />
                <div className="relative bg-[#12121a] rounded-xl px-6 py-4 flex items-center gap-4 group-hover:bg-[#16162a] transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <span className="text-2xl">👨‍👩‍👧‍👦</span>
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-white font-bold text-lg">Hub Familiar</h3>
                    <p className="text-gray-400 text-sm">Dashboard de toda la familia</p>
                  </div>
                  <motion.div
                    className="text-gray-500 text-xl"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </div>
              </motion.button>

              {/* My Tasks Button */}
              <motion.button
                onClick={() => handleEnter("/")}
                className="w-full group relative overflow-hidden rounded-xl p-[1px]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-xl" />
                <div className="relative bg-[#12121a] rounded-xl px-6 py-4 flex items-center gap-4 group-hover:bg-[#16162a] transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-white font-bold text-lg">Mis Tareas</h3>
                    <p className="text-gray-400 text-sm">Selecciona tu perfil</p>
                  </div>
                  <motion.div
                    className="text-gray-500 text-xl"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  >
                    →
                  </motion.div>
                </div>
              </motion.button>

              {/* Admin Button */}
              <motion.button
                onClick={() => handleEnter("/admin/login")}
                className="w-full group relative overflow-hidden rounded-xl p-[1px]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-xl opacity-70" />
                <div className="relative bg-[#12121a] rounded-xl px-6 py-4 flex items-center gap-4 group-hover:bg-[#16162a] transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <span className="text-2xl">🔐</span>
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-white font-bold text-lg">Panel Admin</h3>
                    <p className="text-gray-400 text-sm">Papá / Mamá</p>
                  </div>
                  <motion.div
                    className="text-gray-500 text-xl"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                  >
                    →
                  </motion.div>
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Version tag */}
        <AnimatePresence>
          {showContent && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-gray-600 text-xs tracking-widest uppercase"
            >
              v2.0 • Familia González
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom decorative line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      />
    </div>
  );
}

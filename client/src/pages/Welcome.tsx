import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Users, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { soundEngine } from "@/lib/sounds";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/30 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: 60 + i * 20,
              height: 60 + i * 20,
              background: `linear-gradient(135deg, ${['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#EF4444', '#84CC16'][i]}, transparent)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.7,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="relative z-10 text-center max-w-md w-full"
      >
        {/* Logo / Title */}
        <motion.div
          className="mb-8"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-xl mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2">
            Familia App
          </h1>
          <p className="text-muted-foreground text-lg font-light">
            Tareas, puntos y diversión en familia
          </p>
        </motion.div>

        {/* Selection Cards */}
        <div className="space-y-4">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Card
              onClick={() => {
                soundEngine.playTap();
                setLocation("/admin/login");
              }}
              className="p-6 border-2 border-border/50 cursor-pointer hover:border-primary/50 hover:shadow-xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                >
                  <Users className="w-7 h-7 text-white" />
                </motion.div>
                <div className="text-left flex-1">
                  <h3 className="font-black text-lg">Soy Papá / Mamá</h3>
                  <p className="text-sm text-muted-foreground">Administrar tareas y finanzas</p>
                </div>
                <motion.div
                  className="text-2xl"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <Card
              onClick={() => {
                soundEngine.playTap();
                setLocation("/");
              }}
              className="p-6 border-2 border-border/50 cursor-pointer hover:border-secondary/50 hover:shadow-xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                >
                  <Heart className="w-7 h-7 text-white" />
                </motion.div>
                <div className="text-left flex-1">
                  <h3 className="font-black text-lg">Soy Hijo / Hija</h3>
                  <p className="text-sm text-muted-foreground">Ver mis tareas y ganar puntos</p>
                </div>
                <motion.div
                  className="text-2xl"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                >
                  →
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-xs text-muted-foreground"
        >
          Hecho con ❤️ para nuestra familia
        </motion.p>
      </motion.div>
    </div>
  );
}

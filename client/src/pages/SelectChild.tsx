import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, LogOut, Flame, Star, Trophy, Zap, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { soundEngine } from "@/lib/sounds";

const children = [
  {
    id: 1,
    name: "Fabio",
    age: 15,
    avatarEmoji: "🦊",
    color: "from-blue-500 via-indigo-500 to-purple-600",
    bgGlow: "shadow-blue-500/30",
    points: 2450,
    level: 5,
    streak: 7,
    levelName: "Campeón",
  },
  {
    id: 2,
    name: "Frida",
    age: 11,
    avatarEmoji: "🦋",
    color: "from-pink-500 via-rose-500 to-red-500",
    bgGlow: "shadow-pink-500/30",
    points: 1890,
    level: 4,
    streak: 5,
    levelName: "Guerrera",
  },
  {
    id: 3,
    name: "Julieta",
    age: 10,
    avatarEmoji: "🌸",
    color: "from-green-500 via-emerald-500 to-teal-500",
    bgGlow: "shadow-green-500/30",
    points: 1650,
    level: 3,
    streak: 3,
    levelName: "Exploradora",
  },
];

export default function SelectChild() {
  const [, setLocation] = useLocation();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelectChild = (childId: number) => {
    soundEngine.playTap();
    setSelectedId(childId);
    localStorage.setItem("selectedChildId", childId.toString());
    
    // Delay navigation for animation
    setTimeout(() => {
      setLocation(`/child/${childId}/tasks-improved`);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full opacity-10"
            style={{
              background: `linear-gradient(135deg, ${['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'][i]}, transparent)`,
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="relative z-10 p-6 md:p-8 text-center"
      >
        <motion.div
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-border/50 mb-4"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Crown className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-bold text-muted-foreground">Familia App</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2">
          ¿Quién eres? 👋
        </h1>
        <p className="text-muted-foreground font-light text-lg">
          Selecciona tu perfil para comenzar
        </p>
      </motion.div>

      {/* Children Selection */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {children.map((child, i) => (
            <motion.div
              key={child.id}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.15, type: "spring", stiffness: 100 }}
            >
              <Card
                onClick={() => handleSelectChild(child.id)}
                className={`relative overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                  selectedId === child.id
                    ? `border-transparent shadow-2xl ${child.bgGlow} scale-95`
                    : 'border-border/50 hover:border-primary/30 hover:shadow-xl hover:scale-[1.02]'
                }`}
              >
                {/* Gradient top bar */}
                <div className={`h-2 bg-gradient-to-r ${child.color}`} />
                
                <div className="p-6">
                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    <motion.div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${child.color} flex items-center justify-center text-4xl shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    >
                      {child.avatarEmoji}
                    </motion.div>
                  </div>

                  {/* Name */}
                  <h2 className="text-2xl font-black text-center mb-1">{child.name}</h2>
                  <p className="text-center text-muted-foreground text-sm mb-4">
                    {child.age} años • {child.levelName}
                  </p>

                  {/* Stats */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-muted-foreground">Puntos</span>
                      </div>
                      <span className="font-black text-sm">{child.points.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-muted-foreground">Nivel</span>
                      </div>
                      <span className="font-black text-sm">{child.level}</span>
                    </div>
                    <div className="flex items-center justify-between bg-orange-50 rounded-lg px-3 py-2 border border-orange-100">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-orange-700 font-medium">Racha</span>
                      </div>
                      <motion.span
                        className="font-black text-sm text-orange-600"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {child.streak} días 🔥
                      </motion.span>
                    </div>
                  </div>

                  {/* Enter button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectChild(child.id);
                    }}
                    className={`w-full bg-gradient-to-r ${child.color} text-white font-bold shadow-lg hover:shadow-xl transition-all py-5`}
                  >
                    <span>Entrar</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Admin Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-3 pb-8"
        >
          <Card className="p-5 bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Panel de Papás</h3>
                  <p className="text-xs text-muted-foreground">Administrar tareas y finanzas</p>
                </div>
              </div>
              <Button
                onClick={() => {
                  soundEngine.playTap();
                  setLocation("/admin/login");
                }}
                variant="outline"
                className="font-bold text-sm border-2"
              >
                Acceder
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </Card>

          <Button
            onClick={() => {
              soundEngine.playTap();
              setLocation("/welcome");
            }}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

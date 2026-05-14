import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Target, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  tasks: string[];
  pointsToday: number;
  pointsWeek: number;
}

interface ScheduleItem {
  time: string;
  activity: string;
  person: string;
  color: string;
}

export default function FamilyDashboard() {
  const [, setLocation] = useLocation();

  const familyMembers: FamilyMember[] = [
    {
      id: "papa",
      name: "Papá",
      role: "Logistics",
      avatar: "👨",
      color: "bg-blue-100 border-blue-400",
      tasks: ["Armado de estantes", "Sacar basura", "Bodega"],
      pointsToday: 30,
      pointsWeek: 210,
    },
    {
      id: "mama",
      name: "Mamá",
      role: "Curadora/Supervisora",
      avatar: "👩",
      color: "bg-yellow-100 border-yellow-400",
      tasks: ["Cocina", "Inventario Ropa", "Juez de Checklists"],
      pointsToday: 45,
      pointsWeek: 315,
    },
    {
      id: "fabio",
      name: "Fabio (15)",
      role: "Fuerza",
      avatar: "👨‍🦱",
      color: "bg-green-100 border-green-400",
      tasks: ["Barrer y Trapear", "Su Cuarto", "Acomodar Juguetes"],
      pointsToday: 50,
      pointsWeek: 350,
    },
    {
      id: "frida",
      name: "Frida (11)",
      role: "Digital/Ventas",
      avatar: "👩‍🦰",
      color: "bg-purple-100 border-purple-400",
      tasks: ["Doblar Ropa", "Fotos Venta", "Postear Marketplace"],
      pointsToday: 35,
      pointsWeek: 245,
    },
    {
      id: "julieta",
      name: "Julieta (10)",
      role: "Brigada",
      avatar: "👧",
      color: "bg-pink-100 border-pink-400",
      tasks: ["Sacudir Polvo", "Etiquetar Cajas", "Pasillo/Escaleras"],
      pointsToday: 40,
      pointsWeek: 280,
    },
  ];

  const schedule: ScheduleItem[] = [
    { time: "16:00", activity: "LUN/MIE (BAILE)", person: "Todos", color: "bg-blue-200" },
    { time: "17:30", activity: "", person: "", color: "" },
    { time: "18:30", activity: "16:30-17:30 HORA DE APORTE", person: "Familia", color: "bg-red-200" },
    { time: "19:00", activity: "18:00 BAILE", person: "Todos", color: "bg-pink-200" },
    { time: "20:00", activity: "20:00 REVISIÓN & DESBLOQUEO", person: "Familia", color: "bg-green-200" },
  ];

  const weeklyGoal = 500;
  const currentWeekPoints = familyMembers.reduce((sum, member) => sum + member.pointsWeek, 0);
  const goalProgress = (currentWeekPoints / weeklyGoal) * 100;

  const rules = [
    { id: 1, title: "PASILLO VACÍO", image: "📸", status: "done" },
    { id: 2, title: "CUARTO HIJO ENROLLADO", image: "📸", status: "done" },
    { id: 3, title: "BODEGA ORGANIZADA", image: "📸", status: "pending" },
    { id: 4, title: "WIFI/CONTROLES BAJO CHECKLIST", image: "📱", status: "pending" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => setLocation("/admin/panel")}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <h1 className="text-4xl font-black text-slate-900">
            🏠 FAMILIA: MUDANZA & ORDEN | PLAN FAMILIAR
          </h1>
        </div>
        <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full" />
      </div>

      {/* Family Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {familyMembers.map((member) => (
          <Card key={member.id} className={`p-4 border-2 ${member.color}`}>
            <div className="text-center mb-3">
              <div className="text-5xl mb-2">{member.avatar}</div>
              <h3 className="font-black text-lg text-slate-900">{member.name}</h3>
              <p className="text-xs font-semibold text-slate-600 uppercase">{member.role}</p>
            </div>

            {/* Tasks */}
            <div className="mb-4 space-y-1">
              {member.tasks.map((task, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                  <span className="text-slate-700">{task}</span>
                </div>
              ))}
            </div>

            {/* Gamified Checklist */}
            <div className="bg-white rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600">Checklist Gamificado</span>
                <span className="text-lg">⭐</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: "70%" }} />
                  </div>
                  <span className="text-xs font-bold">+10 PTS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: "50%" }} />
                  </div>
                  <span className="text-xs font-bold">+10 PTS</span>
                </div>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-bold text-slate-600">
                  Hoy: <span className="text-lg text-slate-900">{member.pointsToday} PTS</span>
                </p>
              </div>
            </div>

            {/* Points Summary */}
            <div className="text-center text-xs">
              <p className="text-slate-600">Semana: <span className="font-black text-slate-900">{member.pointsWeek} PTS</span></p>
            </div>
          </Card>
        ))}
      </div>

      {/* Weekly Goal Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Goal */}
        <Card className="p-6 border-2 border-orange-300 bg-orange-50">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-black text-slate-900">META SEMANAL:</h2>
          </div>
          <p className="text-4xl font-black text-orange-600 mb-2">{weeklyGoal} PUNTOS!</p>
          <div className="mb-4">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span>Progreso</span>
              <span>{Math.round(goalProgress)}%</span>
            </div>
            <Progress value={goalProgress} className="h-3" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Puntos acumulados: <span className="text-orange-600 font-black">{currentWeekPoints}</span>
          </p>
        </Card>

        {/* Schedule */}
        <Card className="p-6 border-2 border-slate-400 bg-slate-50">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-slate-600" />
            <h2 className="text-xl font-black text-slate-900">CRONOGRAMA DE PANTALLAS</h2>
          </div>
          <div className="space-y-2 text-xs">
            {schedule.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="font-black text-slate-700 min-w-12">{item.time}</span>
                {item.color ? (
                  <div className={`flex-1 px-2 py-1 rounded font-semibold text-slate-800 ${item.color}`}>
                    {item.activity}
                  </div>
                ) : (
                  <div className="flex-1" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Rules */}
        <Card className="p-6 border-2 border-red-300 bg-red-50">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-black text-slate-900">REGLAS INNEGOCIABLES</h2>
          </div>
          <div className="space-y-2">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-2 p-2 bg-white rounded border border-red-200">
                <span className="text-2xl">{rule.image}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-700">{rule.title}</p>
                </div>
                {rule.status === "done" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <div className="w-4 h-4 border-2 border-red-400 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 font-light">
        <p>🎯 ¡Juntos podemos lograr la meta semanal! 💪</p>
      </div>
    </div>
  );
}

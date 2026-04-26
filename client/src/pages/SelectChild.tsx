import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, LogOut } from "lucide-react";
import { getLoginUrl } from "@/const";

// Sample children data - In production, this would come from the database
const children = [
  {
    id: 1,
    name: "Fabio",
    age: 15,
    avatarColor: "#A8D5E2",
    points: 2450,
    level: 5,
    streak: 7,
  },
  {
    id: 2,
    name: "Frida",
    age: 11,
    avatarColor: "#F5C6D8",
    points: 1890,
    level: 4,
    streak: 5,
  },
  {
    id: 3,
    name: "Julieta",
    age: 10,
    avatarColor: "#D4F1D4",
    points: 1650,
    level: 3,
    streak: 3,
  },
];

export default function SelectChild() {
  const [, setLocation] = useLocation();

  const handleSelectChild = (childId: number) => {
    // Store the selected child in localStorage
    localStorage.setItem("selectedChildId", childId.toString());
    setLocation(`/child/${childId}/tasks`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/30 to-secondary/30 p-6 md:p-8 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-primary mb-2">Bienvenido a Familia App</h1>
          <p className="text-muted-foreground font-light">
            Selecciona tu nombre para comenzar
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Children Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {children.map((child) => (
            <Card
              key={child.id}
              onClick={() => handleSelectChild(child.id)}
              className="p-6 border-2 border-border hover:border-primary cursor-pointer transition-all hover:shadow-lg hover:scale-105 transform"
            >
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black text-white mb-4 shadow-lg"
                  style={{ backgroundColor: child.avatarColor }}
                >
                  {child.name.charAt(0).toUpperCase()}
                </div>

                {/* Name and Age */}
                <h2 className="heading-secondary mb-1">{child.name}</h2>
                <p className="text-muted-foreground font-light mb-4">
                  {child.age} años
                </p>

                {/* Stats */}
                <div className="space-y-2 w-full mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Puntos:</span>
                    <span className="font-black text-primary">{child.points}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nivel:</span>
                    <span className="font-black text-secondary">{child.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Racha:</span>
                    <span className="font-black text-destructive">{child.streak}d</span>
                  </div>
                </div>

                {/* Button */}
                <Button
                  onClick={() => handleSelectChild(child.id)}
                  className="w-full bg-primary text-primary-foreground hover:opacity-90 font-semibold"
                >
                  Entrar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Admin Login Section */}
        <Card className="p-8 bg-gradient-to-r from-secondary/20 to-secondary/10 border-secondary/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="heading-secondary mb-1">¿Eres Ana?</h3>
              <p className="text-muted-foreground font-light">
                Accede al panel de administración para supervisar finanzas y tareas
              </p>
            </div>
            <Button
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
              className="bg-secondary text-secondary-foreground hover:opacity-90 font-semibold"
            >
              Acceso Admin
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

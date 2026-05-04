import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Heart } from "lucide-react";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-primary text-4xl mb-3">Familia App</h1>
          <p className="text-muted-foreground text-lg font-light">
            Organiza tu hogar, finanzas y tareas en familia
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parent Option */}
          <Card className="p-8 border-2 border-primary/30 hover:border-primary/60 cursor-pointer transition-all hover:shadow-lg hover:scale-105">
            <button
              onClick={() => setLocation("/admin/login")}
              className="w-full h-full flex flex-col items-center justify-center gap-6"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <h2 className="heading-secondary text-2xl mb-2">Soy Papá/Mamá</h2>
                <p className="text-muted-foreground font-light">
                  Supervisa finanzas, tareas y el progreso de tus hijos
                </p>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 mt-4">
                Acceder
              </Button>
            </button>
          </Card>

          {/* Child Option */}
          <Card className="p-8 border-2 border-secondary/30 hover:border-secondary/60 cursor-pointer transition-all hover:shadow-lg hover:scale-105">
            <button
              onClick={() => setLocation("/")}
              className="w-full h-full flex flex-col items-center justify-center gap-6"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <h2 className="heading-secondary text-2xl mb-2">Soy Hijo/Hija</h2>
                <p className="text-muted-foreground font-light">
                  Completa tareas, gana puntos y canjea recompensas
                </p>
              </div>
              <Button className="w-full bg-secondary text-secondary-foreground hover:opacity-90 mt-4">
                Entrar
              </Button>
            </button>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm font-light">
            Diseñado para familias que quieren organizarse juntas
          </p>
        </div>
      </div>
    </div>
  );
}

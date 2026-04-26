import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        {/* Geometric decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-secondary/10 blur-3xl"></div>

        <div className="relative z-10 text-center max-w-2xl">
          <h1 className="heading-primary mb-4">
            Mi App Familiar
          </h1>
          <p className="text-lg text-muted-foreground mb-8 font-light">
            Organiza las finanzas de tu hogar y motiva a tus hijos con un sistema de tareas gamificado.
          </p>
          <p className="text-md text-muted-foreground mb-12 font-light">
            Controla gastos, asigna actividades y recompensa con tiempo de pantalla de forma divertida.
          </p>

          <a href={getLoginUrl()}>
            <Button className="bg-primary text-primary-foreground hover:opacity-90 px-8 py-3 text-lg">
              Comenzar
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return null;
}

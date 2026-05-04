import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const ADMIN_PIN = "1234";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      localStorage.setItem("adminLoggedIn", "true");
      toast.success("¡Bienvenido al panel de papás! 👨‍👩‍👧‍👦");
      setLocation("/admin/panel");
    } else {
      setAttempts(attempts + 1);
      setError("PIN incorrecto. Intenta de nuevo.");
      setPin("");
      toast.error("PIN incorrecto");

      if (attempts >= 2) {
        toast.warning("Demasiados intentos fallidos");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 border-2 border-primary/30">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="heading-primary text-center mb-2">Acceso Papás</h1>
          <p className="text-muted-foreground text-center font-light">
            Ingresa el PIN para acceder al panel de administración
          </p>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-destructive/20 border border-destructive/30 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-2">
            PIN de Acceso
          </label>
          <Input
            type="password"
            placeholder="••••"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError("");
            }}
            onKeyPress={handleKeyPress}
            maxLength={4}
            className="text-center text-2xl font-black tracking-widest border-2 border-primary/30 focus:border-primary"
          />
        </div>

        <Button
          onClick={handleLogin}
          className="w-full bg-primary text-primary-foreground hover:opacity-90 font-semibold py-6 text-lg mb-4"
        >
          Ingresar
        </Button>

        <Button
          onClick={() => setLocation("/")}
          variant="outline"
          className="w-full"
        >
          Volver
        </Button>

        <div className="mt-6 p-4 bg-secondary/10 rounded-lg border border-secondary/30">
          <p className="text-xs text-muted-foreground text-center font-light">
            💡 Consejo: El PIN es <span className="font-semibold">1234</span>
          </p>
        </div>
      </Card>
    </div>
  );
}

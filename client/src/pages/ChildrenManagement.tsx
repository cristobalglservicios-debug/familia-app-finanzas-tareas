import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Trophy, Zap, Flame } from "lucide-react";

export default function ChildrenManagement() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [familyId] = useState(1); // TODO: Get from context
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    avatarColor: "#A8D5E2",
  });

  const childrenQuery = trpc.children.list.useQuery(
    { familyId },
    { enabled: isAuthenticated }
  );

  const createChildMutation = trpc.children.create.useMutation({
    onSuccess: () => {
      toast.success("¡Hijo agregado exitosamente!");
      setFormData({ name: "", age: "", avatarColor: "#A8D5E2" });
      setShowForm(false);
      childrenQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Error al agregar hijo");
    },
  });

  const updateChildMutation = trpc.children.update.useMutation({
    onSuccess: () => {
      toast.success("¡Hijo actualizado exitosamente!");
      setFormData({ name: "", age: "", avatarColor: "#A8D5E2" });
      setEditingId(null);
      setShowForm(false);
      childrenQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar hijo");
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.age) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    if (editingId) {
      updateChildMutation.mutate({
        childId: editingId,
        name: formData.name,
        age: parseInt(formData.age),
        avatarColor: formData.avatarColor,
      });
    } else {
      createChildMutation.mutate({
        familyId,
        name: formData.name,
        age: parseInt(formData.age),
        avatarColor: formData.avatarColor,
      });
    }
  };

  const handleEdit = (child: any) => {
    setFormData({
      name: child.name,
      age: child.age.toString(),
      avatarColor: child.avatarColor || "#A8D5E2",
    });
    setEditingId(child.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ name: "", age: "", avatarColor: "#A8D5E2" });
    setEditingId(null);
    setShowForm(false);
  };

  if (!isAuthenticated) return null;

  const colors = [
    "#A8D5E2", // Pastel blue
    "#E6C8D2", // Blush pink
    "#C8E6C9", // Pastel green
    "#FFE0B2", // Pastel orange
    "#F8BBD0", // Light pink
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="heading-primary mb-2">Gestión de Hijos</h1>
            <p className="text-muted-foreground font-light">
              Administra los perfiles de tus hijos y monitorea su progreso
            </p>
          </div>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Agregar Hijo
            </Button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <Card className="p-6 border-2 border-primary">
            <h2 className="heading-secondary mb-6">
              {editingId ? "Editar Hijo" : "Agregar Nuevo Hijo"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="font-semibold mb-2 block">
                  Nombre
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ej: Juan"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border-border"
                />
              </div>

              <div>
                <Label htmlFor="age" className="font-semibold mb-2 block">
                  Edad
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Ej: 12"
                  min="1"
                  max="18"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className="border-border"
                />
              </div>

              <div>
                <Label className="font-semibold mb-3 block">
                  Color del Avatar
                </Label>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, avatarColor: color })
                      }
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        formData.avatarColor === color
                          ? "border-foreground scale-110"
                          : "border-border"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={
                    createChildMutation.isPending || updateChildMutation.isPending
                  }
                  className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
                >
                  {createChildMutation.isPending || updateChildMutation.isPending
                    ? "Procesando..."
                    : editingId
                      ? "Actualizar"
                      : "Agregar"}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Children List */}
        <div>
          <h2 className="heading-secondary mb-4">Mis Hijos</h2>
          {childrenQuery.isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando hijos...</p>
            </div>
          ) : childrenQuery.data && childrenQuery.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {childrenQuery.data.map((child) => (
                <Card
                  key={child.id}
                  className="p-6 hover:shadow-lg transition-shadow border-2 border-border"
                >
                  {/* Avatar and Name */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black text-white"
                      style={{ backgroundColor: child.avatarColor || "#A8D5E2" }}
                    >
                      {child.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-foreground">{child.name}</h3>
                      <p className="text-sm text-muted-foreground font-light">
                        {child.age} años
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-sm font-light">Puntos</span>
                      </div>
                      <span className="font-black text-foreground">
                        {child.totalPoints}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Trophy className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-light">Nivel</span>
                      </div>
                      <span className="font-black text-foreground">
                        {child.currentLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-light">Racha</span>
                      </div>
                      <span className="font-black text-foreground">
                        {child.currentStreak} días
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(child)}
                      variant="outline"
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 flex items-center justify-center gap-2 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground font-light mb-4">
                No hay hijos registrados. ¡Agrega el primero!
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-primary text-primary-foreground hover:opacity-90"
              >
                Agregar Hijo
              </Button>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

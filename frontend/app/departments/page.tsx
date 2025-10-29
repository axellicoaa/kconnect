"use client";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";

import { useEffect, useState } from "react";
import {
  Users,
  Mail,
  Lock,
  Building2,
  UserCircle,
  Edit2,
  Trash2,
  X,
  Save,
  UserPlus,
  Shield,
  Building,
  BuildingIcon,
  Plus,
} from "lucide-react";

const API = "http://localhost:8080/kconnect";
interface Department {
  id: number;
  name: string;
  description: string;
}
export default function DepartmentPage() {
  const { user } = useAuth();
  const token = Cookies.get("token");

  const [departments, setDepartment] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // Crear departamento
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [editForm, setEditForm] = useState<Department | null>(null);

  useEffect(() => {
    if (!token || !user) return;

    const fetchData = async () => {
      try {
        if (user.role === "ADMIN") {
          const depRes = await axios.get<Department[]>(`${API}/departments`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDepartment(depRes.data);
        }
      } catch (err) {
        console.error("Error cargando Departamentos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
      };
      await axios.post(`${API}/departments`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Departamento Creado ");
      setForm({ name: "", description: "" });

      if (user?.role === "ADMIN") {
        const res = await axios.get<Department[]>(`${API}/departments`, {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        });
        setDepartment(res.data);
      }
    } catch (err: any) {
      console.error("REGISTER ERROR:", err.response?.data || err.message);
      alert("Error creando departamento ❌");
    }
  };

  //editar departamentos
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
      };

      await axios.put(`${API}/departments/${editForm.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Departamento actualizado✅");
      setEditForm(null);

      // refrescar lista
      if (user?.role === "ADMIN") {
        const res = await axios.get<Department[]>(`${API}/departments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartment(res.data);
      } else {
        const res = await axios.get<Department>(
          `${API}/departments/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDepartment([res.data]);
      }
    } catch (err: any) {
      console.error("EDIT ERROR:", err.response?.data || err.message);
      alert("Error editando departamento ❌");
    }
  };

  //eliminar departamentos
  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este departamento?")) return;
    try {
      await axios.delete(`${API}/departments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Empleado eliminado exitosamente");
      setDepartment((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      console.error("DELETE ERROR:", err.response?.data || err.message);
      alert("Error eliminando departamento ❌");
    }
  };
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground">Cargando departamentos...</div>
        </div>
      </>
    );
  }
  return (
    <>
      <Header />
      {user?.role === "ADMIN" && (
        <>
          <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  Deparamentos
                </h1>
              </div>
              <form
                onSubmit={handleCreate}
                className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Plus className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Crear nuevo departamento
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Nombre Departamento"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full bg-background border border-input rounded-lg pl-11 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Descripcion"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="w-full bg-background border border-input rounded-lg pl-11 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                >
                  <Building className="w-4 h-4" />
                  Crear Departamento
                </button>
              </form>
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="py-4 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          ID
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Departamento
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Description
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {departments.map((emp) => (
                        <tr
                          key={emp.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-4 px-6 text-sm text-muted-foreground">
                            #{emp.id}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="py-4 px-6 text-sm text-muted-foreground">
                                {emp.name}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-muted-foreground">
                            {emp.description ?? "Sin description"}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                                onClick={() => setEditForm(emp)}
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(emp.id)}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

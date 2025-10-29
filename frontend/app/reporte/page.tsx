"use client"
import { useEffect, useState } from "react"
import type React from "react"

import axios from "axios"
import Cookies from "js-cookie"
import { useAuth } from "../../context/AuthContext"
import Header from "@/components/Header"
import { FileText, Plus, Filter, Edit2, Trash2, X, Save, TrendingUp, Award } from "lucide-react"

const API = "http://localhost:8080/kconnect"

interface Report {
  id: number
  title: string
  description: string
  score: number
  employeeId: number
  employeeName: string
  departmentId: number
  departmentName: string
  createdAt: string
}

interface Department {
  id: number
  name: string
}

export default function ReportsPage() {
  const { user } = useAuth()
  const token = Cookies.get("token")

  const [reports, setReports] = useState<Report[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    title: "",
    description: "",
    score: 0,
  })

  const [editForm, setEditForm] = useState<Report | null>(null)
  const [filterDep, setFilterDep] = useState<string>("")

  useEffect(() => {
    if (!token || !user) return

    const fetchData = async () => {
      try {
        if (user.role === "ADMIN") {
          const depRes = await axios.get<Department[]>(`${API}/departments`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setDepartments(depRes.data)

          if (depRes.data.length > 0) {
            const repRes = await axios.get<Report[]>(`${API}/reports/department/${depRes.data[0].id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            setReports(repRes.data)
            setFilterDep(String(depRes.data[0].id))
          }
        } else {
          const res = await axios.get<Report[]>(`${API}/reports`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setReports(res.data)
        }
      } catch (err) {
        console.error("Error cargando reportes:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token, user])

  // Crear reporte
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        score: Number(form.score),
      }

      await axios.post(`${API}/reports`, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })

      alert("Reporte creado exitosamente")
      setForm({ title: "", description: "", score: 0 })

      if (user?.role === "ADMIN" && filterDep) {
        const res = await axios.get<Report[]>(`${API}/reports/department/${filterDep}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setReports(res.data)
      } else {
        const res = await axios.get<Report[]>(`${API}/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setReports(res.data)
      }
    } catch (err: any) {
      console.error("CREATE ERROR:", err.response?.data || err.message)
      alert("Error creando reporte")
    }
  }

  // Editar reporte
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm) return

    try {
      const payload = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        score: editForm.score,
      }

      await axios.put(`${API}/reports/${editForm.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert("Reporte actualizado exitosamente")
      setEditForm(null)

      if (user?.role === "ADMIN" && filterDep) {
        const res = await axios.get<Report[]>(`${API}/reports/department/${filterDep}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setReports(res.data)
      } else {
        const res = await axios.get<Report[]>(`${API}/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setReports(res.data)
      }
    } catch (err: any) {
      console.error("EDIT ERROR:", err.response?.data || err.message)
      alert("Error editando reporte")
    }
  }

  // Eliminar reporte
  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este reporte?")) return
    try {
      await axios.delete(`${API}/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert("Reporte eliminado exitosamente")

      setReports((prev) => prev.filter((r) => r.id !== id))
    } catch (err: any) {
      console.error("DELETE ERROR:", err.response?.data || err.message)
      alert("Error eliminando reporte")
    }
  }

  const handleFilterDep = async (depId: string) => {
    setFilterDep(depId)
    if (!depId) return

    try {
      const res = await axios.get<Report[]>(`${API}/reports/department/${depId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setReports(res.data)
    } catch (err) {
      console.error("FILTER ERROR:", err)
    }
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "bg-emerald-50 text-emerald-700 border-emerald-200"
    if (score >= 75) return "bg-blue-50 text-blue-700 border-blue-200"
    if (score >= 60) return "bg-amber-50 text-amber-700 border-amber-200"
    return "bg-red-50 text-red-700 border-red-200"
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground">Cargando reportes...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Reportes de Desempeño</h1>
              <p className="text-muted-foreground text-sm">Gestiona y visualiza los reportes del equipo</p>
            </div>
          </div>

          {/* Formulario crear */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <Plus className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Crear Nuevo Reporte</h2>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Título</label>
                  <input
                    type="text"
                    placeholder="Ej: Evaluación trimestral"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Puntuación (0-100)</label>
                  <input
                    type="number"
                    placeholder="85"
                    value={form.score}
                    min={0}
                    max={100}
                    onChange={(e) => setForm({ ...form, score: Number(e.target.value) })}
                    className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Descripción</label>
                <textarea
                  placeholder="Describe el desempeño y los logros..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Crear Reporte
              </button>
            </form>
          </div>

          {/* Filtro admin */}
          {user?.role === "ADMIN" && departments.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <label className="text-sm font-medium text-foreground">Filtrar por departamento:</label>
                <select
                  value={filterDep}
                  onChange={(e) => handleFilterDep(e.target.value)}
                  className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                >
                  <option value="">Todos los departamentos</option>
                  {departments.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Tabla */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">ID</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Título</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Descripción</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Puntuación</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Empleado</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Departamento</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 text-muted-foreground text-sm">#{r.id}</td>
                      <td className="py-4 px-6 text-foreground font-medium">{r.title}</td>
                      <td className="py-4 px-6 text-muted-foreground text-sm max-w-xs truncate">{r.description}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getScoreBadge(
                            r.score,
                          )}`}
                        >
                          <Award className="w-3.5 h-3.5" />
                          {r.score}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-foreground">{r.employeeName}</td>
                      <td className="py-4 px-6 text-muted-foreground text-sm">{r.departmentName}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditForm(r)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors border border-blue-200"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Editar
                          </button>
                          {user?.role === "ADMIN" && (
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors border border-red-200"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {reports.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-12 h-12 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No hay reportes disponibles</p>
                          <p className="text-muted-foreground/70 text-sm">
                            Crea tu primer reporte usando el formulario de arriba
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal edición */}
      {editForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <Edit2 className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Editar Reporte</h2>
                  <p className="text-sm text-muted-foreground">Actualiza la información del reporte</p>
                </div>
              </div>
              <button onClick={() => setEditForm(null)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Contenido del modal */}
            <form onSubmit={handleEdit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Título del Reporte</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Descripción</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                    className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Puntuación (0-100)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={editForm.score}
                      min={0}
                      max={100}
                      onChange={(e) => setEditForm({ ...editForm, score: Number(e.target.value) })}
                      className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getScoreBadge(
                          editForm.score,
                        )}`}
                      >
                        <TrendingUp className="w-3 h-3" />
                        {editForm.score >= 90
                          ? "Excelente"
                          : editForm.score >= 75
                            ? "Bueno"
                            : editForm.score >= 60
                              ? "Regular"
                              : "Bajo"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info adicional */}
                <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Empleado:</span>
                    <span className="text-foreground font-medium">{editForm.employeeName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Departamento:</span>
                    <span className="text-foreground font-medium">{editForm.departmentName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ID del Reporte:</span>
                    <span className="text-foreground">#{editForm.id}</span>
                  </div>
                </div>
              </div>

              {/* Footer del modal */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditForm(null)}
                  className="px-5 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

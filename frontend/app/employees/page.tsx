"use client"
import { useEffect, useState } from "react"
import type React from "react"

import axios from "axios"
import Cookies from "js-cookie"
import { useAuth } from "../../context/AuthContext"
import Header from "@/components/Header"
import { Users, Mail, Lock, Building2, UserCircle, Edit2, Trash2, X, Save, UserPlus, Shield } from "lucide-react"

const API = "http://localhost:8080/kconnect"

interface Employee {
  id: number
  fullName: string
  email: string
  role: string
  departmentName?: string
  departmentId?: number
}

interface Department {
  id: number
  name: string
}

export default function EmployeesPage() {
  const { user } = useAuth()
  const token = Cookies.get("token")

  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)

  // Crear empleado
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
    departmentId: "",
  })

  // Editar empleado
  const [editForm, setEditForm] = useState<Employee | null>(null)

  // Cargar empleados y departamentos
  useEffect(() => {
    if (!token || !user) return

    const fetchData = async () => {
      try {
        if (user.role === "ADMIN") {
          const res = await axios.get<Employee[]>(`${API}/employees`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setEmployees(res.data)

          const depRes = await axios.get<Department[]>(`${API}/departments`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setDepartments(depRes.data)
        } else {
          const res = await axios.get<Employee>(`${API}/employees/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setEmployees([res.data])
        }
      } catch (err) {
        console.error("Error cargando empleados:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token, user])

  // Crear empleado (solo ADMIN)
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        departmentId: form.departmentId ? Number(form.departmentId) : null,
      }

      await axios.post(`${API}/auth/register`, payload, {
        headers: { "Content-Type": "application/json" },
      })

      alert("Empleado creado ✅")
      setForm({ fullName: "", email: "", password: "", role: "EMPLOYEE", departmentId: "" })

      if (user?.role === "ADMIN") {
        const res = await axios.get<Employee[]>(`${API}/employees`, {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        })
        setEmployees(res.data)
      }
    } catch (err: any) {
      console.error("REGISTER ERROR:", err.response?.data || err.message)
      alert("Error creando empleado ❌")
    }
  }

  // Editar empleado (ADMIN o EMPLOYEE propio)
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm) return

    try {
      const payload = {
        fullName: editForm.fullName.trim(),
        departmentId: editForm.departmentId ?? null,
      }

      await axios.put(`${API}/employees/${editForm.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert("Empleado actualizado ✅")
      setEditForm(null)

      // refrescar lista
      if (user?.role === "ADMIN") {
        const res = await axios.get<Employee[]>(`${API}/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setEmployees(res.data)
      } else {
        const res = await axios.get<Employee>(`${API}/employees/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setEmployees([res.data])
      }
    } catch (err: any) {
      console.error("EDIT ERROR:", err.response?.data || err.message)
      alert("Error editando empleado ❌")
    }
  }
  //Eliminar empleado
  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este empleado?")) return
    try {
      await axios.delete(`${API}/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert("Empleado eliminado exitosamente")
      setEmployees((prev) => prev.filter((e) => e.id !== id))
    } catch (err: any) {
      console.error("DELETE ERROR:", err.response?.data || err.message)
      alert("Error eliminando empleado ❌")
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground">Cargando empleados...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Empleados</h1>
          </div>

          {/* Vista EMPLOYEE: solo su card */}
          {user?.role === "EMPLOYEE" && employees[0] && (
            <div className="bg-card border border-border rounded-xl p-8 max-w-2xl shadow-sm">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {employees[0].fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-4">{employees[0].fullName}</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{employees[0].email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          employees[0].role === "ADMIN"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {employees[0].role}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      <span>{employees[0].departmentName ?? "Sin departamento"}</span>
                    </div>
                  </div>
                  <button
                    className="mt-6 flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg transition-colors font-medium"
                    onClick={() => setEditForm(employees[0])}
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar perfil
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Vista ADMIN: formulario + tabla */}
          {user?.role === "ADMIN" && (
            <>
              <form onSubmit={handleCreate} className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <UserPlus className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-foreground">Crear nuevo empleado</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full bg-background border border-input rounded-lg pl-11 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-background border border-input rounded-lg pl-11 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="password"
                      placeholder="Contraseña"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full bg-background border border-input rounded-lg pl-11 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full bg-background border border-input rounded-lg pl-11 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                    >
                      <option value="EMPLOYEE">Empleado</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div className="relative md:col-span-2">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <select
                      value={form.departmentId}
                      onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                      className="w-full bg-background border border-input rounded-lg pl-11 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Seleccione departamento</option>
                      {departments.map((dep) => (
                        <option key={dep.id} value={dep.id}>
                          {dep.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  Crear empleado
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
                          Nombre
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Email
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Rol
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Departamento
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {employees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-6 text-sm text-muted-foreground">#{emp.id}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                {emp.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </div>
                              <span className="text-foreground font-medium">{emp.fullName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-muted-foreground">{emp.email}</td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                emp.role === "ADMIN"
                                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}
                            >
                              {emp.role}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-muted-foreground">
                            {emp.departmentName ?? "Sin departamento"}
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
            </>
          )}

          {editForm && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Edit2 className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">Editar empleado</h2>
                  </div>
                  <button
                    onClick={() => setEditForm(null)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleEdit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Nombre completo</label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                        className="w-full bg-background border border-input rounded-lg pl-11 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full bg-muted border border-input rounded-lg pl-11 pr-4 py-2.5 text-muted-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        disabled
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">El email no se puede modificar</p>
                  </div>

                  {user?.role === "ADMIN" && (
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Departamento</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <select
                          value={editForm.departmentId ?? ""}
                          onChange={(e) => setEditForm({ ...editForm, departmentId: Number(e.target.value) })}
                          className="w-full bg-background border border-input rounded-lg pl-11 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Seleccione departamento</option>
                          {departments.map((dep) => (
                            <option key={dep.id} value={dep.id}>
                              {dep.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditForm(null)}
                      className="px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <Save className="w-4 h-4" />
                      Guardar cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

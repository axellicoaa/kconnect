"use client"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import axios from "axios"
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useAuth } from "../../context/AuthContext"
import Header from "@/components/Header"
import { TrendingUp, Users, FileText, Building2 } from "lucide-react"

const API = "http://localhost:8080/kconnect"

interface DepartmentStats {
  id: number
  name: string
  employeeCount: number
}
interface Report {
  id: number
  title: string
  score: number
  departmentId: number
}
interface User {
  email: string
  role: string
  name?: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const token = Cookies.get("token")

  // Data Admin
  const [deptStats, setDeptStats] = useState<DepartmentStats[]>([])
  const [avgByDep, setAvgByDep] = useState<{ name: string; promedio: number }[]>([])
  const [scores, setScores] = useState<{ name: string; value: number }[]>([])

  // Data Employee
  const [myReports, setMyReports] = useState<Report[]>([])

  useEffect(() => {
    if (!token || !user) return
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        if (user.role === "ADMIN") {
          // 🔹 ADMIN: cargar stats de departamentos
          const statsRes = await axios.get<DepartmentStats[]>(`${API}/departments/stats`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          })
          setDeptStats(statsRes.data)

          // 🔹 ADMIN: cargar reportes por departamento
          const avgPromises = statsRes.data.map(async (dep) => {
            const repRes = await axios.get<Report[]>(`${API}/reports/department/${dep.id}`, {
              headers: { Authorization: `Bearer ${token}` },
              signal: controller.signal,
            })
            const reports = repRes.data

            const promedio = reports.length > 0 ? reports.reduce((acc, r) => acc + r.score, 0) / reports.length : 0

            return { depName: dep.name, reports, promedio }
          })

          const results = await Promise.all(avgPromises)

          setAvgByDep(results.map((r) => ({ name: r.depName, promedio: Number(r.promedio.toFixed(2)) })))
          setScores(results.flatMap((r) => r.reports.map((rep) => ({ name: rep.title, value: rep.score }))))
        } else {
          // 🔹 EMPLOYEE: cargar solo sus reportes
          const repRes = await axios.get<Report[]>(`${API}/reports`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          })
          setMyReports(repRes.data)
        }
      } catch (err) {
        console.error("❌ Error cargando dashboard:", err)
      }
    }

    fetchData()
    return () => controller.abort()
  }, [token, user])

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

  const totalEmployees = deptStats.reduce((acc, d) => acc + d.employeeCount, 0)
  const totalReports = scores.length
  const avgScore =
    avgByDep.length > 0 ? (avgByDep.reduce((acc, d) => acc + d.promedio, 0) / avgByDep.length).toFixed(1) : "0"

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground">
            Bienvenido, <span className="text-primary">{user?.name}</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            {user?.role === "ADMIN"
              ? "Panel de administración y análisis de desempeño"
              : "Visualiza tus reportes y desempeño"}
          </p>
        </div>

        {user?.role === "ADMIN" ? (
          <>
            <div className="mb-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Departamentos</p>
                    <p className="mt-2 text-3xl font-semibold text-card-foreground">{deptStats.length}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Empleados</p>
                    <p className="mt-2 text-3xl font-semibold text-card-foreground">{totalEmployees}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                    <Users className="h-6 w-6 text-chart-2" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Reportes</p>
                    <p className="mt-2 text-3xl font-semibold text-card-foreground">{totalReports}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                    <FileText className="h-6 w-6 text-chart-3" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Promedio General</p>
                    <p className="mt-2 text-3xl font-semibold text-card-foreground">{avgScore}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                    <TrendingUp className="h-6 w-6 text-chart-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Departments Table */}
              <div className="rounded-lg border border-border bg-card">
                <div className="border-b border-border p-6">
                  <h3 className="text-lg font-semibold text-card-foreground">Departamentos</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Distribución de empleados por departamento</p>
                </div>
                <div className="p-6">
                  <div className="overflow-hidden rounded-md border border-border">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nombre</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Empleados</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {deptStats.map((d) => (
                          <tr key={d.id} className="transition-colors hover:bg-muted/50">
                            <td className="px-4 py-3 text-sm text-card-foreground">{d.id}</td>
                            <td className="px-4 py-3 text-sm font-medium text-card-foreground">{d.name}</td>
                            <td className="px-4 py-3 text-right text-sm text-card-foreground">{d.employeeCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card">
                <div className="border-b border-border p-6">
                  <h3 className="text-lg font-semibold text-card-foreground">Distribución de Reportes</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Visualización de todos los reportes</p>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={scores}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={(entry) => entry.name}
                      >
                        {scores.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-border bg-card">
              <div className="border-b border-border p-6">
                <h3 className="text-lg font-semibold text-card-foreground">Desempeño por Departamento</h3>
                <p className="mt-1 text-sm text-muted-foreground">Promedio de puntuación por departamento</p>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={avgByDep}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Bar dataKey="promedio" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mis Reportes</p>
                    <p className="mt-2 text-3xl font-semibold text-card-foreground">{myReports.length}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Promedio</p>
                    <p className="mt-2 text-3xl font-semibold text-card-foreground">
                      {myReports.length > 0
                        ? (myReports.reduce((acc, r) => acc + r.score, 0) / myReports.length).toFixed(1)
                        : "0"}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                    <TrendingUp className="h-6 w-6 text-chart-4" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mejor Puntaje</p>
                    <p className="mt-2 text-3xl font-semibold text-card-foreground">
                      {myReports.length > 0 ? Math.max(...myReports.map((r) => r.score)) : "0"}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                    <TrendingUp className="h-6 w-6 text-chart-2" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border p-6">
                <h3 className="text-lg font-semibold text-card-foreground">Mis Reportes</h3>
                <p className="mt-1 text-sm text-muted-foreground">Historial completo de tus reportes de desempeño</p>
              </div>
              <div className="p-6">
                <div className="overflow-hidden rounded-md border border-border">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Título</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Puntaje</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {myReports.map((r) => (
                        <tr key={r.id} className="transition-colors hover:bg-muted/50">
                          <td className="px-4 py-3 text-sm text-card-foreground">{r.id}</td>
                          <td className="px-4 py-3 text-sm font-medium text-card-foreground">{r.title}</td>
                          <td className="px-4 py-3 text-right">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                r.score >= 80
                                  ? "bg-chart-2/10 text-chart-2"
                                  : r.score >= 60
                                    ? "bg-chart-4/10 text-chart-4"
                                    : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {r.score}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-border bg-card">
              <div className="border-b border-border p-6">
                <h3 className="text-lg font-semibold text-card-foreground">Desempeño de Mis Reportes</h3>
                <p className="mt-1 text-sm text-muted-foreground">Visualización de tus puntuaciones</p>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={myReports.map((r) => ({ name: r.title, promedio: r.score }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Bar dataKey="promedio" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

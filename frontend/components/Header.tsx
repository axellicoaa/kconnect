"use client"
import { BarChart3, Users, FileText, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "../context/AuthContext"

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">Kconnect</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/reporte"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <FileText className="h-4 w-4" />
            Reportes
          </Link>
          <Link
            href="/employees"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Users className="h-4 w-4" />
            Empleados
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="hidden flex-col md:flex">
              <span className="text-sm font-medium text-foreground">{user?.name || "Usuario"}</span>
              <span className="text-xs text-muted-foreground">{user?.role || "USER"}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  )
}

"use client"
import { useState } from "react"
import type React from "react"

import { useAuth } from "../../context/AuthContext"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      alert("Credenciales inválidas")
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side - Login Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 py-12 lg:px-16">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-10 h-10 text-primary"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 4L4 12V28L20 36L36 28V12L20 4Z"
                  fill="currentColor"
                  fillOpacity="0.1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 12V28M12 16L20 20L28 16M12 24L20 28L28 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h1 className="text-3xl font-bold text-foreground">Kconnect</h1>
            </div>
            <p className="text-muted-foreground">Conecta con tu equipo de manera eficiente</p>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Bienvenido de nuevo</h2>
            <p className="text-muted-foreground">Ingresa tus credenciales para acceder a tu cuenta</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Correo electrónico
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Contraseña
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-muted-foreground">Recordarme</span>
              </label>
              <a href="#" className="text-primary hover:underline font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-all shadow-sm hover:shadow-md"
            >
              Iniciar sesión
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">O continúa con</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-3 border border-input rounded-lg hover:bg-muted transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-medium text-foreground">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-3 border border-input rounded-lg hover:bg-muted transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span className="text-sm font-medium text-foreground">GitHub</span>
            </button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Regístrate gratis
            </a>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        {/* Background Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-16 text-white">
          <svg className="w-64 h-64 mb-8" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Connection Network Illustration */}
            <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="2" opacity="0.3" />
            <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="2" opacity="0.5" />
            <circle cx="100" cy="100" r="20" stroke="white" strokeWidth="2" opacity="0.7" />

            {/* Nodes */}
            <circle cx="100" cy="40" r="8" fill="white" />
            <circle cx="160" cy="100" r="8" fill="white" />
            <circle cx="100" cy="160" r="8" fill="white" />
            <circle cx="40" cy="100" r="8" fill="white" />
            <circle cx="70" cy="70" r="6" fill="white" opacity="0.8" />
            <circle cx="130" cy="70" r="6" fill="white" opacity="0.8" />
            <circle cx="130" cy="130" r="6" fill="white" opacity="0.8" />
            <circle cx="70" cy="130" r="6" fill="white" opacity="0.8" />

            {/* Connection Lines */}
            <line x1="100" y1="100" x2="100" y2="40" stroke="white" strokeWidth="2" opacity="0.6" />
            <line x1="100" y1="100" x2="160" y2="100" stroke="white" strokeWidth="2" opacity="0.6" />
            <line x1="100" y1="100" x2="100" y2="160" stroke="white" strokeWidth="2" opacity="0.6" />
            <line x1="100" y1="100" x2="40" y2="100" stroke="white" strokeWidth="2" opacity="0.6" />
            <line x1="100" y1="100" x2="70" y2="70" stroke="white" strokeWidth="1.5" opacity="0.4" />
            <line x1="100" y1="100" x2="130" y2="70" stroke="white" strokeWidth="1.5" opacity="0.4" />
            <line x1="100" y1="100" x2="130" y2="130" stroke="white" strokeWidth="1.5" opacity="0.4" />
            <line x1="100" y1="100" x2="70" y2="130" stroke="white" strokeWidth="1.5" opacity="0.4" />

            {/* Center Node */}
            <circle cx="100" cy="100" r="12" fill="white" />
          </svg>

          <h2 className="text-4xl font-bold mb-4 text-center">Conecta tu equipo</h2>
          <p className="text-xl text-white/80 text-center max-w-md">
            Gestiona empleados, reportes y proyectos en un solo lugar
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-sm text-white/70">Empresas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">10K+</div>
              <div className="text-sm text-white/70">Usuarios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">99.9%</div>
              <div className="text-sm text-white/70">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

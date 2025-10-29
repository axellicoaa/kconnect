# 🌐 KConnect – Sistema de Gestión de Empleados, Departamentos y Reportes

![Java](https://img.shields.io/badge/Java-17-orange?logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-brightgreen?logo=springboot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)
![Next.js](https://img.shields.io/badge/Next.js-13-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## 📖 Descripción
KConnect es una aplicación **Fullstack** que permite la gestión de **empleados, departamentos y reportes de desempeño**.  

El sistema tiene **roles diferenciados**:
- **ADMIN** → control total sobre empleados, departamentos y reportes.
- **EMPLOYEE** → acceso a su perfil y reportes personales.

Incluye **autenticación JWT**, dashboards con **Recharts**, y un diseño moderno con **TailwindCSS (modo oscuro incluido)**.

---

## ⚙️ Tecnologías utilizadas

### Backend
- ☕ Java 17  
- 🍃 Spring Boot 3  
- 🔐 Spring Security + JWT  
- 🗄️ Spring Data JPA  
- 🐘 PostgreSQL  
- 📖 Swagger / OpenAPI  

### Frontend
- ⚡ Next.js 13 (App Router)  
- ⚛️ React 18  
- 🎨 TailwindCSS  
- 🍪 js-cookie  
- 📊 Recharts  
- 🎯 Lucide-react  

---

## 📂 Estructura del proyecto

project-root/
│── backend/
│ ├── config/ → Seguridad (JWT, CORS, etc.)
│ ├── controllers/ → Endpoints REST
│ ├── dto/ → Data Transfer Objects
│ ├── entity/ → Entidades (Employee, Department, Report)
│ ├── repositories/ → Repositorios JPA
│ ├── service/ → Lógica de negocio
│ └── security/ → JWT y filtros
│
│── frontend/
│ ├── app/ → App Router
│ ├── components/ → Reutilizables (Header, Cards, Tablas)
│ ├── context/ → AuthContext (JWT + sesión)
│ ├── service/ → Axios API service
│ └── styles/ → TailwindCSS con tema oscuro



---

## 🔑 Roles y permisos

### 👨‍💼 ADMIN
- CRUD de empleados  
- CRUD de departamentos  
- Listar reportes por departamento  
- Eliminar reportes  
- Dashboard global con estadísticas  

### 👷 EMPLOYEE
- Ver y editar su perfil  
- Crear, listar y editar sus reportes  
- Dashboard personal con métricas  

---

## 🌱 Semilla (usuario de prueba)

Para probar el sistema puedes ingresar con el usuario semilla cargado en la BD:

📧 Email: admin@kconnect.io
🔑 Contraseña: admin123



👉 Desde aquí puedes crear empleados y departamentos para pruebas.

---

## ▶️ Ejecución

### Backend
1. Clonar el repositorio.
2. Configurar `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/kconnect
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   spring.jpa.hibernate.ddl-auto=update
   app.jwt.secret=miClaveSuperSecreta1234567890
   app.jwt.expiration-ms=86400000

### Ejecutar:


mvn spring-boot:run
Acceder a Swagger:
### http://localhost:8080/kconnect/swagger-ui.html

### Entrar a frontend/
Frontend


Instalar dependencias:

-- npm install
-- Ejecutar en desarrollo:

--npm run dev
--Abrir en el navegador:
## http://localhost:3000

### 📑 Endpoints principales
### Empleados
```POST /kconnect/employees → Crear (ADMIN)`

`GET /kconnect/employees → Listar (ADMIN)`

`GET /kconnect/employees/{id} → Perfil empleado`

```PUT /kconnect/employees/{id} → Editar (propio o ADMIN)```

## Departamentos
`POST /kconnect/departments → Crear (ADMIN)`

`GET /kconnect/departments → Listar`

`PUT /kconnect/departments/{id} → Editar`

`DELETE /kconnect/departments/{id} → Eliminar`

📊 Reportes
`POST /kconnect/reports → Crear (empleado autenticado)`

`GET /kconnect/reports → Listar reportes personales`

`GET /kconnect/reports/department/{id} → Reportes por departamento (ADMIN)`

`PUT /kconnect/reports/{id} → Editar`

`DELETE /kconnect/reports/{id} → Eliminar (ADMIN)`

##  Dashboard
ADMIN
Cantidad de empleados y departamentos

Distribución de reportes

Promedio de desempeño por departamento

EMPLOYEE
Total de reportes propios

Promedio personal

Mejor puntaje alcanzado

Historial de reportes

✅ Conclusión
KConnect es un sistema robusto y escalable que gestiona recursos humanos con roles diferenciados, dashboards dinámicos y seguridad basada en JWT.


# Sistema de Gestión de Mascotas - Documentación Completa

## Descripción General

Sistema completo de gestión de mascotas con arquitectura **cliente-servidor**, implementando:
- **Backend**: API REST con Spring Boot
- **Frontend**: Interfaz web con Angular
- **Base de Datos**: PostgreSQL
- **Pruebas**: Unitarias y de estrés

Desarrollado por: **Diego Fabricio Salamea Morales**

---

## 🏗️ Estructura del Proyecto

```
sistema-mascotas/
├── mascotas-backend/          # Backend Spring Boot
│   ├── src/
│   ├── pom.xml               # Dependencias Maven
│   ├── README.md             # Documentación backend
│   └── ...
├── mascotas-frontend/         # Frontend Angular
│   ├── src/
│   ├── package.json          # Dependencias NPM
│   ├── README.md             # Documentación frontend
│   └── ...
├── stress-test-read.js        # Pruebas de lectura (k6)
├── stress-test-write.js       # Pruebas de escritura (k6)
├── STRESS_TESTING.md          # Documentación de pruebas de estrés
├── init.sql                   # Script de base de datos
└── README.md                  # Este archivo
```

---

## 📋 Requisitos

### Backend (Spring Boot)
- Java 17+
- Maven 3.6+
- PostgreSQL 12+

### Frontend (Angular)
- Node.js 18+
- Angular CLI 17+
- npm o yarn

### Pruebas de Estrés
- k6 (herramienta de testing)

---

## 🚀 Instalación y Ejecución

### 1. Base de Datos

```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE mascotas_db;

# Ejecutar script SQL
\i mascotas-backend/src/main/resources/init.sql
```

### 2. Backend (Spring Boot)

```bash
cd mascotas-backend

# Compilar
mvn clean package

# Ejecutar tests unitarios
mvn test

# Ejecutar aplicación
mvn spring-boot:run
```

El backend estará disponible en: `http://localhost:8080/api`

### 3. Frontend (Angular)

```bash
cd mascotas-frontend

# Instalar dependencias
npm install

# Ejecutar tests unitarios
npm test

# Iniciar servidor de desarrollo
npm start
```

El frontend estará disponible en: `http://localhost:4200`

### 4. Pruebas de Estrés (k6)

```bash
# Instalar k6
# Windows: choco install k6
# macOS: brew install k6
# Linux: apt-get install k6

# Ejecutar pruebas de lectura
k6 run stress-test-read.js

# Ejecutar pruebas de escritura
k6 run stress-test-write.js
```

---

## 📚 API REST - Endpoints

### CRUD Completo

| Método | Endpoint | Descripción | Ejemplo |
|--------|----------|-------------|---------|
| GET | `/mascotas` | Listar todas | `curl http://localhost:8080/api/mascotas` |
| GET | `/mascotas/{id}` | Obtener por ID | `curl http://localhost:8080/api/mascotas/1` |
| POST | `/mascotas` | Crear | `curl -X POST -H "Content-Type: application/json" -d '{"nombre":"Max",...}' http://localhost:8080/api/mascotas` |
| PUT | `/mascotas/{id}` | Actualizar | `curl -X PUT -H "Content-Type: application/json" -d '{"nombre":"Max",...}' http://localhost:8080/api/mascotas/1` |
| DELETE | `/mascotas/{id}` | Eliminar | `curl -X DELETE http://localhost:8080/api/mascotas/1` |

### Búsqueda y Filtros

| Endpoint | Descripción | Ejemplo |
|--------|-------------|---------|
| `GET /mascotas?especie=Perro` | Filtrar por especie | `curl 'http://localhost:8080/api/mascotas?especie=Perro'` |
| `GET /mascotas?nombre=Max` | Buscar por nombre | `curl 'http://localhost:8080/api/mascotas?nombre=Max'` |

### Estadísticas (Funcionalidad Adicional Obligatoria)

| Endpoint | Descripción |
|--------|-------------|
| `GET /mascotas/estadisticas/promedio-edad` | Promedio de edad general |
| `GET /mascotas/estadisticas/promedio-edad-especie?especie=Perro` | Promedio por especie |
| `GET /mascotas/estadisticas/contar?especie=Gato` | Contar por especie |

### Monitoreo y Salud

| Endpoint | Descripción |
|--------|-------------|
| `GET /mascotas/health` | Health check personalizado |
| `GET /actuator/health` | Health check Spring Actuator |
| `GET /actuator/metrics` | Métricas del sistema |

---

## 🎯 Características Principales

### Backend

✅ **CRUD Completo**
- Crear, leer, actualizar y eliminar mascotas
- Validaciones robustas
- Manejo de errores

✅ **Funcionalidad Adicional**
- Filtro por especie
- Búsqueda por nombre
- Cálculo de promedios de edad
- Estadísticas por especie

✅ **Seguridad y Confiabilidad**
- Validación de datos con @Valid
- Manejo global de excepciones
- Logs detallados

✅ **Persistencia**
- JPA/Hibernate
- Índices en BD
- Auditoria de cambios

✅ **Monitoreo**
- Spring Actuator
- Health checks
- Métricas de rendimiento

### Frontend

✅ **Interfaz Intuitiva**
- Tabla responsive de mascotas
- Formularios con validaciones
- Vista detallada

✅ **Filtrado y Búsqueda**
- Filtro dinámico por especie
- Búsqueda por nombre en tiempo real

✅ **Estadísticas**
- Dashboard con promedios
- Gráficos por especie

✅ **Diseño Responsive**
- Bootstrap 5
- Adaptable a móviles
- UX mejorada

### Pruebas

✅ **Tests Unitarios Backend**
- Servicios con Mockito
- Controladores REST
- Validaciones

✅ **Tests Unitarios Frontend**
- Servicios HTTP
- Componentes Angular
- Validaciones de formulario

✅ **Pruebas de Estrés (k6)**
- 20 usuarios concurrentes (lectura)
- 10 usuarios concurrentes (CRUD)
- Análisis de thresholds

---

## 📊 Datos de Ejemplo

Base de datos precargada con 10 mascotas:

| ID | Nombre | Especie | Edad | Dueño |
|----|--------|---------|------|-------|
| 1 | Max | Perro | 5 | Juan |
| 2 | Mishi | Gato | 3 | María |
| 3 | Rocky | Perro | 7 | Pedro |
| 4 | Luna | Gato | 2 | Ana |
| 5 | Toby | Perro | 4 | Luis |
| 6 | Fluffy | Conejo | 1 | Carlos |
| 7 | Tweety | Pajaro | 2 | Isabel |
| 8 | Nemo | Pez | 1 | Roberto |
| 9 | Bella | Perro | 6 | Sofía |
| 10 | Shadow | Gato | 8 | Miguel |

---

## ✅ Requisitos de Evaluación

### 1. Funcionamiento del API y Frontend ✓
- API REST completamente funcional
- Frontend consume el API correctamente
- CRUD completo operativo
- Comunicación bidireccional estable

### 2. Arquitectura y Código ✓
- Patrón MVC bien definido
- Servicios separados de controladores
- DTOs para transferencia de datos
- Inyección de dependencias

### 3. Base de Datos ✓
- PostgreSQL configurado
- Script init.sql fornecido
- Índices para optimización
- Auditoria de cambios

### 4. Pruebas Unitarias ✓
- **Backend**: MascotaServiceTest, MascotaControllerTest
- **Frontend**: MascotaService.spec.ts, Componentes.spec.ts
- Casos exitosos y de error cubiertos

### 5. Pruebas de Estrés ✓
- k6 para testing de carga
- Múltiples usuarios concurrentes
- Medición de tiempos de respuesta
- Análisis de tasa de errores

### 6. Monitoreo ✓
- Spring Actuator endpoints
- Health checks personalizados
- Logs estructurados
- Métricas en tiempo real

### 7. Despliegue ✓
- Backend: Docker, Render, Railway, Fly.io
- Frontend: Vercel, Firebase, Netlify
- Scripts de compilación fornecidos

### 8. Documentación ✓
- README en backend y frontend
- Comentarios en código
- Documentación de API
- Guía de pruebas de estrés

---

## 🔐 Validaciones Implementadas

### Mascota
- **nombre**: 2-100 caracteres, obligatorio
- **especie**: obligatoria, lista predefinida
- **edad**: 0-100, rango válido
- **dueño**: 2-100 caracteres, obligatorio

---

## 📈 Resultados Esperados de Stress Testing

### Prueba de Lectura (20 VUs)
```
✓ Throughput: ~200-300 requests/segundo
✓ P99 latency: < 1500ms
✓ Error rate: < 0.1%
✓ Éxito general: > 95%
```

### Prueba de Escritura (10 VUs)
```
✓ Operaciones CRUD exitosas
✓ Latencia aceptable
✓ Consistencia de datos
✓ Recuperación sin errores
```

---

## 🛠️ Mantenimiento y Troubleshooting

### Backend
- Logs en: `target/logs/`
- Configuración: `application.yml`
- Tests: `mvn test`

### Frontend
- Build: `npm run build:prod`
- Tests: `npm test`
- Lint: `npm run lint` (si está configurado)

### Base de Datos
```sql
-- Ver conexiones activas
SELECT * FROM pg_stat_activity;

-- Ver estadísticas de tablas
SELECT * FROM pg_stat_user_tables;

-- Optimizar índices
ANALYZE mascotas;
REINDEX TABLE mascotas;
```

---

## 📞 Contacto y Soporte

**Desarrollador**: Diego Fabricio Salamea Morales

**Clase**: Sistemas Web / Desarrollo Web Avanzado

**Institución**: [Institución educativa]

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos.

---

## 🙏 Agradecimientos

- Spring Boot y el ecosistema de Java
- Angular y TypeScript
- PostgreSQL
- k6 y Grafana
- Bootstrap y comunidad web

---

**Última actualización**: Febrero 2024


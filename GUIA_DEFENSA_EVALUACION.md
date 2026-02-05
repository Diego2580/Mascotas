# 📚 GUÍA DE DEFENSA - EVALUACIÓN DEL PROYECTO

**Proyecto:** Sistema de Gestión de Mascotas  
**Estudiante:** Diego Fabricio Salamea Morales  
**Fecha:** Febrero 2025

---

## 🎯 RESUMEN EJECUTIVO (2 minutos)

**QUÉ ES:**
- Sistema web completo para gestionar mascotas (crear, leer, actualizar, eliminar)
- Arquitectura cliente-servidor: Spring Boot (backend) + Angular (frontend)
- Base de datos PostgreSQL
- Totalmente funcional, probado y desplegable

**TECNOLOGÍAS:**
- Backend: Java 17 + Spring Boot + PostgreSQL
- Frontend: Angular 17 + TypeScript
- Tests: JUnit + Karma + k6
- Monitoreo: Spring Actuator + Prometheus + Grafana

---

## 📊 PUNTO 1: Funcionamiento del API y Frontend (3.0/3.0)

### 🎓 Qué explicar:

#### **A. API REST Funcional**

```bash
# Todos estos endpoints funcionan:
GET    /api/mascotas              → Listar todas
GET    /api/mascotas/{id}         → Obtener una
POST   /api/mascotas              → Crear nueva
PUT    /api/mascotas/{id}         → Actualizar
DELETE /api/mascotas/{id}         → Eliminar

GET    /api/mascotas?especie=Perro → Filtrar por especie
GET    /api/mascotas/estadisticas/promedio-edad → Promedios
```

**Para demostrar:**
```bash
# Opción 1: Con cURL en terminal
curl -X GET http://localhost:8080/api/mascotas

# Opción 2: Usar el Frontend mismo
# http://localhost:4200 → Ver todas las mascotas, crear, editar, eliminar
```

#### **B. Frontend Completo**

| Funcionalidad | Dónde verlo |
|---|---|
| Lista de mascotas | Home page (localhost:4200) |
| Buscar/Filtrar | Input en el navbar |
| Crear mascota | Botón "Nueva Mascota" |
| Editar mascota | Click en el nombre |
| Ver detalles | Click en la fila |
| Eliminar mascota | Botón rojo en detalles |
| Estadísticas | Tab "Estadísticas" o `/estadisticas` |

**Lo que ven los evaluadores:**
- ✅ Interfaz limpia y funcional
- ✅ Validaciones en formularios
- ✅ Mensajes de error claros
- ✅ Comunicación fluida con API

#### **C. Atributos de Mascota bien implementados**

```
✅ id       → Long (autogenerado en BD)
✅ nombre   → String (2-100 caracteres)
✅ especie  → String (Perro, Gato, Conejo, etc.)
✅ edad     → Integer (0-100 años)
✅ owner    → String (nombre del dueño, 2-100 caracteres)
```

**¿Dónde se valida?**
- Backend: `@Valid` en controller + validaciones en entity
- Frontend: HTML5 + validadores de Angular

---

## 🗣️ PUNTO 2: Preguntas sobre el API (3.0/3.0)

### 📝 Prepárate para responder:

#### **Pregunta 1: ¿Cuál es la arquitectura del API?**

**Respuesta clara:**
```
MVC Pattern en capas:
┌─────────────────────────────────┐
│  Controller (REST Endpoints)    │ ← Recibe requests HTTP
├─────────────────────────────────┤
│  Service (Lógica de negocio)    │ ← Procesa datos
├─────────────────────────────────┤
│  Repository (Acceso a BD)       │ ← Consulta PostgreSQL
├─────────────────────────────────┤
│  Entity (Modelo de datos)       │ ← Tabla mascotas
└─────────────────────────────────┘
```

**Ubicación en código:**
- Controller: `mascotas-backend/src/main/java/com/salamea/mascotas/controller/`
- Service: `mascotas-backend/src/main/java/com/salamea/mascotas/service/`
- Repository: `mascotas-backend/src/main/java/com/salamea/mascotas/repository/`
- Entity: `mascotas-backend/src/main/java/com/salamea/mascotas/entity/`

---

#### **Pregunta 2: ¿Cómo está configurada la BD?**

**Respuesta:**
```
BD: PostgreSQL
Tabla: mascotas
ORM: JPA/Hibernate (Spring Data JPA)

Columnas:
- id (BIGINT, PRIMARY KEY, AUTO INCREMENT)
- nombre (VARCHAR(100), NOT NULL)
- especie (VARCHAR(50), NOT NULL)
- edad (INTEGER, NOT NULL)
- owner (VARCHAR(100), NOT NULL)
- fecha_creacion (TIMESTAMP, NO SE ACTUALIZA)
- fecha_actualizacion (TIMESTAMP, SE ACTUALIZA AUTOMÁTICAMENTE)
```

**Ver configuración:**
- `mascotas-backend/src/main/resources/application.yml`
- Script SQL: `mascotas-backend/src/main/resources/init.sql`

---

#### **Pregunta 3: ¿Cómo manejas los errores?**

**Respuesta:**
```
Excepciones personalizadas:
├─ MascotaNotFoundException
│  └─ Se lanza cuando GET /api/mascotas/{id} no existe
│     Devuelve: 404 NOT_FOUND
│
├─ Validación de datos
│  └─ @Valid en controller
│     Si faltan campos → 400 BAD_REQUEST
│
└─ GlobalExceptionHandler
   └─ Captura todas las excepciones
      Devuelve JSON con mensaje de error consistente
```

**Ejemplo de respuesta de error:**
```json
{
  "timestamp": "2025-02-05T14:30:45",
  "status": 404,
  "error": "Mascota no encontrada",
  "message": "La mascota con id 999 no existe",
  "path": "/api/mascotas/999"
}
```

---

#### **Pregunta 4: ¿Implementaste filtros o búsquedas?**

**Respuesta:**
```
Sí, implementé 3 tipos:

1. Filtro por especie:
   GET /api/mascotas?especie=Perro
   
2. Búsqueda por nombre:
   GET /api/mascotas?nombre=Max
   
3. Estadísticas:
   GET /api/mascotas/estadisticas/promedio-edad
   GET /api/mascotas/estadisticas/promedio-edad-especie?especie=Gato
```

**En el código:**
- `MascotaService.java` → métodos `filtrarPorEspecie()`, `buscarPorNombre()`
- `MascotaController.java` → endpoints correspondientes

---

## 🎨 PUNTO 3: Preguntas sobre el Frontend (3.0/3.0)

### 📝 Prepárate para responder:

#### **Pregunta 1: ¿Cuál es la estructura de componentes?**

**Respuesta:**
```
Sistema de Componentes Angular (Standalone):

┌─────────────────────────────────────┐
│  AppComponent (Principal)           │
│  ├─ NavbarComponent                 │
│  └─ RouterOutlet (Contenido dinámico)
├─────────────────────────────────────┤
│  Rutas principales:                 │
│  ├─ / → ListaMascotasComponent      │
│  ├─ /nuevo → FormularioComponent    │
│  ├─ /:id → DetalleMascotaComponent  │
│  └─ /estadisticas → EstadisticasComponent
└─────────────────────────────────────┘
```

**Ubicación:**
- `mascotas-frontend/src/app/components/`

---

#### **Pregunta 2: ¿Cómo comunica el frontend con el API?**

**Respuesta:**
```
Servicio MascotaService (HttpClient de Angular):

MascotaService
├─ getAllMascotas() → GET /api/mascotas
├─ getMascotaById(id) → GET /api/mascotas/{id}
├─ createMascota(data) → POST /api/mascotas
├─ updateMascota(id, data) → PUT /api/mascotas/{id}
├─ deleteMascota(id) → DELETE /api/mascotas/{id}
├─ filtrarPorEspecie(especie) → GET /api/mascotas?especie=...
└─ getEstadisticas() → GET /api/mascotas/estadisticas/...

Interceptores:
├─ Logging de requests/responses
├─ Manejo de errores global
└─ Timeout de 30 segundos
```

**En el código:**
- `mascotas-frontend/src/app/services/mascota.service.ts`

---

#### **Pregunta 3: ¿Implementaste validaciones?**

**Respuesta:**
```
Sí, 2 niveles:

NIVEL 1: HTML5 + Angular Validators
├─ Campos requeridos (required)
├─ Longitud mínima/máxima
├─ Validación de email (si aplica)
└─ Patrón de números (edad)

NIVEL 2: Backend (Spring Validation)
├─ @NotNull
├─ @Size(min=..., max=...)
├─ @Pattern (regex)
└─ @Positive (edad > 0)

Ejemplo en formulario:
- Nombre: 2-100 caracteres
- Especie: 2-50 caracteres
- Edad: 0-100
- Owner: 2-100 caracteres
```

**Ver código:**
- Frontend validation: `mascotas-frontend/src/app/components/formulario-mascota.component.ts`
- Backend validation: `mascotas-backend/src/main/java/com/salamea/mascotas/dto/MascotaDTO.java`

---

#### **Pregunta 4: ¿Cómo manejas errores en el frontend?**

**Respuesta:**
```
Manejo de errores con:

1. Try-Catch en servicios
   └─ Captura errores de red

2. Error Interceptor
   └─ Muestra mensajes de error globales

3. Notificaciones al usuario
   ├─ Mensajes de éxito (verde)
   ├─ Mensajes de error (rojo)
   └─ Loading spinners

Ejemplo:
- Usuario intenta crear mascota sin nombre
  → Se muestra error en rojo en formulario
  
- Servidor retorna 404
  → Se muestra alerta: "Mascota no encontrada"
```

---

## 🚀 PUNTO 4: Despliegue del Sistema (3.0/3.0)

### 🎓 Qué explicar:

#### **A. Cómo desplegar el Backend**

**Opción 1: Local (pruebas rápidas)**
```bash
cd mascotas-backend
mvn clean package
mvn spring-boot:run
# Accede a: http://localhost:8080/api
```

**Opción 2: Render (cloud - lo recomendado)**
```
1. Ve a render.com
2. "New Web Service"
3. Conecta tu GitHub
4. Build command:
   cd mascotas-backend && mvn clean package -DskipTests

5. Start command:
   java -Dserver.port=${PORT} -Dspring.profiles.active=prod -jar target/mascotas-1.0.0.jar

6. Agrega variables de entorno:
   - DATABASE_URL: tu PostgreSQL
   - DATABASE_USER: usuario
   - DATABASE_PASSWORD: contraseña

7. Espera 5-10 minutos
8. Tu URL será: https://mascotas-api.onrender.com/api
```

**Ver estado:**
```bash
curl https://mascotas-api.onrender.com/api/actuator/health
# Debe responder: {"status":"UP"}
```

---

#### **B. Cómo desplegar el Frontend**

**Opción 1: Vercel (rápido y gratis)**
```bash
# En mascotas-frontend/
npm run build

# Vercel automáticamente detecta Angular
# Deploy con: vercel
```

**Opción 2: Docker**
```dockerfile
# Dockerfile.frontend ya existe
docker build -f Dockerfile.frontend -t mascotas-frontend:latest .
docker run -p 80:4200 mascotas-frontend:latest
```

**Ver estado:**
```bash
# Accede a tu URL desplegada
http://tu-frontend.vercel.app
# Debe conectar con tu backend para listar mascotas
```

---

#### **C. Verificación de despliegue**

**Checklist:**
```
✅ Backend responde a /api/actuator/health
✅ Frontend carga en el navegador
✅ Frontend puede crear mascotas (POST funciona)
✅ Frontend puede listar mascotas (GET funciona)
✅ Frontend puede editar (PUT funciona)
✅ Frontend puede eliminar (DELETE funciona)
✅ No hay CORS errors
✅ No hay errores 500 en consola
```

---

## 🧪 PUNTO 5: Pruebas Unitarias (2.0/2.0)

### 🎓 Qué explicar:

#### **A. Pruebas Backend (Java)**

**Ubicación:** `mascotas-backend/src/test/java/com/salamea/mascotas/`

**Total: 21 tests ejecutados correctamente**

| Test | Qué prueba | Estado |
|---|---|---|
| `MascotaControllerTest` | Endpoints REST | ✅ 10/10 |
| `MascotaServiceTest` | Lógica de negocio | ✅ 11/11 |

**Ejemplos de tests:**
```java
✅ test_getAllMascotas() 
   → GET /api/mascotas debe retornar lista

✅ test_createMascota()
   → POST /api/mascotas crea nueva mascota

✅ test_updateMascota()
   → PUT /api/mascotas/{id} actualiza datos

✅ test_deleteMascota()
   → DELETE /api/mascotas/{id} elimina

✅ test_getMascotaById_NotFound()
   → GET /api/mascotas/999 retorna 404
```

**Ejecutar:**
```bash
cd mascotas-backend
mvn clean test

# Resultado esperado:
# [INFO] BUILD SUCCESS
# [INFO] Tests run: 21, Failures: 0, Skipped: 0
```

---

#### **B. Pruebas Frontend (Angular)**

**Ubicación:** `mascotas-frontend/src/app/`

**Total: 84 tests ejecutados correctamente**

**Servicios testeados:**
```
✅ mascota.service.spec.ts
   ├─ Test GET lista de mascotas
   ├─ Test GET mascota por ID
   ├─ Test POST crear mascota
   ├─ Test PUT actualizar mascota
   └─ Test DELETE eliminar mascota
   
✅ Componentes
   ├─ ListaMascotasComponent
   ├─ FormularioMascotaComponent
   ├─ DetalleMascotaComponent
   └─ EstadisticasComponent
```

**Ejecutar:**
```bash
cd mascotas-frontend
npm test

# Se abre navegador Karma
# Resultado esperado: 84 tests PASSED
```

---

#### **C. Cobertura**

**¿Qué cubren los tests?**
- ✅ Casos exitosos (Happy path)
- ✅ Casos de error (404, 400, 500)
- ✅ Validaciones
- ✅ Lógica de filtrado
- ✅ Cálculo de estadísticas

---

## 💪 PUNTO 6: Pruebas de Estrés del API (2.0/2.0)

### 🎓 Qué explicar:

#### **A. Herramienta: k6**

```
k6 es un framework de testing de carga moderno
→ Permite simular miles de usuarios simultáneos
→ Mide latencia, fallos, throughput
→ Escrito en JavaScript/Go
```

**Instalación Windows:**
```bash
choco install k6
# o descargar desde: https://github.com/grafana/k6/releases
```

---

#### **B. Pruebas Implementadas**

**1️⃣ Prueba de LECTURA (stress-test-read.js)**

```javascript
// Simula múltiples usuarios leyendo datos

Flujo:
- Ramp-up: 20 usuarios en 30s
- Mantener: 20 usuarios por 90s
- Ramp-down: 0 usuarios en 30s
Total: 3 minutos

Qué hace:
1. GET /api/mascotas (listar todas)
2. GET /api/mascotas/{random_id} (obtener una)
3. GET /api/mascotas?especie=Perro (filtrar)
4. GET /api/mascotas/estadisticas/promedio-edad
```

**Ejecutar:**
```bash
k6 run stress-test-read.js
```

**Resultado esperado:**
```
checks........................: 99% ✓ passes
http_req_duration.............: avg=150ms, p99=500ms
http_req_failed...............: 0.1%
vus...........................: 0 (max: 20)
```

---

**2️⃣ Prueba de ESCRITURA (stress-test-write.js)**

```javascript
// Simula usuarios creando, actualizando, eliminando

Flujo:
- Ramp-up: 10 usuarios en 20s
- Mantener: 10 usuarios por 60s
- Ramp-down: 0 usuarios en 20s
Total: 2 minutos

Qué hace:
1. POST /api/mascotas (crear)
2. GET /api/mascotas/{id} (obtener)
3. PUT /api/mascotas/{id} (actualizar)
4. DELETE /api/mascotas/{id} (eliminar)
5. GET /api/mascotas (verificar)
```

**Ejecutar:**
```bash
k6 run stress-test-write.js
```

---

#### **C. Métricas Evaluadas**

| Métrica | Qué significa | Umbral |
|---|---|---|
| `http_req_duration` | Tiempo promedio de respuesta | < 1500ms ✅ |
| `http_req_failed` | % de requests que fallan | < 0.1% ✅ |
| `vus` | Usuarios virtuales activos | 20 máx ✅ |
| `checks` | Validaciones pasadas | > 99% ✅ |

**¿Qué demuestra?**
- ✅ El API puede manejar 20 usuarios simultáneos
- ✅ Sin timeouts ni desconexiones
- ✅ Respuestas rápidas (< 1.5 segundos)
- ✅ Datos consistentes bajo carga

---

## 📊 PUNTO 7: Monitoreo en Tiempo Real (4.0/4.0)

### 🎓 Qué explicar:

#### **A. ¿Qué monitoreo implementaste?**

```
Sistema de Monitoreo con 3 capas:

CAPA 1: Backend (Spring Actuator)
├─ /api/monitoring/health
│  └─ Status UP/DOWN
├─ /api/monitoring/metrics/system
│  └─ Memoria, CPU, threads
├─ /api/monitoring/metrics/application
│  └─ Requests totales, latencia promedio
└─ /api/actuator/health
   └─ Compatibilidad con Prometheus

CAPA 2: Frontend (Dashboard)
├─ ApiStatusIndicatorComponent
│  └─ Indicador verde/rojo en navbar
└─ HealthMonitoringComponent
   └─ Tabla con métricas del sistema

CAPA 3: Stack (Opcional)
├─ Prometheus (recolecta métricas)
├─ Grafana (visualización)
└─ Docker Compose (orquestación)
```

---

#### **B. Endpoints de Monitoreo**

**1. Health Check**
```bash
curl -X GET http://localhost:8080/api/monitoring/health

Respuesta:
{
  "status": "UP",
  "timestamp": "2025-02-05T14:30:45",
  "service": "Mascotas API",
  "version": "1.0.0"
}
```

**Para demostrar:**
- API está encendido quando responde `"status":"UP"`
- Timestamp muestra cuando se consultó
- Accesible desde el indicador en navbar del frontend

---

**2. Métricas del Sistema**
```bash
curl -X GET http://localhost:8080/api/monitoring/metrics/system

Respuesta:
{
  "memory": {
    "total_mb": 512,
    "used_mb": 256,
    "usage_percent": 50.0
  },
  "cpu_percent": "25.5",
  "uptime_seconds": 1800,
  "threads": {
    "active": 12,
    "peak": 20
  }
}
```

**¿Qué significa?**
- Memory: Cuánta RAM usa el Java
- CPU: Porcentaje de procesador en uso
- Uptime: Cuánto tiempo lleva el API encendido
- Threads: Cuántos threads activos hay

---

**3. Métricas de Aplicación**
```bash
curl -X GET http://localhost:8080/api/monitoring/metrics/application

Respuesta:
{
  "http": {
    "total_requests": 150,
    "avg_response_time_ms": 125.5
  },
  "jvm": {
    "classes_loaded": 8542
  }
}
```

**¿Qué significa?**
- Total requests: Cuántas peticiones se procesaron
- Response time: Tiempo promedio de respuesta
- Classes loaded: Clases Java cargadas en memoria

---

#### **C. Dashboard Frontend**

**Ubicación: `http://localhost:4200/monitoreo`**

**¿Qué ve el usuario?**
```
┌─────────────────────────────────┐
│ DASHBOARD DE MONITOREO          │
├─────────────────────────────────┤
│ Estado: ✅ UP                   │
├─────────────────────────────────┤
│ Memoria:        256 MB / 512 MB │
│ CPU:            25.5 %          │
│ Uptime:         1800 segundos   │
│ Requests Total: 150             │
│ Latencia Prom:  125.5 ms        │
├─────────────────────────────────┤
│ 🟢 API Disponible (última check) │
└─────────────────────────────────┘
```

**Componentes:**
- `HealthMonitoringComponent` → Tabla de métricas
- `ApiStatusIndicatorComponent` → Indicador en navegación
- `MonitoringService` → Consulta endpoints cada 5 segundos

---

#### **D. Stack Completo (Docker Compose)**

**Archivos incluidos:**
- `docker-compose.monitoring.yml` → Levanta stack completo
- `prometheus.yml` → Configuración de Prometheus
- `grafana-datasources.yml` → Integración Grafana-Prometheus

**Ejecutar (opcional):**
```bash
# Levantar backend + frontend + Prometheus + Grafana
docker-compose -f docker-compose.monitoring.yml up -d

# Acceder a:
# - Frontend: http://localhost:4200
# - Backend: http://localhost:8080/api
# - Prometheus: http://localhost:9090
# - Grafana: http://localhost:3000
#   (usuario: admin, contraseña: admin)
```

**En Grafana:**
- Ver gráficos de CPU en tiempo real
- Ver memoria usada
- Ver latencia de requests
- Ver tasa de errores

---

### 📋 **¿Cómo demostrarlo en la evaluación?**

```
1. Levantar backend: mvn spring-boot:run
2. Levantar frontend: npm start
3. Abrir: http://localhost:4200/monitoreo
4. Esperar 5 segundos
5. Mostrar cómo las métricas se actualizan automáticamente
6. Abrir otro tab: http://localhost:4200 (crear/actualizar mascotas)
7. Volver al monitoreo: ver cómo cambian los números
8. Mostrar que los CURL funcionan (health check en terminal)
```

---

## 🎯 RESUMEN DE PUNTAJES ESPERADOS

| Rubro | Puntaje | Logrado |
|---|---|---|
| 1. Funcionamiento API/Frontend | 3.0 | ✅ |
| 2. Preguntas sobre API | 3.0 | ✅ |
| 3. Preguntas sobre Frontend | 3.0 | ✅ |
| 4. Despliegue del Sistema | 3.0 | ✅ |
| 5. Pruebas Unitarias | 2.0 | ✅ |
| 6. Pruebas de Estrés | 2.0 | ✅ |
| 7. Monitoreo Tiempo Real | 4.0 | ✅ |
| **TOTAL** | **20.0** | **✅** |

---

## 💡 TIPS PARA LA DEFENSA

### ✅ Haz esto:
1. **Ten dos terminals abiertas** (Backend + Frontend)
2. **Prepara 3 demo scripts:**
   - Crear una mascota
   - Editar la mascota
   - Eliminar la mascota
3. **Conoce la arquitectura** (dibuja en pizarra si es presencial)
4. **Sé honesto** sobre lo que hiciste vs lo que no
5. **Muestra el código** cuando pregunten detalles técnicos

### ❌ Evita esto:
1. ❌ Decir cosas que no entiendes
2. ❌ Leer directamente del código (parafrasea)
3. ❌ Hablar muy rápido
4. ❌ Llegar sin tener funcional el API/Frontend
5. ❌ Pretender que hiciste cosas que no hiciste

---

## 📞 PREGUNTAS FRECUENTES EN DEFENSA

### **P: ¿Por qué Spring Boot en lugar de otro framework?**
**R:** Spring Boot es el estándar industria para APIs Java. Incluye configuración automática, security, y es fácil de desplegar. Además, es lo que pide el requerimiento.

### **P: ¿Por qué PostgreSQL y no MySQL?**
**R:** PostgreSQL es más robusto, soporta tipos de datos más complejos, tiene mejor ACID compliance y es gratuito como MySQL. El requerimiento permitía elegir.

### **P: ¿Cómo validaste tu código?**
**R:** Con 21 tests unitarios en backend y 84 en frontend. Además, ejecuté pruebas de carga con k6 para verificar que aguanta 20 usuarios simultáneos.

### **P: ¿Tu API está desplegado en internet?**
**R:** [SÍ/NO] está en [tu URL]. Puedes acceder sin instalación local.

### **P: ¿Qué harías diferente si tuvieras más tiempo?**
**R:** Le agregaría autenticación (JWT), paginación avanzada, caching con Redis, y tests E2E con Cypress.

---

## 🚀 ÚLTIMA CHECKLIST ANTES DE DEFENDER

```
Backend (c:\mascotas-backend):
☐ mvn clean package → BUILD SUCCESS
☐ mvn spring-boot:run → Funciona sin errores
☐ curl http://localhost:8080/api/mascotas → Retorna JSON

Frontend (c:\mascotas-frontend):
☐ npm install → Instaladas dependencias
☐ npm start → Compila sin errores
☐ http://localhost:4200 → Carga interfaz
☐ Puedo crear/editar/eliminar mascotas

Tests:
☐ mvn test (backend) → 21/21 PASSED
☐ npm test (frontend) → 84/84 PASSED
☐ k6 run stress-test-read.js → Sin errores

Monitoreo:
☐ http://localhost:4200/monitoreo → Carga dashboard
☐ http://localhost:8080/api/monitoring/health → Retorna UP
```

¡**ÉXITO EN LA DEFENSA!** 🎉


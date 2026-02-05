# 📊 Documentación de Monitoreo del Sistema

## 🎯 Descripción General

El sistema de Mascotas incluye monitoreo integral con:
- **Backend:** Spring Boot Actuator + Métricas personalizadas
- **Frontend:** Dashboard de monitoreo y verificador de disponibilidad
- **Métricas:** Salud, rendimiento, sistema y aplicación

---

## 🔌 Endpoints de Monitoreo (Backend)

### 1. **Health Check**
**Endpoint:** `GET /api/monitoring/health`

**Propósito:** Verifica el estado de salud del servicio

**Respuesta (200 OK):**
```json
{
  "status": "UP",
  "timestamp": "2025-02-05T14:30:45.123456",
  "service": "Mascotas API",
  "version": "1.0.0"
}
```

**Ejemplo cURL:**
```bash
curl -X GET http://localhost:8080/api/monitoring/health
```

---

### 2. **Métricas del Sistema**
**Endpoint:** `GET /api/monitoring/metrics/system`

**Propósito:** Obtiene métricas del JVM y sistema operativo

**Respuesta (200 OK):**
```json
{
  "memory": {
    "total_mb": 512,
    "used_mb": 256,
    "free_mb": 256,
    "usage_percent": 50.0
  },
  "cpu_percent": "25.50",
  "uptime_seconds": 1800,
  "threads": {
    "active": 12,
    "peak": 20
  },
  "timestamp": "2025-02-05T14:30:45.123456"
}
```

**Métrica por métrica:**
| Campo | Descripción |
|-------|-------------|
| `memory.total_mb` | Memoria total JVM en MB |
| `memory.used_mb` | Memoria usada en MB |
| `memory.free_mb` | Memoria libre disponible |
| `memory.usage_percent` | Porcentaje de memoria usada |
| `cpu_percent` | Porcentaje de CPU en uso |
| `uptime_seconds` | Tiempo de ejecución en segundos |
| `threads.active` | Threads activos actualmente |
| `threads.peak` | Máximo de threads alcanzados |

**Ejemplo cURL:**
```bash
curl -X GET http://localhost:8080/api/monitoring/metrics/system
```

---

### 3. **Métricas de la Aplicación**
**Endpoint:** `GET /api/monitoring/metrics/application`

**Propósito:** Metrics específicas de la aplicación (requests, respuesta)

**Respuesta (200 OK):**
```json
{
  "http": {
    "total_requests": 150,
    "avg_response_time_ms": 125.5
  },
  "jvm": {
    "classes_loaded": 8542
  },
  "timestamp": "2025-02-05T14:30:45.123456"
}
```

**Métrica por métrica:**
| Campo | Descripción |
|-------|-------------|
| `http.total_requests` | Total de requests procesados |
| `http.avg_response_time_ms` | Tiempo promedio de respuesta en ms |
| `jvm.classes_loaded` | Clases Java cargadas |

**Ejemplo cURL:**
```bash
curl -X GET http://localhost:8080/api/monitoring/metrics/application
```

---

### 4. **Estado del Servicio**
**Endpoint:** `GET /api/monitoring/status`

**Propósito:** Estado completo del servicio incluyendo endpoints y BD

**Respuesta (200 OK):**
```json
{
  "service_name": "Mascotas API",
  "status": "HEALTHY",
  "timestamp": "2025-02-05T14:30:45.123456",
  "database": {
    "status": "CONNECTED",
    "type": "PostgreSQL"
  },
  "endpoints": {
    "mascotas": "AVAILABLE",
    "monitoring": "AVAILABLE",
    "health": "AVAILABLE"
  },
  "resource_usage": {
    "memory_percent": 50,
    "cpu_percent": "25.50"
  }
}
```

**Ejemplo cURL:**
```bash
curl -X GET http://localhost:8080/api/monitoring/status
```

---

### 5. **Información de la Aplicación**
**Endpoint:** `GET /api/monitoring/info`

**Propósito:** Información meta de la aplicación

**Respuesta (200 OK):**
```json
{
  "name": "Mascotas Management System",
  "version": "1.0.0",
  "description": "Sistema de gestión de mascotas con monitoreo integrado",
  "author": "Diego Salamea",
  "build_date": "2025-02-05T14:30:45.123456",
  "available_endpoints": {
    "api_base": "/api",
    "mascotas": "GET /api/mascotas",
    "health_check": "GET /api/monitoring/health",
    "system_metrics": "GET /api/monitoring/metrics/system",
    "app_metrics": "GET /api/monitoring/metrics/application",
    "service_status": "GET /api/monitoring/status",
    "actuator": "GET /api/actuator",
    "prometheus": "GET /api/actuator/prometheus"
  }
}
```

**Ejemplo cURL:**
```bash
curl -X GET http://localhost:8080/api/monitoring/info
```

---

### 6. **Actuator - Health (Spring Boot)**
**Endpoint:** `GET /api/actuator/health`

**Propósito:** Health check detallado con componentes individuales

**Respuesta (200 OK):**
```json
{
  "status": "UP",
  "components": {
    "api": {
      "status": "UP",
      "details": {
        "api": "Mascotas API",
        "status": "Available",
        "response_time_ms": 2,
        "endpoints_available": "All"
      }
    },
    "database": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "status": "Connected",
        "response_time": "< 2s"
      }
    }
  }
}
```

**Ejemplo cURL:**
```bash
curl -X GET http://localhost:8080/api/actuator/health
```

---

### 7. **Métricas Prometheus**
**Endpoint:** `GET /api/actuator/prometheus`

**Propósito:** Métricas en formato Prometheus para monitoreo externo

**Formato de Salida:**
```
# HELP jvm_memory_used_bytes The amount of used memory
# TYPE jvm_memory_used_bytes gauge
jvm_memory_used_bytes{area="heap",id="PS Survivor Space",} 1234567.0

# HELP http_server_requests_seconds
# TYPE http_server_requests_seconds summary
http_server_requests_seconds_count{method="GET",status="200",uri="/api/mascotas",} 45.0
http_server_requests_seconds_sum{method="GET",status="200",uri="/api/mascotas",} 5.234
```

**Integración con Prometheus:**
Agregar al `prometheus.yml`:
```yaml
scrape_configs:
  - job_name: 'mascotas-api'
    static_configs:
      - targets: ['localhost:8080']
    metrics_path: '/api/actuator/prometheus'
    scrape_interval: 15s
```

**Ejemplo cURL:**
```bash
curl -X GET http://localhost:8080/api/actuator/prometheus
```

---

## 🎨 Frontend - Componentes de Monitoreo

### 1. **API Status Indicator** (Barra de estado)

**Ubicación:** Barra superior de la aplicación

**Funcionalidades:**
- ✅ Indicador visual del estado (verde = disponible, rojo = no disponible)
- ✅ Tiempo de respuesta en ms si está disponible
- ✅ Actualización automática cada 5 segundos
- ✅ Animación de pulso cuando está disponible

**Código:**
```html
<app-api-status-indicator></app-api-status-indicator>
```

---

### 2. **Health Monitoring Dashboard**

**Ubicación:** `/monitoreo` (ruta en el navegador)

**Secciones:**
1. **Estado del Servicio:** Status general (HEALTHY/UNHEALTHY)
2. **Health Check:** Componentes individuales
3. **Métricas del Sistema:** Memoria, CPU, Threads, Uptime
4. **Disponibilidad de Servicios:** Estado de endpoints
5. **Uso de Recursos:** Gráficas visuales

**Características:**
- 📊 Actualización automática cada 5-10 segundos
- 📈 Gráficas de uso de memoria y CPU
- 🔴 Indicadores visuales de estado
- ⚡ Información en tiempo real

**Acceso:**
```
http://localhost:4200/monitoreo
```

---

## 🛠️ Cómo Usar el Monitoreo

### Opción 1: Dashboard Web (Recomendado)

1. **Iniciar la aplicación**
   ```bash
   # Backend
   cd mascotas-backend
   mvn spring-boot:run
   
   # Frontend (en otra terminal)
   cd mascotas-frontend
   ng serve
   ```

2. **Acceder al dashboard**
   - URL: http://localhost:4200/monitoreo
   - El indicador de estado aparecerá automáticamente en la barra superior

3. **Interpretar métricas**
   - 🟢 Verde: Sistema sano
   - 🔴 Rojo: Sistema con problemas
   - ⚡ Tiempo de respuesta: Menor = mejor

### Opción 2: Curl Commands (Testing)

**Script para monitoreo continuo:**
```bash
#!/bin/bash
while true; do
  echo "=== Health Check ==="
  curl -s http://localhost:8080/api/monitoring/health | jq .
  
  echo -e "\n=== System Metrics ==="
  curl -s http://localhost:8080/api/monitoring/metrics/system | jq '.memory'
  
  sleep 5
  clear
done
```

### Opción 3: Integración con Prometheus/Grafana

1. **Levantar Prometheus**
   ```bash
   docker run -p 9090:9090 \
     -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
     prom/prometheus
   ```

2. **Configurar Grafana**
   - Agregar Prometheus como datasource
   - Importar dashboard para k6 (ID: 3457)
   - Agregar datasource para métricas custom

---

## 📈 Métricas Importantes

### Umbrales de Alerta

| Métrica | Bueno | Advertencia | Crítico |
|---------|-------|-------------|---------|
| Memoria | <60% | 60-80% | >80% |
| CPU | <50% | 50-75% | >75% |
| Response Time | <200ms | 200-500ms | >500ms |
| Error Rate | <1% | 1-5% | >5% |
| Disponibilidad | >99% | 95-99% | <95% |

---

## 🔍 Troubleshooting

### El endpoint `/api/monitoring/health` retorna 404
**Solución:** Verificar que Actuator está habilitado en `application.yml`
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,info,prometheus
```

### El dashboard de monitoreo no muestra datos
**Solución:** 
1. Verificar que el backend está ejecutándose en puerto 8080
2. Abrir consola del navegador (F12) para ver errores
3. Revisar que MonitoringService está disponible

### CPU/Memoria no se actualiza
**Solución:** Los valores se actualizan cada 10 segundos (configurable)

---

## 📝 Logs y Debugging

### Ver logs de monitoreo
```bash
# En terminal donde corre Spring Boot
# Busca líneas con [mascotas.request] o [monitoring]
```

### Habilitar debug mode
En `application.yml`:
```yaml
logging:
  level:
    com.salamea.mascotas: DEBUG
    org.springframework.web: DEBUG
```

---

## 🎯 Checklist de Monitoreo

- [x] Health check endpoint disponible
- [x] Métricas de sistema en tiempo real
- [x] Métricas de aplicación (requests/responses)
- [x] Estado del servicio completo
- [x] Dashboard frontend con visualización
- [x] Indicador de disponibilidad en navbar
- [x] Integración con Prometheus
- [x] Custom Health Indicators (API + Database)
- [x] Interceptor para medir performance
- [x] Documentación completa

---

## 📞 URLs Rápidas

| URL | Propósito |
|-----|----------|
| `http://localhost:8080/api/monitoring/health` | Health check |
| `http://localhost:8080/api/monitoring/status` | Estado general |
| `http://localhost:8080/api/monitoring/metrics/system` | Métricas sistema |
| `http://localhost:8080/api/monitoring/metrics/application` | Métricas app |
| `http://localhost:8080/api/monitoring/info` | Información |
| `http://localhost:8080/api/actuator/health` | Actuator health |
| `http://localhost:8080/api/actuator/prometheus` | Prometheus metrics |
| `http://localhost:4200/monitoreo` | Dashboard de monitoreo |

---

**Documento generado:** 2025-02-05  
**Versión:** 1.0

# Guía Paso a Paso: Ejecución de Pruebas con k6 y Grafana

## 🚀 OPCIÓN 1: Ejecución Simple (Sin Grafana)

### Paso 1: Instalar k6

**Windows (Chocolatey):**
```powershell
choco install k6
```

**Windows (Descarga manual):**
1. Ir a: https://github.com/grafana/k6/releases
2. Descargar `k6-vX.X.X-windows-amd64.zip`
3. Extraer a `C:\Program Files\k6`
4. Agregar a PATH

**macOS (Homebrew):**
```bash
brew install k6
```

**Linux (Debian/Ubuntu):**
```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6-stable.list
sudo apt-get update
sudo apt-get install k6
```

### Paso 2: Verificar instalación

```bash
k6 version
```

### Paso 3: Ejecutar pruebas

```bash
# Ir al directorio del proyecto
cd c:\Users\diego\OneDrive\Escritorio\DIego\sistema-mascotas

# Ejecutar prueba de lectura
k6 run k6-read-test.js

# Ejecutar prueba mixta
k6 run k6-mixed-test.js

# O usar el script automático (Windows)
.\run-k6-tests.bat

# O usar el script automático (Linux/macOS)
bash run-k6-tests.sh
```

---

## 🎯 OPCIÓN 2: Ejecución Completa con Docker, Grafana e InfluxDB

### Paso 1: Instalar Docker y Docker Compose

**Windows:**
- Descargar: https://www.docker.com/products/docker-desktop
- Instalar Docker Desktop

**macOS:**
```bash
brew install docker docker-compose
```

**Linux:**
```bash
sudo apt-get install docker.io docker-compose
```

### Paso 2: Levantar los servicios

```bash
# Ir al directorio del proyecto
cd c:\Users\diego\OneDrive\Escritorio\DIego\sistema-mascotas

# Levantar Docker Compose
docker-compose -f docker-compose.monitoring.yml up -d

# Verificar que los servicios están ejecutándose
docker-compose -f docker-compose.monitoring.yml ps
```

**Esperado:**
```
NAME           STATUS
backend        Up (healthy)
mysql          Up
frontend       Up
influxdb       Up
grafana        Up
prometheus     Up
```

### Paso 3: Ejecutar pruebas con InfluxDB

```bash
# Ejecutar prueba de lectura
k6 run -o influxdb=http://localhost:8086/k6 k6-read-test.js

# Ejecutar prueba mixta
k6 run -o influxdb=http://localhost:8086/k6 k6-mixed-test.js

# Ejecutar spike test
k6 run -o influxdb=http://localhost:8086/k6 k6-spike-test.js
```

### Paso 4: Acceder a Grafana

1. Abrir: `http://localhost:3000`
2. Usuario: `admin`
3. Contraseña: `admin`

### Paso 5: Configurar Grafana

**A. Agregar Data Source:**
1. Click en Engranaje (Settings) en sidebar izquierdo
2. Seleccionar "Data Sources"
3. Click en "Add new data source"
4. Seleccionar "InfluxDB"
5. Ingresar:
   - **Name:** InfluxDB
   - **URL:** http://influxdb:8086
   - **Database:** k6
   - **User:** k6user
   - **Password:** k6pass
6. Click en "Save & test"

**B. Crear Dashboard:**

Opción A - Importar Dashboard Oficial:
1. Click en "+" → "Import"
2. Ingresar ID: `3457` (K6 Official Dashboard)
3. Click "Load"
4. Seleccionar "InfluxDB" como datasource
5. Click "Import"

Opción B - Crear Dashboard Manual:
1. Click en "+" → "Dashboard"
2. Click en "Add new panel"
3. Configurar métricas:
   - Métrica: `http_req_duration`
   - Funciones: `Aggregation > Mean`
   - Agrupar por: `test`, `method`
4. Personalizar según necesidad

### Paso 6: Visualizar resultados en tiempo real

Mientras ejecutas las pruebas k6, abre Grafana y verás:
- Gráficas de tiempo de respuesta
- Tasa de errores
- Usuarios concurrentes en tiempo real
- Throughput (requests/segundo)

---

## 📊 Interpretación de Resultados

### Tabla de Métricas

| Métrica | Descripción | Óptimo |
|---------|--------|--------|
| **http_req_duration** | Tiempo total de request | p(95)<500ms |
| **http_req_blocked** | Tiempo esperando conexión | <10ms |
| **http_req_connecting** | Tiempo estableciendo conexión | <5ms |
| **http_req_sending** | Tiempo enviando datos | <10ms |
| **http_req_waiting** | Tiempo esperando respuesta | <400ms |
| **http_req_receiving** | Tiempo recibiendo respuesta | <50ms |
| **http_req_failed** | % de requests fallidos | <5% |
| **http_reqs** | Total de requests enviados | Mayor es mejor |
| **data_sent** | Total de datos enviados | ~3-5MB |
| **data_received** | Total de datos recibidos | ~100-150MB |
| **vus** | Usuarios virtuales activos | Según config |
| **vus_max** | Máximo de usuarios | 50-200+ |

### Análisis de Rendimiento

**Buen Rendimiento:**
- p(95) response time < 500ms
- Error rate < 5%
- Usuarios soportados > 100

**Rendimiento Aceptable:**
- p(95) response time 500-800ms
- Error rate 5-10%
- Usuarios soportados 50-100

**Mal Rendimiento:**
- p(95) response time > 800ms
- Error rate > 10%
- Usuarios soportados < 50

---

## 🔍 Troubleshooting

### Error: "Cannot connect to localhost:8080"
**Solución:** Verificar que el backend está ejecutándose
```bash
curl http://localhost:8080/mascotas
# Debe retornar JSON con lista de mascotas
```

### Error: "Permission denied" en Linux
**Solución:** Agregar usuario a grupo docker
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Error: "Port 3000 already in use"
**Solución:** Cambiar puerto de Grafana
```bash
docker-compose -f docker-compose.monitoring.yml down
# Editar docker-compose.monitoring.yml, cambiar puerto 3000 a 3001
docker-compose -f docker-compose.monitoring.yml up -d
```

### InfluxDB no recibe datos
**Solución:** Verificar que InfluxDB está funcionando
```bash
# Revisar que la base de datos existe
curl http://localhost:8086/query?q=SHOW%20DATABASES

# Si falta, crearla
curl -X POST http://localhost:8086/query --data-urlencode "q=CREATE DATABASE k6"
```

### Grafana no muestra datos
**Solución:**
1. Verificar que InfluxDB está sano
2. Verificar credenciales de conexión
3. Revisar que k6 escribió datos:
   ```bash
   curl "http://localhost:8086/query?db=k6&q=SELECT%20COUNT(*)" | jq
   ```

---

## 📈 Exportar Resultados

### Generar reporte JSON
```bash
k6 run --out json=resultados.json k6-mixed-test.js
```

### Generar reporte CSV (con plugin)
```bash
k6 run --out csv=resultados.csv k6-mixed-test.js
```

### Exportar dashboard de Grafana
1. Click en nombre del dashboard
2. Click en menu (tres puntos)
3. "Export dashboard"
4. Seleccionar "Export for sharing externally"

---

## 🧹 Limpiar recursos

### Detener Docker Compose
```bash
docker-compose -f docker-compose.monitoring.yml down
```

### Limpiar volumenes (Advertencia: borra datos)
```bash
docker-compose -f docker-compose.monitoring.yml down -v
```

---

## 📚 Recursos Útiles

- **k6 Doc Official:** https://k6.io/docs/
- **k6 API Reference:** https://k6.io/docs/javascript-api/
- **Grafana d docs:** https://grafana.com/docs/
- **InfluxDB Query Language:** https://docs.influxdata.com/influxdb/v1.8/

---

**Última actualización:** 2025-02-05

# 🎬 COMANDOS DE EJECUCIÓN - Copiar y Pegar

## 1️⃣ BACKEND TESTS (Java/Maven)

```bash
# Navegar al directorio backend
cd mascotas-backend

# Limpiar y ejecutar tests
mvn clean test

# Resultado esperado:
# BUILD SUCCESS
# Tests run: 21, Failures: 0, Errors: 0, Skipped: 0
```

---

## 2️⃣ FRONTEND TESTS (Angular/Karma)

```bash
# Navegar al directorio frontend
cd mascotas-frontend

# Instalar dependencias (si es primera vez)
npm install

# Ejecutar tests sin modo watch
npm test -- --watch=false --browsers=ChromeHeadless

# Resultado esperado:
# TOTAL: 84 SUCCESS
# TOTAL: 84 FAILED: 0
```

---

## 3️⃣ INSTALAR K6

### Windows (Chocolatey)
```powershell
choco install k6
```

### Windows (Descarga Manual)
```powershell
# 1. Descargar desde:
# https://github.com/grafana/k6/releases/download/vX.X.X/k6-vX.X.X-windows-amd64.zip

# 2. Extraer a C:\Program Files\k6

# 3. Agregar al PATH:
# Control Panel > System > Advanced > Environment Variables > PATH > Edit
# Agregar: C:\Program Files\k6

# 4. Verificar:
k6 version
```

### macOS
```bash
brew install k6
```

### Linux (Debian/Ubuntu)
```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6-stable.list
sudo apt-get update
sudo apt-get install k6
```

### Verificación
```bash
k6 version
# Debe mostrar: k6 v0.48.0 (o similar)
```

---

## 4️⃣ EJECUTAR PRUEBAS De CARGA CON K6

### Opción A: Script automático (Windows)
```bash
cd c:\Users\diego\OneDrive\Escritorio\DIego\sistema-mascotas
.\run-k6-tests.bat
```

### Opción B: Script automático (Linux/Mac)
```bash
cd /path/to/sistema-mascotas
bash run-k6-tests.sh
```

### Opción C: Ejecutar individualmente

**Prueba de Lectura**
```bash
cd c:\Users\diego\OneDrive\Escritorio\DIego\sistema-mascotas
k6 run k6-read-test.js

# Duración: ~6 minutos
# Usuarios: 10 → 30
```

**Prueba de Escritura**
```bash
k6 run k6-write-test.js

# Duración: ~4 minutos
# Usuarios: 5 → 15
```

**Prueba Mixta (Recomendada)**
```bash
k6 run k6-mixed-test.js

# Duración: ~8 minutos
# Usuarios: 20 → 50
# Operaciones: 70% GET, 30% POST
```

**Spike Test**
```bash
k6 run k6-spike-test.js

# Duración: ~2 minutos
# Usuarios: Picos de 10 → 100 → 200
```

---

## 5️⃣ SETUP COMPLETO CON DOCKER (Opcional)

### Instalar Docker
- **Windows/Mac:** Descargar Docker Desktop desde https://www.docker.com/products/docker-desktop
- **Linux:** `sudo apt-get install docker.io docker-compose`

### Levantar Stack Completo
```bash
# Ir al directorio del proyecto
cd c:\Users\diego\OneDrive\Escritorio\DIego\sistema-mascotas

# Levantar servicios
docker-compose -f docker-compose.monitoring.yml up -d

# Esperar a que inicien (30 segundos)
docker-compose -f docker-compose.monitoring.yml ps

# Resultado esperado:
# backend        Up
# mysql          Up
# frontend       Up
# influxdb       Up
# grafana        Up
# prometheus     Up
```

---

## 6️⃣ EJECUTAR K6 CON INFLUXDB

```bash
# Asegurarse que Docker está ejecutándose
cd c:\Users\diego\OneDrive\Escritorio\DIego\sistema-mascotas

# Ejecutar prueba de lectura con InfluxDB
k6 run -o influxdb=http://localhost:8086/k6 k6-read-test.js

# Ejecutar prueba mixta con InfluxDB
k6 run -o influxdb=http://localhost:8086/k6 k6-mixed-test.js

# Ejecutar spike test con InfluxDB
k6 run -o influxdb=http://localhost:8086/k6 k6-spike-test.js
```

---

## 7️⃣ ACCEDER A GRAFANA

```
URL: http://localhost:3000

Credenciales por defecto:
Username: admin
Password: admin

(Cambiar en primer login)
```

### Configurar Data Source (Influx DB)
1. Click en **Settings** (engranaje) → **Data Sources**
2. Click en **Add new data source**
3. Seleccionar **InfluxDB**
4. Rellenar:
   - **Name:** InfluxDB
   - **URL:** http://influxdb:8086
   - **Database:** k6
   - **User:** k6user
   - **Password:** k6pass
5. Click **Save & Test**

### Importar Dashboard
1. Click en **+** → **Import**
2. Ingresa ID: `3457` (K6 Official Dashboard)
3. Click **Load**
4. Selecciona **InfluxDB** como datasource
5. Haz click **Import**

---

## 8️⃣ VER RESULTADOS EN TIEMPO REAL

Mientras ejecutas `k6 run`:
- Abre http://localhost:3000 en navegador
- Ve al dashboard K6 importado
- Verás gráficas actualizando en tiempo real

---

## 9️⃣ GENERAR REPORTES

### Guardar resultados en JSON
```bash
k6 run --out json=resultados.json k6-mixed-test.js
```

### Guardar resultados en CSV
```bash
k6 run --out csv=resultados.csv k6-mixed-test.js
```

### Ejecutar con más verbosidad
```bash
k6 run -v k6-read-test.js
```

---

## 🔟 VERIFICACIÓN FINAL

### 1. Backend tests correctos
```bash
cd mascotas-backend && mvn clean test
# ✓ BUILD SUCCESS
# ✓ Tests: 21/21
```

### 2. Frontend tests correctos
```bash
cd mascotas-frontend && npm test -- --watch=false --browsers=ChromeHeadless
# ✓ TOTAL: 84 SUCCESS
```

### 3. k6 está instalado
```bash
k6 version
# ✓ v0.48.0 (o similar)
```

### 4. Backend está ejecutándose
```bash
curl http://localhost:8080/mascotas
# ✓ Retorna JSON con mascotas
```

### 5. Docker está ejecutándose (opcional)
```bash
docker-compose -f docker-compose.monitoring.yml ps
# ✓ Todos los servicios en "Up"
```

---

## 🚨 TROUBLESHOOTING

### K6 command not found
```bash
# Verificar que está en PATH
where k6  # Windows
which k6  # Linux/Mac

# Si no funciona, reinstalar:
# Windows: choco uninstall k6 && choco install k6
# Mac: brew uninstall k6 && brew install k6
```

### Backend no responde
```bash
# Revisar que está ejecutándose
curl -v http://localhost:8080/mascotas

# O ejecutar manualmente:
cd mascotas-backend && mvn spring-boot:run
```

### InfluxDB no guarda datos
```bash
# Verifi car que InfluxDB está sano
curl http://localhost:8086/ping

# Ver bases de datos:
curl http://localhost:8086/query?q=SHOW%20DATABASES

# Crear BD si falta:
curl -X POST http://localhost:8086/query --data-urlencode "q=CREATE DATABASE k6"
```

### Puerto 3000 en uso
```bash
# Cambiar puerto en docker-compose.monitoring.yml:
# Cambiar "3000:3000" por "3001:3000"

# Luego:
docker-compose -f docker-compose.monitoring.yml down
docker-compose -f docker-compose.monitoring.yml up -d
```

---

## 📞 CONTACTO Y SOPORTE

**Documentación sobre tests:**
- [TEST_SUMMARY.md](TEST_SUMMARY.md) - Resumen completo
- [LOAD_TESTING_GUIDE.md](LOAD_TESTING_GUIDE.md) - Guía detallada
- [K6_STRESS_TESTS_README.md](K6_STRESS_TESTS_README.md) - Manual de k6

**Recursos externos:**
- k6 Docs: https://k6.io/docs/
- Grafana Docs: https://grafana.com/docs/
- InfluxDB Docs: https://docs.influxdata.com/

---

**Última actualización:** 2025-02-05  
✅ **Todos los comandos están listos para copiar y pegar**


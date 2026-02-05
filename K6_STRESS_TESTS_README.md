# Pruebas de Carga con k6 y Grafana

Este documento describe cómo ejecutar las pruebas de carga del API de mascotas usando **k6** con visualización en **Grafana**.

## Requisitos Previos

1. **k6** instalado ([descargar](https://k6.io/docs/getting-started/installation/))
2. **Docker** y **Docker Compose** para Grafana e InfluxDB (opcional)
3. Backend ejecutándose en `http://localhost:8080`

## Opción 1: Ejecución Simple con k6

### Instalación de k6

#### Windows (con Chocolatey):
```powershell
choco install k6
```

#### Windows (descarga manual):
1. Descargar desde: https://github.com/grafana/k6/releases
2. Agregar al PATH del sistema

#### Mac:
```bash
brew install k6
```

#### Linux:
```bash
sudo apt-get install k6
```

### Scripts de Prueba Disponibles

#### 1. **Prueba de Lectura** (`k6-read-test.js`)
Simula usuarios leyendo datos del API.
```bash
k6 run k6-read-test.js
```
- **Usuarios**: Ramp-up de 10 a 30 usuarios
- **Duración**: ~6 minutos
- **Operaciones**: GET /mascotas, GET /mascotas/{id}, filtrados, búsquedas

#### 2. **Prueba de Escritura** (`k6-write-test.js`)
Simula creación de mascotas.
```bash
k6 run k6-write-test.js
```
- **Usuarios**: Ramp-up de 5 a 15 usuarios
- **Duración**: ~4 minutos
- **Operaciones**: POST /mascotas

#### 3. **Prueba Mixta** (`k6-mixed-test.js`)
Combina 70% lecturas y 30% escrituras - más realista.
```bash
k6 run k6-mixed-test.js
```
- **Usuarios**: Ramp-up de 20 a 50 usuarios
- **Duración**: ~8 minutos
- **Operaciones**: Mezcla de GET y POST

#### 4. **Spike Test** (`k6-spike-test.js`)
Prueba de carga máxima repentina.
```bash
k6 run k6-spike-test.js
```
- **Usuarios**: Picos de hasta 200 usuarios
- **Duración**: ~2 minutos
- **Objetivo**: Ver comportamiento en carga máxima

### Ejemplo: Ejecutar una Prueba

```bash
# Ir al directorio del proyecto
cd c:\Users\diego\OneDrive\Escritorio\DIego\sistema-mascotas

# Ejecutar prueba de lectura
k6 run k6-read-test.js

# Ejecutar prueba mixta
k6 run k6-mixed-test.js

# Ejecutar con más verbosidad
k6 run -v k6-read-test.js
```

## Opción 2: Integración con Grafana e InfluxDB

### Setup con Docker Compose

1. **Crear archivo `docker-compose.yml`**:

```yaml
version: '3'
services:
  influxdb:
    image: influxdb:1.8
    ports:
      - "8086:8086"
    environment:
      - INFLUXDB_DB=k6
      - INFLUXDB_ADMIN_USER=admin
      - INFLUXDB_ADMIN_PASSWORD=admin
    volumes:
      - influxdb-data:/var/lib/influxdb

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_SECURITY_ADMIN_USER=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    depends_on:
      - influxdb
    volumes:
      - grafana-data:/var/lib/grafana

volumes:
  influxdb-data:
  grafana-data:
```

2. **Ejecutar Docker Compose**:
```bash
docker-compose up -d
```

3. **Configurar k6 para enviar datos a InfluxDB**:

```bash
# Prueba de lectura con InfluxDB
k6 run \
  -o influxdb=http://localhost:8086/k6 \
  k6-read-test.js

# Prueba mixta con InfluxDB
k6 run \
  -o influxdb=http://localhost:8086/k6 \
  k6-mixed-test.js
```

4. **Acceder a Grafana**:
- Abrir: `http://localhost:3000`
- Usuario: `admin`
- Contraseña: `admin`

5. **Agregar InfluxDB como Data Source**:
   - Settings → Data Sources → Add Data Source
   - Seleccionar InfluxDB
   - URL: `http://influxdb:8086`
   - Database: `k6`

6. **Importar Dashboard**:
   - Dashboards → Import
   - Importar ID: `3457` (K6 Official Dashboard)

## Interpretación de Resultados

### Métricas Principales

| Métrica | Descripción | Umbral Bueno |
|---------|--------|---------|
| **p(95)** | 95% de requests están por debajo de este tiempo | < 500ms |
| **p(99)** | 99% de requests están por debajo de este tiempo | < 1000ms |
| **http_req_failed** | Tasa de requests que fallaron | < 5% |
| **http_reqs** | Total de requests enviados | Mayor es mejor |
| **vus** | Usuarios virtuales activos | Según configuración |

### Ejemplo de Salida

```
     data_received..................: 125 MB   5.2 MB/s
     data_sent........................: 3.5 MB    146 kB/s
     http_req_blocked..................: avg=5.23ms    min=2ms      med=3ms      max=145ms    p(90)=4ms      p(95)=7ms      p(99)=25ms
     http_req_connecting..............: avg=2.11ms    min=0s       med=0s       max=89ms     p(90)=0s       p(95)=0s       p(99)=15ms
     http_req_duration.................: avg=234ms     min=50ms     med=180ms    max=2.5s     p(90)=450ms    p(95)=520ms    p(99)=920ms
     http_req_failed...................: 2.15%
     http_req_receiving................: avg=12.5ms    min=1ms      med=10ms     max=145ms    p(90)=20ms     p(95)=25ms     p(99)=45ms
     http_req_sending..................: avg=5.2ms     min=1ms      med=4ms      max=85ms     p(90)=6ms      p(95)=8ms      p(99)=20ms
     http_req_tls_handshaking.........: avg=0s        min=0s       med=0s       max=0s       p(90)=0s       p(95)=0s       p(99)=0s
     http_req_waiting..................: avg=216ms     min=45ms     med=165ms    max=2.3s     p(90)=430ms    p(95)=500ms    p(99)=890ms
     http_reqs.........................: 2500         104.166667/s
     iteration_duration................: avg=13.2s     min=12.1s    med=13.5s    max=15.2s    p(90)=13.8s    p(95)=14.2s    p(99)=14.8s
     iterations........................: 500          20.833333/s
     vus...............................: 50           min=10      max=50
     vus_max...........................: 50           min=50      max=50
```

## Escalabilidad del servidor

### Información útil después de las pruebas:

- **Máximo de usuarios soportados**: Der del pico máximo sostenido
- **Throughput (solicitudes/seg)**: Derivado de http_reqs
- **P95 Response Time**: Tiempo de respuesta para el 95% de usuarios
- **Error Rate**: % de requests que fallan

## Recomendaciones

### Si observas problemas:

1. **P95 > 500ms**: Optimizar queries de base de datos
2. **Error Rate > 5%**: Revisar logs del backend
3. **200+ usuarios causa crashes**: Aumentar recursos o optimizar código

### Próximos pasos:

1. Ejecutar pruebas regularmente (e.g., después de cambios)
2. Monitorear tendencias de rendimiento
3. Establecer SLA (Service Level Agreement) para el API

## Scripts Personalizados

Puedes crear tus propios scripts k6 basándote en los ejemplos. Documentación: https://k6.io/docs/

## Troubleshooting

### Error: "Cannot connect to localhost:8080"
- Verificar que el backend está ejecutándose
- Comprobar que está en puerto 8080

### Error: "certificate problem"
- Ignorar con: `k6 run --insecure-skip-tls-verify k6-read-test.js`

### InfluxDB no recibe datos
- Verificar: `curl http://localhost:8086/ping`
- Revisar que XLS está activado en InfluxDB

---

**Fecha de creación**: 2026-02-05

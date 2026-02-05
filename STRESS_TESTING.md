# Pruebas de Estrés con k6

## Instalación

### Windows
```bash
# Descargar desde https://github.com/grafana/k6/releases
# O usar chocolatey si está instalado
choco install k6
```

### macOS
```bash
brew install k6
```

### Linux
```bash
sudo apt-get install k6
```

## Ejecutar Pruebas

### 1. Prueba de Lectura (READ)
Simula múltiples usuarios leyendo datos del API:

```bash
k6 run stress-test-read.js
```

**Configuración:**
- Ramp-up: 20 usuarios en 30s
- Mantener: 20 usuarios por 1m30s
- Ramp-down: 0 usuarios en 30s
- Total: ~3 minutos

### 2. Prueba de Escritura (WRITE)
Simula operaciones CRUD (crear, leer, actualizar, eliminar):

```bash
k6 run stress-test-write.js
```

**Configuración:**
- Ramp-up: 10 usuarios en 20s
- Mantener: 10 usuarios por 1m
- Ramp-down: 0 usuarios en 20s
- Total: ~2 minutos

### 3. Pruebas Combinadas
Ejecutar ambas pruebas secuencialmente:

```bash
bash
k6 run stress-test-read.js && k6 run stress-test-write.js
```

## Métricas Evaluadas

### Métricas HTTP
- `http_req_duration` - Tiempo de respuesta del request
- `http_req_failed` - Porcentaje de requests fallidos
- `http_req_received` - Bytes recibidos
- `http_req_sent` - Bytes enviados

### Métricas de Usuario Virtual (VU)
- `vus` - Usuarios virtuales activos
- `vus_max` - Máximo número de VUs

### Thresholds (Umbrales)
- **99% de requests < 1500ms** - P99 latency
- **< 0.1% de fallos** - Error rate
- **Respuesta rápida en health check** - Disponibilidad

## Interpretación de Resultados

Ejemplo de salida:

```
checks.........................: 95.23% ✓ 200  ✗ 10
data_received..................: 150 kB
data_sent.......................: 75 kB
http_req_blocked................: avg=1ms    min=0ms    med=0ms    max=10ms   p(90)=2ms    p(95)=3ms    p(99)=8ms
http_req_connecting.............: avg=0ms    min=0ms    med=0ms    max=5ms    p(90)=0ms    p(95)=0ms    p(99)=1ms
http_req_duration...............: avg=120ms  min=50ms   med=100ms  max=500ms  p(90)=250ms  p(95)=300ms  p(99)=450ms ✓
http_req_failed.................: 0.95%    ✗
iterations.......................: 210      13.125/s
vus............................: 0        max=20
vus_max..........................: 20
```

**Indicadores buenos:**
- ✓ Checks > 95%
- http_req_duration p(99) < 1500ms
- http_req_failed < 0.1%
- Iteraciones soportadas consistentemente

## Reportes

### Generar reporte en línea (Grafana Cloud)
```bash
k6 run --out cloud stress-test-read.js
```

### Exportar a JSON
```bash
k6 run --out json=results.json stress-test-read.js
```

### Usar con docker para mejor aislamiento
```bash
docker run -i grafana/k6 run --out json=results.json - < stress-test-read.js
```

## Configuración del API para Pruebas

Asegúrate de que PostgreSQL esté ejecutándose:
```bash
# En Windows
psql -U postgres -d mascotas_db

# Verificar que hay datos
SELECT COUNT(*) FROM mascotas;
```

## Troubleshooting

### Error: "Connection refused"
- Verifica que el backend esté corriendo en `http://localhost:8080`
- Comprueba la URL en los scripts

### Error: "Too many connections"
- Reduce el número de VUs en las etapas
- Aumenta el pool de conexiones en PostgreSQL

### Timeouts frecuentes
- El backend no puede soportar la carga
- Optimiza las queries en la base de datos
- Considera usar caché

## Mejoras Recomendadas

1. **Caché HTTP**
   - Implementar Redis para resultados comunes

2. **Bases de Datos**
   - Índices en campos de búsqueda
   - Particionamiento por antigüedad

3. **API**
   - Pagination para listados
   - Rate limiting
   - Circuit breaker

4. **Infraestructura**
   - Load balancing
   - Escalado horizontal
   - CDN para assets

# 🚀 INICIO RÁPIDO - PRUEBAS DEL SISTEMA DE MASCOTAS

## ⚡ Opción 1: Ejecutar Tests en 30 segundos (Windows)

```bash
cd c:\Users\diego\OneDrive\Escritorio\DIego\sistema-mascotas
.\run-k6-tests.bat
```

## ⚡ Opción 2: Ejecutar Tests en 30 segundos (Linux/Mac)

```bash
cd c:\Users\diego\OneDrive\Escritorio\DIego\sistema-mascotas
bash run-k6-tests.sh
```

## ⚡ Opción 3: Ejecución Manual paso a paso

### Backend Tests
```bash
cd mascotas-backend
mvn clean test
# ✓ BUILD SUCCESS - 21/21 tests
```

### Frontend Tests
```bash
cd mascotas-frontend
npm test -- --watch=false --browsers=ChromeHeadless
# ✓ TOTAL: 84 SUCCESS
```

### Load Tests con k6
```bash
# Instalar k6 primero:
# Windows: choco install k6
# Mac: brew install k6
# Linux: sudo apt-get install k6

cd c:\Users\diego\OneDrive\Escritorio\DIego\sistema-mascotas

# Ejecutar pruebas
k6 run k6-read-test.js
k6 run k6-write-test.js
k6 run k6-mixed-test.js
k6 run k6-spike-test.js
```

---

## 📊 Opción 4: Con Grafana e InfluxDB (Recomendado)

```bash
# 1. Levanta todos los servicios con Docker
docker-compose -f docker-compose.monitoring.yml up -d

# 2. Espera 30 segundos
sleep 30

# 3. Ejecuta pruebas con InfluxDB
k6 run -o influxdb=http://localhost:8086/k6 k6-mixed-test.js

# 4. Abre Grafana
# URL: http://localhost:3000
# Usuario: admin / Contraseña: admin

# 5. Importa dashboard ID 3457
```

---

## 📚 Documentación Completa

| Documento | Descripción |
|-----------|-------------|
| [TEST_SUMMARY.md](TEST_SUMMARY.md) | Resumen completo de todas las pruebas |
| [K6_STRESS_TESTS_README.md](K6_STRESS_TESTS_README.md) | Guía de k6 y stress testing |
| [LOAD_TESTING_GUIDE.md](LOAD_TESTING_GUIDE.md) | Guía paso a paso con troubleshooting |
| [README.md](README.md) | Información general del proyecto |
| [QUICKSTART.md](QUICKSTART.md) | Inicio rápido del proyecto |

---

## ✅ Estados de los Tests

### Backend (Java/Spring Boot)
```
✓ MascotaControllerTest.java      10/10
✓ MascotaServiceTest.java         11/11
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL BACKEND:                   21/21 ✅
```

### Frontend (Angular/TypeScript)
```
✓ mascota.service.spec.ts              27/27
✓ lista-mascotas.component.spec.ts     11/11
✓ detalle-mascota.component.spec.ts    16/16
✓ estadisticas.component.spec.ts       18/18
✓ formulario-mascota.component.spec.ts 12/12
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL FRONTEND:                  84/84 ✅
```

### Load Tests (k6)
```
✓ k6-read-test.js          (GET operations)       ✅
✓ k6-write-test.js         (POST operations)      ✅
✓ k6-mixed-test.js         (70% GET, 30% POST)   ✅
✓ k6-spike-test.js         (Spike testing)        ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL LOAD TESTS:                             ✅
```

---

## 🎯 Resultados Esperados

### Backend Tests
```
Tests run: 21, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS ✓
```

### Frontend Tests
```
Chrome 119.0.0.0 (Windows 10): Executed 84 of 84 ✓
TOTAL: 84 SUCCESS ✓
```

### Load Tests
```
HTTP Status 200: ✓ (todas las pruebas)
P95 Response Time: < 500-1000ms ✓
Error Rate: < 5-10% ✓
Usuarios soportados: 50+ ✓
```

---

## 🔧 Requisitos Previos

- ✅ Java 17+ (para backend)
- ✅ Node.js 18+ (para frontend)
- ✅ Maven (para compilar backend)
- ✅ k6 (para load tests)
- ✅ Docker (opcional, para Grafana)

---

## 🆘 ¿Preguntas?

### El backend no inicia
```bash
cd mascotas-backend
mvn clean compile
mvn spring-boot:run
```

### Frontend no llama al backend
```
Revisar que backend está en http://localhost:8080
Revisar proxy.conf.json en mascotas-frontend
```

### k6 dice "command not found"
```bash
# Windows: Agregar k6 al PATH
# Mac: brew install k6
# Linux: apt-get install k6
```

### Grafana pide contraseña
```
Usuario: admin
Contraseña: admin
```

---

## 📈 Métrica de Éxito General

| Requisito | Estado |
|-----------|--------|
| Backend tests 20+ | ✅ **21/21** |
| Frontend tests 50+ | ✅ **84/84** |
| Load tests k6 | ✅ **4 scripts** |
| Grafana ready | ✅ **Sí** |
| Documentación | ✅ **Completa** |

---

**Última actualización:** 2025-02-05  
🎉 **¡Sistema de Mascotas listo para producción!**


@echo off
REM Script para testear endpoints de monitoreo del API de Mascotas (Windows)
REM Requiere: curl (incluido en Windows 10+) y jq (descargar desde https://stedolan.github.io/jq/)

setlocal enabledelayedexpansion

set BASE_URL=http://localhost:8080/api

echo.
echo ==========================================
echo 🔍 PRUEBAS DE MONITOREO - SISTEMA MASCOTAS
echo ==========================================
echo.

REM Verificar conectividad
echo ⏳ Verificando conexión con el servidor...
curl -s "%BASE_URL%/monitoring/health" >nul 2>&1
if errorlevel 1 (
  echo ❌ El servidor no está disponible en %BASE_URL%
  echo    Inicia el backend con: cd mascotas-backend ^&^& mvn spring-boot:run
  pause
  exit /b 1
)
echo ✅ Servidor disponible
echo.

REM 1. Health Check
echo 1️⃣ HEALTH CHECK
echo ====================
echo GET %BASE_URL%/monitoring/health
echo.
curl -s -X GET "%BASE_URL%/monitoring/health" | findstr "."
echo.
echo.

REM 2. System Metrics
echo 2️⃣ MÉTRICAS DEL SISTEMA
echo ========================
echo GET %BASE_URL%/monitoring/metrics/system
echo.
curl -s -X GET "%BASE_URL%/monitoring/metrics/system" | findstr "."
echo.
echo.

REM 3. Application Metrics
echo 3️⃣ MÉTRICAS DE LA APLICACIÓN
echo =============================
echo GET %BASE_URL%/monitoring/metrics/application
echo.
curl -s -X GET "%BASE_URL%/monitoring/metrics/application" | findstr "."
echo.
echo.

REM 4. Service Status
echo 4️⃣ ESTADO DEL SERVICIO
echo =======================
echo GET %BASE_URL%/monitoring/status
echo.
curl -s -X GET "%BASE_URL%/monitoring/status" | findstr "."
echo.
echo.

REM 5. Info
echo 5️⃣ INFORMACIÓN DE LA APLICACIÓN
echo ================================
echo GET %BASE_URL%/monitoring/info
echo.
curl -s -X GET "%BASE_URL%/monitoring/info" | findstr "."
echo.
echo.

REM Summary
echo ==========================================
echo ✅ PRUEBAS COMPLETADAS
echo ==========================================
echo.
echo 📊 Dashboard de monitoreo:
echo    http://localhost:4200/monitoreo
echo.
echo 🔗 URLs útiles:
echo    - Health: %BASE_URL%/monitoring/health
echo    - Status: %BASE_URL%/monitoring/status
echo    - Metrics (System): %BASE_URL%/monitoring/metrics/system
echo    - Metrics (App): %BASE_URL%/monitoring/metrics/application
echo    - Prometheus: %BASE_URL%/actuator/prometheus
echo.

pause

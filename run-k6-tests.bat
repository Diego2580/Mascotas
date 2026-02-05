@echo off
REM Script para ejecutar todas las pruebas de carga con k6
REM Requisitos: k6 instalado y accesible desde PATH

setlocal enabledelayedexpansion

echo.
echo ============================================
echo    K6 Load Tests - Sistema de Mascotas
echo ============================================
echo.

REM Verificar que k6 esté instalado
where k6 >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: k6 no está instalado o no está en PATH
    echo Descargar desde: https://k6.io/docs/getting-started/installation/
    pause
    exit /b 1
)

REM Verificar que el backend está ejecutándose
echo Verificando conexión con el backend en localhost:8080...
timeout /t 2 /nobreak

REM Opciones del menú
:menu
echo.
echo Selecciona la prueba a ejecutar:
echo 1) Prueba de Lectura (Read Test)
echo 2) Prueba de Escritura (Write Test)
echo 3) Prueba Mixta (Mixed Test - 70%% GET, 30%% POST)
echo 4) Spike Test (Prueba de Picos)
echo 5) EJECUTAR TODAS LAS PRUEBAS
echo 6) Ejecutar con InfluxDB (si está disponible)
echo 0) Salir
echo.

set /p choice="Ingresa tu opción (0-6): "

if "%choice%"=="1" (
    echo.
    echo Ejecutando Prueba de Lectura...
    k6 run k6-read-test.js
    goto menu
) else if "%choice%"=="2" (
    echo.
    echo Ejecutando Prueba de Escritura...
    k6 run k6-write-test.js
    goto menu
) else if "%choice%"=="3" (
    echo.
    echo Ejecutando Prueba Mixta...
    k6 run k6-mixed-test.js
    goto menu
) else if "%choice%"=="4" (
    echo.
    echo Ejecutando Spike Test...
    k6 run k6-spike-test.js
    goto menu
) else if "%choice%"=="5" (
    echo.
    echo Ejecutando TODAS las pruebas...
    echo.
    echo [1/4] Iniciando Prueba de Lectura...
    k6 run k6-read-test.js
    
    echo.
    echo [2/4] Iniciando Prueba de Escritura...
    k6 run k6-write-test.js
    
    echo.
    echo [3/4] Iniciando Prueba Mixta...
    k6 run k6-mixed-test.js
    
    echo.
    echo [4/4] Iniciando Spike Test...
    k6 run k6-spike-test.js
    
    echo.
    echo TODAS las pruebas completadas!
    pause
    goto menu
) else if "%choice%"=="6" (
    echo.
    echo Ejecutando pruebas con InfluxDB...
    echo.
    set /p influx_url="Ingresa URL de InfluxDB (default: http://localhost:8086/k6): "
    if "!influx_url!"=="" set influx_url=http://localhost:8086/k6
    
    echo.
    echo [1/3] Prueba de Lectura con InfluxDB...
    k6 run -o influxdb=!influx_url! k6-read-test.js
    
    echo.
    echo [2/3] Prueba Mixta con InfluxDB...
    k6 run -o influxdb=!influx_url! k6-mixed-test.js
    
    echo.
    echo [3/3] Spike Test con InfluxDB...
    k6 run -o influxdb=!influx_url! k6-spike-test.js
    
    echo.
    echo Pruebas completadas. Revisa Grafana en http://localhost:3000
    pause
    goto menu
) else if "%choice%"=="0" (
    echo.
    echo Saliendo...
    exit /b 0
) else (
    echo Opción no válida. Intenta de nuevo.
    goto menu
)

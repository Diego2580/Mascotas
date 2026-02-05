#!/bin/bash

# Script para testear endpoints de monitoreo del API de Mascotas
# Uso: bash monitoring-test.sh

BASE_URL="http://localhost:8080/api"

echo "=========================================="
echo "🔍 PRUEBAS DE MONITOREO - SISTEMA MASCOTAS"
echo "=========================================="
echo ""

# Verificar conectividad
echo "⏳ Verificando conexión con el servidor..."
if ! curl -s "$BASE_URL/monitoring/health" > /dev/null; then
  echo "❌ El servidor no está disponible en $BASE_URL"
  echo "   Inicia el backend con: cd mascotas-backend && mvn spring-boot:run"
  exit 1
fi
echo "✅ Servidor disponible"
echo ""

# 1. Health Check
echo "1️⃣ HEALTH CHECK"
echo "===================="
echo "GET $BASE_URL/monitoring/health"
echo ""
curl -s -X GET "$BASE_URL/monitoring/health" | jq .
echo ""
echo ""

# 2. System Metrics
echo "2️⃣ MÉTRICAS DEL SISTEMA"
echo "========================"
echo "GET $BASE_URL/monitoring/metrics/system"
echo ""
curl -s -X GET "$BASE_URL/monitoring/metrics/system" | jq .
echo ""
echo ""

# 3. Application Metrics
echo "3️⃣ MÉTRICAS DE LA APLICACIÓN"
echo "============================="
echo "GET $BASE_URL/monitoring/metrics/application"
echo ""
curl -s -X GET "$BASE_URL/monitoring/metrics/application" | jq .
echo ""
echo ""

# 4. Service Status
echo "4️⃣ ESTADO DEL SERVICIO"
echo "======================="
echo "GET $BASE_URL/monitoring/status"
echo ""
curl -s -X GET "$BASE_URL/monitoring/status" | jq .
echo ""
echo ""

# 5. Info
echo "5️⃣ INFORMACIÓN DE LA APLICACIÓN"
echo "================================"
echo "GET $BASE_URL/monitoring/info"
echo ""
curl -s -X GET "$BASE_URL/monitoring/info" | jq .
echo ""
echo ""

# 6. Actuator Health
echo "6️⃣ ACTUATOR HEALTH (Detallado)"
echo "==============================="
echo "GET $BASE_URL/actuator/health"
echo ""
curl -s -X GET "$BASE_URL/actuator/health" | jq .
echo ""
echo ""

# 7. Prometheus Metrics (primeras 10 líneas)
echo "7️⃣ PROMETHEUS METRICS (Primeras 20 líneas)"
echo "=========================================="
echo "GET $BASE_URL/actuator/prometheus"
echo ""
curl -s -X GET "$BASE_URL/actuator/prometheus" | head -20
echo ""
echo "... (hay más)"
echo ""

# Summary
echo "=========================================="
echo "✅ PRUEBAS COMPLETADAS"
echo "=========================================="
echo ""
echo "📊 Dashboard de monitoreo:"
echo "   http://localhost:4200/monitoreo"
echo ""
echo "🔗 URLs útiles:"
echo "   - Health: $BASE_URL/monitoring/health"
echo "   - Status: $BASE_URL/monitoring/status"
echo "   - Metrics (System): $BASE_URL/monitoring/metrics/system"
echo "   - Metrics (App): $BASE_URL/monitoring/metrics/application"
echo "   - Prometheus: $BASE_URL/actuator/prometheus"
echo ""

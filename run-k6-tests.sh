#!/bin/bash

# Script para ejecutar todas las pruebas de carga con k6
# Compatible con Linux y macOS
# Requisitos: k6 instalado

set -e

echo ""
echo "============================================"
echo "    K6 Load Tests - Sistema de Mascotas"
echo "============================================"
echo ""

# Verificar que k6 esté instalado
if ! command -v k6 &> /dev/null; then
    echo "ERROR: k6 no está instalado"
    echo "Instala desde: https://k6.io/docs/getting-started/installation/"
    exit 1
fi

# Colores para terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_header() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}$1${NC}"
}

print_error() {
    echo -e "${RED}$1${NC}"
}

# Menú
show_menu() {
    echo ""
    echo "Selecciona la prueba a ejecutar:"
    echo "1) Prueba de Lectura (Read Test)"
    echo "2) Prueba de Escritura (Write Test)"
    echo "3) Prueba Mixta (Mixed Test - 70% GET, 30% POST)"
    echo "4) Spike Test (Prueba de Picos)"
    echo "5) EJECUTAR TODAS LAS PRUEBAS"
    echo "6) Ejecutar con InfluxDB (si está disponible)"
    echo "0) Salir"
    echo ""
    read -p "Ingresa tu opción (0-6): " choice
}

# Verificar conexión con el backend
check_backend() {
    print_header "Verificando conexión con backend en localhost:8080..."
    if timeout 5 curl -s http://localhost:8080/mascotas > /dev/null; then
        print_success "✓ Backend está disponible"
    else
        print_error "✗ Backend no está disponible en localhost:8080"
        read -p "¿Continuar de todas formas? (s/n): " continue_anyway
        if [[ "$continue_anyway" != "s" ]]; then
            exit 1
        fi
    fi
}

# Ejecutar una prueba
run_test() {
    local test_name=$1
    local test_file=$2
    local output_file="${test_file%.js}-results.json"
    
    print_header "Ejecutando $test_name..."
    k6 run "$test_file" --out json="$output_file"
    print_success "✓ $test_name completada. Resultados guardados en $output_file"
}

# Ejecutar una prueba con InfluxDB
run_test_influxdb() {
    local test_name=$1
    local test_file=$2
    local influx_url=$3
    
    print_header "Ejecutando $test_name con InfluxDB..."
    k6 run -o "influxdb=$influx_url" "$test_file"
    print_success "✓ $test_name completada con InfluxDB"
}

# Menú principal
check_backend

while true; do
    show_menu
    
    case $choice in
        1)
            run_test "Prueba de Lectura" "k6-read-test.js"
            ;;
        2)
            run_test "Prueba de Escritura" "k6-write-test.js"
            ;;
        3)
            run_test "Prueba Mixta" "k6-mixed-test.js"
            ;;
        4)
            run_test "Spike Test" "k6-spike-test.js"
            ;;
        5)
            print_header "Ejecutando TODAS las pruebas..."
            run_test "Prueba de Lectura" "k6-read-test.js"
            echo ""
            run_test "Prueba de Escritura" "k6-write-test.js"
            echo ""
            run_test "Prueba Mixta" "k6-mixed-test.js"
            echo ""
            run_test "Spike Test" "k6-spike-test.js"
            echo ""
            print_success "✓ TODAS las pruebas completadas!"
            ;;
        6)
            read -p "Ingresa URL de InfluxDB (default: http://localhost:8086/k6): " influx_url
            influx_url="${influx_url:-http://localhost:8086/k6}"
            
            print_header "Verificando conexión con InfluxDB..."
            if timeout 5 curl -s "$influx_url" > /dev/null; then
                print_success "✓ InfluxDB disponible"
                echo ""
                run_test_influxdb "Prueba de Lectura" "k6-read-test.js" "$influx_url"
                echo ""
                run_test_influxdb "Prueba Mixta" "k6-mixed-test.js" "$influx_url"
                echo ""
                run_test_influxdb "Spike Test" "k6-spike-test.js" "$influx_url"
                echo ""
                print_success "✓ Pruebas completadas. Revisa Grafana en http://localhost:3000"
            else
                print_error "✗ No se puede conectar a InfluxDB en $influx_url"
            fi
            ;;
        0)
            print_success "Saliendo..."
            exit 0
            ;;
        *)
            print_error "Opción no válida. Intenta de nuevo."
            ;;
    esac
done

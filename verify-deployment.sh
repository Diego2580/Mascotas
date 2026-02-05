#!/bin/bash
# Script para verificar que todo está listo para el despliegue

echo "=========================================="
echo "Verificación Pre-Despliegue"
echo "=========================================="

# Verificar Backend
echo ""
echo "✓ Verificando Backend..."
if [ -f "mascotas-backend/target/mascotas-1.0.0.jar" ]; then
    echo "  ✅ JAR generado correctamente"
    SIZE=$(du -h mascotas-backend/target/mascotas-1.0.0.jar | cut -f1)
    echo "  📦 Tamaño: $SIZE"
else
    echo "  ❌ JAR no encontrado. Ejecuta: cd mascotas-backend && mvn clean package -DskipTests"
fi

# Verificar Frontend
echo ""
echo "✓ Verificando Frontend..."
if [ -f "mascotas-frontend/angular.json" ]; then
    echo "  ✅ Proyecto Angular encontrado"
    if [ -d "mascotas-frontend/dist" ]; then
        echo "  ✅ Build generado"
    else
        echo "  ⚠️  Build no encontrado. Ejecuta: cd mascotas-frontend && npm run build"
    fi
else
    echo "  ❌ Proyecto Angular no encontrado"
fi

# Verificar configuraciones
echo ""
echo "✓ Verificando archivos de configuración..."
if [ -f "mascotas-backend/Procfile" ]; then
    echo "  ✅ Procfile encontrado"
else
    echo "  ⚠️  Procfile no encontrado"
fi

if [ -f "mascotas-backend/src/main/resources/application-prod.yml" ]; then
    echo "  ✅ Configuración de producción encontrada"
else
    echo "  ⚠️  application-prod.yml no encontrado"
fi

# Resumen
echo ""
echo "=========================================="
echo "Resumen para Despliegue"
echo "=========================================="
echo ""
echo "BACKEND (Render):"
echo "  - Command: mvn clean package -DskipTests"
echo "  - Start: java -Dserver.port=\${PORT} -Dspring.profiles.active=prod -jar target/mascotas-1.0.0.jar"
echo "  - Env vars: DATABASE_URL, DATABASE_USER, DATABASE_PASSWORD"
echo ""
echo "FRONTEND (Vercel):"
echo "  - Build: cd mascotas-frontend && npm run build"
echo "  - Output: mascotas-frontend/dist/mascotas-frontend"
echo "  - Env vars: VITE_API_URL"
echo ""
echo "=========================================="

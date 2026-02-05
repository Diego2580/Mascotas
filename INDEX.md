% En la carpeta `c:\Users\diego\OneDrive\Escritorio\DIego\sistema-mascotas` encontrarás:

## 📑 ÍNDICE DE DOCUMENTACIÓN

### Inicio Rápido
- **QUICKSTART.md** - Guía en 5 minutos para empezar
- **README.md** - Documentación completa del proyecto

### Referencia Técnica
- **FEATURES.md** - Lista detallada de todas las características
- **PROJECT_STRUCTURE.md** - Estructura árbol de carpetas
- **CHECKLIST_ENTREGA.md** - Checklist de completitud

### Pruebas y Despliegue
- **STRESS_TESTING.md** - Documentación completa de pruebas k6
- **docker-compose.yml** - Orquestación Docker
- **.env.example** - Variables de entorno

### Código Fuente
- **mascotas-backend/** - Spring Boot API REST
- **mascotas-frontend/** - Angular 17 Frontend
- **stress-test-read.js** - Pruebas de lectura (k6)
- **stress-test-write.js** - Pruebas de escritura (k6)

### Base de Datos
- **mascotas-backend/src/main/resources/init.sql**

---

## 🚀 EMPEZAR EN 3 PASOS

### 1. Instalar
```bash
cd mascotas-backend && mvn install
cd ../mascotas-frontend && npm install
```

### 2. Ejecutar
```bash
# Backend
cd mascotas-backend && mvn spring-boot:run

# Frontend (nueva terminal)
cd mascotas-frontend && npm start
```

### 3. Acceder
- Frontend: http://localhost:4200
- API: http://localhost:8080/api

---

## 📊 ESTADÍSTICAS

- **Backend**: 12 archivos Java + tests
- **Frontend**: 15+ archivos TypeScript + tests
- **Tests**: 36+ casos totales
- **Documentación**: 8 guías principales
- **Código**: 3000+ líneas
- **Requisitos**: 100% completado

---

**Ver archivos .md específicos para más información.**

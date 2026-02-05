# Quick Start Guide - Sistema de Gestión de Mascotas

## ⚡ Inicio Rápido (5 minutos)

### Prerrequisitos Instalados
- Java 17+
- Node.js 18+
- PostgreSQL 12+
- Maven
- Angular CLI

### Paso 1: Preparar Base de Datos (1 min)

```bash
# Abrir terminal de PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE mascotas_db;

# Salir
\q
```

### Paso 2: Ejecutar Backend (2 min)

```bash
cd mascotas-backend

# Compilar y ejecutar
mvn clean spring-boot:run
```

✅ Backend listo en: `http://localhost:8080/api`

### Paso 3: Ejecutar Frontend (2 min)

```bash
cd mascotas-frontend

# Instalar dependencias
npm install

# Iniciar servidor
npm start
```

✅ Frontend listo en: `http://localhost:4200`

---

## 🧪 Ejecutar Pruebas

### Backend

```bash
cd mascotas-backend
mvn test
```

### Frontend

```bash
cd mascotas-frontend
npm test
```

---

## 📊 Pruebas de Estrés

```bash
# Instalar k6 (si no lo tienes)
choco install k6  # Windows
brew install k6   # macOS
apt-get install k6 # Linux

# Ejecutar pruebas
k6 run stress-test-read.js
k6 run stress-test-write.js
```

---

## 🌐 URLs Principales

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:8080/api |
| Health Check | http://localhost:8080/api/mascotas/health |
| Actuator | http://localhost:8080/actuator |
| Métricas | http://localhost:8080/actuator/metrics |

---

## 📐 Estructura de Carpetas

```
sistema-mascotas/
├── mascotas-backend/
│   ├── src/main/         # Código fuente
│   ├── src/test/         # Tests unitarios
│   └── pom.xml           # Dependencias Maven
├── mascotas-frontend/
│   ├── src/app/          # Componentes Angular
│   ├── src/test/         # Tests unitarios
│   └── package.json      # Dependencias NPM
├── stress-test-*.js      # Pruebas k6
└── README.md            # Este archivo
```

---

## 🔧 Solución de Problemas

### Error: "Connection refused"
```
→ Verificar que PostgreSQL esté corriendo
→ Verificar puerto 5432 disponible
```

### Error: "Port 8080 already in use"
```
→ Cambiar puerto en application.yml
→ O matar proceso: taskkill /PID <pid> /F
```

### Error: "npm not found"
```
→ Instalar Node.js desde https://nodejs.org
→ Reiniciar terminal después de instalar
```

---

## 📝 Ejemplos de API

### Crear Mascota
```bash
curl -X POST http://localhost:8080/api/mascotas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Firulais",
    "especie": "Perro",
    "edad": 3,
    "dueño": "Carlos"
  }'
```

### Obtener Mascotas
```bash
curl http://localhost:8080/api/mascotas
curl 'http://localhost:8080/api/mascotas?especie=Gato'
curl 'http://localhost:8080/api/mascotas?nombre=Mi'
```

### Estadísticas
```bash
curl http://localhost:8080/api/mascotas/estadisticas/promedio-edad
curl 'http://localhost:8080/api/mascotas/estadisticas/promedio-edad-especie?especie=Perro'
```

---

## ✅ Checklist de Desarrollo

- [ ] Backend compilando sin errores
- [ ] Frontend ejecutándose en localhost:4200
- [ ] Tests unitarios pasando (80%+ coverage)
- [ ] Base de datos con datos de ejemplo
- [ ] Pruebas de estrés configuradas
- [ ] Documentación completa
- [ ] Despliegue configurado

---

## 📚 Documentación Adicional

- [Backend Documentation](mascotas-backend/README.md)
- [Frontend Documentation](mascotas-frontend/README.md)
- [Stress Testing Guide](STRESS_TESTING.md)

---

**¡Todo listo para empezar!** 🚀

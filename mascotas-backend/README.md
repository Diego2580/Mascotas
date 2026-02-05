# Mascotas API - Backend

Aplicación backend para el Sistema de Gestión de Mascotas construida con Spring Boot.

## Tecnologías

- Spring Boot 3.3.0
- Java 17
- PostgreSQL
- JPA/Hibernate
- Maven
- JUnit 5 + Mockito

## Estructura del Proyecto

```
mascotas-backend/
├── src/
│   ├── main/
│   │   ├── java/com/salamea/mascotas/
│   │   │   ├── controller/     # Controladores REST
│   │   │   ├── entity/         # Entidades JPA
│   │   │   ├── repository/     # Repositorios Spring Data
│   │   │   ├── service/        # Lógica de negocios
│   │   │   ├── dto/            # Objetos de transferencia de datos
│   │   │   ├── exception/      # Manejo de excepciones
│   │   │   └── MascotasApplication.java
│   │   └── resources/
│   │       ├── application.yml # Configuración
│   │       └── init.sql        # Script de base de datos
│   └── test/
│       └── java/com/salamea/mascotas/
│           ├── MascotaServiceTest.java
│           └── MascotaControllerTest.java
└── pom.xml
```

## Instalación

### Prerequisitos

- Java 17+
- Maven 3.6+
- PostgreSQL 12+

### Pasos

1. **Clonar el repositorio**
```bash
cd mascotas-backend
```

2. **Crear la base de datos PostgreSQL**
```bash
psql -U postgres
CREATE DATABASE mascotas_db;
\c mascotas_db
\i src/main/resources/init.sql
```

3. **Configurar credenciales en `application.yml`**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mascotas_db
    username: tu_usuario
    password: tu_contraseña
```

4. **Compilar el proyecto**
```bash
mvn clean package
```

5. **Ejecutar la aplicación**
```bash
mvn spring-boot:run
```

La aplicación estará disponible en: `http://localhost:8080/api`

## Endpoints API

### CRUD Mascota

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/mascotas` | Listar todas las mascotas |
| GET | `/mascotas/{id}` | Obtener mascota por ID |
| POST | `/mascotas` | Crear nueva mascota |
| PUT | `/mascotas/{id}` | Actualizar mascota |
| DELETE | `/mascotas/{id}` | Eliminar mascota |

### Búsqueda y Filtros

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/mascotas?especie=Perro` | Filtrar mascotas por especie |
| GET | `/mascotas?nombre=Max` | Buscar mascotas por nombre |

### Estadísticas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/mascotas/estadisticas/promedio-edad` | Promedio de edad general |
| GET | `/mascotas/estadisticas/promedio-edad-especie?especie=Perro` | Promedio por especie |
| GET | `/mascotas/estadisticas/contar?especie=Perro` | Contar mascotas por especie |

### Salud y Monitoreo

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/mascotas/health` | Health check |
| GET | `/actuator/health` | Health check Spring Actuator |
| GET | `/actuator/metrics` | Métricas del sistema |

## Ejemplos de Uso

### Crear mascota
```bash
curl -X POST http://localhost:8080/api/mascotas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Max",
    "especie": "Perro",
    "edad": 5,
    "dueño": "Juan"
  }'
```

### Obtener todas las mascotas
```bash
curl http://localhost:8080/api/mascotas
```

### Filtrar por especie
```bash
curl http://localhost:8080/api/mascotas?especie=Perro
```

### Promedio de edad
```bash
curl http://localhost:8080/api/mascotas/estadisticas/promedio-edad
```

## Pruebas

### Ejecutar pruebas unitarias
```bash
mvn test
```

### Ejecutar pruebas con reporte de cobertura
```bash
mvn clean test jacoco:report
```

### Ver resultados
Los reportes estarán en: `target/site/jacoco/index.html`

## Validaciones

La API realiza validaciones en:
- Campos requeridos (nombre, especie, edad, dueño)
- Longitud de campos (2-100 caracteres)
- Rango de edad (0-100)
- Tipos de datos

## Manejo de Errores

Respuestas de error incluyen:
- **404**: Mascota no encontrada
- **400**: Error de validación
- **500**: Error interno del servidor

Formato:
```json
{
  "timestamp": "2024-01-01T12:00:00",
  "status": 404,
  "error": "Recurso no encontrado",
  "message": "Mascota no encontrada con id: 999",
  "path": "/api/mascotas/999"
}
```

## Monitoreo

### Spring Actuator
- Health: `/actuator/health`
- Metrics: `/actuator/metrics`
- Info: `/actuator/info`

## Logs

Los logs se configuran en `application.yml`:
```yaml
logging:
  level:
    com.salamea.mascotas: DEBUG
```

## Despliegue

### Opción 1: JAR
```bash
mvn clean package
java -jar target/mascotas-api-1.0.0.jar
```

### Opción 2: Docker (si está disponible)
Crear un Dockerfile:
```dockerfile
FROM eclipse-temurin:17-jre-alpine
COPY target/mascotas-api-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Opción 3: Render/Railway
1. Crear archivo `Procfile`:
```
web: java -Dserver.port=$PORT -jar target/mascotas-api-1.0.0.jar
```

2. Conectar PostgreSQL remoto
3. Desplegar repositorio Git

## Contacto

Desarrollador: Diego Fabricio Salamea Morales


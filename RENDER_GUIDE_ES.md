# 🚀 Guía PASO A PASO para Render.com

## 1. Preparar el Repositorio Git

Tu proyecto debe estar en GitHub con esta estructura:

```
sistema-mascotas/
├── mascotas-backend/          # Backend Spring Boot
│   ├── pom.xml
│   ├── Procfile              # ← Requerido
│   ├── target/
│   │   └── mascotas-1.0.0.jar
│   └── src/
└── mascotas-frontend/         # Frontend Angular
    ├── package.json
    ├── angular.json
    └── src/
```

✅ Verifica que `Procfile` esté en `mascotas-backend/`

---

## 2. Obtener Credenciales de Base de Datos

Ya tienes la BD desplegada. Necesitas:

```
DATABASE_URL: jdbc:postgresql://[host]:[puerto]/[nombre_db]
DATABASE_USER: [usuario]
DATABASE_PASSWORD: [contraseña]
```

**Dónde obtenerlas:**
- Si usas Render Database: Panel → Databases → Copia la connection string PostgreSQL
- Si usas Railway: Panel → Resources → PostgreSQL → Copy Connection String
- Si usas otra BD: Obtén los datos del proveedor

---

## 3. CREAR SERVICIO BACKEND EN RENDER

### 3.1 - Crear Web Service

1. Ve a [render.com](https://render.com) y loguéate
2. Haz click en **+ New** (arriba a la derecha)
3. Selecciona **Web Service**
4. Selecciona **Build and deploy from a Git repository**
5. Conecta tu repositorio de GitHub con Render

### 3.2 - Configurar el Servicio

Completa estos campos exactamente:

**Name:**
```
mascotas-api
```

**Repository:**
```
your-github-username/sistema-mascotas  (o el nombre de tu repo)
```

**Branch:**
```
main
```

**Runtime:**
```
Image: Docker (selecciona esta opción)
```

**Build Command:**
```bash
cd mascotas-backend && mvn clean package -DskipTests
```

**Start Command:**
```bash
cd mascotas-backend && java -Dserver.port=${PORT} -Dspring.profiles.active=prod -jar target/mascotas-1.0.0.jar
```

**Root Directory:**
```
(dejar vacío)
```

### 3.3 - Configurar Variables de Entorno

Haz click en **Environment** en el menú de la izquierda

Agrega estas variables exactamente:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `jdbc:postgresql://tu-host.com:5432/tu_basedatos` |
| `DATABASE_USER` | `tu_usuario` |
| `DATABASE_PASSWORD` | `tu_contraseña` |
| `SPRING_PROFILES_ACTIVE` | `prod` |

⚠️ **Reemplaza los valores con los de tu base de datos**

### 3.4 - Desplegar

1. Haz click en **Create Web Service**
2. Espera 5-10 minutos mientras Render compila y despliega
3. Verás un mensaje "Service is live!" cuando termine
4. Copia la URL que te da Render (ej: `https://mascotas-api.onrender.com`)

### 3.5 - Verificar que Funciona

En tu navegador, ve a:
```
https://mascotas-api.onrender.com/api/actuator/health
```

Deberías ver un JSON con `"status":"UP"`

---

## 4. CREAR PROYECTO FRONTEND EN VERCEL

### 4.1 - Crear Proyecto

1. Ve a [vercel.com](https://vercel.com) y loguéate
2. Haz click en **Add New...** → **Project**
3. Selecciona **Import Git Repository**
4. Busca y selecciona tu repositorio GitHub

### 4.2 - Configurar el Proyecto

**Project Name:**
```
mascotas-frontend
```

**Framework Preset:**
```
Otros (Other)  # Déjalo en otros, Angular no está en la lista
```

**Root Directory:**
```
mascotas-frontend
```

**Build & Development Settings:**

Haz click en "Edit" si necesitas cambiar:

- **Build Command:** `npm run build`
- **Output Directory:** `dist/mascotas-frontend`
- **Install Command:** `npm ci`

### 4.3 - Variables de Entorno

En **Environment Variables**, agrega:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://mascotas-api.onrender.com/api` |

⚠️ **IMPORTANTE**: Reemplaza `mascotas-api-xxxx` con el nombre real de tu servicio en Render

### 4.4 - Desplegar

1. Haz click en **Deploy**
2. Espera a que se despliegue (2-3 minutos)
3. Verás un mensaje "Deployment successful" 
4. Copia la URL (ej: `https://mascotas-frontend.vercel.app`)

### 4.5 - Verificar que Funciona

1. Ve a tu URL del frontend en el navegador
2. Deberías ver la aplicación cargando
3. Si ves "API Status: NO DISPONIBLE" en la parte superior, verifica que:
   - La variable de entorno `VITE_API_URL` está correcta
   - El backend en Render está funcionando

---

## 5. ACTUALIZAR EL FRONTEND PARA USAR LA API CORRECTA

Si el frontend no conecta con el backend:

### 5.1 - Actualizar la URL en Vercel

1. Ve a tu Dashboard de Vercel
2. Selecciona el proyecto `mascotas-frontend`
3. Ve a **Settings** → **Environment Variables**
4. Actualiza `VITE_API_URL` con la URL correcta de tu backend

### 5.2 - Si usas Environment Variables en Angular

En `mascotas-frontend/src/services/monitoring.service.ts`, verifica:

```typescript
private readonly baseUrl = 'http://localhost:8080/api/monitoring';
// Debería ser:
private readonly baseUrl = '${VITE_API_URL}/monitoring';
```

---

## 6. RESOLVER PROBLEMAS COMUNES

### "Build fails" en Render

**Solución:** Ve a `Logs` en el dashboard de Render para ver el error. Usualmente es:
- Variable de entorno mal configurada
- Archivo `Procfile` no encontrado
- JAR no compilado correctamente

**Intenta:**
```bash
cd mascotas-backend
mvn clean package -DskipTests
```

### "API Status: NO DISPONIBLE" en el frontend

**Solución:** El frontend no puede conectar con el backend. Verifica:

1. La URL en Vercel → Settings → Environment Variables
2. Que el backend está activo en Render (debe estar verde)
3. Que CORS está habilitado (ya lo está en nuestro código)

### "Database connection error" en backend

**Solución:** Las credenciales de BD son incorrectas. Verifica:

1. `DATABASE_URL` correcto (debe incluir `jdbc:postgresql://`)
2. `DATABASE_USER` y `DATABASE_PASSWORD` correctos
3. La BD está online y accesible desde Render

---

## 7. URLS FINALES

Una vez todo funcione:

| Servicio | URL |
|----------|-----|
| 🌐 Frontend | https://mascotas-frontend.vercel.app |
| 🔌 Backend API | https://mascotas-api.onrender.com/api |
| 📊 Monitoreo | https://mascotas-frontend.vercel.app/monitoreo |
| 💚 Health Check | https://mascotas-api.onrender.com/api/actuator/health |
| 📈 Prometheus | https://mascotas-api.onrender.com/api/actuator/prometheus |

---

## 8. PRÓXIMOS PASOS

✅ Ambos servicios están desplegados  
✅ Puedes hacer cambios en GitHub y automáticamente se redespliegan  
✅ Monitorea los logs en los dashboards de Render y Vercel  
✅ Configura alertas si es necesario

---

¡Listo! 🎉 Tu aplicación está en producción.

# Guía de Despliegue en Render + Vercel

## 📋 Índice
1. [Despliegue Backend en Render](#backend-render)
2. [Despliegue Frontend en Vercel](#frontend-vercel)
3. [Configuración de Variables de Entorno](#variables-entorno)

---

## 🚀 Despliegue Backend en Render {#backend-render}

### Paso 1: Preparar el Código

El backend ya está compilado en `mascotas-backend/target/mascotas-1.0.0.jar` y listo para desplegar.

### Paso 2: Crear Servicio en Render

1. Ve a [render.com](https://render.com) y crea una cuenta
2. Haz click en **New +** → **Web Service**
3. Selecciona **Deploy an existing Git repository**
4. Conecta tu repositorio de GitHub

### Paso 3: Configurar el Servicio

En la página de configuración, rellena:

- **Name**: `mascotas-api` (o tu preferencia)
- **Environment**: `Java 17`
- **Build Command**: 
  ```
  cd mascotas-backend && mvn clean package -DskipTests
  ```
- **Start Command**: 
  ```
  java -Dserver.port=${PORT} -Dspring.profiles.active=prod -jar target/mascotas-1.0.0.jar
  ```
- **Root Directory**: `mascotas-backend` (opcional, depende de tu estructura)

### Paso 4: Configurar Variables de Entorno

En **Environment Variables**, agrega:

```
DATABASE_URL=jdbc:postgresql://[host]:[puerto]/[base_datos]
DATABASE_USER=[usuario_db]
DATABASE_PASSWORD=[contraseña_db]
PORT=10000
```

⚠️ **Obtén estos valores de tu instancia PostgreSQL en la nube**

### Paso 5: Desplegar

Haz click en **Create Web Service** y espera a que se compile y despliegue (5-10 minutos)

---

## 🌐 Despliegue Frontend en Vercel {#frontend-vercel}

### Paso 1: Preparar el Código

```bash
cd mascotas-frontend
npm run build
```

El frontend estará listo en la carpeta `dist/` (o similar según tu config)

### Paso 2: Crear Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz click en **New Project**
3. Importa tu repositorio de GitHub
4. Selecciona el framework **Other** (es Angular standalone sin framework predeterminado)

### Paso 3: Configurar el Proyecto

En **Project Settings**:

- **Build & Dev Settings**
  - Framework: Otros (déjalo en blanco o selecciona "Create React App")
  - Build Command: `cd mascotas-frontend && npm run build`
  - Output Directory: `mascotas-frontend/dist/mascotas-frontend`
  - Install Command: `npm ci`

### Paso 4: Variables de Entorno para Frontend

En **Environment Variables**, agrega:

```
VITE_API_URL=https://[tu-backend-render].onrender.com/api
# O si usas Next.js o similar:
NEXT_PUBLIC_API_URL=https://[tu-backend-render].onrender.com/api
```

⚠️ **Reemplaza `[tu-backend-render]` con el dominio real de tu backend en Render**

### Paso 5: Desplegar

Haz click en **Deploy** y espera a que se complete

---

## ⚙️ Variables de Entorno {#variables-entorno}

### Para el Backend (Render)

```env
# Database Configuration
DATABASE_URL=jdbc:postgresql://your-host.com:5432/mascotas_db
DATABASE_USER=postgres
DATABASE_PASSWORD=yourpassword

# Spring Configuration
spring.profiles.active=prod
PORT=10000

# Monitoring (opcional)
management.endpoints.web.exposure.include=health,metrics,info,prometheus
```

### Para el Frontend (Vercel)

```env
# Angular Environment
VITE_API_URL=https://mascotas-api.onrender.com/api
VITE_MONITORING_URL=https://mascotas-api.onrender.com/api/monitoring
```

### Para la Base de Datos

Necesitas proporcionar una URL de conexión PostgreSQL. Puedes usar:
- **Railway.app** (recomendado, gratis)
- **ElephantSQL** (deprecated, pero aún funciona)
- **Render PostgreSQL** (mismo proveedor que el backend)
- **AWS RDS** (de pago)

---

## 🔗 URLs Finales

Una vez completado el despliegue:

- **Backend API**: `https://mascotas-api.onrender.com/api`
- **Frontend**: `https://mascotas-frontend.vercel.app`
- **Monitoring**: `https://mascotas-api.onrender.com/api/monitoreo`  
- **Actuator Health**: `https://mascotas-api.onrender.com/api/actuator/health`

---

## 📝 Notas Importantes

1. **CORS Configuration**: El backend ya tiene CORS habilitado para `localhost:4200` y otros orígenes. Actualiza `WebMvcConfig.java` si necesitas agregar más orígenes.

2. **Base de Datos**: Si la BD expira (como en Render Trial), el backend se desconectará. Considera databases de pago o permanentes.

3. **Primer Deploy**: Render puede tardar 5-10 minutos en el primer despliegue debido a la compilación Maven.

4. **Monitoreo**: Accede al dashboard de monitoreo en `/monitoreo` (requiere que el frontend esté correctamente configurado).

5. **Logs**: 
   - **Render**: Dashboard → Logs
   - **Vercel**: Dashboard → Deployments → Logs

---

## ✅ Checklist Final

- [ ] Backend compila sin errores
- [ ] JAR generado en `target/mascotas-1.0.0.jar`
- [ ] Base de datos desplegada y accesible
- [ ] Variables de entorno correctas en Render
- [ ] Frontend compilado sin errores
- [ ] Variables de entorno correctas en Vercel
- [ ] CORS configurado correctamente
- [ ] URLs de API actualizadas en el frontend
- [ ] Backend desplegado y accesible
- [ ] Frontend desplegado y conecta con el backend
- [ ] Monitoreo funcionando

---

¡Felicidades! 🎉 Tu aplicación está lista para producción.

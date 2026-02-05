# 🎨 DESPLIEGUE DEL FRONTEND EN VERCEL

## 📋 Prerequisitos

```
✅ Backend desplegado en Render
✅ URL del backend: https://mascotas-api.onrender.com/api
✅ Código en GitHub: Diego2580/Mascotas
✅ Tienes cuenta en Vercel (crea gratis en vercel.com)
```

---

## 🔧 PASO 1: Actualizar la URL del API

**Archivo:** `mascotas-frontend/src/app/services/mascota.service.ts`

Busca la línea:
```typescript
private apiUrl = 'http://localhost:8080/api';
```

Cámbiala a:
```typescript
private apiUrl = 'https://mascotas-api.onrender.com/api';
```

**También en cualquier otro servicio** que tenga `http://localhost:8080`, cámbialo igual.

Busca en todo el proyecto:
```bash
cd mascotas-frontend
grep -r "localhost:8080" src/
```

Reemplaza todas las ocurrencias.

---

## 📤 PASO 2: Commit y Push a GitHub

Desde tu carpeta del proyecto:

```bash
cd c:\Users\diego\OneDrive\Escritorio\Mascotas\sistema-mascotas

git add mascotas-frontend/src/app/services/mascota.service.ts
git commit -m "Update API URL to production Render endpoint"
git push origin main
```

Verifica que subió a GitHub:
```bash
git log --oneline | Select-Object -First 3
```

---

## 🌐 PASO 3: Crear cuenta en Vercel

1. Entra a [vercel.com](https://vercel.com)
2. Click en **"Sign Up"**
3. Elige **"Continue with GitHub"**
4. Autoriza a Vercel para acceder a tu GitHub

---

## 🚀 PASO 4: Hacer Deploy

En Vercel (una vez logeado):

1. Click en **"Add New..."**
2. Selecciona **"Project"**
3. Busca y selecciona: **"Diego2580/Mascotas"**
4. Click en **"Import"**

---

## ⚙️ PASO 5: Configurar el Proyecto

Vercel debería auto-detectar que es un proyecto Angular.

**Si pide configuración manual, rellena así:**

### Framework:
```
Angular (detectado automáticamente)
```

### Root Directory:
```
mascotas-frontend
```

### Build Command:
```
npm run build
```

(Vercel debería sugerir esto automáticamente)

### Output Directory:
```
dist/mascotas-frontend
```

---

## 🔐 PASO 6: Environment Variables (Opcional pero Recomendado)

Si quieres tener la URL del API como variable:

1. En Vercel, ve a **"Project Settings"**
2. Click en **"Environment Variables"**
3. Agrega:

```
Name: VITE_API_URL  (o NG_API_URL para Angular)
Value: https://mascotas-api.onrender.com/api
```

**Pero NO es obligatorio** porque ya pusiste la URL en el código.

---

## ✅ PASO 7: Deploy

Click en el botón **"Deploy"** (color azul)

Vercel comenzará a:
1. Clonar el repo
2. Instalar dependencias (`npm install`)
3. Compilar el proyecto (`npm run build`)
4. Desplegar los archivos estáticos

**Espera 3-5 minutos**

Cuando veas ✅ **"Production"** = **¡Listo!**

---

## 🎉 PASO 8: Obtener tu URL

Cuando termina el deploy, Vercel te muestra:

```
✓ Production
  mascotas-frontend-[hash].vercel.app
```

O algo como:
```
mascotas-***.vercel.app
```

**Esa es tu URL del frontend.**

Accede a:
```
https://mascotas-[hash].vercel.app
```

---

## 🧪 PASO 9: Probar que Funciona

1. Abre tu frontend desplegado
2. Intenta crear una mascota
3. Verifica que aparezca en la lista
4. Intenta editar/eliminar
5. Abre developer tools (F12) → Console
   - NO deben haber errores CORS
   - NO deben haber errores de conexión al API

---

## 🔗 URLS FINALES

```
Frontend:  https://mascotas-[hash].vercel.app
Backend:   https://mascotas-api.onrender.com/api
BD:        postgres://host:5432/mascotas_db.txto
```

**Guarda estas URLs para tu documentación de evaluación**

---

## 🛠️ TROUBLESHOOTING

### P: "Build failed" en Vercel

**Solución:**
```bash
# Localmente:
cd mascotas-frontend
npm install
npm run build

# Si hay errores, arréglalo localmente primero
# Luego push a GitHub
```

### P: Error CORS cuando intenta conectar al API

**Solución:**
Verifica que en tu backend (`mascotas-backend/`) la clase de configuración CORS permite Vercel:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(
                "http://localhost:4200",
                "http://localhost:8080",
                "https://mascotas-*.vercel.app",  // ← Agregado
                "*"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

Si cambias esto, haz:
```bash
cd mascotas-backend
mvn clean package -DskipTests
# Render auto-redeploya
```

### P: "Not Found" cuando acceso a una ruta como /estadisticas

**Solución:**
Es un problema de SPA routing. Vercel necesita redirigir a `index.html`

En Vercel:
1. Ve a **"Project Settings"**
2. Click en **"Build & Development Settings"**
3. Busca **"Framework Preset"** → asegúrate que es **"Angular"**
4. Debe haber una regla que diga:
   ```
   Rewrites: routes to index.html for SPA routing
   ```

Si no está, crea un archivo `vercel.json` en tu raíz:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/mascotas-frontend",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Commit y push:
```bash
git add vercel.json
git commit -m "Add Vercel config for SPA routing"
git push origin main
```

Vercel redeploya automáticamente.

---

## 📊 CHECKLIST FINAL

```
☐ Actualicé mascota.service.ts con URL de producción
☐ Hice git commit y push
☐ Verifiqué en GitHub que está el cambio
☐ Creé cuenta en Vercel
☐ Importé el proyecto Diego2580/Mascotas
☐ Vercel auto-detectó Angular y rutas correctas
☐ Hice click en "Deploy"
☐ Esperé 3-5 minutos
☐ Vi ✅ "Production" en verde
☐ Copié mi URL: https://mascotas-[hash].vercel.app
☐ Probé crear/editar/eliminar mascotas
☐ Verifiqué console (F12) sin errores CORS
☐ Probé rutas como /estadisticas
```

---

## 🎯 ESQUEMA FINAL DE TU APLICACIÓN

```
┌─────────────────────────────────────────────────────┐
│         USUARIO EN NAVEGADOR                        │
│                                                     │
│    https://mascotas-[hash].vercel.app              │
│           (Frontend Angular)                        │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ HTTP Requests
                       │ (get, post, put, delete)
                       ▼
┌─────────────────────────────────────────────────────┐
│  https://mascotas-api.onrender.com/api              │
│        (Backend Spring Boot)                        │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ JDBC/Hibernate
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│    dog-d8z3i.eu8routes2dzhxny-a:5432               │
│      (PostgreSQL en Render)                        │
│      Database: mascotas_db.txto                    │
└─────────────────────────────────────────────────────┘
```

---

## ✅ DESPUÉS DEL DEPLOY

Tu proyecto ahora está:

1. ✅ **Backend corriendo** en Render (Spring Boot)
2. ✅ **Frontend corriendo** en Vercel (Angular)
3. ✅ **BD conectada** en Render (PostgreSQL)
4. ✅ **Todo accesible públicamente** sin instalación local

---

## 🎪 PARA TU EVALUACIÓN

**Puedes mostrar:**
1. Abre el frontend: `https://mascotas-[hash].vercel.app`
2. Crea una mascota
3. Edítala
4. Elimínala
5. **Todo conectado a la BD en internet** ✅

**Sin necesidad de levantar nada localmente**

---

## 📞 SOPORTE

Si tienes problemas:

1. Verifica que el backend esté ✅ en Render
2. Verifica que la URL del API en `mascota.service.ts` sea correcta
3. Abre console del navegador (F12) y revisa errores
4. Ve a "Logs" en Vercel para ver servidor logs
5. Ve a "Logs" en Render para ver backend logs

---

**¡Listo para tu evaluación!** 🚀

Manda las 2 URLs cuando termines el deploy:
- Frontend: https://...
- Backend: https://...


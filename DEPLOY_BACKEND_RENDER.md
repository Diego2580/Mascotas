# 🚀 DESPLIEGUE DEL BACKEND EN RENDER

## 📋 Información que necesitas de tu BD en Render

De las capturas veo que tienes:
```
Hostname: dog-d8z3i.eu8routes2dzhxny-a
Puerto: 5432
Database: mascotas_db.txto
Usuario: mascotas_db_txto_user
Contraseña: [La que copiaste]
External Database URL: postgresql://mascotas_db_txto_user:...@dog-d8z3i.eu8routes2dzhxny-a:5432/mascotas_db.txto
```

---

## 🔗 PASO 1: Copiar la Connection String

En Render donde ves tu BD:
1. Click en tu BD "mascotas_db"
2. Busca la sección **"Connections"**
3. **Copia la "External Database URL"** completa
   - Debe verse como: `postgresql://usuario:password@host:5432/database`

**Guarda esto para el Paso 3**

---

## 🌐 PASO 2: Crear Web Service en Render

1. Entra a [render.com](https://render.com)
2. Click en **"+ New"** (arriba a la derecha)
3. Selecciona **"Web Service"**
4. Elige: **"Deploy an existing repository"**
5. Busca tu repositorio: **"Diego2580/Mascotas"**
6. Click en **"Connect"**

---

## ⚙️ PASO 3: Configurar el Deploy

### Rellena estos campos:

**Name:**
```
mascotas-api
```

**Region:**
```
Oregon (US West)  ← Selecciona la misma región que tu BD
```

**Branch:**
```
main
```

**Build Command:**
```
cd mascotas-backend && mvn clean package -DskipTests
```

**Start Command:**
```
cd mascotas-backend && java -Dserver.port=${PORT} -Dspring.profiles.active=prod -jar target/mascotas-1.0.0.jar
```

**Instance Type:**
```
Free (o Starter si quieres mejor performance)
```

---

## 🔐 PASO 4: Agregar Variables de Entorno

Scroll down hasta **"Environment Variables"**

Click en **"Add Environment Variable"** y agrega estas 3:

### Variable 1:
```
Key: DATABASE_URL
Value: [Pega aquí la External Database URL que copiaste]
```

**Ejemplo:**
```
postgresql://mascotas_db_txto_user:EFRnpR4e1cr2dA...@dog-d8z3i.eu8routes2dzhxny-a:5432/mascotas_db.txto
```

### Variable 2:
```
Key: SPRING_DATASOURCE_URL
Value: [Mismo que DATABASE_URL]
```

### Variable 3:
```
Key: SPRING_DATASOURCE_USERNAME
Value: mascotas_db_txto_user
```

### Variable 4:
```
Key: SPRING_DATASOURCE_PASSWORD
Value: [Tu contraseña de BD]
```

---

## 📝 PASO 5: Verificar application-prod.yml

Asegúrate que en `mascotas-backend/src/main/resources/application-prod.yml` está así:

```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  application:
    name: mascotas-api
server:
  port: ${PORT:8080}
```

**Verifica el archivo:**
```bash
cd mascotas-backend
cat src/main/resources/application-prod.yml
```

Si no existe o está vacío, crea/actualiza el contenido de arriba.

---

## 🚀 PASO 6: Deploy

1. En Render, scroll al final
2. Click en **"Create Web Service"** (botón azul)
3. **ESPERA 5-10 minutos** mientras compila y despliega

Verás esto en la consola:
```
Fetching repository...
Building...
Deploying...
```

Cuando esté listo, verá:
```
✓ Deployed successfully
```

---

## ✅ PASO 7: Obtener la URL de tu API

Cuando termine el deploy:
1. Tu API será accesible en: `https://mascotas-api.onrender.com/api`
2. Render te da la URL en la sección **"Environments"**
3. **Copia esa URL** - la necesitarás para el frontend

---

## 🧪 PASO 8: Verificar que funciona

Abre en tu navegador (o PowerShell):

```powershell
# Health check
curl https://mascotas-api.onrender.com/api/monitoring/health

# Listar mascotas
curl https://mascotas-api.onrender.com/api/mascotas
```

**Esperado:**
```json
{
  "status": "UP",
  "timestamp": "2025-02-05T...",
  "service": "Mascotas API"
}
```

---

## 🔴 SI HAY ERRORES

**El deploy tarda mucho:**
- Free tier puede tardar hasta 10-15 minutos la primera vez
- Es normal, especialmente Maven

**Error: "Build failed":**
- Ve a "Logs" en Render
- Busca línea que dice "ERROR"
- Comúnmente es que `mascotas-1.0.0.jar` no se generó
- Solución: Asegúrate que el `mvn package` en tu máquina funciona localmente

**Error: "Connection to database failed":**
- DATABASE_URL está mal copiada
- Verifica que incluya usuario:contraseña@host:puerto/database
- Sin espacios en blanco al inicio/final

**Error: "Port already in use":**
- No debería pasar (Render lo maneja)
- Ignora, Render asigna el puerto automáticamente

---

## 📊 ACTUALIZAR FRONTEND CON LA URL DEL API

Una vez que el backend esté desplegado, necesitas actualizar el frontend.

En `mascotas-frontend/src/app/services/mascota.service.ts`:

**Busca esta línea:**
```typescript
private apiUrl = 'http://localhost:8080/api';
```

**Cámbiala a:**
```typescript
private apiUrl = 'https://mascotas-api.onrender.com/api';
```

Luego:
```bash
cd mascotas-frontend
git add src/app/services/mascota.service.ts
git commit -m "Update API URL to production render"
git push origin main
```

---

## 🎯 CHECKLIST FINAL

```
☐ Tengo la External Database URL copiada
☐ Creé "Web Service" en Render
☐ Configuré Build Command correctamente
☐ Configuré Start Command correctamente
☐ Agregué 4 variables de entorno (DATABASE_URL, SPRING_DATASOURCE_USERNAME, SPRING_DATASOURCE_PASSWORD)
☐ Verifiqué application-prod.yml
☐ Hice click en "Create Web Service"
☐ Esperé 5-10 minutos al deploy
☐ Verifiqué con curl que funciona
☐ Copié la URL del API (https://mascotas-api.onrender.com/api)
```

---

## 🚀 SIGUIENTE PASO: Desplegar Frontend

Una vez que el backend esté corriendo, desplegamos el frontend en **Vercel** o **Netlify** (es más rápido que Render para Angular).

¿Necesitas instrucciones para eso también?

---

**Tiempo total:** ~15 minutos (incluidos los tiempos de espera)

¡Manda foto cuando esté verde (deployed) en Render! ✅


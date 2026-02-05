# Mascotas Frontend - Angular

Frontend diseñado con Angular para el Sistema de Gestión de Mascotas.

## Tecnologías

- Angular 17
- TypeScript
- Bootstrap 5
- RxJS
- Karma/Jasmine (Tests)

## Estructura del Proyecto

```
mascotas-frontend/
├── src/
│   ├── app/
│   │   ├── components/           # Componentes Angular
│   │   │   ├── lista-mascotas/
│   │   │   ├── formulario-mascota/
│   │   │   ├── detalle-mascota/
│   │   │   └── estadisticas/
│   │   ├── services/            # Servicios HTTP
│   │   ├── models/              # Interfaces TypeScript
│   │   ├── app.routes.ts        # Rutas de la aplicación
│   │   ├── app.config.ts        # Configuración de la app
│   │   └── app.component.ts     # Componente raíz
│   ├── assets/                  # Recursos estáticos
│   ├── index.html               # HTML principal
│   ├── main.ts                  # Punto de entrada
│   ├── test.ts                  # Configuración de tests
│   └── styles.css               # Estilos globales
├── angular.json                 # Configuración Angular CLI
├── tsconfig.json                # Configuración TypeScript
├── karma.conf.js                # Configuración tests
└── package.json
```

## Instalación

### Prerequisitos

- Node.js 18+
- Angular CLI 17+

### Pasos

1. **Navegar al directorio del frontend**
```bash
cd mascotas-frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar servidor de desarrollo**
```bash
npm start
```

La aplicación estará disponible en: `http://localhost:4200`

4. **Compilar para producción**
```bash
npm run build:prod
```

## Funcionalidades

### 1. Lista de Mascotas
- Visualizar todas las mascotas en una table
- Filtrar por especie
- Buscar por nombre
- Acciones: Ver, Editar, Eliminar

### 2. Formulario CRUD
- Crear nueva mascota
- Editar mascota existente
- Validaciones en tiempo real
- Campos requeridos con indicadores visuales

### 3. Vista de Detalle
- Visualizar información completa de la mascota
- Botón para editar
- Volver a la lista

### 4. Estadísticas
- Promedio de edad general
- Promedio de edad por especie
- Conteo de mascotas por especie

## Componentes

### ListaMascotasComponent
- Tabla de mascotas con datos del API
- Filtros por especie y búsqueda por nombre
- Paginación (opcional)

### FormularioMascotaComponent
- Formulario reactivo con validaciones
- Crear y editar mascotas
- Mensajes de éxito/error

### DetalleMascotaComponent
- Vista detallada de una mascota
- Información completa
- Acciones rápidas

### EstadisticasComponent
- Dashboard con estadísticas
- Visualización de promedios
- Cards por especie

## Servicios

### MascotaService
- `listarMascotas()` - Obtener todas las mascotas
- `obtenerMascota(id)` - Obtener por ID
- `crearMascota(mascota)` - Crear nueva
- `actualizarMascota(id, mascota)` - Actualizar
- `eliminarMascota(id)` - Eliminar
- `filtrarPorEspecie(especie)` - Filtrar
- `buscarPorNombre(nombre)` - Buscar
- `obtenerPromedioEdad()` - Estadísticas generales
- `obtenerPromedioEdadPorEspecie(especie)` - Estadísticas por especie

## Rutas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | ListaMascotasComponent | Lista principal |
| `/crear` | FormularioMascotaComponent | Crear mascota |
| `/editar/:id` | FormularioMascotaComponent | Editar mascota |
| `/detalle/:id` | DetalleMascotaComponent | Ver detalle |
| `/estadisticas` | EstadisticasComponent | Estadísticas |

## Pruebas

### Ejecutar pruebas unitarias
```bash
npm test
```

### Ejecutar pruebas con cobertura
```bash
npm test -- --code-coverage
```

## Validaciones

El formulario incluye validaciones para:
- Campos requeridos
- Longitud mínima y máxima
- Tipos de datos
- Rangos numéricos

## Estilos

- **Bootstrap 5** para componentes
- **CSS personalizado** para estilos específicos
- **Responsive Design** para todos los dispositivos

## Despliegue

### Opción 1: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init
npm run build:prod
firebase deploy
```

### Opción 2: Vercel
```bash
npm install -g vercel
npm run build:prod
vercel
```

### Opción 3: Angular Universal (SSR)
```bash
ng add @angular/ssr
npm run build:ssr
```

## Variables de Entorno

Crear archivo `.env`:
```
NG_APP_API_URL=http://localhost:8080/api
```

## Contacto

Desarrollador: Diego Fabricio Salamea Morales


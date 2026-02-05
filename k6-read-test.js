import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración de prueba de carga
export const options = {
  stages: [
    { duration: '30s', target: 10 },    // Ramp-up: 0 a 10 usuarios en 30s
    { duration: '1m30s', target: 10 },  // Stay: 10 usuarios por 1min 30s
    { duration: '20s', target: 30 },    // Ramp-up: 10 a 30 usuarios en 20s
    { duration: '1m30s', target: 30 },  // Stay: 30 usuarios por 1min 30s
    { duration: '30s', target: 0 },     // Ramp-down: 30 a 0 usuarios en 30s
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],      // 95% de requests < 500ms
    http_req_failed: ['rate<0.1'],         // Tasa de error < 10%
  },
};

const BASE_URL = 'http://localhost:8080/mascotas';

export default function () {
  // 1. GET - Listar todas las mascotas
  const resListar = http.get(`${BASE_URL}`);
  check(resListar, {
    'GET /mascotas status 200': (r) => r.status === 200,
    'GET /mascotas tiene body': (r) => r.body.length > 0,
    'GET /mascotas tiempo < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);

  // 2. GET - Obtener mascota por ID
  const resDetalle = http.get(`${BASE_URL}/1`);
  check(resDetalle, {
    'GET /mascotas/1 status 200': (r) => r.status === 200,
    'GET /mascotas/1 tiene nombre': (r) => r.body.includes('nombre'),
    'GET /mascotas/1 tiempo < 300ms': (r) => r.timings.duration < 300,
  });
  sleep(1);

  // 3. GET - Filtrar por especie
  const resFiltro = http.get(`${BASE_URL}?especie=Perro`);
  check(resFiltro, {
    'GET /mascotas?especie status 200': (r) => r.status === 200,
    'GET /mascotas?especie tiempo < 400ms': (r) => r.timings.duration < 400,
  });
  sleep(1);

  // 4. GET - Búsqueda por nombre
  const resBusqueda = http.get(`${BASE_URL}?nombre=Max`);
  check(resBusqueda, {
    'GET /mascotas?nombre status 200': (r) => r.status === 200,
    'GET /mascotas?nombre tiempo < 400ms': (r) => r.timings.duration < 400,
  });
  sleep(1);

  // 5. GET - Estadísticas: Promedio de edad
  const resPromedio = http.get(`${BASE_URL}/estadisticas/promedio-edad`);
  check(resPromedio, {
    'GET /estadisticas/promedio-edad status 200': (r) => r.status === 200,
    'GET /estadisticas/promedio-edad tiene promedio': (r) => r.body.includes('promedio'),
  });
  sleep(1);
}

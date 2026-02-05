import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp-up: aumentar a 20 usuarios en 30s
    { duration: '1m30s', target: 20 }, // Mantener 20 usuarios por 1.5 min
    { duration: '30s', target: 0 },   // Ramp-down: bajar a 0 usuarios en 30s
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'],  // 99% de requests < 1500ms
    http_req_failed: ['<0.1'],           // Menos del 0.1% de fallos
  },
};

const BASE_URL = 'http://localhost:8080/api';

export default function() {
  // Test 1: Obtener lista de mascotas
  let res = http.get(`${BASE_URL}/mascotas`);
  check(res, {
    'GET /mascotas status is 200': (r) => r.status === 200,
    'GET /mascotas response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Test 2: Obtener mascota por ID
  res = http.get(`${BASE_URL}/mascotas/1`);
  check(res, {
    'GET /mascotas/1 status is 200': (r) => r.status === 200,
    'GET /mascotas/1 response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Test 3: Filtrar por especie
  res = http.get(`${BASE_URL}/mascotas?especie=Perro`);
  check(res, {
    'GET /mascotas?especie=Perro status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // Test 4: Obtener promedio de edad
  res = http.get(`${BASE_URL}/mascotas/estadisticas/promedio-edad`);
  check(res, {
    'GET promedio-edad status is 200': (r) => r.status === 200,
    'promedio-edad response time < 300ms': (r) => r.timings.duration < 300,
  });

  sleep(1);

  // Test 5: Health check
  res = http.get(`${BASE_URL}/mascotas/health`);
  check(res, {
    'GET health status is 200': (r) => r.status === 200,
  });

  sleep(2);
}

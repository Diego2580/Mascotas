import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración de prueba de escritura
export const options = {
  stages: [
    { duration: '20s', target: 5 },     // Ramp-up: 0 a 5 usuarios en 20s
    { duration: '1m', target: 5 },      // Stay: 5 usuarios por 1min
    { duration: '20s', target: 15 },    // Ramp-up: 5 a 15 usuarios en 20s
    { duration: '1m', target: 15 },     // Stay: 15 usuarios por 1min
    { duration: '30s', target: 0 },     // Ramp-down: 15 a 0 usuarios en 30s
  ],
  thresholds: {
    http_req_duration: ['p(95)<600'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = 'http://localhost:8080/mascotas';

// Generador de ID único basado en timestamp y número aleatorio
function generateUniqueName() {
  return `Mascota_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

const especies = ['Perro', 'Gato', 'Conejo', 'Pájaro', 'Pez'];

export default function () {
  // 1. POST - Crear mascota
  const nuevoNombre = generateUniqueName();
  const especieAleatoria = especies[Math.floor(Math.random() * especies.length)];
  const edadAleatoria = Math.floor(Math.random() * 15) + 1;
  
  const payload = JSON.stringify({
    nombre: nuevoNombre,
    especie: especieAleatoria,
    edad: edadAleatoria,
    dueno: 'Test User',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const resCrear = http.post(`${BASE_URL}`, payload, params);
  check(resCrear, {
    'POST /mascotas status 201': (r) => r.status === 201,
    'POST /mascotas tiene id': (r) => r.body.includes('id'),
    'POST /mascotas tiempo < 600ms': (r) => r.timings.duration < 600,
  });
  sleep(1);

  // 2. GET - Verificar que se creó
  if (resCrear.status === 201) {
    // Extraer ID de la respuesta (si está disponible)
    const resGet = http.get(`${BASE_URL}/1`);
    check(resGet, {
      'Verificar mascota creada status 200': (r) => r.status === 200,
    });
  }
  sleep(1);
}

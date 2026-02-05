import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración de prueba mixta realista
export const options = {
  stages: [
    { duration: '1m', target: 20 },     // Ramp-up: 0 a 20 usuarios en 1 min
    { duration: '2m', target: 20 },     // Stay: 20 usuarios por 2 min
    { duration: '1m', target: 50 },     // Ramp-up: 20 a 50 usuarios en 1 min
    { duration: '3m', target: 50 },     // Stay: 50 usuarios por 3 min
    { duration: '1m', target: 0 },      // Ramp-down: 50 a 0 usuarios en 1 min
  ],
  thresholds: {
    http_req_duration: ['p(99)<1000'],  // 99% de requests < 1s
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = 'http://localhost:8080/mascotas';

const especies = ['Perro', 'Gato', 'Conejo', 'Pájaro', 'Pez', 'Hámster', 'Tortuga'];
const nombres = ['Max', 'Luna', 'Rocky', 'Bella', 'Toby', 'Mimi', 'Rex', 'Coco'];

function generateUniqueName() {
  const nombre = nombres[Math.floor(Math.random() * nombres.length)];
  return `${nombre}_${Date.now() % 10000}`;
}

export default function () {
  // 70% GET operations
  if (Math.random() < 0.7) {
    // 1. Listar todas las mascotas
    if (Math.random() < 0.4) {
      const resListar = http.get(`${BASE_URL}`);
      check(resListar, {
        'GET /mascotas status': (r) => r.status === 200,
        'GET /mascotas duration': (r) => r.timings.duration < 500,
      });
    }
    // 2. Obtener mascota por ID
    else if (Math.random() < 0.7) {
      const idAleatorio = Math.floor(Math.random() * 10) + 1;
      const resDetalle = http.get(`${BASE_URL}/${idAleatorio}`);
      check(resDetalle, {
        'GET /mascotas/{id} success': (r) => r.status === 200 || r.status === 404,
      });
    }
    // 3. Filtrar por especie
    else if (Math.random() < 0.85) {
      const especieAleatoria = especies[Math.floor(Math.random() * especies.length)];
      const resFiltro = http.get(`${BASE_URL}?especie=${especieAleatoria}`);
      check(resFiltro, {
        'GET /mascotas?especie status': (r) => r.status === 200,
      });
    }
    // 4. Estadísticas
    else {
      const resStats = http.get(`${BASE_URL}/estadisticas/promedio-edad`);
      check(resStats, {
        'GET /estadisticas/promedio-edad status': (r) => r.status === 200,
      });
    }
  }
  // 30% POST operations
  else {
    const payload = JSON.stringify({
      nombre: generateUniqueName(),
      especie: especies[Math.floor(Math.random() * especies.length)],
      edad: Math.floor(Math.random() * 20) + 1,
      dueno: `Owner_${Date.now() % 1000}`,
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const resCrear = http.post(`${BASE_URL}`, payload, params);
    check(resCrear, {
      'POST /mascotas status': (r) => r.status === 201,
      'POST /mascotas duration': (r) => r.timings.duration < 800,
    });
  }

  sleep(Math.random() * 2); // Sleep entre 0 a 2 segundos
}

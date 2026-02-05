import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración: Spike test - carga máxima repentina
export const options = {
  stages: [
    { duration: '30s', target: 10 },    // Warm up
    { duration: '5s', target: 100 },    // SPIKE: 10 a 100 usuarios en 5s
    { duration: '30s', target: 100 },   // Mantener 100 usuarios
    { duration: '5s', target: 200 },    // SPIKE: 100 a 200 usuarios en 5s
    { duration: '30s', target: 200 },   // Mantener 200 usuarios
    { duration: '10s', target: 0 },     // Cooldown rápido
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    http_req_failed: ['rate<0.1'],  // Permitir hasta 10% de errores en spike
  },
};

const BASE_URL = 'http://localhost:8080/mascotas';

const especies = ['Perro', 'Gato', 'Conejo'];

export default function () {
  // Operación rápida: solo GET
  const resListar = http.get(`${BASE_URL}`);
  check(resListar, {
    'SPIKE test status': (r) => r.status === 200 || r.status === 500,
  });

  const idAleatorio = Math.floor(Math.random() * 50) + 1;
  const resDetalle = http.get(`${BASE_URL}/${idAleatorio}`);
  check(resDetalle, {
    'SPIKE test detail status': (r) => r.status === 200 || r.status === 404 || r.status === 503,
  });

  sleep(0.5);
}

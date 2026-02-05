import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '20s', target: 10 },  // Ramp-up: 10 usuarios
    { duration: '1m', target: 10 },   // Mantener 10 usuarios
    { duration: '20s', target: 0 },   // Ramp-down
  ],
};

const BASE_URL = 'http://localhost:8080/api';

let mascotaId = 0;

export default function() {
  // Test 1: Crear mascota
  let mascota = {
    nombre: `Mascota_${__VU}_${__ITER}`,
    especie: 'Perro',
    edad: Math.floor(Math.random() * 15) + 1,
    dueño: `Dueño_${__VU}`,
  };

  let res = http.post(`${BASE_URL}/mascotas`, JSON.stringify(mascota), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'POST /mascotas status is 201': (r) => r.status === 201,
    'POST response time < 500ms': (r) => r.timings.duration < 500,
  });

  if (res.status === 201) {
    let responseBody = JSON.parse(res.body);
    mascotaId = responseBody.id;
  }

  sleep(1);

  // Test 2: Obtener mascota creada
  if (mascotaId > 0) {
    res = http.get(`${BASE_URL}/mascotas/${mascotaId}`);
    check(res, {
      'GET created mascota status is 200': (r) => r.status === 200,
    });
  }

  sleep(1);

  // Test 3: Actualizar mascota
  if (mascotaId > 0) {
    let updatedMascota = {
      nombre: `Mascota_Updated_${__VU}`,
      especie: 'Gato',
      edad: 5,
      dueño: `Dueño_Updated_${__VU}`,
    };

    res = http.put(`${BASE_URL}/mascotas/${mascotaId}`, JSON.stringify(updatedMascota), {
      headers: { 'Content-Type': 'application/json' },
    });

    check(res, {
      'PUT /mascotas/:id status is 200': (r) => r.status === 200,
    });
  }

  sleep(1);

  // Test 4: Eliminar mascota
  if (mascotaId > 0) {
    res = http.delete(`${BASE_URL}/mascotas/${mascotaId}`);
    check(res, {
      'DELETE /mascotas/:id status is 200': (r) => r.status === 200,
    });
  }

  sleep(2);
}

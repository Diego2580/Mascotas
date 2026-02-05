import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MascotaService } from './mascota.service';
import { Mascota } from '../models/mascota.model';

describe('MascotaService', () => {
  let service: MascotaService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/api/mascotas';

  const mascotaMock: Mascota = {
    id: 1,
    nombre: 'Max',
    especie: 'Perro',
    edad: 5,
    dueno: 'Juan'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MascotaService]
    });

    service = TestBed.inject(MascotaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Inicialización', () => {
    it('Debe ser creado', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('listarMascotas', () => {
    it('Debe obtener lista de mascotas correctamente', () => {
      const mockMascotas: Mascota[] = [mascotaMock];

      service.listarMascotas().subscribe(mascotas => {
        expect(mascotas.length).toBe(1);
        expect(mascotas[0].nombre).toBe('Max');
        expect(mascotas[0].especie).toBe('Perro');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockMascotas);
    });

    it('Debe manejar lista vacía', () => {
      service.listarMascotas().subscribe(mascotas => {
        expect(mascotas.length).toBe(0);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush([]);
    });

    it('Debe manejar múltiples mascotas', () => {
      const mascotas: Mascota[] = [
        mascotaMock,
        { id: 2, nombre: 'Mishi', especie: 'Gato', edad: 3, dueno: 'María' }
      ];

      service.listarMascotas().subscribe(result => {
        expect(result.length).toBe(2);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mascotas);
    });
  });

  describe('obtenerMascota', () => {
    it('Debe obtener mascota por ID correctamente', () => {
      service.obtenerMascota(1).subscribe(mascota => {
        expect(mascota.id).toBe(1);
        expect(mascota.nombre).toBe('Max');
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mascotaMock);
    });

    it('Debe manejar mascota no encontrada', () => {
      service.obtenerMascota(999).subscribe(
        () => fail('debería haber fallado'),
        (error) => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush('No encontrada', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('crearMascota', () => {
    it('Debe crear mascota correctamente', () => {
      const nuevaMascota: Mascota = { nombre: 'Rocky', especie: 'Perro', edad: 3, dueno: 'Carlos' };
      const mascotaCreada = { id: 3, ...nuevaMascota };

      service.crearMascota(nuevaMascota).subscribe(mascota => {
        expect(mascota.id).toBe(3);
        expect(mascota.nombre).toBe('Rocky');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(nuevaMascota);
      req.flush(mascotaCreada);
    });

    it('Debe manejar error en crear con validación fallida', () => {
      const nuevaMascota: Mascota = { nombre: '', especie: 'Perro', edad: 3, dueno: 'Carlos' };

      service.crearMascota(nuevaMascota).subscribe(
        () => fail('debería haber fallado'),
        (error) => {
          expect(error.status).toBe(400);
        }
      );

      const req = httpMock.expectOne(apiUrl);
      req.flush('Validación fallida', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('actualizarMascota', () => {
    it('Debe actualizar mascota correctamente', () => {
      const mascotaActualizada: Mascota = { id: 1, nombre: 'MaxActualizado', especie: 'Perro', edad: 6, dueno: 'Juan' };

      service.actualizarMascota(1, mascotaActualizada).subscribe(mascota => {
        expect(mascota.nombre).toBe('MaxActualizado');
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mascotaActualizada);
      req.flush(mascotaActualizada);
    });

    it('Debe manejar error en actualizar si no existe', () => {
      service.actualizarMascota(999, mascotaMock).subscribe(
        () => fail('debería haber fallado'),
        (error) => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush('No encontrada', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('eliminarMascota', () => {
    it('Debe eliminar mascota correctamente', () => {
      service.eliminarMascota(1).subscribe(respuesta => {
        expect(respuesta.message).toBe('Mascota eliminada correctamente');
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Mascota eliminada correctamente', id: '1' });
    });

    it('Debe manejar error al eliminar si no existe', () => {
      service.eliminarMascota(999).subscribe(
        () => fail('debería haber fallado'),
        (error) => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush('No encontrada', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('filtrarPorEspecie', () => {
    it('Debe filtrar mascotas por especie correctamente', () => {
      service.filtrarPorEspecie('Perro').subscribe(mascotas => {
        expect(mascotas.length).toBe(1);
        expect(mascotas[0].especie).toBe('Perro');
      });

      const req = httpMock.expectOne(req => req.url === apiUrl && req.params.get('especie') === 'Perro');
      expect(req.request.method).toBe('GET');
      req.flush([mascotaMock]);
    });

    it('Debe retornar lista vacía si no hay mascotas de esa especie', () => {
      service.filtrarPorEspecie('Pajaro').subscribe(mascotas => {
        expect(mascotas.length).toBe(0);
      });

      const req = httpMock.expectOne(req => req.url === apiUrl && req.params.get('especie') === 'Pajaro');
      req.flush([]);
    });
  });

  describe('buscarPorNombre', () => {
    it('Debe buscar mascotas por nombre correctamente', () => {
      service.buscarPorNombre('Max').subscribe(mascotas => {
        expect(mascotas[0].nombre).toBe('Max');
      });

      const req = httpMock.expectOne(req => req.url === apiUrl && req.params.get('nombre') === 'Max');
      expect(req.request.method).toBe('GET');
      req.flush([mascotaMock]);
    });

    it('Debe retornar lista vacía si no encuentra coincidencias', () => {
      service.buscarPorNombre('NoExiste').subscribe(mascotas => {
        expect(mascotas.length).toBe(0);
      });

      const req = httpMock.expectOne(req => req.url === apiUrl && req.params.get('nombre') === 'NoExiste');
      req.flush([]);
    });
  });

  describe('obtenerPromedioEdad', () => {
    it('Debe obtener promedio de edad general correctamente', () => {
      const promedioMock = { promedio: 5.5, message: 'Promedio de edad calculado correctamente' };

      service.obtenerPromedioEdad().subscribe(promedio => {
        expect(promedio.promedio).toBe(5.5);
      });

      const req = httpMock.expectOne(`${apiUrl}/estadisticas/promedio-edad`);
      expect(req.request.method).toBe('GET');
      req.flush(promedioMock);
    });
  });

  describe('obtenerPromedioEdadPorEspecie', () => {
    it('Debe obtener promedio de edad por especie correctamente', () => {
      const promedioMock = { promedio: 5.0, message: 'Promedio por especie' };

      service.obtenerPromedioEdadPorEspecie('Perro').subscribe(promedio => {
        expect(promedio.promedio).toBe(5.0);
      });

      const req = httpMock.expectOne(req => 
        req.url === `${apiUrl}/estadisticas/promedio-edad-especie` && 
        req.params.get('especie') === 'Perro'
      );
      expect(req.request.method).toBe('GET');
      req.flush(promedioMock);
    });
  });
});

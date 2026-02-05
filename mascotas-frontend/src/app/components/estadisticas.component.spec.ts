import { TestBed, ComponentFixture, fakeAsync, flush } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EstadisticasComponent } from './estadisticas.component';
import { MascotaService } from '@services/mascota.service';
import { of, throwError } from 'rxjs';
import { PromedioEdad } from '@models/mascota.model';

describe('EstadisticasComponent', () => {
  let component: EstadisticasComponent;
  let fixture: ComponentFixture<EstadisticasComponent>;
  let mascotaService: MascotaService;

  const promedioMock: PromedioEdad = {
    promedio: 5.5,
    message: 'Promedio de edad calculado correctamente'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EstadisticasComponent,
        HttpClientTestingModule
      ],
      providers: [MascotaService]
    }).compileComponents();

    fixture = TestBed.createComponent(EstadisticasComponent);
    component = fixture.componentInstance;
    mascotaService = TestBed.inject(MascotaService);
  });

  describe('Inicialización', () => {
    it('Debe crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('Debe inicializar con valores por defecto', () => {
      expect(component.promedioEdadGeneral).toBeNull();
      expect(component.estadisticasEspecies.size).toBe(0);
      expect(component.cargando).toBeFalsy();
      expect(component.error).toBeNull();
      expect(component.especies.length).toBe(5);
    });

    it('Debe tener lista de especies predefinidas', () => {
      expect(component.especies).toContain('Perro');
      expect(component.especies).toContain('Gato');
      expect(component.especies).toContain('Conejo');
      expect(component.especies).toContain('Pájaro');
      expect(component.especies).toContain('Pez');
    });
  });

  describe('cargarEstadisticas', () => {
    it('Debe cargar promedio de edad general', fakeAsync(() => {
      spyOn(mascotaService, 'obtenerPromedioEdad').and.returnValue(of(promedioMock));
      spyOn(mascotaService, 'obtenerPromedioEdadPorEspecie').and.returnValue(of(promedioMock));

      component.cargarEstadisticas();
      flush();

      expect(component.promedioEdadGeneral).toEqual(promedioMock);
      expect(mascotaService.obtenerPromedioEdad).toHaveBeenCalled();
    }));

    it('Debe cargar estadísticas por especie', fakeAsync(() => {
      spyOn(mascotaService, 'obtenerPromedioEdad').and.returnValue(of(promedioMock));
      spyOn(mascotaService, 'obtenerPromedioEdadPorEspecie').and.returnValue(of(promedioMock));

      component.cargarEstadisticas();
      flush();

      expect(mascotaService.obtenerPromedioEdadPorEspecie).toHaveBeenCalledWith('Perro');
      expect(mascotaService.obtenerPromedioEdadPorEspecie).toHaveBeenCalledWith('Gato');
      expect(mascotaService.obtenerPromedioEdadPorEspecie).toHaveBeenCalledWith('Conejo');
    }));

    it('Debe almacenar estadísticas en el mapa', fakeAsync(() => {
      const promedioPerro: PromedioEdad = { promedio: 5.0, message: 'Promedio Perro' };
      
      spyOn(mascotaService, 'obtenerPromedioEdad').and.returnValue(of(promedioMock));
      spyOn(mascotaService, 'obtenerPromedioEdadPorEspecie').and.callFake((especie) => {
        if (especie === 'Perro') return of(promedioPerro);
        return of(promedioMock);
      });

      component.cargarEstadisticas();
      flush();

      expect(component.estadisticasEspecies.get('Perro')).toEqual(promedioPerro);
    }));

    it('Debe manejar error en promedio general', fakeAsync(() => {
      spyOn(mascotaService, 'obtenerPromedioEdad').and.returnValue(
        throwError(() => new Error('Error'))
      );
      spyOn(mascotaService, 'obtenerPromedioEdadPorEspecie').and.returnValue(of(promedioMock));

      component.cargarEstadisticas();
      flush();

      expect(component.error).toBe('Error al cargar estadísticas generales');
      expect(component.promedioEdadGeneral).toBeNull();
    }));

    it('Debe manejar error por especie sin detener el proceso', fakeAsync(() => {
      spyOn(mascotaService, 'obtenerPromedioEdad').and.returnValue(of(promedioMock));
      spyOn(mascotaService, 'obtenerPromedioEdadPorEspecie').and.returnValue(
        throwError(() => new Error('Error'))
      );
      spyOn(console, 'warn');

      component.cargarEstadisticas();
      flush();

      expect(component.promedioEdadGeneral).toEqual(promedioMock);
      expect(console.warn).toHaveBeenCalled();
    }));

    it('Debe limpiar error anterior al cargar', () => {
      component.error = 'Error anterior';
      spyOn(mascotaService, 'obtenerPromedioEdad').and.returnValue(of(promedioMock));
      spyOn(mascotaService, 'obtenerPromedioEdadPorEspecie').and.returnValue(of(promedioMock));

      component.cargarEstadisticas();

      expect(component.error).toBeNull();
    });

    it('Debe establecer cargando en true al inicio', () => {
      spyOn(mascotaService, 'obtenerPromedioEdad').and.returnValue(of(promedioMock));
      spyOn(mascotaService, 'obtenerPromedioEdadPorEspecie').and.returnValue(of(promedioMock));

      component.cargando = false;
      component.cargarEstadisticas();

      expect(component.cargando).toBeTruthy();
    });

    it('Debe establecer cargando en false después de completar', fakeAsync(() => {
      spyOn(mascotaService, 'obtenerPromedioEdad').and.returnValue(of(promedioMock));
      spyOn(mascotaService, 'obtenerPromedioEdadPorEspecie').and.returnValue(of(promedioMock));

      component.cargarEstadisticas();
      flush();

      expect(component.cargando).toBeFalsy();
    }));
  });

  describe('ngOnInit', () => {
    it('Debe llamar a cargarEstadisticas en ngOnInit', () => {
      spyOn(component, 'cargarEstadisticas');

      component.ngOnInit();

      expect(component.cargarEstadisticas).toHaveBeenCalled();
    });
  });

  describe('Manejo de datos', () => {
    it('Debe guardar promedio general correctamente', () => {
      spyOn(mascotaService, 'obtenerPromedioEdad').and.returnValue(of(promedioMock));
      spyOn(mascotaService, 'obtenerPromedioEdadPorEspecie').and.returnValue(of(promedioMock));

      component.cargarEstadisticas();

      expect(component.promedioEdadGeneral?.promedio).toBe(5.5);
    });

    it('Debe almacenar múltiples estadísticas por especie', fakeAsync(() => {
      const promedioPerro: PromedioEdad = { promedio: 4.0, message: 'Perro' };
      const promediGato: PromedioEdad = { promedio: 3.0, message: 'Gato' };

      spyOn(mascotaService, 'obtenerPromedioEdad').and.returnValue(of(promedioMock));
      spyOn(mascotaService, 'obtenerPromedioEdadPorEspecie').and.callFake((especie) => {
        if (especie === 'Perro') return of(promedioPerro);
        if (especie === 'Gato') return of(promediGato);
        return of(promedioMock);
      });

      component.cargarEstadisticas();
      flush();

      expect(component.estadisticasEspecies.size).toBeGreaterThan(0);
      expect(component.estadisticasEspecies.get('Perro')?.promedio).toBe(4.0);
      expect(component.estadisticasEspecies.get('Gato')?.promedio).toBe(3.0);
    }));
  });

  describe('Manejo de errores', () => {
    it('Debe mostrar mensaje de error si falla carga general', () => {
      spyOn(mascotaService, 'obtenerPromedioEdad').and.returnValue(
        throwError(() => ({ status: 500 }))
      );
      spyOn(mascotaService, 'obtenerPromedioEdadPorEspecie').and.returnValue(of(promedioMock));

      component.cargarEstadisticas();

      expect(component.error).toBe('Error al cargar estadísticas generales');
    });

    it('Debe no mostrar error si falla solo una especie', fakeAsync(() => {
      spyOn(mascotaService, 'obtenerPromedioEdad').and.returnValue(of(promedioMock));
      spyOn(mascotaService, 'obtenerPromedioEdadPorEspecie').and.returnValue(
        throwError(() => ({ status: 500 }))
      );

      component.cargarEstadisticas();
      flush();

      expect(component.error).toBeNull();
    }));
  });
});

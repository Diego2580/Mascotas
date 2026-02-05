import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DetalleMascotaComponent } from './detalle-mascota.component';
import { MascotaService } from '@services/mascota.service';
import { of, throwError } from 'rxjs';
import { Mascota } from '@models/mascota.model';

describe('DetalleMascotaComponent', () => {
  let component: DetalleMascotaComponent;
  let fixture: ComponentFixture<DetalleMascotaComponent>;
  let mascotaService: MascotaService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  const mascotaMock: Mascota = {
    id: 1,
    nombre: 'Max',
    especie: 'Perro',
    edad: 5,
    dueno: 'Juan'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DetalleMascotaComponent,
        HttpClientTestingModule
      ],
      providers: [
        MascotaService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleMascotaComponent);
    component = fixture.componentInstance;
    mascotaService = TestBed.inject(MascotaService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  describe('Inicialización', () => {
    it('Debe crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('Debe inicializar con valores por defecto', () => {
      expect(component.mascota).toBeNull();
      expect(component.cargando).toBeFalsy();
      expect(component.error).toBeNull();
    });

    it('Debe cargar mascota en ngOnInit', () => {
      spyOn(mascotaService, 'obtenerMascota').and.returnValue(of(mascotaMock));

      fixture.detectChanges();

      expect(component.mascota).toEqual(mascotaMock);
      expect(component.cargando).toBeFalsy();
    });
  });

  describe('cargarMascota', () => {
    it('Debe cargar mascota por ID correctamente', () => {
      spyOn(mascotaService, 'obtenerMascota').and.returnValue(of(mascotaMock));

      component.cargarMascota(1);

      expect(mascotaService.obtenerMascota).toHaveBeenCalledWith(1);
      expect(component.mascota).toEqual(mascotaMock);
      expect(component.error).toBeNull();
      expect(component.cargando).toBeFalsy();
    });

    it('Debe manejar error cuando mascota no existe', () => {
      spyOn(mascotaService, 'obtenerMascota').and.returnValue(
        throwError(() => new Error('No encontrada'))
      );

      component.cargarMascota(999);

      expect(component.error).toBe('Mascota no encontrada');
      expect(component.mascota).toBeNull();
      expect(component.cargando).toBeFalsy();
    });

    it('Debe limpiar error anterior al cargar', () => {
      component.error = 'Error anterior';
      spyOn(mascotaService, 'obtenerMascota').and.returnValue(of(mascotaMock));

      component.cargarMascota(1);

      expect(component.error).toBeNull();
    });

    it('Debe mostrar cargando durante la carga', () => {
      spyOn(mascotaService, 'obtenerMascota').and.returnValue(of(mascotaMock));

      component.cargando = false;
      component.cargarMascota(1);

      expect(component.cargando).toBeFalsy();
    });
  });

  describe('Métodos de navegación', () => {
    it('Debe navegar a editar cuando se llama editar con ID válido', () => {
      component.editar(1);

      expect(router.navigate).toHaveBeenCalledWith(['/editar', 1]);
    });

    it('No debe navegar si no hay ID', () => {
      component.editar(undefined);

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('Debe navegar a inicio cuando se llama volver', () => {
      component.volver();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Manejo de datos', () => {
    it('Debe mostrar datos correctamente', () => {
      spyOn(mascotaService, 'obtenerMascota').and.returnValue(of(mascotaMock));

      fixture.detectChanges();

      expect(component.mascota?.nombre).toBe('Max');
      expect(component.mascota?.edad).toBe(5);
      expect(component.mascota?.dueno).toBe('Juan');
    });

    it('Debe obtener el ID de los parámetros de ruta', () => {
      spyOn(mascotaService, 'obtenerMascota').and.returnValue(of(mascotaMock));
      spyOn(activatedRoute.params, 'subscribe').and.callThrough();

      fixture.detectChanges();

      expect(activatedRoute.params.subscribe).toHaveBeenCalled();
    });
  });

  describe('Manejo de errores', () => {
    it('Debe manejar error de conexión', () => {
      spyOn(mascotaService, 'obtenerMascota').and.returnValue(
        throwError(() => ({
          status: 500,
          message: 'Error de servidor'
        }))
      );

      component.cargarMascota(1);

      expect(component.error).toBe('Mascota no encontrada');
    });

    it('Debe manejar ID inválido', () => {
      spyOn(mascotaService, 'obtenerMascota').and.returnValue(
        throwError(() => ({
          status: 404,
          message: 'No encontrada'
        }))
      );

      component.cargarMascota(0);

      expect(component.error).toBe('Mascota no encontrada');
    });
  });
});

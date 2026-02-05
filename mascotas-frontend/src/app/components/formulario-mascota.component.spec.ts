import { TestBed, ComponentFixture, fakeAsync, tick, flush } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormularioMascotaComponent } from './formulario-mascota.component';
import { MascotaService } from '@services/mascota.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Mascota } from '@models/mascota.model';

describe('FormularioMascotaComponent', () => {
  let component: FormularioMascotaComponent;
  let fixture: ComponentFixture<FormularioMascotaComponent>;
  let mascotaService: MascotaService;
  let router: Router;

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
        FormularioMascotaComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        MascotaService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: null })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioMascotaComponent);
    component = fixture.componentInstance;
    mascotaService = TestBed.inject(MascotaService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  describe('Inicialización', () => {
    it('Debe crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('Debe inicializar el formulario correctamente', () => {
      expect(component.formulario).toBeTruthy();
      expect(component.formulario.get('nombre')).toBeTruthy();
      expect(component.formulario.get('especie')).toBeTruthy();
      expect(component.formulario.get('edad')).toBeTruthy();
      expect(component.formulario.get('dueno')).toBeTruthy();
    });

    it('Debe inicializar en modo crear', () => {
      expect(component.editando).toBeFalsy();
      expect(component.cargando).toBeFalsy();
    });

    it('Debe tener lista de especies predefinida', () => {
      expect(component.especies).toContain('Perro');
      expect(component.especies).toContain('Gato');
      expect(component.especies.length).toBeGreaterThan(0);
    });
  });

  describe('Validaciones del formulario', () => {
    it('Debe indicar formulario inválido cuando está vacío', () => {
      expect(component.formulario.invalid).toBeTruthy();
    });

    it('Debe indicar formulario válido cuando está completo', () => {
      component.formulario.patchValue({
        nombre: 'Max',
        especie: 'Perro',
        edad: 5,
        dueno: 'Juan'
      });
      expect(component.formulario.valid).toBeTruthy();
    });

    it('Debe rechazar nombre vacío', () => {
      const nombreControl = component.formulario.get('nombre');
      nombreControl?.setValue('');
      expect(nombreControl?.hasError('required')).toBeTruthy();
    });

    it('Debe rechazar nombre muy corto', () => {
      const nombreControl = component.formulario.get('nombre');
      nombreControl?.setValue('A');
      expect(nombreControl?.hasError('minlength')).toBeTruthy();
    });

    it('Debe rechazar nombre muy largo', () => {
      const nombreControl = component.formulario.get('nombre');
      nombreControl?.setValue('A'.repeat(101));
      expect(nombreControl?.hasError('maxlength')).toBeTruthy();
    });

    it('Debe rechazar especie vacía', () => {
      const especieControl = component.formulario.get('especie');
      especieControl?.setValue('');
      expect(especieControl?.hasError('required')).toBeTruthy();
    });

    it('Debe rechazar edad negativa', () => {
      const edadControl = component.formulario.get('edad');
      edadControl?.setValue(-5);
      expect(edadControl?.hasError('min')).toBeTruthy();
    });

    it('Debe rechazar edad mayor a 100', () => {
      const edadControl = component.formulario.get('edad');
      edadControl?.setValue(101);
      expect(edadControl?.hasError('max')).toBeTruthy();
    });

    it('Debe rechazar edad no numérica', () => {
      const edadControl = component.formulario.get('edad');
      edadControl?.setValue('abc');
      expect(edadControl?.invalid).toBeTruthy();
    });

    it('Debe rechazar dueño vacío', () => {
      const duenoControl = component.formulario.get('dueno');
      duenoControl?.setValue('');
      expect(duenoControl?.hasError('required')).toBeTruthy();
    });

    it('Debe rechazar dueño muy corto', () => {
      const duenoControl = component.formulario.get('dueno');
      duenoControl?.setValue('A');
      expect(duenoControl?.hasError('minlength')).toBeTruthy();
    });
  });

  describe('Crear mascota', () => {
    it('Debe crear mascota cuando el formulario es válido', () => {
      spyOn(mascotaService, 'crearMascota').and.returnValue(of(mascotaMock));
      spyOn(router, 'navigate');

      component.formulario.patchValue({
        nombre: 'Max',
        especie: 'Perro',
        edad: 5,
        dueno: 'Juan'
      });

      component.onSubmit();

      expect(mascotaService.crearMascota).toHaveBeenCalled();
      expect(component.exito).toBe('Mascota creada correctamente');
    });

    it('Debe mostrar error cuando el formulario es inválido', () => {
      component.onSubmit();

      expect(component.error).toBe('Por favor completa todos los campos correctamente');
      expect(component.cargando).toBeFalsy();
    });

    it('Debe manejar error al crear mascota', () => {
      spyOn(mascotaService, 'crearMascota').and.returnValue(
        throwError(() => new Error('Error'))
      );

      component.formulario.patchValue({
        nombre: 'Max',
        especie: 'Perro',
        edad: 5,
        dueno: 'Juan'
      });

      component.onSubmit();

      expect(component.error).toBe('Error al crear la mascota');
    });

    it('Debe limpiar el formulario después de crear', (done) => {
      spyOn(mascotaService, 'crearMascota').and.returnValue(of(mascotaMock));
      spyOn(router, 'navigate');

      component.formulario.patchValue({
        nombre: 'Max',
        especie: 'Perro',
        edad: 5,
        dueno: 'Juan'
      });

      component.onSubmit();

      setTimeout(() => {
        expect(component.formulario.value.nombre).toBe(null);
        done();
      }, 100);
    });
  });

  describe('Actualizar mascota', () => {
    it('Debe cargar mascota en modo edición', () => {
      spyOn(mascotaService, 'obtenerMascota').and.returnValue(of(mascotaMock));

      component.mascotaId = 1;
      component.editando = true;
      component.cargarMascota();

      expect(mascotaService.obtenerMascota).toHaveBeenCalledWith(1);
      expect(component.formulario.get('nombre')?.value).toBe('Max');
    });

    it('Debe actualizar mascota cuando el formulario es válido', () => {
      spyOn(mascotaService, 'actualizarMascota').and.returnValue(of(mascotaMock));
      spyOn(router, 'navigate');

      component.mascotaId = 1;
      component.editando = true;
      component.formulario.patchValue({
        nombre: 'MaxActualizado',
        especie: 'Perro',
        edad: 6,
        dueno: 'Juan'
      });

      component.onSubmit();

      expect(mascotaService.actualizarMascota).toHaveBeenCalledWith(1, jasmine.any(Object));
      expect(component.exito).toBe('Mascota actualizada correctamente');
    });

    it('Debe manejar error al actualizar mascota', () => {
      spyOn(mascotaService, 'actualizarMascota').and.returnValue(
        throwError(() => new Error('Error'))
      );

      component.mascotaId = 1;
      component.editando = true;
      component.formulario.patchValue({
        nombre: 'Max',
        especie: 'Perro',
        edad: 5,
        dueno: 'Juan'
      });

      component.onSubmit();

      expect(component.error).toBe('Error al actualizar la mascota');
    });

    it('Debe manejar error al cargar mascota para editar', () => {
      spyOn(mascotaService, 'obtenerMascota').and.returnValue(
        throwError(() => new Error('No encontrada'))
      );

      component.mascotaId = 999;
      component.cargarMascota();

      expect(component.error).toBe('Error al cargar la mascota');
    });
  });

  describe('Manejo de estados', () => {
    it('Debe limpiar errores y éxitos previos', () => {
      component.error = 'Error anterior';
      component.exito = 'Éxito anterior';

      component.formulario.patchValue({
        nombre: 'Max',
        especie: 'Perro',
        edad: 5,
        dueno: 'Juan'
      });

      spyOn(mascotaService, 'crearMascota').and.returnValue(of(mascotaMock));

      component.onSubmit();

      expect(component.error).toBeNull();
    });
  });

  describe('Navegación', () => {
    it('Debe navegar a inicio después de crear', (done) => {
      spyOn(mascotaService, 'crearMascota').and.returnValue(of(mascotaMock));
      spyOn(router, 'navigate');

      component.formulario.patchValue({
        nombre: 'Max',
        especie: 'Perro',
        edad: 5,
        dueno: 'Juan'
      });

      component.onSubmit();

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/']);
        done();
      }, 1600);
    });
  });
});

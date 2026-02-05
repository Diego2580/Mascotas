import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ListaMascotasComponent } from './lista-mascotas.component';
import { MascotaService } from '@services/mascota.service';
import { of, throwError } from 'rxjs';
import { Mascota } from '@models/mascota.model';

describe('ListaMascotasComponent', () => {
  let component: ListaMascotasComponent;
  let fixture: ComponentFixture<ListaMascotasComponent>;
  let mascotaService: MascotaService;

  const mascotasMock: Mascota[] = [
    { id: 1, nombre: 'Max', especie: 'Perro', edad: 5, dueno: 'Juan' },
    { id: 2, nombre: 'Mishi', especie: 'Gato', edad: 3, dueno: 'María' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ListaMascotasComponent,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [MascotaService]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaMascotasComponent);
    component = fixture.componentInstance;
    mascotaService = TestBed.inject(MascotaService);
  });

  describe('Inicialización', () => {
    it('Debe crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('Debe inicializar con valores por defecto', () => {
      expect(component.mascotas).toEqual([]);
      expect(component.cargando).toBeFalsy();
      expect(component.error).toBeNull();
      expect(component.busqueda).toBe('');
      expect(component.filtroEspecie).toBe('');
    });
  });

  describe('cargarMascotas', () => {
    it('Debe cargar lista de mascotas al inicializar', () => {
      spyOn(mascotaService, 'listarMascotas').and.returnValue(of(mascotasMock));

      fixture.detectChanges();

      expect(component.mascotas.length).toBe(2);
      expect(component.cargando).toBeFalsy();
      expect(component.error).toBeNull();
    });

    it('Debe filtrar por especie cuando filtroEspecie está seteado', () => {
      const perrosMock = [mascotasMock[0]];
      spyOn(mascotaService, 'filtrarPorEspecie').and.returnValue(of(perrosMock));

      component.filtroEspecie = 'Perro';
      component.cargarMascotas();

      expect(mascotaService.filtrarPorEspecie).toHaveBeenCalledWith('Perro');
      expect(component.mascotas).toEqual(perrosMock);
      expect(component.cargando).toBeFalsy();
    });

    it('Debe buscar por nombre cuando busqueda está seteada', () => {
      const resultadoBusqueda = [mascotasMock[0]];
      spyOn(mascotaService, 'buscarPorNombre').and.returnValue(of(resultadoBusqueda));

      component.busqueda = 'Max';
      component.cargarMascotas();

      expect(mascotaService.buscarPorNombre).toHaveBeenCalledWith('Max');
      expect(component.mascotas).toEqual(resultadoBusqueda);
    });

    it('Debe listar todas las mascotas cuando no hay filtro ni búsqueda', () => {
      spyOn(mascotaService, 'listarMascotas').and.returnValue(of(mascotasMock));

      component.cargarMascotas();

      expect(mascotaService.listarMascotas).toHaveBeenCalled();
      expect(component.mascotas).toEqual(mascotasMock);
    });

    it('Debe manejar error al cargar mascotas', () => {
      spyOn(mascotaService, 'listarMascotas').and.returnValue(
        throwError(() => new Error('Error de conexión'))
      );

      component.cargarMascotas();

      expect(component.error).toBe('Error al cargar mascotas');
      expect(component.cargando).toBeFalsy();
    });

    it('Debe mostrar cargando durante la carga', () => {
      spyOn(mascotaService, 'listarMascotas').and.returnValue(of(mascotasMock));

      component.cargando = false;
      component.cargarMascotas();

      expect(component.cargando).toBeFalsy();
    });
  });

  describe('Interacciones del usuario', () => {
    it('Debe limpiar error al cargar', () => {
      component.error = 'Error anterior';
      spyOn(mascotaService, 'listarMascotas').and.returnValue(of(mascotasMock));

      component.cargarMascotas();

      expect(component.error).toBeNull();
    });

    it('Debe manejar lista vacía', () => {
      spyOn(mascotaService, 'listarMascotas').and.returnValue(of([]));

      component.cargarMascotas();

      expect(component.mascotas).toEqual([]);
      expect(component.error).toBeNull();
    });

    it('Debe recargar mascotas cuando se cambia el filtro', () => {
      spyOn(mascotaService, 'filtrarPorEspecie').and.returnValue(of([mascotasMock[0]]));

      component.filtroEspecie = 'Perro';
      component.cargarMascotas();

      component.filtroEspecie = 'Gato';
      component.cargarMascotas();

      expect(mascotaService.filtrarPorEspecie).toHaveBeenCalledTimes(2);
    });
  });
});

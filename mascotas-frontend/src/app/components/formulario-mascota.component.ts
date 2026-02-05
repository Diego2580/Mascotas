import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotaService } from '@services/mascota.service';
import { Mascota } from '@models/mascota.model';

@Component({
  selector: 'app-formulario-mascota',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './formulario-mascota.component.html',
  styleUrls: ['./formulario-mascota.component.css']
})
export class FormularioMascotaComponent implements OnInit {
  formulario!: FormGroup;
  editando = false;
  cargando = false;
  error: string | null = null;
  exito: string | null = null;
  mascotaId: number | null = null;

  especies = ['Perro', 'Gato', 'Conejo', 'Pájaro', 'Pez', 'Hámster', 'Tortuga'];

  constructor(
    private formBuilder: FormBuilder,
    private mascotaService: MascotaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.mascotaId = params['id'];
        this.editando = true;
        this.cargarMascota();
      }
    });
  }

  crearFormulario(): void {
    this.formulario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      especie: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern(/^[0-9]*$/)]],
      dueno: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  cargarMascota(): void {
    if (this.mascotaId) {
      this.cargando = true;
      this.mascotaService.obtenerMascota(this.mascotaId).subscribe({
        next: (mascota) => {
          this.formulario.patchValue(mascota);
          this.cargando = false;
        },
        error: () => {
          this.error = 'Error al cargar la mascota';
          this.cargando = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.error = 'Por favor completa todos los campos correctamente';
      return;
    }

    this.cargando = true;
    this.error = null;
    this.exito = null;

    const mascota: Mascota = this.formulario.value;

    if (this.editando && this.mascotaId) {
      this.mascotaService.actualizarMascota(this.mascotaId, mascota).subscribe({
        next: () => {
          this.exito = 'Mascota actualizada correctamente';
          this.cargando = false;
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        },
        error: () => {
          this.error = 'Error al actualizar la mascota';
          this.cargando = false;
        }
      });
    } else {
      this.mascotaService.crearMascota(mascota).subscribe({
        next: () => {
          this.exito = 'Mascota creada correctamente';
          this.cargando = false;
          this.formulario.reset();
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        },
        error: () => {
          this.error = 'Error al crear la mascota';
          this.cargando = false;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/']);
  }

  get nombre() {
    return this.formulario.get('nombre');
  }

  get especie() {
    return this.formulario.get('especie');
  }

  get edad() {
    return this.formulario.get('edad');
  }

  get dueno() {
    return this.formulario.get('dueno');
  }

  get tituloFormulario(): string {
    return this.editando ? 'Editar Mascota' : 'Agregar Nueva Mascota';
  }

  get tituloBoton(): string {
    return this.editando ? 'Actualizar' : 'Crear';
  }
}

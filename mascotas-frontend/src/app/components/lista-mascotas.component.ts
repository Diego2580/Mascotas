import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '@services/mascota.service';
import { Mascota } from '@models/mascota.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-mascotas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-mascotas.component.html',
  styleUrls: ['./lista-mascotas.component.css']
})
export class ListaMascotasComponent implements OnInit {
  mascotas: Mascota[] = [];
  cargando = false;
  error: string | null = null;
  busqueda = '';
  filtroEspecie = '';

  constructor(
    private mascotaService: MascotaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    this.cargando = true;
    this.error = null;

    if (this.filtroEspecie) {
      this.mascotaService.filtrarPorEspecie(this.filtroEspecie).subscribe({
        next: (data) => {
          this.mascotas = data;
          this.cargando = false;
        },
        error: (err) => {
          this.error = 'Error al cargar mascotas';
          this.cargando = false;
        }
      });
    } else if (this.busqueda) {
      this.mascotaService.buscarPorNombre(this.busqueda).subscribe({
        next: (data) => {
          this.mascotas = data;
          this.cargando = false;
        },
        error: (err) => {
          this.error = 'Error al buscar mascotas';
          this.cargando = false;
        }
      });
    } else {
      this.mascotaService.listarMascotas().subscribe({
        next: (data) => {
          this.mascotas = data;
          this.cargando = false;
        },
        error: (err) => {
          this.error = 'Error al cargar mascotas';
          this.cargando = false;
        }
      });
    }
  }

  ver(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/detalle', id]);
    }
  }

  editar(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/editar', id]);
    }
  }

  eliminar(id: number | undefined): void {
    if (id && confirm('¿Deseas eliminar esta mascota?')) {
      this.mascotaService.eliminarMascota(id).subscribe({
        next: () => {
          this.cargarMascotas();
        },
        error: () => {
          this.error = 'Error al eliminar mascota';
        }
      });
    }
  }

  crear(): void {
    this.router.navigate(['/crear']);
  }

  aplicarFiltro(): void {
    this.cargarMascotas();
  }

  limpiar(): void {
    this.busqueda = '';
    this.filtroEspecie = '';
    this.cargarMascotas();
  }

  get totalMascotas(): number {
    return this.mascotas.length;
  }
}

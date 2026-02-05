import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotaService } from '@services/mascota.service';
import { Mascota } from '@models/mascota.model';

@Component({
  selector: 'app-detalle-mascota',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-mascota.component.html',
  styleUrls: ['./detalle-mascota.component.css']
})
export class DetalleMascotaComponent implements OnInit {
  mascota: Mascota | null = null;
  cargando = false;
  error: string | null = null;

  constructor(
    private mascotaService: MascotaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.cargarMascota(params['id']);
      }
    });
  }

  cargarMascota(id: number): void {
    this.cargando = true;
    this.error = null;

    this.mascotaService.obtenerMascota(id).subscribe({
      next: (data) => {
        this.mascota = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Mascota no encontrada';
        this.cargando = false;
      }
    });
  }

  editar(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/editar', id]);
    }
  }

  volver(): void {
    this.router.navigate(['/']);
  }

  getColorEspecie(especie: string): string {
    const colores: { [key: string]: string } = {
      'Perro': 'bg-warning',
      'Gato': 'bg-info',
      'Conejo': 'bg-success',
      'Pájaro': 'bg-danger',
      'Pez': 'bg-primary',
      'Hámster': 'bg-secondary'
    };
    return colores[especie] || 'bg-dark';
  }
}

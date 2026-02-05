import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaService } from '@services/mascota.service';
import { PromedioEdad, EstadisticaEspecie } from '@models/mascota.model';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  promedioEdadGeneral: PromedioEdad | null = null;
  estadisticasEspecies: Map<string, PromedioEdad> = new Map();
  cargando = false;
  error: string | null = null;
  especies = ['Perro', 'Gato', 'Conejo', 'Pájaro', 'Pez'];

  constructor(private mascotaService: MascotaService) { }

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.cargando = true;
    this.error = null;

    this.mascotaService.obtenerPromedioEdad().subscribe({
      next: (data) => {
        this.promedioEdadGeneral = data;
      },
      error: () => {
        this.error = 'Error al cargar estadísticas generales';
      }
    });

    this.especies.forEach(especie => {
      this.mascotaService.obtenerPromedioEdadPorEspecie(especie).subscribe({
        next: (data) => {
          this.estadisticasEspecies.set(especie, data);
        },
        error: () => {
          console.warn(`Error al cargar estadísticas para ${especie}`);
        }
      });
    });

    setTimeout(() => {
      this.cargando = false;
    }, 1500);
  }

  obtenerEstadisticaEspecie(especie: string): PromedioEdad | undefined {
    return this.estadisticasEspecies.get(especie);
  }

  get tieneEstadisticas(): boolean {
    return this.estadisticasEspecies.size > 0;
  }
}

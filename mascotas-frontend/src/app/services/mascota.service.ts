import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mascota, PromedioEdad, EstadisticaEspecie } from '../models/mascota.model';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  // API URL - cambia según el entorno
  // Development: http://localhost:8080/api/mascotas
  // Production: https://mascotas-api.onrender.com/api/mascotas
  private apiUrl = 'http://localhost:8080/api/mascotas';

  constructor(private http: HttpClient) { }

  /**
   * Listar todas las mascotas
   */
  listarMascotas(): Observable<Mascota[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.map(m => this.mapMascota(m)))
    );
  }

  /**
   * Obtener mascota por ID
   */
  obtenerMascota(id: number): Observable<Mascota> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(m => this.mapMascota(m))
    );
  }

  private mapMascota(data: any): Mascota {
    return {
      id: data.id,
      nombre: data.nombre,
      especie: data.especie,
      edad: data.edad,
      dueno: data.dueno
    } as Mascota;
  }

  /**
   * Crear nueva mascota
   */
  crearMascota(mascota: Mascota): Observable<Mascota> {
    return this.http.post<any>(this.apiUrl, mascota).pipe(
      map(m => this.mapMascota(m))
    );
  }

  /**
   * Actualizar mascota
   */
  actualizarMascota(id: number, mascota: Mascota): Observable<Mascota> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, mascota).pipe(
      map(m => this.mapMascota(m))
    );
  }

  /**
   * Eliminar mascota
   */
  eliminarMascota(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Filtrar por especie
   */
  filtrarPorEspecie(especie: string): Observable<Mascota[]> {
    let params = new HttpParams().set('especie', especie);
    return this.http.get<Mascota[]>(this.apiUrl, { params });
  }

  /**
   * Buscar por nombre
   */
  buscarPorNombre(nombre: string): Observable<Mascota[]> {
    let params = new HttpParams().set('nombre', nombre);
    return this.http.get<Mascota[]>(this.apiUrl, { params });
  }

  /**
   * Obtener promedio de edad general
   */
  obtenerPromedioEdad(): Observable<PromedioEdad> {
    return this.http.get<PromedioEdad>(`${this.apiUrl}/estadisticas/promedio-edad`);
  }

  /**
   * Obtener promedio de edad por especie
   */
  obtenerPromedioEdadPorEspecie(especie: string): Observable<PromedioEdad> {
    let params = new HttpParams().set('especie', especie);
    return this.http.get<PromedioEdad>(`${this.apiUrl}/estadisticas/promedio-edad-especie`, { params });
  }

  /**
   * Obtener conteo por especie
   */
  contarPorEspecie(especie: string): Observable<EstadisticaEspecie> {
    let params = new HttpParams().set('especie', especie);
    return this.http.get<EstadisticaEspecie>(`${this.apiUrl}/estadisticas/contar`, { params });
  }

  /**
   * Health check
   */
  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }
}

export interface Mascota {
  id?: number;
  nombre: string;
  especie: string;
  edad: number;
  dueno: string;
}

export interface PromedioEdad {
  promedio: number;
  message: string;
}

export interface EstadisticaEspecie {
  especie: string;
  cantidad: number;
}

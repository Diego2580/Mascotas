import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, interval } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

export interface HealthStatus {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

export interface SystemMetrics {
  memory: {
    total_mb: number;
    used_mb: number;
    free_mb: number;
    usage_percent: number;
  };
  cpu_percent: string;
  uptime_seconds: number;
  threads: {
    active: number;
    peak: number;
  };
  timestamp: string;
}

export interface ApplicationMetrics {
  http: {
    total_requests: number;
    avg_response_time_ms: number;
  };
  jvm: {
    classes_loaded: number;
  };
  timestamp: string;
}

export interface ServiceStatus {
  service_name: string;
  status: string;
  database: {
    status: string;
    type: string;
  };
  endpoints: {
    mascotas: string;
    monitoring: string;
    health: string;
  };
  resource_usage: {
    memory_percent: number;
    cpu_percent: string;
  };
  timestamp: string;
}

export interface ApiInfo {
  name: string;
  version: string;
  description: string;
  author: string;
  build_date: string;
  available_endpoints: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {

  private readonly baseUrl = 'https://mascotas-api.onrender.com/api/monitoring';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el estado de salud del servicio
   */
  getHealth(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>(`${this.baseUrl}/health`)
      .pipe(
        catchError(() => of({
          status: 'DOWN',
          timestamp: new Date().toISOString(),
          service: 'Mascotas API',
          version: '1.0.0'
        } as HealthStatus))
      );
  }

  /**
   * Obtiene las métricas del sistema
   */
  getSystemMetrics(): Observable<SystemMetrics> {
    return this.http.get<SystemMetrics>(`${this.baseUrl}/metrics/system`)
      .pipe(
        catchError(() => of({
          memory: { total_mb: 0, used_mb: 0, free_mb: 0, usage_percent: 0 },
          cpu_percent: '0.00',
          uptime_seconds: 0,
          threads: { active: 0, peak: 0 },
          timestamp: new Date().toISOString()
        } as SystemMetrics))
      );
  }

  /**
   * Obtiene las métricas de la aplicación
   */
  getApplicationMetrics(): Observable<ApplicationMetrics> {
    return this.http.get<ApplicationMetrics>(`${this.baseUrl}/metrics/application`)
      .pipe(
        catchError(() => of({
          http: { total_requests: 0, avg_response_time_ms: 0 },
          jvm: { classes_loaded: 0 },
          timestamp: new Date().toISOString()
        } as ApplicationMetrics))
      );
  }

  /**
   * Obtiene el estado completo del servicio
   */
  getServiceStatus(): Observable<ServiceStatus> {
    return this.http.get<ServiceStatus>(`${this.baseUrl}/status`)
      .pipe(
        catchError(() => of({
          service_name: 'Mascotas API',
          status: 'DOWN',
          database: { status: 'DISCONNECTED', type: 'PostgreSQL' },
          endpoints: { mascotas: 'UNAVAILABLE', monitoring: 'UNAVAILABLE', health: 'UNAVAILABLE' },
          resource_usage: { memory_percent: 0, cpu_percent: '0.00' },
          timestamp: new Date().toISOString()
        } as ServiceStatus))
      );
  }

  /**
   * Obtiene información de la aplicación
   */
  getInfo(): Observable<ApiInfo> {
    return this.http.get<ApiInfo>(`${this.baseUrl}/info`)
      .pipe(
        catchError(() => of({
          name: 'Mascotas Management System',
          version: '1.0.0',
          description: 'Sistema de gestión de mascotas',
          author: 'Diego Salamea',
          build_date: new Date().toISOString(),
          available_endpoints: {}
        } as ApiInfo))
      );
  }

  /**
   * Obtiene estado de salud con polling automático cada N segundos
   */
  getHealthPolling(intervalSeconds: number = 5): Observable<HealthStatus> {
    return interval(intervalSeconds * 1000).pipe(
      switchMap(() => this.getHealth())
    );
  }

  /**
   * Obtiene métricas del sistema con polling automático
   */
  getSystemMetricsPolling(intervalSeconds: number = 10): Observable<SystemMetrics> {
    return interval(intervalSeconds * 1000).pipe(
      switchMap(() => this.getSystemMetrics())
    );
  }

  /**
   * Verifica disponibilidad del API
   */
  checkAvailability(): Observable<boolean> {
    return this.getHealth().pipe(
      map(health => health.status === 'UP'),
      catchError(() => of(false))
    );
  }

  /**
   * Obtiene métricas principales para dashboard
   */
  getDashboardMetrics(): Observable<any> {
    return this.http.get<any>('https://mascotas-api.onrender.com/api/actuator/metrics').pipe(
      catchError(() => of({ names: [] }))
    );
  }

  /**
   * Obtiene detalles de una métrica específica
   */
  getMetricDetail(metricName: string): Observable<any> {
    return this.http.get<any>(`https://mascotas-api.onrender.com/api/actuator/metrics/${metricName}`).pipe(
      catchError(() => of(null))
    );
  }
}

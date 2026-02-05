import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitoringService, HealthStatus, SystemMetrics, ServiceStatus } from '../services/monitoring.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-health-monitoring',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="monitoring-container">
      <h1>📊 Monitoreo del Sistema</h1>

      <!-- Status General -->
      <div class="status-card">
        <h2>Estado del Servicio</h2>
        <div [ngClass]="'status-badge ' + (serviceStatus?.status === 'HEALTHY' ? 'healthy' : 'unhealthy')">
          {{ serviceStatus?.status || 'CARGANDO...' }}
        </div>
        <p class="timestamp">{{ serviceStatus?.timestamp }}</p>
      </div>

      <!-- Health Check -->
      <div class="health-check-card">
        <h2>Health Check</h2>
        <div class="health-grid">
          <div class="health-item">
            <strong>API Status:</strong>
            <span [ngClass]="'indicator ' + (health?.status === 'UP' ? 'up' : 'down')">
              {{ health?.status || '🔄' }}
            </span>
          </div>
          <div class="health-item">
            <strong>Servicio:</strong>
            <span>{{ health?.service }}</span>
          </div>
          <div class="health-item">
            <strong>Versión:</strong>
            <span>{{ health?.version }}</span>
          </div>
        </div>
      </div>

      <!-- System Metrics -->
      <div class="metrics-card">
        <h2>Métricas del Sistema</h2>
        
        <div class="metric-grid">
          <!-- Memory -->
          <div class="metric-item">
            <h3>Memoria</h3>
            <div class="metric-content">
              <div class="metric-bar">
                <div class="metric-fill" [style.width.%]="(systemMetrics?.memory?.usage_percent || 0)">
                  {{ (systemMetrics?.memory?.usage_percent || 0).toFixed(1) }}%
                </div>
              </div>
              <p class="metric-details">
                {{ (systemMetrics?.memory?.used_mb || 0) }}MB / {{ (systemMetrics?.memory?.total_mb || 0) }}MB
              </p>
            </div>
          </div>

          <!-- CPU -->
          <div class="metric-item">
            <h3>CPU</h3>
            <div class="metric-content">
              <div class="metric-value">{{ systemMetrics?.cpu_percent }}</div>
              <p class="metric-label">Uso actual</p>
            </div>
          </div>

          <!-- Uptime -->
          <div class="metric-item">
            <h3>Tiempo Activo</h3>
            <div class="metric-content">
              <div class="metric-value">{{ formatUptime(systemMetrics?.uptime_seconds) }}</div>
              <p class="metric-label">Desde inicio</p>
            </div>
          </div>

          <!-- Threads -->
          <div class="metric-item">
            <h3>Threads</h3>
            <div class="metric-content">
              <div class="metric-value">{{ (systemMetrics?.threads?.active || 0) }} activos</div>
              <p class="metric-label">Pico: {{ (systemMetrics?.threads?.peak || 0) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Service Status -->
      <div class="service-status-card">
        <h2>Disponibilidad de Servicios</h2>
        <div class="endpoints-grid">
          <div class="endpoint-item" *ngFor="let endpoint of getEndpoints()">
            <span class="endpoint-name">{{ endpoint.name }}</span>
            <span [ngClass]="'endpoint-status ' + (endpoint.available ? 'available' : 'unavailable')">
              {{ endpoint.available ? '✓' : '✗' }}
            </span>
          </div>
        </div>

        <!-- Database Status -->
        <div class="database-status">
          <h3>Base de Datos</h3>
          <div class="status-row">
            <span>Tipo:</span>
            <strong>{{ serviceStatus?.database?.type || 'N/A' }}</strong>
          </div>
          <div class="status-row">
            <span>Estado:</span>
            <span [ngClass]="'status-indicator ' + ((serviceStatus?.database?.status === 'CONNECTED') ? 'connected' : 'disconnected')">
              {{ serviceStatus?.database?.status || 'N/A' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Resource Usage -->
      <div class="resources-card">
        <h2>Uso de Recursos</h2>
        <div class="resource-grid">
          <div class="resource-item">
            <h3>Memoria JVM</h3>
            <div class="resource-bar">
              <div class="resource-fill" [style.width.%]="(serviceStatus?.resource_usage?.memory_percent || 0)">
                {{ (serviceStatus?.resource_usage?.memory_percent || 0) }}%
              </div>
            </div>
          </div>
          <div class="resource-item">
            <h3>CPU</h3>
            <div class="resource-value">{{ serviceStatus?.resource_usage?.cpu_percent || 'N/A' }}</div>
          </div>
        </div>
      </div>

      <!-- Auto Refresh Info -->
      <div class="footer">
        <p>🔄 Se actualiza automáticamente cada 5 segundos</p>
        <p class="last-update">Última actualización: {{ lastUpdate }}</p>
      </div>
    </div>
  `,
  styles: [`
    .monitoring-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    h1 {
      color: #333;
      border-bottom: 3px solid #007bff;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }

    .status-card, .health-check-card, .metrics-card, .service-status-card, .resources-card {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
      color: #495057;
      margin-top: 0;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
    }

    h3 {
      color: #6c757d;
      margin: 0 0 10px 0;
    }

    .status-badge {
      display: inline-block;
      padding: 10px 20px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 18px;
      margin: 10px 0;
    }

    .status-badge.healthy {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .status-badge.unhealthy {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .timestamp {
      color: #6c757d;
      font-size: 12px;
      margin: 10px 0 0 0;
    }

    .health-grid, .metric-grid, .endpoints-grid, .resource-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }

    .health-item, .metric-item, .endpoint-item, .resource-item {
      background: white;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid #dee2e6;
    }

    .health-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .indicator {
      font-weight: bold;
      padding: 5px 10px;
      border-radius: 4px;
    }

    .indicator.up {
      background-color: #d4edda;
      color: #155724;
    }

    .indicator.down {
      background-color: #f8d7da;
      color: #721c24;
    }

    .metric-bar {
      background: #e9ecef;
      border-radius: 4px;
      height: 20px;
      overflow: hidden;
      margin: 10px 0;
    }

    .metric-fill {
      background: linear-gradient(90deg, #28a745, #ffc107, #dc3545);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: bold;
      transition: width 0.3s ease;
    }

    .metric-details {
      font-size: 12px;
      color: #6c757d;
      margin: 5px 0 0 0;
    }

    .metric-content {
      text-align: center;
    }

    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
      margin: 10px 0;
    }

    .metric-label {
      color: #6c757d;
      font-size: 12px;
      margin: 5px 0 0 0;
    }

    .endpoint-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .endpoint-name {
      font-weight: 500;
      color: #495057;
    }

    .endpoint-status {
      font-weight: bold;
      font-size: 18px;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .endpoint-status.available {
      color: #28a745;
    }

    .endpoint-status.unavailable {
      color: #dc3545;
    }

    .database-status {
      background: white;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid #dee2e6;
      margin-top: 15px;
    }

    .database-status h3 {
      margin-top: 0;
    }

    .status-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #dee2e6;
    }

    .status-row:last-child {
      border-bottom: none;
    }

    .status-indicator {
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .status-indicator.connected {
      background-color: #d4edda;
      color: #155724;
    }

    .status-indicator.disconnected {
      background-color: #f8d7da;
      color: #721c24;
    }

    .resource-bar {
      background: #e9ecef;
      border-radius: 4px;
      height: 25px;
      overflow: hidden;
      margin-top: 10px;
    }

    .resource-fill {
      background: linear-gradient(90deg, #17a2b8, #28a745);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 12px;
      transition: width 0.3s ease;
    }

    .resource-value {
      font-size: 20px;
      font-weight: bold;
      color: #007bff;
      margin-top: 10px;
    }

    .footer {
      text-align: center;
      color: #6c757d;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #dee2e6;
    }

    .last-update {
      font-size: 12px;
      margin-top: 5px;
    }

    @media (max-width: 768px) {
      .monitoring-container {
        padding: 10px;
      }

      .health-grid, .metric-grid, .endpoints-grid, .resource-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HealthMonitoringComponent implements OnInit, OnDestroy {

  health: HealthStatus | null = null;
  systemMetrics: SystemMetrics | null = null;
  serviceStatus: ServiceStatus | null = null;
  lastUpdate: string = '';

  private destroy$ = new Subject<void>();

  constructor(private monitoringService: MonitoringService) { }

  ngOnInit(): void {
    // Polling inicial para health
    this.monitoringService.getHealthPolling(5)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.health = data;
        this.lastUpdate = new Date().toLocaleTimeString();
      });

    // Polling para métricas del sistema
    this.monitoringService.getSystemMetricsPolling(10)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.systemMetrics = data;
      });

    // Polling para estado del servicio
    this.monitoringService.getServiceStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.serviceStatus = data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getEndpoints() {
    if (!this.serviceStatus) return [];
    return [
      { name: 'Mascotas API', available: this.serviceStatus.endpoints.mascotas === 'AVAILABLE' },
      { name: 'Monitoreo', available: this.serviceStatus.endpoints.monitoring === 'AVAILABLE' },
      { name: 'Health Check', available: this.serviceStatus.endpoints.health === 'AVAILABLE' }
    ];
  }

  formatUptime(seconds: number | undefined): string {
    if (!seconds) return '0s';
    
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0) parts.push(`${secs}s`);

    return parts.join(' ') || '0s';
  }
}

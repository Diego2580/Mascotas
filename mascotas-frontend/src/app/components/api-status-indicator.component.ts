import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitoringService } from '../services/monitoring.service';
import { Subject,interval } from 'rxjs';
import { takeUntil, switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-api-status-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="api-status-bar">
      <div class="status-container">
        <div [ngClass]="'status-dot ' + (isAvailable ? 'available' : 'unavailable')"></div>
        <div class="status-info">
          <span class="status-label">API Status:</span>
          <span [ngClass]="'status-text ' + (isAvailable ? 'up' : 'down')">
            {{ isAvailable ? 'DISPONIBLE' : 'NO DISPONIBLE' }}
          </span>
        </div>
      </div>
      <div class="status-details">
        <span *ngIf="isAvailable" class="response-time">
          ⚡ {{ responseTime }}ms
        </span>
        <span *ngIf="!isAvailable" class="error-message">
          ⚠️ El servidor no responde
        </span>
      </div>
    </div>
  `,
  styles: [`
    .api-status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      font-size: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      margin-bottom: 15px;
    }

    .status-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .status-dot.available {
      background-color: #28a745;
      box-shadow: 0 0 10px rgba(40, 167, 69, 0.8);
    }

    .status-dot.unavailable {
      background-color: #dc3545;
      box-shadow: 0 0 10px rgba(220, 53, 69, 0.8);
      animation: none;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .status-info {
      display: flex;
      gap: 8px;
      flex-direction: column;
    }

    .status-label {
      font-size: 10px;
      opacity: 0.85;
      text-transform: uppercase;
    }

    .status-text {
      font-weight: bold;
      font-size: 13px;
    }

    .status-text.up {
      color: #28a745;
    }

    .status-text.down {
      color: #dc3545;
    }

    .status-details {
      font-size: 11px;
      font-weight: 500;
      opacity: 0.9;
    }

    .response-time {
      color: #d4edda;
    }

    .error-message {
      color: #f8d7da;
    }

    @media (max-width: 600px) {
      .api-status-bar {
        flex-direction: column;
        gap: 8px;
      }

      .status-info {
        flex-direction: row;
      }
    }
  `]
})
export class ApiStatusIndicatorComponent implements OnInit, OnDestroy {

  isAvailable: boolean = false;
  responseTime: number = 0;
  private destroy$ = new Subject<void>();

  constructor(private monitoringService: MonitoringService) { }

  ngOnInit(): void {
    // Polling cada 5 segundos
    interval(5000).pipe(
      startWith(0),
      switchMap(() => this.monitoringService.checkAvailability()),
      takeUntil(this.destroy$)
    ).subscribe(available => {
      this.isAvailable = available;
      if (available) {
        const start = performance.now();
        this.monitoringService.getHealth().subscribe(() => {
          this.responseTime = Math.round(performance.now() - start);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

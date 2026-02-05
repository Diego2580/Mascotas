import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ApiStatusIndicatorComponent } from './components/api-status-indicator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ApiStatusIndicatorComponent],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/">
          <i class="bi bi-paw"></i> Gestión de Mascotas
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                <i class="bi bi-house"></i> Inicio
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/crear">
                <i class="bi bi-plus-circle"></i> Agregar Mascota
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/estadisticas">
                <i class="bi bi-graph-up"></i> Estadísticas
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/monitoreo">
                <i class="bi bi-speedometer2"></i> Monitoreo
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main>
      <div class="container mt-3">
        <app-api-status-indicator></app-api-status-indicator>
      </div>
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-dark text-white text-center py-4 mt-5">
      <p class="mb-0">&copy; 2024 Sistema de Gestión de Mascotas - Diego Fabricio Salamea Morales</p>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    nav {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    main {
      flex: 1;
      padding: 20px 0;
    }

    .navbar-brand {
      font-size: 1.5rem;
      font-weight: bold;
    }

    footer {
      margin-top: auto;
      border-top: 1px solid #444;
    }
  `]
})
export class AppComponent {
  title = 'mascotas-frontend';
}

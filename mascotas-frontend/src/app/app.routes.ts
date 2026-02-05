import { Routes } from '@angular/router';
import { ListaMascotasComponent } from './components/lista-mascotas.component';
import { FormularioMascotaComponent } from './components/formulario-mascota.component';
import { DetalleMascotaComponent } from './components/detalle-mascota.component';
import { EstadisticasComponent } from './components/estadisticas.component';
import { HealthMonitoringComponent } from './components/health-monitoring.component';

export const routes: Routes = [
  { path: '', component: ListaMascotasComponent },
  { path: 'crear', component: FormularioMascotaComponent },
  { path: 'editar/:id', component: FormularioMascotaComponent },
  { path: 'detalle/:id', component: DetalleMascotaComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: 'monitoreo', component: HealthMonitoringComponent },
  { path: '**', redirectTo: '' }
];

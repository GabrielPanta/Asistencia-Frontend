import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ListaAsistenciasComponent } from './components/asistencias/lista-asistencias.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'asistencias', component: ListaAsistenciasComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'asistencias', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }




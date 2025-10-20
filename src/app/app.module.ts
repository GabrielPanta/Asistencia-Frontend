import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// 👇 AGREGA TUS COMPONENTES
import { LoginComponent } from './components/login/login.component';
import { ListaAsistenciasComponent } from './components/asistencias/lista-asistencias.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,            // 👈 Agregado
    ListaAsistenciasComponent  // 👈 Agregado
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
  <div class="container mt-5">
    <h3>Login</h3>
    <form (ngSubmit)="doLogin()">
      <input class="form-control mb-2" [(ngModel)]="username" name="username" placeholder="usuario" required>
      <input class="form-control mb-2" [(ngModel)]="password" name="password" placeholder="contraseña" type="password" required>
      <button class="btn btn-primary" type="submit">Entrar</button>
    </form>
  </div>`
})
export class LoginComponent {
  username = '';
  password = '';
  constructor(private auth: AuthService, private router: Router) {}

  doLogin() {
    this.auth.login(this.username, this.password).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/asistencias']);
      },
      error: err => alert('Credenciales incorrectas')
    });
  }
}

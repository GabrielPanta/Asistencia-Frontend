import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.loading = true;
    this.errorMessage = '';

    this.auth.login(this.username, this.password).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token);
        this.loading = false;
        this.router.navigate(['/asistencias']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Usuario o contraseña incorrectos';
        console.error(err);
      }
    });
  }
}


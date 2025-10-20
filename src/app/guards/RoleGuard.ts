import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn:'root'})
export class RoleGuard  {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(roles: string[]): boolean {
    const role = this.auth.getRole();
    if (role && roles.includes(role)) return true;
    this.router.navigate(['/no-permission']);
    return false;
  }
}

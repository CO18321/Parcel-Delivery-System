import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class VerificationStatusGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService){}
  canActivate(): boolean
  {if (this.auth.verified()){
    return true
  }
  else{
    this.router.navigate(['/verification'])
    return false
  }
  }
  
}

import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
 
  constructor(private router: Router, private _auth: AuthService){}

  canActivate(): boolean{
    if(this._auth.loggedIn()){
      return true
    }
    // this.router.navigate(['./login'])
    this._auth.logOut()
    return false
  }
}

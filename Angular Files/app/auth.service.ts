import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  loggedIn(){
    return !!localStorage.getItem("token")
  }
  logOut(){
    localStorage.removeItem("token")
    localStorage.removeItem("verification_status")
    this.router.navigate(["/login"])
    
  }
  verified(){
    let status = localStorage.getItem("verification_status")
    // console.log(status)
    if (status==null){
      return false
    }
    else{
      return status==='true'
    }
  }
}

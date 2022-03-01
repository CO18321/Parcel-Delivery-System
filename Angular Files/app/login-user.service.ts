import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginUserService {

  private loginURL = "http://localhost:5000/api/login"
  constructor(private http: HttpClient) {
   }

   loginUserCheckDatabase(user: any){
    console.log(user)

    return this.http.post<any>(this.loginURL,user);
   }
}

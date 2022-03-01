import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  private registerURL = "http://localhost:5000/api/register"
  private getPhoneURL = "http://localhost:5000/api/getPhone"
  constructor(private http: HttpClient) {
   }

   registerUserInDatabase(user: any){
    // console.log(user)

    return this.http.post<any>(this.registerURL,user);
   }

    getRegisteredPhoneNumber(){
    // console.log(user)
    return this.http.get<any>(this.getPhoneURL);
   }
}

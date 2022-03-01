import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class GetUserDataService {

  constructor(private http: HttpClient, private router: Router) { }

  private getUserProfileURL = "http://localhost:5000/api/getUserData"
  private updateUserProfileURL = "http://localhost:5000/api/updateProfile"

  getUserProfile(){
    return this.http.get<any>(this.getUserProfileURL)
}
  updateProfile(values:any){
    return this.http.post(this.updateUserProfileURL, values, {responseType:"text"})
}
}



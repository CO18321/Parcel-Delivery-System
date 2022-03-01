import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VerifyOTPService {

  private verifyOTPURL = "http://localhost:5000/api/verifyOTP"
  private resendOTPURL = "http://localhost:5000/api/resendOTP"

  constructor(private http: HttpClient) { }

  verifyOTP(data:any){
    return this.http.post(this.verifyOTPURL, data, {responseType:"text"})
  }
  resendOTP(){
    return this.http.put(this.resendOTPURL,{},{responseType:"text"})
  }
}

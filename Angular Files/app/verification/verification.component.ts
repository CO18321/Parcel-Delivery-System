import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterUserService } from '../register-user.service';
import { VerifyOTPService } from '../verify-otp.service';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  constructor( 
    private router: Router, 
    private _register: RegisterUserService, 
    private _verify: VerifyOTPService,
    private auth: AuthService
    ) { }

  verifyPhone = ""
  OTP = ""
  error_msg = ""
  success_msg = ""
  ngOnInit(): void {
    this._register.getRegisteredPhoneNumber()
        .subscribe({
          next: (res) => {
            // console.log(res)
            this.verifyPhone = res.phone
          },
          error: (err) => {
            if (err.status==409){
              this.router.navigate(['/profile'])
            }
            else{
              // this.router.navigate(['/login'])
              this.auth.logOut()
            }
            
          }
        })

  }

  verifyOTP(){
    this.success_msg=""
    this.error_msg= ""
    this._verify.verifyOTP({otp: this.OTP})
      .subscribe({
        next: (res)=>{
          localStorage.setItem("verification_status", "true")
          console.log(res)
          this.router.navigate(['/profile'])
          this.error_msg = ""
        },
        error: (err)=>{
          // console.log(err)
          this.OTP=""
          if (err.status == 401 || err.status == 500){
            this.error_msg = err.error
          }
          else{
            // this.router.navigate(['/login'])
          }
        }
      })
  }
  resendOTP(){
    this.OTP=""
    this.error_msg = ""
    this.success_msg=""
    this._verify.resendOTP()
    .subscribe({
      next: (res)=>{
        // console.log(res)
        this.success_msg = "OTP has been Resent"
      },
      error: (err)=>{
        if (err.status == 400 || err.status == 500){
          this.error_msg = err.error
        }
        else{
          // this.router.navigate(['/login'])
          this.auth.logOut()
        }
      }
    })
  }
}

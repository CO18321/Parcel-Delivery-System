import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { LoginUserService } from '../login-user.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // loginForm: FormGroup
  constructor(
    private fb: FormBuilder, 
    private _login: LoginUserService, 
    private router: Router,
    private auth: AuthService

    ) { }

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })
  
  dbError = false
  dbErrorMsg = ""

  ngOnInit(): void {
  }
  
  get email(){
    return this.loginForm.get('email')
  }

  get password(){
    return this.loginForm.get('password')
  }


  loginUser(){
    // console.log(this.loginForm.value)
    this._login.loginUserCheckDatabase(this.loginForm.value)
                .subscribe({
                  next: (res) => {
                    this.dbError = false
                    this.dbErrorMsg = ""
                    console.log(res)
                    localStorage.setItem("token", res.token)
                    localStorage.setItem("verification_status", res.verification_status)
                    if (res.verification_status==false){
                      this.router.navigate(['/verification']);
                    }
                    else{this.router.navigate(['/profile']);}
                   
                  },
                  error: (err) =>{
                    if (err.status==500 || err.status==401 || err.status==403 ){
                      this.dbError = true
                      this.dbErrorMsg = err.error
                    
                    }
                    else{
                      this.auth.logOut()
                      // this.router.navigate(['/login'])
                    }
                  }
                })
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RegisterUserService } from '../register-user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder, private _register: RegisterUserService, private router: Router) { }

  registrationForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(5)]],
    phone: ['',[Validators.required, Validators.pattern('^[0-9]{10}$')]]
  })

  dbError = false
  dbErrorMsg = ""

  ngOnInit(): void {
  }

  get email(){
    return this.registrationForm.get('email')
  }

  get password(){
    return this.registrationForm.get('password')
  }

  get phone(){
    return this.registrationForm.get('phone')
  }

  registerUser(){
    // console.log(this.registrationForm.value)
    this._register.registerUserInDatabase(this.registrationForm.value)
        .subscribe({
          next: (res) => {
            this.dbError = false
            this.dbErrorMsg = ""
            // console.log(res);
            localStorage.setItem("token", res.token)
            this.router.navigate(['/verification']);
          
          },
            
          error: (err) => {
              this.dbError = true
              this.dbErrorMsg = err.error
          }
        })
  }

}

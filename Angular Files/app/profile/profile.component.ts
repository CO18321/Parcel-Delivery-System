import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { GetUserDataService } from '../get-user-data.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
              private fb: FormBuilder, 
              private _getUserData: GetUserDataService,
              private router: Router,
              private auth: AuthService
              ) { }


    
  updateProfileForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    state: ['', Validators.required],
    city: ['', Validators.required],
    zip: ['', Validators.required],
    country: ['', Validators.required],
  })

  dbError = ""
  successMessage = ""

  ngOnInit(): void {
    // this.updateProfileForm.get('email').disable();
    this._getUserData.getUserProfile()
        .subscribe({
          next: (res) => {
            // console.log(res)
            this.dbError=""
            console.log("res", res)
            this.updateProfileForm.patchValue(res)   
          },
          error: (err) =>{
            if (err.status == 500){
                this.dbError = err.error
            }else{
              // this.router.navigate(['/login'])
              this.auth.logOut()
            }
          }
        })
    this.updateProfileForm.get("email")?.disable()
  }

  updateProfile(){
    // console.log(this.updateProfileForm)
    this.successMessage = ""
    this._getUserData.updateProfile(this.updateProfileForm.value)
        .subscribe({
          next: (res)=>{
            this.dbError=""
            this.successMessage = "Your Profile has been Updated"
          },
          error: (err)=>{
            if (err.status == 500){
              this.dbError = err.error
              
            }
            else{
              // this.router.navigate(['/login'])
              this.auth.logOut()
            }
          }

        })
  }

  
  get name(){
    return this.updateProfileForm.get('name')
  }
  get country(){
    return this.updateProfileForm.get('country')
  }
  get city(){
    return this.updateProfileForm.get('city')
  }
  get zip(){
    return this.updateProfileForm.get('zip')
  }
  get state(){
    return this.updateProfileForm.get('state')
  }
}

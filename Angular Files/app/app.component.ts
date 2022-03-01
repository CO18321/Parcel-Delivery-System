import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private auth: AuthService, private http: HttpClient){}
  title = 'PDS';
   
  ngOnInit(){
    if (this.loggedIn()){
      let authorizeToken = "http://localhost:5000/api/authorizeToken"
      this.http.get(authorizeToken, {responseType:"text"})
          .subscribe({
            error: (err) =>{ this.logOut()}
          })
    }
  }


  loggedIn(){
    // console.log(localStorage.getItem("verification_status"))
    return this.auth.loggedIn()
    // localStorage.getItem("verification_status")? localStorage.getItem("verification_status"): false)
  }

  verified(){
    return this.auth.verified()
  }
  logOut(){
    return this.auth.logOut()
  }
}

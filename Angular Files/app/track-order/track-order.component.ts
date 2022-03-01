import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.css']
})
export class TrackOrderComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthService
  ) { }

  private trackOrderURL = "http://localhost:5000/api/trackOrder"
  
  status = ""
  orderID:any = ""

  ngOnInit(): void {
    this.orderID = this.route.snapshot.paramMap.get('orderID');
    console.log(this.orderID)
    this.http.post<any>(this.trackOrderURL,{orderID: this.orderID})
        .subscribe({
          next: (res)=>{
            this.status = res.status
          },
          error: (err)=>{
            if (err.status==500 || err.status==404){
              this.router.navigate(['./myOrders'])
            }
            else{
              // this.router.navigate(['./logout'])
              this.auth.logOut()
            }
          }
          
        })
  }

}

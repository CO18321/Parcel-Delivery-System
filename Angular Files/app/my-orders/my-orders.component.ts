import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetMyOrdersService } from '../get-my-orders.service';
import { AuthService } from '../auth.service';
// import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  constructor(
    private _myOrder: GetMyOrdersService, 
    private router: Router,
    private auth: AuthService
    // private http: HttpClient
    ) { }

  myOrderHistory:any = []
  ngOnInit(): void {
    this._myOrder.getMyOrders()
        .subscribe({
          next: (res) =>{ console.log(res); 
            this.myOrderHistory = res},
          error: (err) => {
            if (err instanceof HttpErrorResponse){
              if (err.status==401){
                  // this.router.navigate(['/login'])
                  this.auth.logOut()
              }
            }
          }
        })
  }

  trackOrder(order:any){
    // console.log(order)
    this.router.navigate([`/trackOrder/${order.orderID}`])
  }

}

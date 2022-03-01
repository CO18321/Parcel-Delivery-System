import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlaceOrderService {

  constructor(private http: HttpClient) { }

  private newOrderURL = "http://localhost:5000/api/newOrder"
  private getOrderCostURL = "http://localhost:5000/api/getOrderCost"
  newOrder(orderDetails:any){
    return this.http.post(this.newOrderURL, orderDetails, {responseType:"text"})
  }

  getOrderCost(orderDetails:any){
    return this.http.post<any>(this.getOrderCostURL, orderDetails)
  }
}

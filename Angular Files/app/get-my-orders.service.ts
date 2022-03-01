import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetMyOrdersService {

  constructor(private http: HttpClient) { }

  private myOrdersURL = "http://localhost:5000/api/myOrders"
  getMyOrders(){
    return this.http.get(this.myOrdersURL)
  }
}

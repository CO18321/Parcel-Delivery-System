import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
 } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("hello Ganga")
      let tokenizedRequest = req.clone({
        setHeaders:{
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      return next.handle(tokenizedRequest)
  }
}

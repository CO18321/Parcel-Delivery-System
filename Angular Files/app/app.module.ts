import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerificationComponent } from './verification/verification.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { ReactiveFormsModule} from '@angular/forms';

import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { RegisterUserService } from './register-user.service';
import { LoginUserService } from './login-user.service';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { GetMyOrdersService } from './get-my-orders.service';
import { ProfileComponent } from './profile/profile.component';
import { AuthenticationGuard } from './authentication.guard';
import { TokenInterceptorService } from './token-interceptor.service';
import { VerifyOTPService } from './verify-otp.service';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { VerificationStatusGuard } from './verification-status.guard';
import { PlaceOrderService } from './place-order.service';
import { TrackOrderComponent } from './track-order/track-order.component';
import { ConfirmOrderComponent } from './confirm-order/confirm-order.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatDialogModule} from '@angular/material/dialog';
// import { ConfirmOrderComponent } from './confirm-order/confirm-order.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    VerificationComponent,
    NotFoundComponent,
    MyOrdersComponent,
    ProfileComponent,
    PlaceOrderComponent,
    TrackOrderComponent,
    ConfirmOrderComponent,
  ],
  entryComponents:[ConfirmOrderComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule

  ],
  providers: [RegisterUserService, LoginUserService, GetMyOrdersService, 
              AuthenticationGuard, VerifyOTPService, VerificationStatusGuard ,
              PlaceOrderService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

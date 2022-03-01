import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './authentication.guard';
import { LoginComponent } from './login/login.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
import { VerificationComponent } from './verification/verification.component';
import { ProfileComponent } from './profile/profile.component';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { VerificationStatusGuard } from './verification-status.guard';
import { TrackOrderComponent } from './track-order/track-order.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full"
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "myOrders",
    component: MyOrdersComponent,
    canActivate: [AuthenticationGuard, VerificationStatusGuard ]
  },
  {
    path: "placeOrder",
    component: PlaceOrderComponent,
    canActivate: [AuthenticationGuard, VerificationStatusGuard ]
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthenticationGuard, VerificationStatusGuard ]
  },
  {
    path: "trackOrder/:orderID",
    component: TrackOrderComponent,
    canActivate: [AuthenticationGuard, VerificationStatusGuard ]
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "verification",
    component: VerificationComponent,
    canActivate: [AuthenticationGuard]

  },
  {
    path: "**",
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { PlaceOrderService } from '../place-order.service';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmOrderComponent } from '../confirm-order/confirm-order.component';
// import {DialogExampleComponent} from './dialog-example/'


@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private _order: PlaceOrderService,
    private auth: AuthService,
    private dialog: MatDialog
  ) { }
  private regex: RegExp = new RegExp(/^(?!0\d)\d*(\.\d+)?$/);
  newOrderForm = this.fb.group({
    pickupAddress: ['', Validators.required],
    deliveryAddress: ['', Validators.required],
    weight: ['', [Validators.required, Validators.pattern(this.regex)]],
    length: ['',  [Validators.required, Validators.pattern(this.regex)] ],
    width: ['',  [Validators.required, Validators.pattern(this.regex)] ],
    height: ['',  [Validators.required, Validators.pattern(this.regex)]],
    ///[0-9]{2}\.[0-9]{2}$/
    alternatePhone: ['', Validators.pattern('^[0-9]{10}$')],
    coupon: ['']
  })

  

  dbError = ""
  successMessage = ""
  coupons = ["SAVE50", "GRATEFUL50"]
  couponError = false
  imageError = ''
  imageURL = ''
  selectedFile = null
  cost = ""
 
  ngOnInit(): void {
    this.newOrderForm.get('coupon')?.valueChanges
        .subscribe({
          next: (res) =>{ this.couponError = false}
        })
    
  } 

  placeOrder(){
    this.dbError=""
    this.successMessage=""

    if (this.newOrderForm.value['coupon']!=''){
      let couponMatch = this.coupons.indexOf(this.newOrderForm.value['coupon'].toUpperCase())
      if(couponMatch==-1){
        this.couponError = true
        return
    }
    }
    
    if (this.imageURL==''){
      this.imageError ="Image is Required"
      return
    }
    this.couponError = false
    this.imageError = ''
    // console.log(String(Number(this.newOrderForm.value['weight']).toFixed(2)))
    this.newOrderForm.patchValue({
      "weight": String(Number(this.newOrderForm.value['weight']).toFixed(2)),
      "height": String(Number(this.newOrderForm.value['height']).toFixed(2)),
      "width": String(Number(this.newOrderForm.value['width']).toFixed(2)),
      "length": String(Number(this.newOrderForm.value['length']).toFixed(2)),
    })
    // console.log(this.newOrderForm.value)
    let orderDetails = this.newOrderForm.value
    // orderDetails['image'] = this.selectedFile
    this._order.getOrderCost(orderDetails)
        .subscribe({
          next: (res)=>{
              console.log(res)
              this.cost = res.cost
              this.openDialog()
          },
          error: (err)=>{
              if (err.status==401){
                this.auth.logOut()
              }
              else{
                this.dbError= err.error
              }
          }
        })

  }

  onFileSelection(event:any){
    this.imageError = ''
    var reader = new FileReader()
    reader.readAsDataURL(event.target.files[0])
    this.selectedFile = event.target.files[0]
    reader.onload = (event:any)=>{
      this.imageURL = event.target.result
    }
  }

  openDialog(){
    let dialogRef = this.dialog.open(ConfirmOrderComponent, {data: {cost:this.cost}, height:"200px", width:"300px"});
    dialogRef.afterClosed().subscribe(
      res =>{
        console.log(res, typeof res)
        if(res=='true'){
          this.sendOrderToServer()
        }
        else{
          return
        }
      }
    )
  }

  sendOrderToServer(){
    // console.log("hi")
    let orderDetails = this.newOrderForm.value
    this._order.newOrder(orderDetails)
        .subscribe({
          next: (res) =>{
            console.log("order id received", res)
            this.successMessage= res
          },
          error: (err)=>{
            if (err.status==401){
              this.auth.logOut()
            }
            else{
              console.log(err)
              this.dbError= err.error
            }
          }
        })
  }


  get pickupAddress(){
    return this.newOrderForm.get('pickupAddress')
  }
  get deliveryAddress(){
    return this.newOrderForm.get('deliveryAddress')
  }
  get weight(){
    return this.newOrderForm.get('weight')
  }
  get length(){
    return this.newOrderForm.get('length')
  } 
  get width(){
    return this.newOrderForm.get('width')
  }
  get height(){
    return this.newOrderForm.get('height')
  }
  get alternatePhone(){
    return this.newOrderForm.get('alternatePhone')
  }
  get coupon(){
    return this.newOrderForm.get('coupon')
  }


}

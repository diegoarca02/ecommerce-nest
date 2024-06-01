import { Component } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClientService } from 'src/app/services/client.service';
import { GuestService } from 'src/app/services/guest.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  public user : any = JSON.parse(localStorage.getItem('user_data')!);
  public cart : Array<any> = [];
  public load_cart = false;
  public total = 0;
  public token = localStorage.getItem('token');
  public url = GLOBAL.url;
  public tax = 0;

  constructor(
    private _clientService:ClientService,
    private _guestService:GuestService,
  ){

  }

  ngOnInit(){
    this._guestService.eventCart.subscribe(response=>{
      this.init_cart();
     });
    this.init_cart();
  }

  init_cart(){
    if(this.user == null){
      if(localStorage.getItem('cart')){
        this.cart = JSON.parse(localStorage.getItem('cart')!);
      }else{
        this.cart = [];
      }
      this.calcular_total();
      
      
    }else{
      this.load_cart = true;
      this._clientService.getCartClient(this.token).subscribe(
        response=>{
          this.cart = response.data;
          console.log(this.cart);
          this.calcular_total();
          this.load_cart = false;
        }
      );
    }
   
    console.log(this.cart);
  }

  calcular_total(){
    this.total = 0;
    if(this.user == null){
      for(var item of this.cart){
        let subtotal = item.cantidad * item.precio;
        this.total = this.total + subtotal;
      }
    }else{
      for(var item of this.cart){
        let subtotal = item.cantidad * item.producto_variedad.precio;
        this.total = this.total + subtotal;
      }
      console.log(this.total);
    }

    this.tax = this.total * 0.20;
    console.log(this.tax);
    
  }
  
  quitar_producto(value:any){
    if(this.user == null){
      this.cart.splice(value,1);
      localStorage.removeItem('cart');
      localStorage.setItem('cart',JSON.stringify(this.cart));
      this.calcular_total();
      this._guestService.eventToCart();
    }else{
      this._clientService.deleteProductoCart(value,this.token).subscribe(
        response=>{
          console.log(response);
          if(response.data != undefined){
            this._guestService.eventToCart();
            this.init_cart();
          }else{

          }
        }
      );
    }
  }

  updateCantidadClient(id:any,cantidad:any){
    this._clientService.updateCantidadCart(id,{cantidad},this.token).subscribe(
      response=>{
        if(response.data != undefined){
          this.init_cart();
          this._guestService.eventToCart();
        }
      }
    );
  }

  updateCantidadGuest(idx:any,cantidad:any){
    this.cart[idx].cantidad = cantidad;
    localStorage.removeItem('cart');
    localStorage.setItem('cart',JSON.stringify(this.cart));
    this._guestService.eventToCart();
  }
}

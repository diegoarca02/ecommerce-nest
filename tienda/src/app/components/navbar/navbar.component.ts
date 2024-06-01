import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClientService } from 'src/app/services/client.service';
import { GuestService } from 'src/app/services/guest.service';
declare var $:any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  public CURRENCY = 'USD';
  public IDIOMA = 'Español';
  public user : any = JSON.parse(localStorage.getItem('user_data')!);
  public cart : Array<any> = [];
  public url = GLOBAL.url;
  public token = localStorage.getItem('token');
  public load_cart = false;
  public total = 0;

  constructor(
    private _guestService:GuestService,
    private _clientService:ClientService,
    private _router:Router
  ){}

  ngOnInit(){
    this.init_cart();

    this._guestService.eventCart.subscribe(response=>{
     this.init_cart();
    });
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
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    window.location.reload();
  }

  quitar_producto(value:any){
    if(this.user == null){
      this.cart.splice(value,1);
      localStorage.removeItem('cart');
      localStorage.setItem('cart',JSON.stringify(this.cart));
      this.calcular_total();
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

  redirect(route:any){
    this._router.navigate([route]).then(()=>{
      setTimeout(() => {
        $('#modalShoppingCart').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        $('body').css('overflow', 'auto');
        $('body').css('padding-right', '0px');
      }, 50);
    });
  }
}

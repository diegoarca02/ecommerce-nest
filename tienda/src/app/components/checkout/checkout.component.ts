import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClientService } from 'src/app/services/client.service';
import { GuestService } from 'src/app/services/guest.service';
declare var $:any;
declare var paypal:any;
declare var moment:any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  public user : any = JSON.parse(localStorage.getItem('user_data')!);
  public token = localStorage.getItem('token');
  public direcciones : Array<any> = [];
  public load_direccion = false;
  public direccion_selected : any = {};

  public shipping : any= 0;
  public cart : Array<any> = [];
  public load_cart = true;
  public url = GLOBAL.url;
  public total = 0; //
  public const_subtotal = 0;
  public subtotal = 0; // 
  public codigo = '';
  public cupon : any = {};
  public msm_cupon = '';
  public descuento = 0;

  public venta: any ={};
  public detalles : Array<any> = [];
  public msm_error_venta = '';
  public cliente : any = {};
  public direccion : any = {
    prefijo: '',
    country: ''
  };


  constructor(
    private _clienteService:ClientService,
    private _guestService:GuestService,
    private renderer: Renderer2, private el: ElementRef,
    private _router:Router
  ){
    if(this.user != null){
      this.venta.cliente = this.user._id;
    }
  }

  ngOnInit(){
    setTimeout(() => {
      $('body').css('overflow', 'auto');
      $('body').css('padding-right', '0px');
    }, 50);
    if(this.user != undefined) this.init_direcciones();
    this.init_cart();
    this.renderPaypalButton();
  }

  renderPaypalButton(){
    paypal.Buttons({
        // Call your server to set up the transaction
        createOrder: (data:any, actions:any)=> {
          if(this.user != undefined){
            if(!this.venta.direccion){
              this.msm_error_venta = 'Selecciona la dirección';
            }else if(!this.venta.envio){
              this.msm_error_venta = 'Selecciona el tipo de envio';
            }else{
              return actions.order.create({
                purchase_units: [{
                  amount : {
                    value: this.total
                  }
                }]
              });
            }
          }else{
            console.log(this.cliente);
            
            if(!this.cliente.nombres){
              this.msm_error_venta = 'Los nombres son requeridos';
            }else if(!this.cliente.apellidos){
              this.msm_error_venta = 'Los apellidos son requeridos';
            }else if(!this.cliente.email){
              this.msm_error_venta = 'El correo electrónico es requerido';
            }else if(!this.direccion.prefijo){
              this.msm_error_venta = 'El prefijo es requerido';
            }else if(!this.direccion.telefono){
              this.msm_error_venta = 'El telefono es requerido';
            }else if(!this.direccion.country){
              this.msm_error_venta = 'El país es requerido';
            }else if(!this.direccion.postcode){
              this.msm_error_venta = 'El ZIP es requerido';
            }else if(!this.direccion.address){
              this.msm_error_venta = 'La dirección es requerida';
            }else{
              return actions.order.create({
                purchase_units: [{
                  amount : {
                    value: this.total
                  }
                }]
              });
            }
          }

            
        },

        // Call your server to finalize the transaction
        onApprove: (data:any, actions:any)=> {
            console.log(data);
            this.venta.detalles = this.detalles;
            if(this.user != undefined){
              this.venta.paymentID = data.paymentID;
              console.log(this.venta);
              this._clienteService.createVentaClient(this.venta,this.token).subscribe(
                response=>{
                  console.log(response);
                  this._router.navigate(['/cuenta/ventas-detalle',response.data._id]);
                }
              );
            }else{
              this.venta.cliente = this.cliente;
              this.venta.direccion = this.direccion;
              console.log(this.venta);
              this._guestService.createVentaGuest(this.venta).subscribe(
                response=>{
                  console.log(response);
                  this._router.navigate(['/venta',response.data._id]);
                }
              );
            }
            
        },
        onError: (err:any) => {
          console.log(err);
          
        }

    }).render('#paypal-button-container');

    
  }


  init_cart(){
    if(this.user == null){
      if(localStorage.getItem('cart')){
        this.cart = JSON.parse(localStorage.getItem('cart')!);
        console.log(this.cart);
        for(let item of this.cart){
          this.detalles.push({
            producto: item.producto,
            producto_variedad: item.producto_variedad,
            cantidad: item.cantidad,
            precio: item.precio
          });
        }
        this.calcular_total();
        this.load_cart = false;
      }else{
        this.cart = [];
      }
      
    }else{
      this.load_cart = true;
      this._clienteService.getCartClient(this.token).subscribe(
        response=>{
          this.cart = response.data;
          console.log(this.cart);

          for(let item of this.cart){
            this.detalles.push({
              cliente: this.user._id,
              producto: item.producto._id,
              producto_variedad: item.producto_variedad._id,
              cantidad: item.cantidad,
              precio: item.producto_variedad.precio
            });
          }
          console.log(this.detalles);
          this.calcular_total();
          this.load_cart = false;
        }
      );
    }
  }

  init_direcciones(){
    this.load_direccion = true;
    this._clienteService.getDireccionesCliente(this.token).subscribe(
      response=>{
        this.direcciones = response.data;
        console.log(this.direcciones);
        this.load_direccion = false;
      }
    );
  }

  calcular_total(){
    this.subtotal = 0;
    if(this.user == null){
      for(var item of this.cart){
        let subtotal = item.cantidad * item.precio;
        this.subtotal = this.subtotal + subtotal;
      }
    }else{
      for(var item of this.cart){
        let subtotal = item.cantidad * item.producto_variedad.precio;
        this.subtotal = this.subtotal + subtotal;
      }
    }

    this.total = this.subtotal;
    this.const_subtotal = this.subtotal;

    this.venta.total = this.total;
  }

  select_direccion(item:any){
    this.direccion_selected = item;
    this.venta.direccion = this.direccion_selected._id;
  }

  setEnvio(){
    console.log(this.shipping);
    this.total = this.subtotal + parseFloat(this.shipping.toString());
    this.venta.envio = this.shipping;
    this.venta.total = this.total;
    let today = moment();
    if(this.shipping == '8'){
      this.venta.tipo_envio = 'Standard Shipping';
      this.venta.fecha_entrega = today.add(6,'days');
    }else if(this.shipping == '12'){
      this.venta.tipo_envio = 'Express Shipping';
      this.venta.fecha_entrega = today.add(4,'days');
    }else if(this.shipping == '18'){
      this.venta.tipo_envio = '1 - 2 Shipping';
      this.venta.fecha_entrega = today.add(2,'days');
    }else if(this.shipping == '0'){
      this.venta.tipo_envio = 'Free Shipping';
      this.venta.fecha_entrega = today.add(35,'days');
    }
  }

  aplicarCupon(){
    if(!this.codigo){
      this.total = this.const_subtotal;
      this.descuento = 0;
      this.cupon = {};
    }else{
      let categorias : any= [];
      let productos : any= [];

      this.cart.forEach(element => {
        categorias.push(element.producto.categoria);
        productos.push(element.producto._id);
      });

      this._guestService.applyCupon(this.codigo,{
        total:this.total,
        categorias,
        productos
      }).subscribe(
        response=>{
          console.log(response);
          if(response.data != undefined){
            this.msm_cupon = '';
            this.cupon = response.data;
            //VENTA
            this.venta.cupon = this.cupon._id;
            this.descuento = (this.cupon.descuento/100)*this.subtotal;
            this.venta.descuento = this.descuento;
            this.total = (this.subtotal - this.descuento) + parseFloat(this.shipping.toString());
            this.venta.total = this.total;
          }else{
            this.msm_cupon = response.message;
          }
        }
      );
    }
  }
}

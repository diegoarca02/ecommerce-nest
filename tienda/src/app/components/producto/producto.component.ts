import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClientService } from 'src/app/services/client.service';
import { GuestService } from 'src/app/services/guest.service';
declare var Flickity:any;

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent {

  public slug = '';
  public producto : any = {};
  public variaciones : Array<any> = [];
  public galeria : Array<any> = [];
  public url = GLOBAL.url;
  public load_data = true;
  public user : any = JSON.parse(localStorage.getItem('user_data')!);
  public variacion : any = {};
  public cantidad = 1;
  public token = localStorage.getItem('token');

  public message : any = {
    text: ''
  }  

  constructor(
    private _route : ActivatedRoute,
    private _guestService : GuestService,
    private _clienteService: ClientService
  ){
    console.log(this.variacion.color);
    
  }

  ngOnInit(){

    this._route.params.subscribe(
      params=>{
        this.slug = params['slug'];
        this.init_producto();
        
      }
    );

    setTimeout(() => {
      var elementSlider = document.getElementById('productSlider');
      new Flickity(elementSlider,{
        "draggable": false, 
        "fade": true,
        "pageDots": false,
      }); 
  
      var navElement = document.querySelector('.flickity-nav');
  
      new Flickity(navElement,{
        "asNavFor": "#productSlider", 
        "contain": true, 
        "wrapAround": false,
        "pageDots": false,
        "prevNextButtons": false,
        "draggable": false,
        "cellAlign":"left"
      });
    }, 500);
  }

  init_producto(){
    this.load_data = true;
    this._guestService.getProductoShop(this.slug).subscribe(
      response=>{
        this.producto = response.data;
        this.variaciones = response.variaciones;
        this.galeria = response.galeria;
        console.log(this.galeria);
        this.load_data = false;
      }
    );
  }

  selectedVariacion(item:any){
    this.variacion = item;
    console.log(this.variacion);
    
  }

  toCartNoUser(){
    let arr_cart = JSON.parse(localStorage.getItem('cart')!);

    let producto = {
      producto: this.producto._id,
      producto_variedad: this.variacion._id,
      cantidad: this.cantidad,
      portada: this.producto.portada,
      titulo: this.producto.titulo,
      variedad: this.variacion.color + ' ' +this.variacion.talla,
      precio: this.variacion.precio,
      slug: this.producto.slug,
      color: this.variacion.color,
      talla: this.variacion.talla,
    }

    if(arr_cart == null){
      let cart = [];
      cart.push(producto);
      localStorage.setItem('cart',JSON.stringify(cart));
    }else{
      let cart = JSON.parse(localStorage.getItem('cart')!);
      cart.push(producto);
      localStorage.removeItem('cart');
      localStorage.setItem('cart',JSON.stringify(cart));
    }

    this.message.text = 'Producto agregado al carrito.';
    this.message.type = 1;

    this._guestService.eventToCart();
  }

  toCartUser(){
    let producto = {
      producto: this.producto._id,
      producto_variedad: this.variacion._id,
      cantidad: this.cantidad,
    }

    this._clienteService.addProductCart(producto,this.token).subscribe(
      response=>{
        console.log(response);
        if(response.data != undefined){
          this.message.text = 'Producto agregado al carrito.';
          this.message.type = 1;
          this._guestService.eventToCart();
        }else{
          this.message.text = response.message;
          this.message.type = 2;
        }
      },
      error=>{
        this.message.text = 'No se pudo agregar el producto.';
        this.message.type = 2;
      }
    );

    console.log(producto);
  }
}

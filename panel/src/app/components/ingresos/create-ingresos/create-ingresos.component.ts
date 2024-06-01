import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { IngresoService } from 'src/app/services/ingreso.service';
import { ProductoService } from 'src/app/services/producto.service';
declare var $:any;
declare var toastr:any;

@Component({
  selector: 'app-create-ingresos',
  templateUrl: './create-ingresos.component.html',
  styleUrls: ['./create-ingresos.component.css']
})
export class CreateIngresosComponent {

  public token = localStorage.getItem('token');
  public filtro_producto = '';
  public productos : Array<any> = [];
  public variaciones : Array<any> = [];
  public url = GLOBAL.url;
  public producto_selected : any = {};
  public detalles : Array<any> = [];

  public proveedores : Array<any> = GLOBAL.proveedores;
  public almacenes : Array<any> = GLOBAL.almacenes;
  public btn_load = false;
  public total = 0;
  public ingreso : any = {
    proveedor: '',
    almacen: ''
  };


  public detalle : any = {
    producto_variedad: ''
  };
  public msm_error_detalle = '';

  constructor(
    private _productoService:ProductoService,
    private _ingresoService:IngresoService,
    private _router:Router
  ){

  }

  ngOnInit(){

  }

  init_producto(){
    this._productoService.searchProductos(this.filtro_producto,this.token).subscribe(
      response=>{
        console.log(response);
        if(response.data != undefined){
          this.productos = response.data;
        }else{
          this.productos = [];
        }
      }
    );
  }

  select_producto(item:any){
    this.producto_selected = item;
    this.detalle.producto = item._id;
    this.detalle.producto_titulo = item.titulo;
    $('#str_producto').val(item.titulo);
    this._productoService.getVariacionesProducto(item._id,this.token).subscribe(
      response=>{
        this.variaciones = response.data;
        $('#modalProducto').modal('hide');
      }
    );
  }

  select_variacion(){
    let variacion = this.variaciones.filter(item=> item._id == this.detalle.producto_variedad)[0];
    this.detalle.talla = variacion.talla;
    this.detalle.color = variacion.color;
    console.log(this.detalle);
    
  }

  agregar_detalle(){
    if(!this.detalle.producto){
      this.msm_error_detalle = 'El producto es requerido';
    }else if(!this.detalle.producto_variedad){
      this.msm_error_detalle = 'La variación es requerida';
    }else if(!this.detalle.precio_unidad){
      this.msm_error_detalle = 'El precio es requerido';
    }else if(this.detalle.precio_unidad <= 0){
      this.msm_error_detalle = 'El precio es invalido';
    }else if(!this.detalle.cantidad){
      this.msm_error_detalle = 'La cantidad es requerida';
    }else if(this.detalle.cantidad <= 0){
      this.msm_error_detalle = 'La cantidad es invalida';
    }else{
      this.msm_error_detalle = '';
      this.detalles.push(this.detalle);
      console.log(this.detalles);
      
      this.calcular_total();
      //RESET
      $('#str_producto').val('');
      this.detalle = {
        producto_variedad: ''
      };
    }
      
      
  }

  calcular_total(){
    this.total = 0;
    for(var item of this.detalles){
      this.total = this.total + (item.cantidad*item.precio_unidad);
    }
  }

  quitar_detalle(idx:any){
    this.detalles.splice(idx,1);
    this.calcular_total();
  }

  guardar(){
    this.ingreso.detalles = this.detalles;
    this.ingreso.total = this.total;
    if(!this.ingreso.proveedor){
      toastr.error("El proveedor es requerido");
    }else if(!this.ingreso.almacen){
      toastr.error("El almacen es requerido");
    }else if(this.ingreso.detalles.length == 0){
      toastr.error("No hay productos ingresados.");
    }else{
      console.log(this.ingreso);
      this.btn_load = true;
      this._ingresoService.createIngreso(this.ingreso,this.token).subscribe(
        response=>{
          if(response.data != undefined){
            toastr.success("Ingreso creado.");
            this._router.navigate(['/ingresos']);
          }else{
            toastr.error(response.message);
          }
          this.btn_load = false;
        }
      );
    }
  }
}

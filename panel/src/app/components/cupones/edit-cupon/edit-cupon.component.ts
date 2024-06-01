import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
declare var moment:any;
declare var toastr:any;
declare var $:any;

@Component({
  selector: 'app-edit-cupon',
  templateUrl: './edit-cupon.component.html',
  styleUrls: ['./edit-cupon.component.css']
})
export class EditCuponComponent {

  public id = '';
  public token = localStorage.getItem('token');
  public btn_load = false;
  public cupon : any = {
    tipo: 'Producto'
  };
  public filtro_categoria = '';
  public filtro_producto = '';
  public load_categorias = false;
  public load_productos = false;
  public categorias : Array<any> = [];
  public productos : Array<any> = [];
  public url = GLOBAL.url;
  public detalles : Array<any> = [];
  public load_detalles = true;
  public btn_del_detalle = false;

  constructor(
    private _productoService:ProductoService,
    private _route:ActivatedRoute,
    private _router:Router
  ){

  }

  ngOnInit(){
    this._route.params.subscribe(
     params=>{
      this.id = params['id'];
      this.init_data();
     }
    );
  }

  init_data(){
    this._productoService.getCupon(this.id,this.token).subscribe(
      response=>{
        console.log(response);
        this.cupon = response.data;
        this.init_detalles();
        this.cupon.f_inicio = moment(this.cupon.f_inicio).format('YYYY-MM-DD');
        this.cupon.f_fin = moment(this.cupon.f_fin).format('YYYY-MM-DD');
      }
    );
  }

  validar(){
    if(!this.cupon.codigo){
      toastr.error("El codigo es requerido.");
    }else if(!this.cupon.descuento){
      toastr.error("El descuento es requerido.");
    }else if(this.cupon.descuento <= 0 || this.cupon.descuento >= 100){
      toastr.error("El descuento debe ser entre 1 al 100");
    }else if(!this.cupon.monto_max){
      toastr.error("El monto maximo es requerido.");
    }else if(this.cupon.monto_max <= 0){
      toastr.error("El monto maximo no es válido.");
    }else if(!this.cupon.f_inicio){
      toastr.error("El inicio de vigencia es requerido.");
    }else if(!this.cupon.f_fin){
      toastr.error("El fin de vigencia es requerida.");
    }else if(!this.cupon.canjes){
      toastr.error("El número de canjes es requerido.");
    }else if(this.cupon.canjes <= 0){
      toastr.error("El número de canjes no es válido.");
    }else{
      this.actualizar();
      
    }
  }

  init_detalles(){
    this.load_detalles = true;
    this._productoService.getDetallesCupon(this.id,this.token).subscribe(
      response=>{
        this.detalles = response.data;
        console.log(this.detalles); 
        this.load_detalles = false;
      }
    );
  }

  actualizar(){
    this.btn_load = true;
    this._productoService.updateCupon(this.id,this.cupon,this.token).subscribe(
      response=>{
        if(response.data != undefined){
          toastr.success("Cupón actualizado.");
          this._router.navigate(['/cupones']);
        }else{
          toastr.error(response.message);
        }
        this.btn_load = false;
      }
    );
  }

  searchProducto(){
    if(this.filtro_producto){
      this.load_productos = true;
      
      this._productoService.getProductosCupon(this.filtro_producto,this.token).subscribe(
        response=>{

          this.productos = response.data;
          console.log( this.productos);
          
          this.load_productos = false;
        }
      );
    }
  }

  addDetalle(tipo:any,item:any){
    let value = {};
    if(tipo == 'Producto'){
      value = {
        producto: item.producto._id,
        titulo: item.producto.titulo,
        tipo: 'Producto',
        cupon: this.id
      };
    }else if(tipo == 'Categoria'){
      value = {
        categoria: item._id,
        titulo: item.titulo,
        tipo: 'Categoria',
        cupon: this.id
      }
    }

    this._productoService.addDetalleCupon(value,this.token).subscribe(
      response=>{
        if(response.data != undefined){
          this.init_detalles();
        }else{
          toastr.error(response.message);
        }
      }
    );
  }

  searchCategoria(){
    if(this.filtro_categoria){
      this.load_categorias = true;
      this._productoService.getCategoriasCupon(this.filtro_categoria,this.token).subscribe(
        response=>{

          this.categorias = response.data;
          console.log( this.categorias);
          
          this.load_categorias = false;
        }
      );
    }
  }

  delete_detalle(id:any){
    this.btn_del_detalle = true;
    this._productoService.deleteCupon(id,this.token).subscribe(
      response=>{
        console.log(response);
        if(response.data != undefined){
          toastr.success("Eliminacion completada.");
          this.init_detalles();
        }else{
          toastr.error(response.message);
        }
        this.btn_del_detalle = false;
        $('#delete-'+id).modal('hide');
       
      }
    );
  }
}

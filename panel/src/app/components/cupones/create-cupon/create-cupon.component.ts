import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
declare var toastr:any;

@Component({
  selector: 'app-create-cupon',
  templateUrl: './create-cupon.component.html',
  styleUrls: ['./create-cupon.component.css']
})
export class CreateCuponComponent {

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
  public _arr = new Set();

  constructor(
    private _productoService:ProductoService,
    private _router:Router
  ) {}

  ngOnInit(){

  }

  selectedTipo(){
    this.detalles = [];
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

  searchProducto(){
    if(this.filtro_producto){
      this.load_productos = true;
      console.log(this.filtro_producto);
      
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
    if(tipo == 'Producto'){
      if(!this._arr.has(item.producto._id)){
        let value = {
          producto: item.producto._id,
          titulo: item.producto.titulo,
          tipo: 'Producto'
        };
        this.detalles.push(value);
        this._arr.add(value.producto);
      }
    }else if(tipo == 'Categoria'){
      if(!this._arr.has(item._id)){
        let value = {
          categoria: item._id,
          titulo: item.titulo,
          tipo: 'Categoria'
        }
        this.detalles.push(value);
        this._arr.add(value.categoria);
      }
    }
    console.log(this._arr);
    
  }

  validar(){
    this.cupon.detalles = this.detalles;
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
      if(this.cupon.tipo != 'General'){
        if(this.cupon.detalles.length <= 0){
          toastr.error("Los detalles estan vacios.");
        }else{
          this.registrar();
        }
      }else{
        this.registrar();
      }
      
    }
    
  }

  registrar(){
    this.btn_load = true;
    this._productoService.createCupon(this.cupon,this.token).subscribe(
      response=>{
        if(response.data != undefined){
          toastr.success("Cupón creado.");
          this._router.navigate(['/cupones']);
        }else{
          toastr.error(response.message);
        }
        this.btn_load = false;
      }
    );
  }

  remove(idx:any){
    this.detalles.splice(idx,1);
  }
}

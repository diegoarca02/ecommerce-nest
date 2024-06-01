import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
declare var $:any;
declare var QRCode:any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent {
  public token = localStorage.getItem('token');
  public productos : Array<any> = [];
  public const_productos : Array<any> = [];
  public load_data = true;
  public page = 1;
  public pageSize = 15;
  public url = GLOBAL.url;
  public filtro = '';

  public filtro_clasificacion = 'Todos';
  public filtro_categoria = 'Todos';
  public filtro_subcategoria = 'Todos';
  public filtro_estado = 'Todos';

  public categorias : Array<any> = [];
  public subcategorias : Array<any> = [];

  public btn_state_load = false;

  constructor(
    private _productoService:ProductoService,
    private _router:Router,
    private _route:ActivatedRoute
  ){

  }

  ngOnInit(){
    this._route.queryParams.subscribe(
      params=>{
        this.filtro = params['filter'];
        if(this.filtro){
          this.init_data(this.filtro);
        }else{
          this.init_data('Todos');
        }
      }
    );
  }

  init_data(filtro:any){
    this.load_data = true;
    this._productoService.getProductos(filtro,this.token).subscribe(
      response=>{
        console.log(response);
        if(response.data != undefined){
          this.productos = response.data; //
          this.const_productos = this.productos; //
        }else{

        }
        this.load_data = false;
        console.log(this.productos);
        
      }
    );
  }

  filtro_producto(){
    if(this.filtro){
      this._router.navigate(['/producto'],{ queryParams : { filter : this.filtro } });
    }else{
      this._router.navigate(['/producto']);
    }
  }

  setClasificacion(){
    this._productoService.getCategorias(this.filtro_clasificacion,this.token).subscribe(
      response=>{
        if(response.data != undefined){
          this.categorias = response.data;
          this.filtro_avanzando();
        }
      }
    );
  }

  setCategoria(){
    let categoria = this.categorias.find(item=>item._id == this.filtro_categoria);
    if(categoria) this.subcategorias = categoria.subcategorias;
    this.filtro_avanzando();
  }

  filtro_avanzando(){
    var arr_uno = [];
    if(this.filtro_clasificacion == 'Todos'){
      arr_uno = this.const_productos;
    }else{
      arr_uno = this.const_productos.filter(item=>item.producto.clasificacion == this.filtro_clasificacion);
    }

    var arr_dos = [];
    if(this.filtro_categoria == 'Todos'){
      arr_dos = arr_uno;
    }else{
      arr_dos = arr_uno.filter(item=>item.producto.categoria._id == this.filtro_categoria);
    }

    var arr_tres = [];
    if(this.filtro_subcategoria == 'Todos'){
      arr_tres = arr_dos;
    }else{
      arr_tres = arr_dos.filter(item=>item.producto.subcategoria == this.filtro_subcategoria);
    }

    var arr_cuatro = [];
    if(this.filtro_estado == 'Todos'){
      arr_cuatro = arr_tres;
    }else{
      if(this.filtro_estado == 'Borrador'){
        arr_cuatro = arr_tres.filter(item=>!item.producto.estado);
      }else{
        arr_cuatro = arr_tres.filter(item=>item.producto.estado);
      }
    }

    this.productos = arr_cuatro;
  }

  setState(id:any,estado:any){
    this.btn_state_load = true;
    this._productoService.setStateProducto(id,{estado:estado},this.token).subscribe(
      response=>{
        console.log(response);
        $('#state-'+id).modal('hide');
        this.init_data('Todos');
        this.btn_state_load = false;
      }
    );
  }

} 

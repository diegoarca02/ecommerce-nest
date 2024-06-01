import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
declare var $:any;

@Component({
  selector: 'app-index-categoria',
  templateUrl: './index-categoria.component.html',
  styleUrls: ['./index-categoria.component.css']
})
export class IndexCategoriaComponent {

  public token = localStorage.getItem('token');
  public load_data = true;
  public categorias : Array<any> = [];
  public categorias_const : Array<any> = [];
  public filtro = '';
  public page = 1;
  public pageSize = 2;
  public btn_state_load = false;
  public active = 'Masculino';

  constructor(
    private _productoService:ProductoService,
    private _route:ActivatedRoute,
    private _router:Router
  ){

  }

  ngOnInit(){
    this._route.params.subscribe(
      params=>{
        if(params['clasificacion']){
          this.active = params['clasificacion'];
          this.init_data();
        }else{
          this._router.navigate(['/categoria',this.active]);
        }
      }
    );
    
  }

  init_data(){
    this.load_data = true;
    this._productoService.getCategorias(this.active,this.token).subscribe(
      response=>{
        if(response.data != undefined){
          this.categorias = response.data;
          this.categorias_const = this.categorias;
        }
        this.load_data = false;
      }
    );
  }

  filter(){
    let test = new RegExp(this.filtro,'i');
    this.categorias = this.categorias_const.filter(item=>test.test(item.titulo));
  }

  setClasificacion(value:any){
    this.active = value;
    this._router.navigate(['/categoria',this.active]);
  }

  setState(id:any,estado:any,genero:any){
    this.btn_state_load = true;
    this._productoService.setStateCategoria(id,{
      estado:estado,
      genero: genero
    },this.token).subscribe(
      response=>{
        console.log(response);
        $('#state-'+id).modal('hide');
        this.init_data();
        this.btn_state_load = false;
      }
    );
  }
}

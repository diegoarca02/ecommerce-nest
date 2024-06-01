import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { GuestService } from 'src/app/services/guest.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {

  public productos : Array<any> = [];
  public producto_const : Array<any> = [];
  public url = GLOBAL.url;
  public sort = 'Default';
  public genero = 'Todos';
  public precio = '';
  public query_categorias : Array<any> = [];
  public categorias : Array<any> = [];
  public load_producto = true;
  public page = 1;
  public pageSize = 20;

  constructor(
    private _guestService:GuestService,
    private _router:Router,
    private _route:ActivatedRoute,
  ){

  }

  ngOnInit(){
    
    this._route.queryParams.subscribe(
      query=>{
        if(query['sort']){
          this.sort = query['sort'];
        }

        if(query['genero']){
          this.genero = query['genero'];
          this.init_categorias();
        }

        if(query['categorias']){
          this.query_categorias = query['categorias'].split(',');
        }

        if(query['precio']){
          this.precio = query['precio'];
        }

        this.init_productos();
      }
    );
  }

  init_productos(){
    this.load_producto = true;
    this._guestService.getProductosShop().subscribe(
      response=>{
        this.productos = response.data;
        this.producto_const = this.productos;
        console.log(this.productos);
        this.initSort();
        this.init_filtro();
        this.load_producto = false;
      }
    )
  }

  setSort(value:any){
    this.sort = value;
    this.redirect();
  }

  redirect(){
    this._router.navigate(['/tienda'],{ queryParams: { 
      sort: this.sort,
      genero: this.genero,
      categorias: this.query_categorias.join(','),
      precio: this.precio
    } })
  }

  initSort(){
    if(this.sort == 'A-Z'){
      this.productos.sort((a,b)=>a.titulo.localeCompare(b.titulo));
    }else if(this.sort == 'Z-A'){
      this.productos.sort((a,b)=>b.titulo.localeCompare(a.titulo));
    }else if(this.sort == 'Precio menor'){
      this.productos.sort((a,b)=>a.precio - b.precio);
    }else if(this.sort == 'Precio mayor'){
      this.productos.sort((a,b)=>b.precio - a.precio);
    }else{
    
    }
  }

  setFiltro(tipo:any,value:any){
    if(tipo == 'Genero'){
      this.genero = value;
      this.redirect();
    }else if(tipo == 'Precio'){
      this.redirect();
    }
  }

  setCategorias(){
    this.query_categorias = this.categorias.filter(item=>item.selected).map(item=>item._id);
    this.redirect();
  }
  
  init_filtro(){
    var arr_uno = [];
    
    if(this.genero == 'Todos'){
      arr_uno = this.producto_const;
    }else{
      arr_uno = this.producto_const.filter(item=>item.clasificacion == this.genero);
    }

    var arr_dos = [];

    if(this.query_categorias.length >= 1){
      for(var item of arr_uno){
        let arr = this.query_categorias.filter(subitem=> subitem == item.categoria._id);
        if(arr.length >= 1){
          arr_dos.push(item);
        }
      }
    }else{
      arr_dos = arr_uno;
    }

    var arr_tres = [];

    if(!this.precio){
      arr_tres = arr_dos;
    }else{
      if(this.precio == '$10.00 - $49.00'){
        arr_tres = arr_dos.filter(item=> item.precio >= 10 && item.precio <= 49);
      }else if(this.precio == '$50.00 - $99.00'){
        arr_tres = arr_dos.filter(item=> item.precio >= 50 && item.precio <= 9);
      }else if(this.precio == '$100.00 - $199.00'){
        arr_tres = arr_dos.filter(item=> item.precio >= 100 && item.precio <= 199);
      }else if(this.precio == '$200.00 a más'){
        arr_tres = arr_dos.filter(item=> item.precio >= 200);
      }
    }

    this.productos = arr_tres;
  }

  init_categorias(){
    this._guestService.getCategoriasShop(this.genero).subscribe(
      response=>{
        this.categorias = response.data;
        
        if(this.query_categorias.length == 0){
          for(var item of this.categorias){
            item.selected = true;
          }
        }else{
          for(var item of this.categorias){
            for(var subitem of this.query_categorias){
              if(item._id == subitem) item.selected = true;
            }
          }
        }

        this.setCategorias();
      }
    );
  }

  toggleSelection(event:any,idx:any){
    this.categorias[idx].selected = event.target.checked;
    console.log(this.categorias);
    
  }

  selectPrecio(event:any){
      console.log(event.target.value);
      var chks = document.querySelectorAll('.chk-precio');
      chks.forEach((element:any) => {
        if(element.value != event.target.value){
          if(element.checked){
            element.checked = false;
          } 
        }  
      });
      
      this.precio = event.target.value;
  }
}

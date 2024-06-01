import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
declare var Tagify:any;
declare var $:any;
declare var toastr:any;

@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css']
})
export class CreateProductoComponent {

  public token = localStorage.getItem('token');
  public active = 1;
  public producto : any = {
    categoria: '',
    subcategoria: '',
    clasificacion: ''
  };
  public tagify : any;
  public colores : Array<any> = GLOBAL.colores;
  public tallas : Array<any> = GLOBAL.tallas;
  public variacion : any = {
    color: '',
    talla: '',
    hxd: '#ccc'
  };
  public imagen : any = undefined;
  public imagen_titulo = '';
  public imagen_str : any= '';
  public variaciones : Array<any> = [];
  public galeria : Array<any> = [];
  public etiquetas : Array<any> = [];

  public categorias : Array<any> = [];
  public subcategorias : Array<any> = [];

  public btn_load = false;

  constructor(
    private _productoService:ProductoService,
    private _router:Router
  ){

  }

  ngOnInit(){
    this.init_tagify();
    setTimeout(() => {
      $('#colorpicker').spectrum({
        color: '#ccc',
        
      });
    }, 50);
  }

  init_tagify(){
    setTimeout(() => {
      const input = document.querySelector('#kt_tagify');
      this.tagify = new Tagify(input,{
        maxTags: 10,
        dropdown: {
          maxItems: 5,
          classname: 'tagify__inline__suggestions',
          enable: 0,
          closeOnSelect: false
        }
      });
    }, 150);
  }

  uploadImage(event:any){
    if(event.target.files && event.target.files[0]){
      let file = event.target.files[0];
      if(file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif" || file.type == "image/webp"){
        if(file.size <= (2*1024*1024)){
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = ()=>{
            console.log(reader.result);
            this.imagen_str = reader.result;
          }
          this.imagen = file;
        }else{
          toastr.error("Debe pesar menos de 2MB");
          this.imagen = undefined;
          $('#FileInput').val('');
        }
      }else{
        toastr.error("Se permiten solo imagenes");
        this.imagen = undefined;
        $('#FileInput').val('');
      }
    }else{
      console.log('No se selecciono nada');
      
    }
    
  }
  
  setActive(value:any){
    this.active = value;
  }

  add_variacion(){
    this.variacion.hxd = $('#colorpicker').spectrum('get').toHexString();
    
    if(!this.variacion.hxd){
      toastr.error("El color HXD es requerido");
    }else if(!this.variacion.color){
      toastr.error("El color es requerido");
    }else if(!this.variacion.talla){
      toastr.error("La talla es requerida");
    }else{
      this.variaciones.push(this.variacion);
      this.variacion = {
        color: '',
        talla: '',
      };
      console.log(this.variaciones);
    }
  }

  remove_variacion(idx:any){
    this.variaciones.splice(idx,1);
  }

  remove_imagen(idx:any){
    this.galeria.splice(idx,1);
  }

  add_imagen(){
    if(this.imagen == undefined){
      toastr.error("Debe subir una imagen valida");
    }else if(!this.imagen_titulo){
      toastr.error("El titulo es requerido");
    }else{
      this.galeria.push({
        imagen: this.imagen,
        titulo: this.imagen_titulo,
        str: this.imagen_str,
      });

      this.imagen = undefined;
      this.imagen_titulo = '';
      this.imagen_str = '';

      $('#FileInput').val('');
    }
  }

  setClasificacion(){
    console.log(this.producto.clasificacion);
    this._productoService.getCategorias(this.producto.clasificacion,this.token).subscribe(
      response=>{
        if(response.data != undefined){
          this.categorias = response.data;
          console.log(this.categorias);
          
        }
      }
    );
  }

  setCategoria(){
    let categoria = this.categorias.find(item=>item._id == this.producto.categoria);
    this.subcategorias = categoria.subcategorias;
    console.log(this.subcategorias);
  }


  crear(){
      this.etiquetas = [];
      for(var item of this.tagify.getTagElms()){
        this.etiquetas.push(item.__tagifyTagData.value);
      }
      
      if(!this.producto.titulo){
        toastr.error("El titulo es requerido");
      }else if(!this.producto.clasificacion){
        toastr.error("La clasificacion es requerida");
      }else if(!this.producto.categoria){
        toastr.error("La categoria es requerida");
      }else if(!this.producto.subcategoria){
        toastr.error("La subcategoria es requerida");
      }else if(!this.producto.descripcion){
        toastr.error("La descripción es requerida");
      }else if(this.etiquetas.length == 0){
        toastr.error("Las etiquetas estan vacias");
      }else if(this.variaciones.length == 0){
        toastr.error("Las variaciones estan vacias");
      }else if(this.galeria.length == 0){
        toastr.error("Las galeria esta vacia");
      }else{
        this.producto.etiquetas = this.etiquetas;
        this.producto.variaciones = this.variaciones;
        var arr_galeria = [];
        for(var item of this.galeria){
          arr_galeria.push({
            imagen: item.imagen,
            titulo: item.titulo,
          });
        }
        this.producto.galeria = arr_galeria;
        this.btn_load = true;
        console.log(this.producto);
        
        this._productoService.createProducto(this.producto,this.token).subscribe(
          response=>{
            if(response.data != undefined){
              this._router.navigate(['/producto']);
            }else{
              toastr.error(response.message);
            }
            this.btn_load = false;
          }
        );
      }
  }
}

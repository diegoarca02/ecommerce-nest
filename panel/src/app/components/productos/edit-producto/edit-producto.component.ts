import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
declare var toastr:any;
declare var $:any;
declare var Tagify:any;

@Component({
  selector: 'app-edit-producto',
  templateUrl: './edit-producto.component.html',
  styleUrls: ['./edit-producto.component.css']
})
export class EditProductoComponent {

  public tagify : any;
  public token = localStorage.getItem('token');
  public active = 1;
  public producto : any = {
    categoria: '',
    subcategoria: '',
    clasificacion: ''
  };
  public categorias : Array<any> = [];
  public subcategorias : Array<any> = [];
  public variacion : any = {
    color: '',
    talla: '',
    hxd: '#ccc'
  };
  public colores : Array<any> = GLOBAL.colores;
  public tallas : Array<any> = GLOBAL.tallas;
  public variaciones : Array<any> = [];
  public galeria : Array<any> = [];
  public imagen : any = undefined;
  public imagen_titulo = '';
  public btn_load = false;
  public id = '';

  public load_variaciones = true;
  public load_galeria = true;
  public url = GLOBAL.url;
  public etiquetas :Array<any> = [];
  public btn_delete_variacion = false;
  public btn_delete_imagen = false;
  public variedad_selected : any = {};
  public btn_precio_variacion = false;

  constructor(
    private _productoService:ProductoService,
    private _route:ActivatedRoute
  ){

  }

  ngOnInit(){
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this.init_data(); //PRODUCTO
        this.init_variaciones();  //VARIACIONES
        this.init_galeria();

        setTimeout(() => {
          $('#colorpicker').spectrum({
            color: '#ccc',
            
          });
        }, 50);
      }
    );
  }

  init_variaciones(){
    this.load_variaciones = true;
    this._productoService.getVariacionesProducto(this.id,this.token).subscribe(
      response=>{
        this.variaciones = response.data;
        console.log(this.variaciones);
        
        this.load_variaciones = false;
      }
    );
  }

  init_galeria(){
    this.load_galeria = true;
    this._productoService.getGaleriaProducto(this.id,this.token).subscribe(
      response=>{
        this.galeria = response.data;
        this.load_galeria = false;
      }
    );
  }

  init_data(){
    this._productoService.getProducto(this.id,this.token).subscribe(
      response=>{
        console.log(response);
        this.producto = response.data;
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
          this.tagify.addTags(this.producto.labels);
        }, 150);
        this._productoService.getCategorias(this.producto.clasificacion,this.token).subscribe(
          response=>{
            if(response.data != undefined){
              this.categorias = response.data;
              this.setCategoria();
            }
          }
        );
        
      }
    );
  }

  setClasificacion(){
    this._productoService.getCategorias(this.producto.clasificacion,this.token).subscribe(
      response=>{
        if(response.data != undefined){
          this.categorias = response.data;
        }
      }
    );
  }

  setCategoria(){
    let categoria = this.categorias.find(item=>item._id == this.producto.categoria);
    if(categoria) this.subcategorias = categoria.subcategorias;
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
      this.variacion.producto = this.id;
      this._productoService.addVariacion(this.variacion,this.token).subscribe(
        response=>{
          console.log(response);
          if(response.data != undefined){
            toastr.success("Variación agregada.");
            this.variacion = {
              color: '',
              talla: '',
            };
            this.init_variaciones();
          }else{
            toastr.error(response.message);
          }
        }
      );
    }
  }

  remove_variacion(idx:any){
    this.variaciones.splice(idx,1);
  }

  uploadImage(event:any){
    if(event.target.files && event.target.files[0]){
      let file = event.target.files[0];
      if(file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif" || file.type == "image/webp"){
        if(file.size <= (2*1024*1024)){
          this.imagen = file;
          console.log(this.imagen);
          
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

  add_imagen(){
    if(this.imagen == undefined){
      toastr.error("Debe subir una imagen valida");
    }else if(!this.imagen_titulo){
      toastr.error("El titulo es requerido");
    }else{
      let data = {
        imagen: this.imagen,
        titulo: this.imagen_titulo,
        producto: this.id
      };

      this._productoService.uploadImgProducto(data,this.token).subscribe(
        response=>{
          console.log(response);
          if(response.data != undefined){
            toastr.success("Imagen agregada.");
            this.imagen = undefined;
            this.imagen_titulo = '';
            $('#FileInput').val('');
            this.init_galeria();

          }else{
            toastr.error(response.message);
          }
          /*  */
        }
      );

      
    }
  }

  
  remove_imagen(idx:any){
    this.galeria.splice(idx,1);
  }

  setActive(value:any){
    this.active = value;
  }

  actualizar(){
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
    }else{
      let data : any = {
        titulo: this.producto.titulo,
        clasificacion: this.producto.clasificacion,
        categoria: this.producto.categoria,
        subcategoria: this.producto.subcategoria,
        labels: this.etiquetas,
        descripcion: this.producto.descripcion,
      };
      this._productoService.updateProducto(this.id,data,this.token).subscribe(
        response=>{
          console.log(response);
          if(response.data != undefined){
            toastr.success("Actualización completada.");
            this.init_data();
          }else{
            toastr.error(response.message);
          }
        }
      );
    }
  }

  delete_variacion(id:any){
    this.btn_delete_variacion = true;
    this._productoService.deleteVariacion(id,this.token).subscribe(
      response=>{
        console.log(response);
        if(response.data != undefined){
          toastr.success("Eliminacion completada.");
          this.init_variaciones();
        }else{
          toastr.error(response.message);
        }
        this.btn_delete_variacion = false;
        $('#delete-'+id).modal('hide');
       
      }
    );
  }

  select_variedad(item:any){
    this.variedad_selected = item;
  }

  delete_imagen(id:any){
    this.btn_delete_imagen = true;
    this._productoService.deleteImgProducto(id,this.token).subscribe(
      response=>{
        console.log(response);
        if(response.data != undefined){
          toastr.success("Eliminacion completada.");
          this.init_galeria();
        }else{
          toastr.error(response.message);
        }
        this.btn_delete_imagen = false;
        $('#deleteImg-'+id).modal('hide');
      }
    );
  }

  update_precio(){
    this.btn_precio_variacion = true;
    this._productoService.updatePrecioVariacion(this.variedad_selected._id,{
      precio: this.variedad_selected.precio
    },this.token).subscribe(
      response=>{
        console.log(response);
        if(response.data != undefined){
          toastr.success('Precio actualizado.');
          $('#precioModal').modal('hide');
          this.init_variaciones(); 
        }else{
          toastr.error(response.message);
        }
        this.btn_precio_variacion = false;
      }
    );
  }
}

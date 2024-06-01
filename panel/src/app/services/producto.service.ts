import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  public url = GLOBAL.url;

  constructor(
    private _http : HttpClient
  ) { }

  createCategoria(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'/createCategoria',data,{headers:headers});
  }

  getCategorias(clasificacion:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getCategorias/'+clasificacion,{headers:headers});
  }

  setStateCategoria(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'/setStateCategoria/'+id,data,{headers:headers});
  }

  getCategoria(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getCategoria/'+id,{headers:headers});
  }

  updateCategoria(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'/updateCategoria/'+id,data,{headers:headers});
  }

  createProducto(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Authorization':token});
    const fd = new FormData();
    fd.append('titulo',data.titulo);
    fd.append('clasificacion',data.clasificacion);
    fd.append('categoria',data.categoria);
    fd.append('subcategoria',data.subcategoria);
    fd.append('descripcion',data.descripcion);

    fd.append('etiquetas',JSON.stringify(data.etiquetas));
    fd.append('variaciones',JSON.stringify(data.variaciones));
    if(data.galeria.length >= 1){
      fd.append('galeria',JSON.stringify(data.galeria));
      data.galeria.forEach((element:any) => { fd.append('files[]',element.imagen) });
    }
    return this._http.post(this.url+'/createProducto',fd,{headers:headers});
  }

  uploadImgProducto(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Authorization':token});
    const fd = new FormData();
    fd.append('titulo',data.titulo);
    fd.append('imagen',data.imagen);
    fd.append('producto',data.producto);
    return this._http.post(this.url+'/uploadImgProducto',fd,{headers:headers});
  }

  getProductos(filtro:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getProductos/'+filtro,{headers:headers});
  }

  searchProductos(filtro:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/searchProductos/'+filtro,{headers:headers});
  }

  setStateProducto(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'/setStateProducto/'+id,data,{headers:headers});
  }

  getProducto(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getProducto/'+id,{headers:headers});
  }

  getVariacionesProducto(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getVariacionesProducto/'+id,{headers:headers});
  }

  getGaleriaProducto(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getGaleriaProducto/'+id,{headers:headers});
  }

  updateProducto(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'/updateProducto/'+id,data,{headers:headers});
  }

  addVariacion(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'/addVariacion',data,{headers:headers});
  }

  deleteVariacion(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url+'/deleteVariacion/'+id,{headers:headers});
  }

  deleteImgProducto(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url+'/deleteImgProducto/'+id,{headers:headers});
  }

  getCategoriasCupon(filtro:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getCategoriasCupon/'+filtro,{headers:headers});
  }

  getProductosCupon(filtro:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getProductosCupon/'+filtro,{headers:headers});
  }

  createCupon(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'/createCupon',data,{headers:headers});
  }

  getCupones(codigo:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getCupones/'+codigo,{headers:headers});
  }

  getCupon(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getCupon/'+id,{headers:headers});
  }

  updateCupon(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'/updateCupon/'+id,data,{headers:headers});
  }

  getDetallesCupon(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getDetallesCupon/'+id,{headers:headers});
  }

  addDetalleCupon(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'/addDetalleCupon',data,{headers:headers});
  }


  deleteCupon(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url+'/deleteCupon/'+id,{headers:headers});
  }

  updatePrecioVariacion(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'/updatePrecioVariacion/'+id,data,{headers:headers});
  }

}

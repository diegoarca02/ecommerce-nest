import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  public url = GLOBAL.url;
  public eventCart = new EventEmitter<any>();

  constructor(
    private _http : HttpClient
  ) { }

  createtCliente(data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url+'/createtCliente',data,{headers:headers});
  }

  createtClienteGoogle(data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url+'/createtClienteGoogle',data,{headers:headers});
  }

  logintCliente(data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url+'/logintCliente',data,{headers:headers});
  }

  verificationCliente(token:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/verificationCliente/'+token,{headers:headers});
  }

  getNewProducts():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/getNewProducts',{headers:headers});
  }
  
  getProductosShop():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/getProductosShop',{headers:headers});
  }

  getCategoriasShop(clasificacion:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/getCategoriasShop/'+clasificacion,{headers:headers});
  }

  getProductoShop(slug:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/getProductoShop/'+slug,{headers:headers});
  }

  applyCupon(codigo:any,data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.put(this.url+'/applyCupon/'+codigo,data,{headers:headers});
  }

  eventToCart(){
    this.eventCart.emit(true);
  }

  createVentaGuest(data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url+'/createVentaGuest/',data,{headers:headers});
  }

  getVentaGuest(id:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/getVentaGuest/'+id,{headers:headers});
  }
}

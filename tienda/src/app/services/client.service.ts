import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  public url = GLOBAL.url;

  constructor(
    private _http : HttpClient
  ) { }

  addProductCart(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'/addProductCart',data,{headers:headers});
  }

  getCartClient(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getCartClient',{headers:headers});
  }

  deleteProductoCart(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url+'/deleteProductoCart/'+id,{headers:headers});
  }

  getClientPerfil(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getClientPerfil',{headers:headers});
  }

  updatePSWClient(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'/updatePSWClient',data,{headers:headers});
  }

  createDireccionClient(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'/createDireccionClient',data,{headers:headers});
  }

  getDireccionesCliente(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getDireccionesCliente',{headers:headers});
  }

  deleteDireccionClient(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url+'/deleteDireccionClient/'+id,{headers:headers});
  }

  getDireccionClient(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getDireccionClient/'+id,{headers:headers});
  }

  updateDireccionClient(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'/updateDireccionClient/'+id,data,{headers:headers});
  }

  updateCantidadCart(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'/updateCantidadCart/'+id,data,{headers:headers});
  }

  createVentaClient(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'/createVentaClient',data,{headers:headers});
  }

  getVentasClient(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getVentasClient',{headers:headers});
  }

  getVentaClient(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getVentaClient/'+id,{headers:headers});
  }



}

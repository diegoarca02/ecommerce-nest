import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  public url = GLOBAL.url;

  constructor(
    private _http : HttpClient
  ) { }

  getProductosInventario(filtro:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getProductosInventario/'+filtro,{headers:headers});
  }

  getVariacionInventario(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getVariacionInventario/'+id,{headers:headers});
  }
}

import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  public url = GLOBAL.url;

  constructor(
    private _http : HttpClient
  ) { }

  createIngreso(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'/createIngreso',data,{headers:headers});
  }

  getIngresos(inicio:any,fin:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getIngresos/'+inicio+'/'+fin,{headers:headers});
  }

  getIngreso(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getIngreso/'+id,{headers:headers});
  }

  setStateIngreso(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'/setStateIngreso/'+id,data,{headers:headers});
  }
}

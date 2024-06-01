import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from "@angular/common/http";
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public url = GLOBAL.url;

  constructor(
    private _http : HttpClient
  ) { }

  createUsuario(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'/createUsuario',data,{headers:headers});
  }

  getUsuarios(filtro:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getUsuarios/'+filtro,{headers:headers});
  }

  setState(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'/setState/'+id,data,{headers:headers});
  }

  getUsuario(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'/getUsuario/'+id,{headers:headers});
  }

  updateUsuario(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'/updateUsuario/'+id,data,{headers:headers});
  }

  login(data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url+'/login',data,{headers:headers});
  }

  isAuthenticate(){
    let token : any = localStorage.getItem('token');

    try {
      var helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(token);

      if(!token){
        localStorage.clear();
        return false;
      }

      if(!decodedToken || decodedToken == undefined){
        localStorage.clear();
        return false;
      }

      if(helper.isTokenExpired(token)){
        localStorage.clear();
        return false;
      }
    } catch (error) {
      localStorage.clear();
      return false;
    }

    return true;
  }
}

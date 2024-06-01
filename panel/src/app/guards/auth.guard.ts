import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private usuario:UsuarioService,
    private _router:Router
  ){

  }

  canActivate(): any {
    let access = this.usuario.isAuthenticate();
    if(!access) this._router.navigate(['/']);
    return true;
  }
  
}

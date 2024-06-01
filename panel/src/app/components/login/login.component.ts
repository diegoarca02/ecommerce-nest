import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
declare var toastr:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public usuario : any = {
    email: '',
    password: ''
  };
  public load_btn = false;
  public token = localStorage.getItem('token');
  
  constructor(
    private _usuarioService:UsuarioService,
    private _router:Router
  ){}

  ngOnInit(){
    if(this.token){
      this._router.navigate(['/dashboard']);
    }
  }

  login(){
    if(!this.usuario.email){
      toastr.error("El correo es requerido.");
    }else if(!this.usuario.password){
      toastr.error("La contraseña es requerida.");
    }else{
      //
      console.log(this.usuario);
      this.load_btn = true;
      this._usuarioService.login(this.usuario).subscribe(
        response=>{
          console.log(response);
          if(response.data != undefined){
            localStorage.clear();
            localStorage.setItem('user',JSON.stringify(response.data));
            localStorage.setItem('token',response.jwt);
            this._router.navigate(['/dashboard']);
          }else{
            toastr.error(response.message);
          }

          this.load_btn = false;
        },
        error=>{
          this.load_btn = false;
        }
      );
    }
  }
}

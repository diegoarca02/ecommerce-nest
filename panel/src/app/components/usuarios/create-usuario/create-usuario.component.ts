import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
declare var toastr:any;

@Component({
  selector: 'app-create-usuario',
  templateUrl: './create-usuario.component.html',
  styleUrls: ['./create-usuario.component.css']
})
export class CreateUsuarioComponent {
  public usuario : any = {
    rol: ''
  };
  public token = localStorage.getItem('token');
  public btn_load = false;

  constructor(
    private _usuarioService : UsuarioService,
    private _router:Router
  ){}

  ngOnInit(){}

  registrar(){
    
    if(!this.usuario.nombres){
      toastr.error("Los nombres son requeridos.");
    }else if(!this.usuario.apellidos){
      toastr.error("Los apellidos son requeridos.");
    }else if(!this.usuario.email){
      toastr.error("El correo es requerido.");
    }else if(!this.usuario.rol){
      toastr.error("El rol es requerido.");
    }else{
      this.btn_load = true;
      this._usuarioService.createUsuario(this.usuario,this.token).subscribe(
        response=>{
          if(response.data != undefined){
            console.log(response);
            this.btn_load = false;
            this._router.navigate(['/colaborador']);
          }else{
            toastr.error(response.message);
          }
        },
        error=>{
          console.log(error);
          this.btn_load = false;
        }
      );
    }
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
declare var toastr:any;

@Component({
  selector: 'app-edit-usuario',
  templateUrl: './edit-usuario.component.html',
  styleUrls: ['./edit-usuario.component.css']
})
export class EditUsuarioComponent {

  public token = localStorage.getItem('token');
  public usuario : any = {};
  public btn_load = false;
  public id = '';
  public data = false;
  public load_data = true;

  constructor(
    private _route:ActivatedRoute,
    private _usuarioService:UsuarioService
  ){}

  ngOnInit(){
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this.init_data();
      }
    );
  }

  init_data(){
    this.load_data = true;
    this._usuarioService.getUsuario(this.id,this.token).subscribe(
      response=>{
        console.log(response);
        if(response.data != undefined){
          this.usuario = response.data;
          this.data = true;
        }else{
          this.data = false;
        }
        this.load_data = false;
      }
    )
  }

  actualizar(){
    if(!this.usuario.email){
      toastr.error("El correo es requerido.");
    }else if(!this.usuario.rol){
      toastr.error("El rol es requerido.");
    }else{
      this._usuarioService.updateUsuario(this.id,this.usuario,this.token).subscribe(
        response=>{
          console.log(response);
          if(response.data != undefined){
            toastr.success("Usuario acctualizado.");
            this.init_data();
          }else{
            toastr.error(response.message);
          }
        }
      );
    }
  }
}

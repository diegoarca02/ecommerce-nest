import { Component } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-perfil-cuenta',
  templateUrl: './perfil-cuenta.component.html',
  styleUrls: ['./perfil-cuenta.component.css']
})
export class PerfilCuentaComponent {
  public cliente : any = {};
  public token = localStorage.getItem('token');
  public load_data = true;

  public password = '';
  public password_c = '';
  public msm_error_psw = '';
  public msm_success_psw = '';

  constructor(
    private _clienteService:ClientService
  ){

  }

  ngOnInit(){
    this.init_data();    
  }

  init_data(){
    this.load_data = true;
    this._clienteService.getClientPerfil(this.token).subscribe(
      response=>{
        this.cliente = response.data;
        this.load_data = false;
      }
    );
  }

  update_psw(){
    if(!this.password){
      this.msm_error_psw = 'La nueva contraseña es requerida.';
    }else if(!this.password_c){
      this.msm_error_psw = 'La confirmación de contraseña es requerida.';
    }else if(this.password != this.password_c){
      this.msm_error_psw = 'Las contraseñas no coinciden.';
    }else{
      this.msm_error_psw = '';
      this._clienteService.updatePSWClient({password:this.password},this.token).subscribe(
        response=>{
          console.log(response);
          if(response.data != undefined){
            this.msm_success_psw = 'Se actualizó la contraseña';
            this.msm_error_psw = '';
          }else{
            this.msm_error_psw = response.message;
            this.msm_success_psw = '';
          }

          this.password = '';
          this.password_c = '';
        }
      );
    }
  }
}

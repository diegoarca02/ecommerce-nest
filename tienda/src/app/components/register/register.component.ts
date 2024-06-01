import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GuestService } from 'src/app/services/guest.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public cliente: any = {};
  public msm_error = '';
  public btn_load = false;

  constructor(
    private _guestService:GuestService,
    private _router:Router
  ){}

  ngOnInit(){

  }

  validate(){
    if(!this.cliente.nombres){
      this.msm_error = 'Los nombres son requeridos';
    }else if(!this.cliente.apellidos){
      this.msm_error = 'Los apellidos son requeridos';
    }else if(!this.cliente.email){
      this.msm_error = 'El correo es requerido';
    }else if(!this.cliente.password){
      this.msm_error = 'La contraseña es requerida';
    }else if(!this.cliente.password_confirm){
      this.msm_error = 'La confirmación de la contraseña es requerida';
    }else if(this.cliente.password != this.cliente.password_confirm){
      this.msm_error = 'Las contraseña no coinciden';
    }else{
      this.msm_error = '';
      console.log(this.cliente);
      this.btn_load = true;
      this._guestService.createtCliente(this.cliente).subscribe(
        response=>{
          console.log(response);
          if(response.data != undefined){
            this._router.navigate(['/login'],{queryParams: { email: response.data.email }});
          }else{
            this.msm_error = response.message;
          }
          this.btn_load = false;
        }
      );
    }
  }
}

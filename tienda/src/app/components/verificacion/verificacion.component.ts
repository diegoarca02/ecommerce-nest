import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuestService } from 'src/app/services/guest.service';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.css']
})
export class VerificacionComponent {

  public token = '';
  public state = true;
  public load_data = true;

  constructor(
    private _route:ActivatedRoute,
    private _guestService:GuestService
  ){

  }

  ngOnInit(){
    this._route.params.subscribe(params=>{
      this.token = params['token'];
      this.init_data();
    });
  }

  init_data(){
    this.load_data = true;
    this._guestService.verificationCliente(this.token).subscribe(
      response=>{
        console.log(response);
        this.state = response.state;
        this.load_data = false;
      }
    );
  }
}

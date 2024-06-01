import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { GuestService } from 'src/app/services/guest.service';

@Component({
  selector: 'app-detalles-guest-venta',
  templateUrl: './detalles-guest-venta.component.html',
  styleUrls: ['./detalles-guest-venta.component.css']
})
export class DetallesGuestVentaComponent {

  public id = '';
  public load_data = true;
  public venta : any= {};
  public detalles : Array<any> = [];
  public subtotal = 0;
  public url = GLOBAL.url;

  constructor(
    private _guestService:GuestService,
    private _route:ActivatedRoute
  ){

  }

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
    this._guestService.getVentaGuest(this.id).subscribe(
      response=>{
        this.venta = response.data.venta;
        this.detalles = response.data.detalles;
        for(let item of this.detalles){
          this.subtotal = this.subtotal + (item.cantidad*item.precio);
        }
        this.load_data = false;
      }
    );
  }
}

import { Component } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-index-venta',
  templateUrl: './index-venta.component.html',
  styleUrls: ['./index-venta.component.css']
})
export class IndexVentaComponent {
  public token = localStorage.getItem('token');
  public ventas : Array<any> = [];
  public url = GLOBAL.url;

  constructor(
    private _clienteService:ClientService
  ){

  }

  ngOnInit(){
    this.init_data();
  }

  init_data(){
    this._clienteService.getVentasClient(this.token).subscribe(
      response=>{
        console.log(response);
        this.ventas = response.data;
      }
    );
  }
}

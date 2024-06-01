import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.css']
})
export class DetalleVentaComponent {
  public token = localStorage.getItem('token');
  public id = '';
  public venta : any = {};
  public detalles : Array<any> = [];
  public load_data = true;
  public url = GLOBAL.url;
  public subtotal = 0;  

  constructor(
    private _clienteService:ClientService,
    private _route:ActivatedRoute
  ){

  }

  ngOnInit(){
    this._route.params.subscribe(params=>{
      this.id = params['id'];
      this.init_data();
    });
  }

  init_data(){
    this.load_data = true;
    this._clienteService.getVentaClient(this.id,this.token).subscribe(
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

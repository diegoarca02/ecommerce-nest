import { Component } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
declare var $:any;

@Component({
  selector: 'app-index-direccion',
  templateUrl: './index-direccion.component.html',
  styleUrls: ['./index-direccion.component.css']
})
export class IndexDireccionComponent {

  public token = localStorage.getItem('token');
  public direcciones : Array<any> = [];
  public load_btn = false;
  public load_data = true;

  constructor(
    private _clienteService:ClientService
  ){

  }

  ngOnInit(){
    this.init_data();
  }
   
  init_data(){
    this.load_data = true;
    this._clienteService.getDireccionesCliente(this.token).subscribe(
      response=>{
        this.direcciones = response.data;
        console.log(this.direcciones);
        this.load_data = false;
      }
    );
  }

  delete(id:any){
    console.log(id);
    this.load_btn = true;
    this._clienteService.deleteDireccionClient(id,this.token).subscribe(
      response=>{
        console.log(response);
        if(response.data != undefined){
          this.init_data();
          setTimeout(() => {
            $('#deleteModal-'+id).modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $('body').css('overflow', 'auto');
            $('body').css('padding-right', '0px');
          }, 50);
        }else{

        }
        this.load_btn = false;
      }
    );
  }
}

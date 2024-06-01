import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { InventarioService } from 'src/app/services/inventario.service';
declare var JsBarcode:any;

@Component({
  selector: 'app-detalle-inventario',
  templateUrl: './detalle-inventario.component.html',
  styleUrls: ['./detalle-inventario.component.css']
})
export class DetalleInventarioComponent {

  public token = localStorage.getItem('token');
  public id = '';
  public variacion : any = {};
  public unidades : Array<any> = [];
  public almacenes : Array<any> = [];
  public almacen_active = '';
  public unidades_active: Array<any> = [];

  constructor(
    private _inventarioService:InventarioService,
    private _route:ActivatedRoute
  ){
    let arr_almacenes = GLOBAL.almacenes;

    for(var item of arr_almacenes){
      this.almacenes.push({
        almacen: item,
        unidades: []
      });
    }

    this.almacen_active = this.almacenes[0].almacen;
    
  }

  ngOnInit(){

    this._route.params.subscribe(params=>{
      this.id = params['id'];
      this.init_data();
    });
  }

  setAlmacen(value:any){
    this.almacen_active = value;
    this.unidades_active = this.unidades.filter(item=> item.ingreso.almacen == value);
    
    this.unidades_active.forEach((element,index) => {
      setTimeout(() => {
        JsBarcode("#barcode-"+index, element.codigo,{
          height: 40
        });
      }, 50);
    });
    
  }

  init_data(){
    this._inventarioService.getVariacionInventario(this.id,this.token).subscribe(
      response=>{
        if(response.data != undefined){
          this.variacion = response.data;
          this.unidades = response.unidades;

          this.setAlmacen(this.almacen_active);
          
          for(var item of this.unidades){
            for(var subitem of this.almacenes){
              if(item.ingreso.almacen == subitem.almacen){
                subitem.unidades.push(item);
              }
            }
          }

          console.log(this.almacenes);
          
        }
      }
    )
  }

}

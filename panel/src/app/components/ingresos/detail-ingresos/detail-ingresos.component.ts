import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { IngresoService } from 'src/app/services/ingreso.service';
declare var JsBarcode:any;
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
declare var $:any;
declare var toastr:any;

@Component({
  selector: 'app-detail-ingresos',
  templateUrl: './detail-ingresos.component.html',
  styleUrls: ['./detail-ingresos.component.css']
})
export class DetailIngresosComponent {

  public token = localStorage.getItem('token');
  public id = '';
  public ingreso : any = {};
  public detalles : Array<any> = [];
  public detalles_xls : Array<any> = [];
  public url = GLOBAL.url;
  public load_data = true;
  public data = true;
  public data_str : any = '';

  constructor(
    private _ingresoService:IngresoService,
    private _route:ActivatedRoute
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
    this._ingresoService.getIngreso(this.id,this.token).subscribe(
      response=>{
        if(response.data != undefined){
          this.ingreso = response.data;
          this.data_str = new Date(this.ingreso.createdAt);
          this.detalles = response.detalles;
          this.detalles.forEach((element,idx) => {
            setTimeout(() => {
              JsBarcode("#barcode-"+idx, element.codigo,{
                height: 40
              });
            }, 50);

            this.detalles_xls.push({
              producto: element.producto.titulo,
              talla: element.producto_variedad.talla,
              color: element.producto_variedad.color,
              codigo: element.codigo,
              precio_unidad: element.precio_unidad,
            });
          });
          console.log(this.detalles_xls);

          this.data = true;
        }else{
          this.data = false;
        }

        this.load_data = false;
      }
    );
  }

  downloadXLS(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Unidades");

    worksheet.addRow(undefined);
    for (let x1 of this.detalles_xls){
      let x2=Object.keys(x1);

      let temp=[]
      for(let y of x2){
        temp.push(x1[y])
      }
      worksheet.addRow(temp)
    }


    //GENERAR EXCEL
    let fname='Ingreso-'+this.data_str.getFullYear()+'-'+this.ingreso.codigo.toString().padStart(6,'000000');

    worksheet.columns = [
      { header: 'Producto', key: 'col1', width: 35},
      { header: 'Talla', key: 'col2', width: 10},
      { header: 'Color', key: 'col3', width: 15},
      { header: 'Codigo', key: 'col4', width: 20},
      { header: 'Precio', key: 'col5', width: 10}
    ]as any;

    //add data and file name and download
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname+'.xlsx');
    });
  }

  setEstado(estado:any){
    this._ingresoService.setStateIngreso(this.id,{
      estado: estado,
      estado_: estado
    },this.token).subscribe(
      response=>{
        console.log(response);
        if(response.data != undefined){
          $('#estadoModal').modal('hide');
          toastr.success("Ingreso actualizado.");
          this.init_data();
        }else{
          toastr.error(response.message);
        }
      }
    );
  }
}

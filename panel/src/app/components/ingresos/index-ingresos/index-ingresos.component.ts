import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { IngresoService } from 'src/app/services/ingreso.service';
declare var $:any;
declare var moment:any;

@Component({
  selector: 'app-index-ingresos',
  templateUrl: './index-ingresos.component.html',
  styleUrls: ['./index-ingresos.component.css']
})
export class IndexIngresosComponent {

  public token = localStorage.getItem('token');
  public load_data = true;
  public ingresos :Array<any> = [];
  public page = 1;
  public pageSize = 15;
  public url = GLOBAL.url;

  public startDate :any = '';
  public endDate :any = '';

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _ingresoService:IngresoService
  ){

  }

  ngOnInit(){
    setTimeout(() => {
      $("#kt_daterangepicker_1").daterangepicker();

      $("#kt_daterangepicker_1").daterangepicker({
        opens: 'left'
      }, (start:any,end:any, label:any)=>{
        let start_ = moment(start).format('YYYY-MM-DD');
        let end_ = moment(end).format('YYYY-MM-DD');
        this._router.navigate(['/ingresos'],{queryParams: {startDate:start_,endDate:end_}});
      });
    }, 50);

    this._route.queryParams.subscribe(
      (params:any)=>{
        if(params.startDate && params.endDate){
          this.startDate = params.startDate;
          this.endDate = params.endDate;
        }else{
          this.startDate = moment().startOf('month').format('YYYY-MM-DD');
          this.endDate = moment().endOf('month').format('YYYY-MM-DD');
        }

        this.setDate();
      }
    );
  }

  setDate(){
    //YYYY-MM-DD
    setTimeout(() => {
      $("#kt_daterangepicker_1").data('daterangepicker').setStartDate(new Date(this.startDate+'T00:00:00'));
      $("#kt_daterangepicker_1").data('daterangepicker').setEndDate(new Date(this.endDate+'T23:59:59'));
    }, 50);

    this.filtro_ingresos();
  }
 
  filtro_ingresos(){
    let inicio = moment(this.startDate).format('YYYY-MM-DD');
    let fin = moment(this.endDate).format('YYYY-MM-DD');
    this.load_data = true;
    this._ingresoService.getIngresos(inicio,fin,this.token).subscribe(
      response=>{
        console.log(response);
        this.ingresos = response.data;
        this.load_data = false;
      }
    );
  }
}

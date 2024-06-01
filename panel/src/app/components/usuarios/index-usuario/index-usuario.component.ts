import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
declare var toastr:any;
declare var $:any;

@Component({
  selector: 'app-index-usuario',
  templateUrl: './index-usuario.component.html',
  styleUrls: ['./index-usuario.component.css']
})
export class IndexUsuarioComponent {

  public filtro = '';
  public token = localStorage.getItem('token');
  public usuarios : Array<any> = [];
  public page = 1;
  public pageSize = 2;
  public btn_state_load = false;
  public load_data = true;

  constructor(
    private _usuarioService:UsuarioService,
    private _router:Router,
    private _route:ActivatedRoute
  ){

  }
  

  ngOnInit(){
    this.init_data('Todos');
    this._route.queryParams.subscribe(
      params=>{
        this.filtro = params['filter'];
        if(this.filtro){
          this.init_data(this.filtro);
        }else{
          this.init_data('Todos');
        }
      }
    );
  }

  init_data(filtro:any){
    filtro = filtro.trim();
    if(filtro != 'Todos') this.filtro = filtro;
    this.load_data = true;
    this._usuarioService.getUsuarios(filtro,this.token).subscribe(
      response=>{
        console.log(response);
        
        if(response != undefined){
          this.usuarios = response;
          this.load_data = false;
        }else{
          
        }
      },
      error=>{

        if(error.error.statusCode === 403){
          localStorage.clear();
          this._router.navigate(['/']);
        }
      }
    );
  }

  filter(){
    if(this.filtro){
      this._router.navigate(['/colaborador'],{ queryParams : { filter : this.filtro } });
    }else{
      this._router.navigate(['/colaborador']);
    }
  }

  setState(id:any,estado:any){
    this.btn_state_load = true;
    this._usuarioService.setState(id,{estado:estado},this.token).subscribe(
      response=>{
        console.log(response);
        $('#state-'+id).modal('hide');
        this.init_data('Todos');
        this.btn_state_load = false;
      }
    );
  }

  
}

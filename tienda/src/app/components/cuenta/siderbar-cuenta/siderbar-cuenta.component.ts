import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-siderbar-cuenta',
  templateUrl: './siderbar-cuenta.component.html',
  styleUrls: ['./siderbar-cuenta.component.css']
})
export class SiderbarCuentaComponent {
  public route = '';
  public id = '';

  constructor(
    private _route:ActivatedRoute,
    private _router:Router
  ){

  }

  ngOnInit(){

    this._route.params.subscribe(
      params=>{
        
        if(!params['route']){
          this.route = 'perfil';
          this._router.navigate(['/cuenta',this.route]);
        }else{
          this.route = params['route'];
        }

        this.id = params['id'];

        console.log(this.id);
      }
    );
  }
}

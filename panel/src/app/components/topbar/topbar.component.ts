import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {

  constructor(
    private _userService:UsuarioService
  ){
 
  }

  public show_menu = false;

  openMenu(){
    if(this.show_menu) this.show_menu = false;
    else if(!this.show_menu)this.show_menu = true;
  }

  logout(){
    localStorage.clear();
    window.location.reload();
  }
}

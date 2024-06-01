import { Component, effect } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { GuestService } from 'src/app/services/guest.service';
declare var Swiper:any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  public productos : Array<any> = [];
  public url = GLOBAL.url;

  constructor(
    private _guestService:GuestService
  ){

  }

  ngOnInit(){
    new Swiper(".mySwiper", {
      effect: 'fade'
    });

    new Swiper(".SwiperProducts", {
      slidesPerView: 5,
      spaceBetween: 30,
      freeMode: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

    this.init_productos();
  }

  init_productos(){
    this._guestService.getNewProducts().subscribe(
      response=>{
        this.productos = response.data;
      }
    );
  }
}

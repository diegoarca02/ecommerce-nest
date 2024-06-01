import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClientService } from 'src/app/services/client.service';
declare var L:any;

@Component({
  selector: 'app-edit-direccion',
  templateUrl: './edit-direccion.component.html',
  styleUrls: ['./edit-direccion.component.css']
})
export class EditDireccionComponent {
  @Input() iddireccion = '';
  public token = localStorage.getItem('token');
  public direccion : any = {
    prefijo: ''
  };
  public msm_error = '';
  public msm_success = '';
  public map : any = {};
  public marker : any;
  public lat = '';
  public lng = '';
  public newIcon : any = {};
  public data_geo : any = undefined;

  constructor(
    private _clienteService:ClientService,
    private _router:Router
  ){
    this.newIcon = L.icon({
      iconUrl: 'assets/img/marker.png',
  
      iconSize:     [40, 40], // size of the icon
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });
  }

  ngOnInit(){
    console.log(this.iddireccion);
    this.init_data();
  }

  init_data(){
    this._clienteService.getDireccionClient(this.iddireccion,this.token).subscribe(
      response=>{
        if(response.data != undefined){
          this.direccion = response.data;
          this.lat = this.direccion.lat;
          this.lng = this.direccion.lng;
          this.initMap();
        }
      }
    );
  }

  initMap(){
    this.map = L.map('myMap').setView([this.lat,this.lng ], 16);
    L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    this.marker = L.marker([this.lat,this.lng],
      {draggable: true,autoPan:true,icon: this.newIcon}).addTo(this.map) // "Kyiv" is the accessible name of this marker
      .bindPopup('Ubicación Actual');

    L.Control.geocoder({
      defaultMarkGeocode: false
    }).on('markgeocode', async (event:any)=>{
      console.log(event);
      const { center } = event.geocode;
      this.marker.setLatLng(center).update();
      this.map.panTo(center);

      this.lat = center.lat;
      this.lng = center.lng;

      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.lng},${this.lat}.json?access_token=${GLOBAL.token_mapbox}&language=es`);
      this.data_geo = await response.json();
      console.log(this.data_geo);
    }).addTo(this.map);

    this.marker.on('dragend',async (event:any)=>{
      let marker = event.target.getLatLng();

      this.lat = marker.lat;
      this.lng = marker.lng;
      
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.lng},${this.lat}.json?access_token=${GLOBAL.token_mapbox}&language=es`);
      this.data_geo = await response.json();
      console.log(this.data_geo);
      
    });
  }

  update(){
    if(!this.direccion.nombres){
      this.msm_error = 'Ingrese los nombres';
    }else if(!this.direccion.apellidos){
      this.msm_error = 'Ingrese los apellidos';
    }else if(!this.direccion.prefijo){
      this.msm_error = 'Seleccione el prefijo';
    }else if(!this.direccion.telefono){
      this.msm_error = 'Ingrese el telefono';
    }else if(this.data_geo == undefined){
      this.msm_error = 'Busque la dirección en el mapa';
    }else if(this.data_geo.features.length == 0){
      this.msm_error = 'La ubicación es incorrecta.';
    }else{
      this.direccion.lat = this.lat;
      this.direccion.lng = this.lng;
      this.msm_error = '';
      for(var context of this.data_geo.features){
        if(context.place_type[0] == 'address'){
          this.direccion.address = context.place_name_es;
        }else if(context.place_type[0] == 'postcode'){
          this.direccion.postcode = context.text_es;
        }else if(context.place_type[0] == 'locality'){
          this.direccion.locality = context.text_es;
        }else if(context.place_type[0] == 'place'){
          this.direccion.place = context.text_es;
        }else if(context.place_type[0] == 'region'){
          this.direccion.region = context.text_es;
        }else if(context.place_type[0] == 'country'){
          this.direccion.country = context.text_es;
        }
      }

      this._clienteService.updateDireccionClient(this.iddireccion,this.direccion,this.token).subscribe(
        response=>{
          console.log(response);
          if(response.data != undefined){
              this.msm_success = 'Dirección actualizada correctamente';
              this.direccion = {
                prefijo: ''
              }
              this._router.navigate(['/cuenta/direcciones']);
          }else{
            this.msm_success = '';
            this.msm_error = response.message;
          }
        }
      );

    }
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialResponse } from 'google-one-tap';
import { ClientService } from 'src/app/services/client.service';
import { GuestService } from 'src/app/services/guest.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public email = '';
  public password = '';
  public msm_error_email = '';
  public msm_error_password = '';
  public btn_load = false;
  public googleToken : any = undefined;

  constructor(
    private _clienteService:ClientService,
    private _guestService:GuestService,
    private _router:Router,
    private _route:ActivatedRoute
  ){
    if(localStorage.getItem('googleToken') != null){
      this.googleToken = JSON.parse(localStorage.getItem('googleToken')!);
    }

    console.log(this.googleToken);
    
  }

  ngOnInit(){
    this._route.queryParams.subscribe(
      params=>{
        console.log();
        if(params['email']){
          this.email = params['email'];
        }
        this.initGoogle();
      }
    );
  }

  initGoogle(){
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      this.initializeGoogleSignIn();
    };

    script.onerror = (error) => {
      console.error('Error loading Google SDK:', error);
    };

    document.head.appendChild(script);
  }

  initializeGoogleSignIn(){
    if(!(<any>window).google || !(<any>window).google.accounts || !(<any>window).google.accounts.id){
      console.log('Google Sign-In library not available');
      return;
    }

    (<any>window).onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: '775893432403-mci91krjtbr1fdphqq9qfru9u3rkmrvn.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById("btnGoogle"), 
        {theme: 'outline', size: 'large', width: 380}
      );
     };
  }

  removeGoogleToken(){
    localStorage.removeItem('googleToken');
    this.googleToken = undefined;
  }

  async handleCredentialResponse(response:CredentialResponse){
    console.log(response.credential);
    const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+response.credential);
    const userInfo = await googleResponse.json();
    console.log(userInfo);
    this._guestService.createtClienteGoogle({
      nombres: userInfo.given_name,
      apellidos: userInfo.family_name,
      email: userInfo.email,
      portada: userInfo.picture,
    }).subscribe(
      response=>{
        console.log(response);
        localStorage.clear();
        localStorage.setItem('token',response.jwt);
        localStorage.setItem('user_data',JSON.stringify(response.data));
        localStorage.setItem('googleToken',JSON.stringify(userInfo));
        this._router.navigate(['/']);
      }
    );
  }

  validate(){
    if(!this.email){
      this.msm_error_password = '';
      this.msm_error_email = 'El correo es requerido';
    }else if(!this.password){
      this.msm_error_email = '';
      this.msm_error_password = 'La contraseña es requerida';
    }else{
      this.msm_error_password = '';
      this.msm_error_email = '';
      console.log(this.email + ' '+this.password);
      this.btn_load = true;
      this._guestService.logintCliente({
        email: this.email,
        password: this.password
      }).subscribe(
        response=>{
          console.log(response);
          if(response.data != undefined){
            localStorage.clear();
            localStorage.setItem('token',response.jwt);
            localStorage.setItem('user_data',JSON.stringify(response.data));
            this._router.navigate(['/']);
          }else{
            if(response.tipo == 'password'){
              this.msm_error_password = response.message;
            }else if(response.tipo == 'email'){
              this.msm_error_email = response.message;
            }
          }
          this.btn_load = false;
        }
      );
    }
  }
}

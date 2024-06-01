import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { routing } from "src/app/app.routing";

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { VerificacionComponent } from './components/verificacion/verificacion.component';
import { ShopComponent } from './components/shop/shop.component';
import { BarComponent } from './components/bar/bar.component';
import { ProductoComponent } from './components/producto/producto.component';
import { SiderbarCuentaComponent } from './components/cuenta/siderbar-cuenta/siderbar-cuenta.component';
import { IndexDireccionComponent } from './components/cuenta/direcciones/index-direccion/index-direccion.component';
import { CreateDireccionComponent } from './components/cuenta/direcciones/create-direccion/create-direccion.component';
import { EditDireccionComponent } from './components/cuenta/direcciones/edit-direccion/edit-direccion.component';
import { PerfilCuentaComponent } from './components/cuenta/perfil-cuenta/perfil-cuenta.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { IndexVentaComponent } from './components/cuenta/ventas/index-venta/index-venta.component';
import { DetalleVentaComponent } from './components/cuenta/ventas/detalle-venta/detalle-venta.component';
import { DetallesGuestVentaComponent } from './components/cuenta/ventas/detalles-guest-venta/detalles-guest-venta.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    RegisterComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    VerificacionComponent,
    ShopComponent,
    BarComponent,
    ProductoComponent,
    SiderbarCuentaComponent,
    IndexDireccionComponent,
    CreateDireccionComponent,
    EditDireccionComponent,
    PerfilCuentaComponent,
    CartComponent,
    CheckoutComponent,
    IndexVentaComponent,
    DetalleVentaComponent,
    DetallesGuestVentaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    routing,
    NgbPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

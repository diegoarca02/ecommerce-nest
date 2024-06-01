import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { InicioComponent } from "./components/inicio/inicio.component";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { VerificacionComponent } from "./components/verificacion/verificacion.component";
import { ShopComponent } from "./components/shop/shop.component";
import { ProductoComponent } from "./components/producto/producto.component";
import { SiderbarCuentaComponent } from "./components/cuenta/siderbar-cuenta/siderbar-cuenta.component";
import { CartComponent } from "./components/cart/cart.component";
import { CheckoutComponent } from "./components/checkout/checkout.component";
import { DetallesGuestVentaComponent } from "./components/cuenta/ventas/detalles-guest-venta/detalles-guest-venta.component";

const appRoutes : Routes = [
    {path: '', component:InicioComponent},
    {path: 'registro', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'account-verificacion/:token', component: VerificacionComponent},
    {path: 'tienda', component: ShopComponent},
    

    {path: 'cuenta', component: SiderbarCuentaComponent},
    {path: 'cuenta/:route', component: SiderbarCuentaComponent},
    {path: 'cuenta/:route/:id', component: SiderbarCuentaComponent},

    {path: 'cart', component: CartComponent},
    {path: 'checkout', component: CheckoutComponent},
    {path: 'venta/:id', component: DetallesGuestVentaComponent},

    {path: ':slug', component: ProductoComponent},
];

export const appRoutingProviders : any[] = [];
export const routing : ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { routing } from "src/app/app.routing";
import { IndexUsuarioComponent } from './components/usuarios/index-usuario/index-usuario.component';
import { CreateUsuarioComponent } from './components/usuarios/create-usuario/create-usuario.component';
import { EditUsuarioComponent } from './components/usuarios/edit-usuario/edit-usuario.component';
import { LoginComponent } from './components/login/login.component';
import { IndexCategoriaComponent } from './components/categorias/index-categoria/index-categoria.component';
import { CreateCategoriaComponent } from './components/categorias/create-categoria/create-categoria.component';
import { EditCategoriaComponent } from './components/categorias/edit-categoria/edit-categoria.component';
import { IndexProductoComponent } from './components/productos/index-producto/index-producto.component';
import { CreateProductoComponent } from './components/productos/create-producto/create-producto.component';
import { EditProductoComponent } from './components/productos/edit-producto/edit-producto.component';
import { IndexIngresosComponent } from './components/ingresos/index-ingresos/index-ingresos.component';
import { CreateIngresosComponent } from './components/ingresos/create-ingresos/create-ingresos.component';
import { DetailIngresosComponent } from './components/ingresos/detail-ingresos/detail-ingresos.component';
import { IndexInventarioComponent } from './components/inventario/index-inventario/index-inventario.component';
import { DetalleInventarioComponent } from './components/inventario/detalle-inventario/detalle-inventario.component';
import { IndexCuponComponent } from './components/cupones/index-cupon/index-cupon.component';
import { CreateCuponComponent } from './components/cupones/create-cupon/create-cupon.component';
import { EditCuponComponent } from './components/cupones/edit-cupon/edit-cupon.component';
import { IndexClientesComponent } from './components/clientes/index-clientes/index-clientes.component';
import { AsideClientesComponent } from './components/clientes/aside-clientes/aside-clientes.component';
import { PerfilClientesComponent } from './components/clientes/perfil-clientes/perfil-clientes.component';
import { DireccionClientesComponent } from './components/clientes/direccion-clientes/direccion-clientes.component';
import { VentasClientesComponent } from './components/clientes/ventas-clientes/ventas-clientes.component';
import { DetalleVentaClientesComponent } from './components/clientes/detalle-venta-clientes/detalle-venta-clientes.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    TopbarComponent,
    DashboardComponent,
    IndexUsuarioComponent,
    CreateUsuarioComponent,
    EditUsuarioComponent,
    LoginComponent,
    IndexCategoriaComponent,
    CreateCategoriaComponent,
    EditCategoriaComponent,
    IndexProductoComponent,
    CreateProductoComponent,
    EditProductoComponent,
    IndexIngresosComponent,
    CreateIngresosComponent,
    DetailIngresosComponent,
    IndexInventarioComponent,
    DetalleInventarioComponent,
    IndexCuponComponent,
    CreateCuponComponent,
    EditCuponComponent,
    IndexClientesComponent,
    AsideClientesComponent,
    PerfilClientesComponent,
    DireccionClientesComponent,
    VentasClientesComponent,
    DetalleVentaClientesComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    routing,
    FormsModule,
    HttpClientModule,
    NgbPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

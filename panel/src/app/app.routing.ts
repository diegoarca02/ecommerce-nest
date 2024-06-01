import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { IndexUsuarioComponent } from "./components/usuarios/index-usuario/index-usuario.component";
import { CreateUsuarioComponent } from "./components/usuarios/create-usuario/create-usuario.component";
import { EditUsuarioComponent } from "./components/usuarios/edit-usuario/edit-usuario.component";
import { LoginComponent } from "./components/login/login.component";
import { IndexCategoriaComponent } from "./components/categorias/index-categoria/index-categoria.component";
import { CreateCategoriaComponent } from "./components/categorias/create-categoria/create-categoria.component";
import { EditCategoriaComponent } from "./components/categorias/edit-categoria/edit-categoria.component";
import { IndexProductoComponent } from "./components/productos/index-producto/index-producto.component";
import { CreateProductoComponent } from "./components/productos/create-producto/create-producto.component";
import { EditProductoComponent } from "./components/productos/edit-producto/edit-producto.component";
import { IndexIngresosComponent } from "./components/ingresos/index-ingresos/index-ingresos.component";
import { CreateIngresosComponent } from "./components/ingresos/create-ingresos/create-ingresos.component";
import { DetailIngresosComponent } from "./components/ingresos/detail-ingresos/detail-ingresos.component";
import { IndexInventarioComponent } from "./components/inventario/index-inventario/index-inventario.component";
import { DetalleInventarioComponent } from "./components/inventario/detalle-inventario/detalle-inventario.component";
import { IndexCuponComponent } from "./components/cupones/index-cupon/index-cupon.component";
import { CreateCuponComponent } from "./components/cupones/create-cupon/create-cupon.component";
import { EditCuponComponent } from "./components/cupones/edit-cupon/edit-cupon.component";
import { AuthGuard } from "./guards/auth.guard";
import { IndexClientesComponent } from "./components/clientes/index-clientes/index-clientes.component";

const appRoutes : Routes = [
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

    { path: 'colaborador', component: IndexUsuarioComponent ,canActivate: [AuthGuard]},
    { path: 'colaborador/create', component: CreateUsuarioComponent ,canActivate: [AuthGuard]},
    { path: 'colaborador/edit/:id', component: EditUsuarioComponent ,canActivate: [AuthGuard]},

    { path: 'categoria/create', component: CreateCategoriaComponent ,canActivate: [AuthGuard]},
    { path: 'categoria', component: IndexCategoriaComponent ,canActivate: [AuthGuard]},
    { path: 'categoria/:clasificacion', component: IndexCategoriaComponent ,canActivate: [AuthGuard]},
    { path: 'categoria/edit/:id', component: EditCategoriaComponent ,canActivate: [AuthGuard]},

    { path: 'producto', component: IndexProductoComponent ,canActivate: [AuthGuard]},
    { path: 'producto/create', component: CreateProductoComponent ,canActivate: [AuthGuard]},
    { path: 'producto/edit/:id', component: EditProductoComponent ,canActivate: [AuthGuard]},

    { path: 'ingresos', component: IndexIngresosComponent ,canActivate: [AuthGuard]},
    { path: 'ingresos/create', component: CreateIngresosComponent ,canActivate: [AuthGuard]},
    { path: 'ingresos/detail/:id', component: DetailIngresosComponent ,canActivate: [AuthGuard]},

    { path: 'cupones', component: IndexCuponComponent ,canActivate: [AuthGuard]},
    { path: 'cupones/create', component: CreateCuponComponent ,canActivate: [AuthGuard]},
    { path: 'cupones/edit/:id', component: EditCuponComponent ,canActivate: [AuthGuard]},

    { path: 'inventario', component: IndexInventarioComponent ,canActivate: [AuthGuard]},
    { path: 'inventario/detail/:id', component: DetalleInventarioComponent ,canActivate: [AuthGuard]},

    { path: 'clientes', component: IndexClientesComponent ,canActivate: [AuthGuard]},
]

export const appRoutingProviders : any[] = [];
export const routing : ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
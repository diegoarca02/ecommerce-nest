import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioModule } from './api/usuario/usuario.module';
import { ProductoController } from './api/producto/producto.controller';
import { ProductoService } from './api/producto/producto.service';
import { ProductoModule } from './api/producto/producto.module';
import { IngresoModule } from './api/ingreso/ingreso.module';
import { InventarioController } from './api/inventario/inventario.controller';
import { InventarioService } from './api/inventario/inventario.service';
import { InventarioModule } from './api/inventario/inventario.module';
import { TclienteController } from './api/tcliente/tcliente.controller';
import { TclienteService } from './api/tcliente/tcliente.service';
import { TclienteModule } from './api/tcliente/tcliente.module';
import { UsuarioSchema } from './schemas/usuario.schema';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminInterceptorInterceptor } from './interceptors/admin-interceptor/admin-interceptor.interceptor';
import { ClienteInterceptorInterceptor } from './interceptors/cliente-interceptor/cliente-interceptor.interceptor';
import { EmailsController } from './api/emails/emails.controller';
import { EmailsService } from './api/emails/emails.service';
import { EmailsModule } from './api/emails/emails.module';
import { GuestController } from './api/guest/guest.controller';
import { GuestService } from './api/guest/guest.service';
import { GuestModule } from './api/guest/guest.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/ecommerce'),
    UsuarioModule,
    ProductoModule,
    IngresoModule,
    InventarioModule,
    TclienteModule,
    EmailsModule,
    GuestModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})

export class AppModule {}

import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioSchema } from 'src/schemas/usuario.schema';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AdminInterceptorInterceptor } from 'src/interceptors/admin-interceptor/admin-interceptor.interceptor';
import { ClienteInterceptorInterceptor } from 'src/interceptors/cliente-interceptor/cliente-interceptor.interceptor';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'usuario', schema: UsuarioSchema}
    ]),
    JwtModule.register({ 
      secret: 'diego',
      signOptions: {
        expiresIn: '1d'
      }
    })
  ],
  providers: [UsuarioService,
    /* {
      provide: APP_INTERCEPTOR,
      useClass: AdminInterceptorInterceptor
    } */
    
  ],
  controllers: [UsuarioController],
  exports: [UsuarioService]
})
export class UsuarioModule {}

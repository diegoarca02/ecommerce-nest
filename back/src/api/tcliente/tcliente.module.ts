import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ClienteSchema } from 'src/schemas/cliente.schema';
import { TclienteService } from './tcliente.service';
import { TclienteController } from './tcliente.controller';
import { MailerModule } from "@nestjs-modules/mailer";
import { EmailsModule } from '../emails/emails.module';
import { CarritoSchema } from 'src/schemas/carrito.schema';
import { ProductoSchema } from 'src/schemas/producto.schema';
import { DireccionSchema } from 'src/schemas/direccion.schema';
import { CuponSchema } from 'src/schemas/cupon.schema';
import { Cupon_detalleSchema } from 'src/schemas/cupon_detalle.schema';
import { VentaSchema } from 'src/schemas/venta.schema';
import { Venta_detalleSchema } from 'src/schemas/venta_detalles.shema';
import { IngresoSchema } from 'src/schemas/ingreso.schema';
import { Ingreso_detalleSchema } from 'src/schemas/ingreso_detalle.schema';


@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'cliente', schema: ClienteSchema},
            {name: 'carrito', schema: CarritoSchema},
            {name: 'producto', schema: ProductoSchema},
            {name: 'direccion', schema: DireccionSchema},
            {name: 'cupon', schema: CuponSchema},
            {name: 'cupon_detalle', schema: Cupon_detalleSchema},
            {name: 'venta', schema: VentaSchema},
            {name: 'venta_detalle', schema: Venta_detalleSchema},
            {name: 'ingreso', schema: IngresoSchema},
            {name: 'ingreso_detalle', schema: Ingreso_detalleSchema}
        ]),
        JwtModule.register({ 
            secret: 'diego1',
            signOptions: {
            expiresIn: '1d'
            }
        }),
        EmailsModule
    ],
    providers: [TclienteService,
    /* {
        provide: APP_INTERCEPTOR,
        useClass: AdminInterceptorInterceptor
    } */
    
    ],
    controllers: [TclienteController],
    exports: [TclienteModule,TclienteService]
})
export class TclienteModule {}

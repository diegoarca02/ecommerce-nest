import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { IngresoSchema } from 'src/schemas/ingreso.schema';
import { Ingreso_detalleSchema } from 'src/schemas/ingreso_detalle.schema';
import { ProductoSchema } from 'src/schemas/producto.schema';
import { Producto_variedadSchema } from 'src/schemas/producto_variedad.shema';
import { IngresoController } from './ingreso.controller';
import { IngresoService } from './ingreso.service';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'producto', schema: ProductoSchema
            },
            {
                name: 'producto_variedad', schema: Producto_variedadSchema
            },
            {
                name: 'ingreso', schema: IngresoSchema
            },
            {
                name: 'ingreso_detalle', schema: Ingreso_detalleSchema
            },
        ]),
        JwtModule.register({ 
            secret: 'diego',
            signOptions: {
                expiresIn: '1d'
            }
        }),
        UsuarioModule
    ],
    controllers: [IngresoController],
    providers: [IngresoService]
})
export class IngresoModule {}

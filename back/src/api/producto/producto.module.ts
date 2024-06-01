import { Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from 'src/schemas/categoria.schema';
import { JwtModule } from '@nestjs/jwt';
import { ProductoSchema } from 'src/schemas/producto.schema';
import { Producto_variedadSchema } from 'src/schemas/producto_variedad.shema';
import { Producto_galeriaSchema } from 'src/schemas/producto_galeria.schema';
import { CuponSchema } from 'src/schemas/cupon.schema';
import { Cupon_detalleSchema } from 'src/schemas/cupon_detalle.schema';
import { UsuarioModule } from '../usuario/usuario.module';
import { IngresoSchema } from 'src/schemas/ingreso.schema';
import { Ingreso_detalleSchema } from 'src/schemas/ingreso_detalle.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'categoria', schema: CategoriaSchema
            },
            {
                name: 'producto', schema: ProductoSchema
            },
            {
                name: 'producto_variedad', schema: Producto_variedadSchema
            },
            {
                name: 'producto_galeria', schema: Producto_galeriaSchema
            },
            {
                name: 'cupon', schema: CuponSchema
            },
            {
                name: 'cupon_detalle', schema: Cupon_detalleSchema
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
    controllers: [ProductoController],
    providers: [ProductoService]
})
export class ProductoModule {}

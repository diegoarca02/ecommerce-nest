import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from 'src/schemas/categoria.schema';
import { ProductoSchema } from 'src/schemas/producto.schema';
import { Producto_galeriaSchema } from 'src/schemas/producto_galeria.schema';
import { Producto_variedadSchema } from 'src/schemas/producto_variedad.shema';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';
import { IngresoSchema } from 'src/schemas/ingreso.schema';
import { Ingreso_detalleSchema } from 'src/schemas/ingreso_detalle.schema';
import { VentaSchema } from 'src/schemas/venta.schema';
import { Venta_detalleSchema } from 'src/schemas/venta_detalles.shema';
import { CarritoSchema } from 'src/schemas/carrito.schema';
import { ClienteSchema } from 'src/schemas/cliente.schema';
import { DireccionSchema } from 'src/schemas/direccion.schema';

@Module({
    imports:[
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
                name: 'ingreso', schema: IngresoSchema
            },
            {
                name: 'ingreso_detalle', schema: Ingreso_detalleSchema
            },
            {name: 'venta', schema: VentaSchema},
            {name: 'venta_detalle', schema: Venta_detalleSchema},
            {name: 'carrito', schema: CarritoSchema},
            {name: 'cliente', schema: ClienteSchema},
            {name: 'direccion', schema: DireccionSchema},
        ]),
    ],
    controllers: [GuestController],
    providers: [GuestService],
    exports: []
})
export class GuestModule {}

import { Prop } from "@nestjs/mongoose";
import { Schema } from "mongoose";
import { ProductoSchema } from "./producto.schema";

export const Ingreso_detalleSchema = new Schema({
    ingreso: { type: Schema.Types.ObjectId,ref:'ingreso' ,required: true },
    producto: { type: Schema.Types.ObjectId,ref:'producto' ,required: true },//
    producto_variedad: { type: Schema.Types.ObjectId,ref:'producto_variedad' ,required: true },//
    venta: { type: Schema.Types.ObjectId,ref:'venta' ,required: false },
    venta_detalle: { type: Schema.Types.ObjectId,ref:'venta_detalle' ,required: false },
    precio_unidad : { type: Number, required: true},//
    codigo : { type: String, required: true},
    estado : { type: Boolean, default: true, required: true},
    estado_ : { type: String, default: 'Procesado', required: true},
    createdAt: { type: Date, default: Date.now}
});

//RDRDDRDR156654
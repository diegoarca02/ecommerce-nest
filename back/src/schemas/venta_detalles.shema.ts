import { Prop } from "@nestjs/mongoose";
import { Schema } from "mongoose";

export const Venta_detalleSchema = new Schema({
    cliente: { type: Schema.Types.ObjectId,ref:'cliente' ,required: true },
    venta: { type: Schema.Types.ObjectId,ref:'venta' ,required: true },
    producto: { type: Schema.Types.ObjectId,ref:'producto' ,required: true },
    producto_variedad: { type: Schema.Types.ObjectId,ref:'producto_variedad' ,required: true },
    cantidad : { type: Number, required: true},
    precio : { type: Number, required: true},
    createdAt: { type: Date, default: Date.now}
});
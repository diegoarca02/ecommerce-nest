import { Prop } from "@nestjs/mongoose";
import { Schema } from "mongoose";

export const Producto_variedadSchema = new Schema({
    hxd: { type: String, required: true },
    color: { type: String, required: true },
    talla: { type: String, required: true },
    sku: { type: String, required: true },
    precio: { type: Number,default: 0,required: true },
    cantidad: { type: Number, required: true, default: 0},
    producto: { type: Schema.Types.ObjectId, required: true, ref: 'producto' },
    createdAt: { type: Date, default: Date.now}
});

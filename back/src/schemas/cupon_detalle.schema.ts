import { Prop } from "@nestjs/mongoose";
import { Schema } from "mongoose";

export const Cupon_detalleSchema = new Schema({
    tipo: { type: String, required: true },
    cupon: { type: Schema.Types.ObjectId,ref:'cupon' ,required: true },
    producto: { type: Schema.Types.ObjectId,ref:'producto' ,required: false },
    categoria: { type: Schema.Types.ObjectId,ref:'categoria' ,required: false },
    createdAt: { type: Date, default: Date.now}
});
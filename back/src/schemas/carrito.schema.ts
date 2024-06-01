import { Prop } from "@nestjs/mongoose";
import { Schema } from "mongoose";

export const CarritoSchema = new Schema({
    producto: { type: Schema.Types.ObjectId, ref: 'producto' ,required: true },
    producto_variedad: { type: Schema.Types.ObjectId, ref: 'producto_variedad' ,required: true },
    cliente: { type: Schema.Types.ObjectId, ref: 'cliente' ,required: true },
    cantidad: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now}
});
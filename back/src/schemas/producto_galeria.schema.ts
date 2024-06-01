import { Prop } from "@nestjs/mongoose";
import { Schema } from "mongoose";

export const Producto_galeriaSchema = new Schema({
    imagen: { type: String, required: true },
    titulo: { type: String, required: true },
    producto: { type: Schema.Types.ObjectId, required: true, ref: 'Producto' },
    createdAt: { type: Date, default: Date.now}
});
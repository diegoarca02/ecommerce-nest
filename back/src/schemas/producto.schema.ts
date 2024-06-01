import { Prop } from "@nestjs/mongoose";
import { Schema } from "mongoose";

export const ProductoSchema = new Schema({
    titulo: { type: String, required: true },
    portada: { type: String, required: true },
    slug: { type: String, required: true },
    descripcion: { type: String, required: true },
    descuento: { type: Number, required: false },
    etiqueta: { type: String, default: 'Nuevo' ,required: true },
    clasificacion: { type: String, required: true },
    categoria: { type: Schema.Types.ObjectId, required: true, ref:'categoria' },
    subcategoria: { type: String, required: true },
    labels: [{type:Object, required: true}],
    estado: { type: Boolean, default: false,required: true },
    createdAt: { type: Date, default: Date.now}
});
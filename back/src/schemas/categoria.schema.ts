import { Prop } from "@nestjs/mongoose";
import { Schema } from "mongoose";

export const CategoriaSchema = new Schema({
    titulo: { type: String, required: true },
    slug: { type: String, required: true },
    genero: { type: String, required: true },
    subcategorias: [{ type: Object, required: true }],
    estado: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now}
});
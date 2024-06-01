import { Prop } from "@nestjs/mongoose";
import { Schema } from "mongoose";

export const IngresoSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId,ref:'usuario' ,required: true },
    usuario_estado: { type: Schema.Types.ObjectId,ref:'usuario' ,required: false },
    proveedor : { type: String, required: true},//
    almacen : { type: String, required: true},//
    total : { type: Number, required: true},
    codigo : { type: Number, required: true},
    estado : { type: String, default: 'Procesado' ,required: true},
    createdAt: { type: Date, default: Date.now}
});
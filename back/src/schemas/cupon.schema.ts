import { Prop } from "@nestjs/mongoose";
import { Schema } from "mongoose";

export const CuponSchema = new Schema({
    codigo: { type: String, required: true },
    tipo: { type: String, required: true }, //categoria - producto - general
    descuento: { type: Number, required: true },
    monto_max: { type: Number, required: true },
    canjes: { type: Number, required: true },
    f_inicio: { type: Date, required: true },
    f_fin: { type: Date, required: true },
    estado: { type: Boolean,default: false, required: true },
    createdAt: { type: Date, default: Date.now}
});
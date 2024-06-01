import { Prop } from "@nestjs/mongoose";
import { Schema } from "mongoose";

export const VentaSchema = new Schema({
    cliente: { type: Schema.Types.ObjectId,ref:'cliente' ,required: true },
    cupon: { type: Schema.Types.ObjectId,ref:'cupon' ,required: false },
    direccion: { type: Schema.Types.ObjectId,ref:'direccion' ,required: true },
    total : { type: Number, required: true},
    descuento : { type: Number, required: false},
    envio : { type: Number, required: true},
    paymentID: { type: String, required: false},
    nota : { type: String, required: false},
    tipo_envio: { type: String, required: false},
    fecha_entrega: { type: String, required: false},
    estado: { type: String, default: 'Procesado'},
    createdAt: { type: Date, default: Date.now}
});
import { Prop } from "@nestjs/mongoose";
import { Schema } from "mongoose";

export const DireccionSchema = new Schema({
    cliente: { type: Schema.Types.ObjectId, ref: 'cliente' ,required: true },
    nombres: { type: String, required: true }, //
    apellidos: { type: String, required: true }, //
    prefijo: { type: String, required: true }, //
    telefono: { type: String, required: true }, //

    country: { type: String, required: false },
    region: { type: String, required: false },
    place: { type: String, required: false },
    locality: { type: String, required: false },
    postcode: { type: String, required: false },
    address: { type: String, required: false },

    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
    createdAt: { type: Date, default: Date.now}
});
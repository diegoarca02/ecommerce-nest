import { Prop } from "@nestjs/mongoose";
import { Schema } from "mongoose";

export const ClienteSchema = new Schema({
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    fullnames: { type: String, required: true },
    email: { type: String, required: true },
    portada: { type: String, required: false },
    tipo: { type: String, required: true }, //Interno - Google
    email_validation : { type: Boolean},
    password: { type: String, required: false },
    estado: { type: Boolean,default: true, required: true },
    createdAt: { type: Date, default: Date.now}
});
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {

    constructor(
        @InjectModel('usuario') private usuarioModel,
        private readonly _jwtService:JwtService
    ){}

    async createUsuario(data:any){

        try {
            const _usuarios = await this.usuarioModel.find({email:data.email});

            if(_usuarios.length >= 1){
                return { data: undefined, message: 'El correo electrónico esta uso.' }
            }else{
                var salt = await bcrypt.genSalt(10);
                var hash = await bcrypt.hash('123456',salt);

                data.password = hash;
                data.fullnames = data.nombres + ' ' + data.apellidos;
                const usuario = await this.usuarioModel.create(data);
                return { data: usuario };
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo crear el usuario' }
        }
    }

    async getUsuarios(filtro:any){
        try {
            console.log('Hola servicio');
            var usuarios = [];
            if(filtro == 'Todos'){
                usuarios = await this.usuarioModel.find().sort({createdAt:-1});
            }else{
                const searchTerm = filtro.split(" ");
                const regTerm = searchTerm.map(term => `(?=.*\\b${term}\\b)`);
                const regex = new RegExp(`^${regTerm.join("")}`,'i');
                //
                usuarios = await this.usuarioModel.find({
                    $or: [
                        {fullnames: regex},
                        {nombres: new RegExp(filtro,'i')},
                        {email: new RegExp(filtro,'i')},
                        {apellidos: new RegExp(filtro,'i')},
                    ]
                }).sort({createdAt:-1});
            }
            
            return usuarios;

        } catch (error) {
            return { data: undefined, message:'No se pudo obtener los usuarios' }
        }
    }

    async setState(id:any,data:any){
        var usuario = await this.usuarioModel.findOne({_id:id});

        if(usuario){
            ///
            let estado_actual = data.estado;
            let estado_nuevo;
            
            if(estado_actual) estado_nuevo = false;
            else if(!estado_actual) estado_nuevo = true;

            let reg = await this.usuarioModel.findOneAndUpdate({_id:id},{
                estado: estado_nuevo
            });

            return { data: reg };

        }else{
            return { data: undefined, message:'No se pudo obtener los usuarios' }
        }
    }

    async getUsuario(id:any){
        try {
            var usuario = await this.usuarioModel.findOne({_id:id});
            if(usuario){
                return { data: usuario };
            }else{
                return { data: undefined, message:'No se pudo obtener el usuario' }
            }
        } catch (error) {
            console.log(error);
            
            return { data: undefined, message:'No se pudo obtener el usuario' }
        }
    }

    async updateUsuario(id:any,data:any){
        try {
            var usuario = await this.usuarioModel.findOne({_id:id});
            
            if(usuario){
                //

                var reg_usuarios = await this.usuarioModel.find({email:data.email,_id:{$ne:id}});
                
                if(reg_usuarios.length == 0){
                    var reg = await this.usuarioModel.findOneAndUpdate({_id:id},{
                        email: data.email,
                        rol: data.rol 
                    });
                    return { data : reg };
                }else{
                    return { data: undefined, message:'El correo no esta disponible' }
                }

            }else{
                return { data: undefined, message:'No se pudo obtener el usuario' }
            }
        } catch (error) {
            console.log(error);
            
            return { data: undefined, message:'No se pudo actualizar el usuario' }
        }
    }

    async login(data:any){
        let usuario = await this.usuarioModel.find({email: data.email});

        if(usuario.length >= 1){
            //
            let compare = await bcrypt.compare(data.password,usuario[0].password);

            if(compare){
                let jwt = this._jwtService.sign({
                    sub: usuario[0]._id,
                    nombres: usuario[0].nombres,
                    apellidos: usuario[0].apellidos,
                    email: usuario[0].email,
                    rol: usuario[0].rol
                });
                return { data: usuario[0], jwt }
            }else{
                return { data: undefined, message:'La contraseña es incorrecta.' }
            }

        }else{
            return { data: undefined, message:'El correo electrónico no encontrado.' }
        }
    }

}

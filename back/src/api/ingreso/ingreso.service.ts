import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class IngresoService {

    constructor(
        @InjectModel('ingreso') private ingresoModel,
        @InjectModel('producto') private productoModel,
        @InjectModel('ingreso_detalle') private detalleingresoModel,
    ){
        
    }

    async createIngreso(data:any,user){
        try {
            var ingresos = await this.ingresoModel.find().limit(1).sort({createdAt:-1});
            var codigo = 0;
            if(ingresos.length == 0){
                codigo = 1;
            }else{
                codigo = ingresos[0].codigo + 1;
            }

            data.usuario = user.sub;
            data.codigo = codigo;

            var reg_ingreso = await this.ingresoModel.create(data);

            for(var item of data.detalles){
                var producto = await this.productoModel.findOne({_id:item.producto}).populate('categoria');
                item.ingreso = reg_ingreso._id;
                

                for(var i = 0; i < item.cantidad;i++){
                    item.codigo = producto.titulo.toUpperCase().substring(0,2)+''+producto.categoria.titulo.toUpperCase().substring(0,2)+''+data.almacen.toUpperCase().substring(0,2)+''+uuidv4().split('-')[0].toUpperCase();
                    await this.detalleingresoModel.create(item);
                }

            }
            return { data: reg_ingreso};
        } catch (error) {
            console.log(error);
            
            return { data: undefined, message:'No se pudo crear el ingreso' }
        }
    }

    async getIngresos(inicio,fin){
        try {
            let ingresos = await this.ingresoModel.find({createdAt:{
                $gte : new Date(inicio+'T00:00:00'),
                $lte : new Date(fin+'T23:59:59'),
            }}).populate('usuario').sort({createdAt:-1});

            return {data: ingresos}
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener los ingresos' }
        }
    }

    async getIngreso(id){
        try {
            let ingreso = await this.ingresoModel.findOne({_id:id}).populate('usuario').populate('usuario_estado');

            if(ingreso){
                let detalles = await this.detalleingresoModel.find({ingreso:id}).populate('producto_variedad').populate('producto');
                return { data:ingreso,detalles }
            }else{
                return { data: undefined, message:'No se pudo obtener el ingreso' }
            }

            return {data: ingreso}
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener los ingresos' }
        }
    }

    async setStateIngreso(id,data,user){
        try {
            let ingreso = await this.ingresoModel.findOne({_id:id}).populate('usuario');

            if(ingreso){
                let ingreso = await this.ingresoModel.findOneAndUpdate({_id:id},{
                    estado : data.estado,
                    usuario_estado : user
                })

                let bool_estado;

                if(data.estado == 'Cancelado'){
                    bool_estado = false;
                }else if(data.estado == 'Confirmado'){
                    bool_estado = true;
                }

                await this.detalleingresoModel.updateMany({ingreso:id},{
                    estado_ : data.estado_,
                    estado: bool_estado
                });

                return { data:ingreso }

            }else{
                return { data: undefined, message:'No se pudo obtener el ingreso' }
            }

            return {data: ingreso}
        } catch (error) {
            return { data: undefined, message:'No se pudo cambiar el estado.' }
        }
    }
}

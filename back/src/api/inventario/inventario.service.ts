import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class InventarioService {

    constructor(
        @InjectModel('categoria') private categoriaModal,
        @InjectModel('producto') private productoModel,
        @InjectModel('producto_variedad') private producto_variedadModel,
        @InjectModel('ingreso') private ingresoModel,
        @InjectModel('ingreso_detalle') private detalleingresoModel,
    ){}

    async getProductosInventario(filtro){
        try {
            let arr_productos = [];
            let productos;

            
            if(filtro == 'Todos'){
                productos = await this.productoModel.find().populate('categoria').sort({createdAt:-1});
            }else{
                productos = await this.productoModel.find({titulo:new RegExp(filtro,'i')}).populate('categoria').sort({createdAt:-1});
            }

            for(var item of productos){
                var arr_variaciones = [];
                var variaciones = await this.producto_variedadModel.find({producto:item._id});
                var unidades = await this.detalleingresoModel.find({producto: item._id,estado:true});

                for(var subitem of variaciones){
                    var unidades_variacion = await this.detalleingresoModel.find({producto_variedad: subitem._id,estado:true});
                    arr_variaciones.push({
                        cantidad: subitem.cantidad,
                        color: subitem.color,
                        createdAt: subitem.createdAt,
                        hxd: subitem.hxd,
                        precio: subitem.precio,
                        producto: subitem.producto,
                        sku: subitem.sku,
                        talla: subitem.talla,
                        _id: subitem._id,
                        unidades: unidades_variacion.length
                    });
                }

                arr_productos.push({
                    producto: item,
                    unidades: unidades.length,
                    variaciones: arr_variaciones
                });
            }
        
            return { data: arr_productos }
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener los producto' }
        }
    }

    async getVariacionInventario(id){
        try{
            var variacion = await this.producto_variedadModel.findOne({_id:id}).populate('producto');

            if(variacion){
                var unidades = await this.detalleingresoModel.find({producto_variedad:id,estado: true}).populate('ingreso');

                return { data: variacion,unidades }
            }else{
                return { data: undefined, message:'No se pudo obtener la variacion 1' }
            }
        } catch (error) {
            console.log(error);
            
            return { data: undefined, message:'No se pudo obtener la variacion 2' }
        }
    }
}

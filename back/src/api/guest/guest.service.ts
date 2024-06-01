import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class GuestService {

    constructor(
        @InjectModel('categoria') private categoriaModal,
        @InjectModel('producto') private productoModel,
        @InjectModel('producto_variedad') private producto_variedadModel,
        @InjectModel('producto_galeria') private producto_galeriaModel,
        @InjectModel('ingreso_detalle') private ingreso_detalleModel,
        @InjectModel('venta') private _ventaModel,  
        @InjectModel('venta_detalle') private _ventaDetalleModel,  
        @InjectModel('carrito') private _carritoModel,   
        @InjectModel('cliente') private _clienteModel,   
        @InjectModel('direccion') private _direccionModel,  
    ){

    }

    async getProductosShop(){
        try {
            let productos = await this.productoModel.find({estado:true}).populate('categoria').sort({createdAt: -1});
            let arr_productos = [];

            for(var element of productos){
                let variaciones = await this.producto_variedadModel.find({producto: element._id,precio:{ $gt:0}});
                let cantidades_total = 0;

                for(let subitem of variaciones){
                    let unidades = await this.ingreso_detalleModel.find({producto_variedad: subitem._id,estado:true,estado_:'Confirmado'});
                    cantidades_total = cantidades_total + unidades.length;
                }

                if(cantidades_total >= 1){
                    if(variaciones.length >= 1){

                        arr_productos.push({
                            _id: element._id,
                            titulo: element.titulo,
                            portada: element.portada,
                            slug: element.slug,
                            clasificacion: element.clasificacion,
                            etiqueta: element.etiqueta,
                            categoria: element.categoria,
                            precio: variaciones[0].precio
                        });
                    }
                }
            }

            

            return { data: arr_productos}
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener los productos.' }
        }
    }

    async getCategoriasShop(clasificacion){
        try {
            let categorias = await this.categoriaModal.find({genero:clasificacion});
            return { data: categorias }
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener las categoria' }
        }
    }

    async getProductoShop(slug){
        try {
            let producto = await this.productoModel.findOne({slug:slug,estado:true}).populate('categoria');
            let arr_variacion = [];
            if(producto){
                let variaciones = await this.producto_variedadModel.find({producto: producto._id,precio: {$gt:0}});
                let galeria = await this.producto_galeriaModel.find({producto: producto._id});
                for(let subitem of variaciones){
                    let unidades = await this.ingreso_detalleModel.find({producto_variedad: subitem._id,estado:true,estado_:'Confirmado'});
                
                    if(unidades.length >= 1){
                        arr_variacion.push({
                            _id : subitem._id,
                            hxd : subitem.hxd,
                            color : subitem.color,
                            talla : subitem.talla,
                            sku : subitem.sku,
                            precio : subitem.precio,
                            cantidad : subitem.cantidad,
                            producto :subitem.producto,
                            createdAt : subitem.createdAt,
                            cantidades : unidades.length
                        });
                    }
                }

                return { data: producto , variaciones: arr_variacion, galeria} 

            }else{
                return { data: undefined, message:'No se pudo encontrar el producto' }
            }

        } catch (error) {
            return { data: undefined, message:'No se pudo obtener el producto' }
        }
    }


    async createVentaGuest(data){
        try {

            let arr_clientes = this._clienteModel.find({email: data.cliente.email});
            let cliente;
            if(arr_clientes.length >= 1){
                cliente = arr_clientes[0];
            }else{
                cliente = await this._clienteModel.create({
                    nombres: data.cliente.nombres,
                    apellidos: data.cliente.apellidos,
                    fullnames: data.cliente.nombres + ' '+data.cliente.apellidos,
                    email: data.cliente.email,
                    tipo: 'Invitado',
                });
            }

            let direccion = await this._direccionModel.create({
                cliente: cliente._id,
                nombres: data.cliente.nombres,
                apellidos: data.cliente.apellidos,
                prefijo: data.direccion.prefijo,
                telefono: data.direccion.telefono,
                country: data.direccion.country,
                postcode: data.direccion.postcode,
                address: data.direccion.address,
            });

            data.cliente = cliente._id;
            data.direccion = direccion._id;
            let venta = await this._ventaModel.create(data);
            console.log(data.detalles);
            
            if(venta){
                for(let item of data.detalles){
                    item.cliente = cliente._id;
                    item.venta = venta._id;
                    let detalle = await this._ventaDetalleModel.create(item);
                    let ingresos = await this.ingreso_detalleModel.find({producto_variedad:item.producto_variedad,estado:true}).sort({createdAt:1}).limit(item.cantidad);

                    for(let subitem of ingresos){
                        await this.ingreso_detalleModel.findOneAndUpdate({_id:subitem._id},{
                            venta:venta._id,
                            venta_detalle: detalle._id,
                            estado: false
                        })
                    }
                }

                await this._carritoModel.deleteMany({cliente:data.cliente});

                return {data:venta}
            }else{
                return { data: undefined, message:'No se pudo registrar la venta.' }
            }
        } catch (error) {
            console.log(error);
            
            return { data: undefined, message:'No se pudo registrar la venta.' }
        }
    }

    async getVentaGuest(id){
        try {
           let venta = await this._ventaModel.findOne({_id:id}).populate('cliente').populate('cupon').populate('direccion');

           if(venta){
                var detalles = await this._ventaDetalleModel.find({venta:id}).populate('producto').populate('producto_variedad');
                return { data: { venta,detalles}}
            }else{
                return { data: undefined, message:'No se pudo obtener la venta.' }
           }
        } catch (error) {
            console.log(error);
            return { data: undefined, message:'No se pudo obtener la venta.' }
        }
    }

}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import slugify from 'slugify';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class ProductoService {
    constructor(
        @InjectModel('categoria') private categoriaModal,
        @InjectModel('producto') private productoModel,
        @InjectModel('producto_variedad') private producto_variedadModel,
        @InjectModel('producto_galeria') private producto_galeriaModel,
        @InjectModel('cupon') private cuponModel,
        @InjectModel('cupon_detalle') private cupondetalleModel,
        @InjectModel('ingreso_detalle') private ingreso_detalleModel,
    ){}

    async createCategoria(data:any){
        try {

            let categorias = await this.categoriaModal.find({titulo:data.titulo});
        
            if(categorias.length >= 1){
                return { data: undefined, message:'La categoria no esta disponible' }
            }else{
                data.slug = data.titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-").trim();
                let reg = await this.categoriaModal.create(data);
                return { data: reg}
            }

        } catch (error) {
             return { data: undefined, message:'No se pudo crear la categoria' }
        }
    }
    
    async getCategorias(clasificacion){
        try {
            let categorias = await this.categoriaModal.find({genero:clasificacion});
            return { data: categorias }
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener las categoria' }
        }
    }

    async setStateCategoria(id:any,data:any){
        var categoria = await this.categoriaModal.findOne({_id:id,genero:data.genero});

        if(categoria){
            ///
            let estado_actual = data.estado;
            let estado_nuevo;
            
            if(estado_actual) estado_nuevo = false;
            else if(!estado_actual) estado_nuevo = true;

            let reg = await this.categoriaModal.findOneAndUpdate({_id:id},{
                estado: estado_nuevo
            });

            return { data: reg };

        }else{
            return { data: undefined, message:'No se pudo obtener la categoria' }
        }
    }

    async getCategoria(id:any){
        try {
            var categoria = await this.categoriaModal.findOne({_id:id});
            if(categoria){
                return { data: categoria };
            }else{
                return { data: undefined, message:'No se pudo obtener la categoria' }
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener la categoria' }
        }
    }

    async updateCategoria(id:any,data:any){
        try {
            var categoria = await this.categoriaModal.findOne({_id:id});
            if(categoria){

                let reg = await this.categoriaModal.findOneAndUpdate({_id:id},{
                    titulo: data.titulo,
                    genero: data.genero,
                    subcategorias: data.subcategorias,
                    estado: data.estado
                });

                return { data: reg }

            }else{
                return { data: undefined, message:'No se pudo obtener la categoria' }
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener la categoria' }
        }
    }
    async createProducto(data:any,files:any){
        try {

            console.log(files);
            

            data.portada = files[0].filename;
            data.slug = slugify(data.titulo,{lower:true});
            data.labels = JSON.parse(data.etiquetas);
            let producto = await this.productoModel.create(data);

            data.variaciones = JSON.parse(data.variaciones);

            var str_clas;
            var categoria_producto = await this.categoriaModal.findOne({_id:data.categoria});

            if(data.clasificacion == 'Femenino') str_clas = 2;
            if(data.clasificacion == 'Masculino') str_clas = 1;
            if(data.clasificacion == 'Niños') str_clas = 3;
            if(data.clasificacion == 'Niñas') str_clas = 4;

            for(var item of data.variaciones){
                item.producto = producto._id;
                item.sku = ('0'+str_clas+''+categoria_producto.titulo.substring(0,3)+''+data.subcategoria.substring(0,3)+''+item.color.substring(0,3)+''+data.titulo.substring(0,3)+''+item.talla).toUpperCase();
                await this.producto_variedadModel.create(item);
            }

            data.galeria = JSON.parse(data.galeria);

            data.galeria.forEach(async (element,index) => {
                element.producto = producto._id;
                element.imagen = files[index].filename;
                await this.producto_galeriaModel.create(element);
            });

            return { data : producto }

        } catch (error) {
            console.log(error);
            
            return { data: undefined, message:'No se pudo crear el producto' }
        }
    }

    async getProductos(filtro){
        try {
            let arr_productos = [];
            let productos;
            if(filtro == 'Todos'){
                productos = await this.productoModel.find().populate('categoria').sort({createdAt:-1});
            }else{
                productos = await this.productoModel.find({titulo:new RegExp(filtro,'i')}).populate('categoria').sort({createdAt:-1});
            }

            for(var item of productos){
                var variaciones = await this.producto_variedadModel.find({producto:item._id});
                var galeria = await this.producto_galeriaModel.find({producto:item._id});

                arr_productos.push({
                    producto: item,
                    variaciones,
                    galeria
                });
            }
        
            return { data: arr_productos }
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener los producto' }
        }
    }

    async searchProductos(filtro){
        try {
            let productos;

            productos = await this.productoModel.find({titulo:new RegExp(filtro,'i'),estado:true}).populate('categoria').sort({createdAt:-1});
        
            return { data: productos }
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener los producto' }
        }
    }

    async setStateProducto(id:any,data:any){
        var producto = await this.productoModel.findOne({_id:id});

        if(producto){
            ///
            let estado_actual = data.estado;
            let estado_nuevo;
            
            if(estado_actual) estado_nuevo = false;
            else if(!estado_actual) estado_nuevo = true;

            let reg = await this.productoModel.findOneAndUpdate({_id:id},{
                estado: estado_nuevo
            });

            return { data: reg };

        }else{
            return { data: undefined, message:'No se pudo obtener el producto' }
        }
    }

    async getProducto(id:any){
        try {
            var producto = await this.productoModel.findOne({_id:id});
            if(producto){
                return { data: producto };
            }else{
                return { data: undefined, message:'No se pudo obtener el producto' }
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener el producto' }
        }
    }

    async getVariacionesProducto(id:any){
        try {
            var producto = await this.productoModel.findOne({_id:id});
            if(producto){
                let variaciones = await this.producto_variedadModel.find({producto:id});
                let arr_variacion = [];

                for(let item of variaciones){
                    let unidades = await this.ingreso_detalleModel.find({producto_variedad: item._id,estado:true,estado_:'Confirmado'});

                    arr_variacion.push({
                        color: item.color,
                        createdAt: item.createdAt,
                        hxd: item.hxd,
                        precio: item.precio,
                        producto: item.producto,
                        sku: item.sku,
                        talla: item.talla,
                        _id: item._id,
                        cantidad: unidades.length
                    });
                }

                return { data: arr_variacion }
            }else{
                return { data: undefined, message:'No se pudo obtener el producto' }
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener el producto' }
        }
    }

    async getGaleriaProducto(id){
        try {
            var producto = await this.productoModel.findOne({_id:id});
            if(producto){
                let galeria = await this.producto_galeriaModel.find({producto:id});
                return { data: galeria }
            }else{
                return { data: undefined, message:'No se pudo obtener el producto' }
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener el producto' }
        }
    }

    async updateProducto(id,data){
        try {
            var producto = await this.productoModel.findOne({_id:id});
            if(producto){
                //
                let producto = await this.productoModel.findOneAndUpdate({_id:id},{
                    titulo: data.titulo,
                    clasificacion: data.clasificacion,
                    categoria: data.categoria,
                    subcategoria: data.subcategoria,
                    labels: data.labels,
                    descripcion: data.descripcion,
                })

                return { data: producto}
            }else{
                return { data: undefined, message:'No se pudo encontrar el producto' }
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo actualizar el producto' }
        }
    }

    async addVariacion(data){
        try {
            
            let str_clas = 0;
            let producto = await this.productoModel.findOne({_id:data.producto}).populate('categoria');
            if(producto.clasificacion == 'Femenino') str_clas = 2;
            if(producto.clasificacion == 'Masculino') str_clas = 1;
            if(producto.clasificacion == 'Niños') str_clas = 3;
            if(producto.clasificacion == 'Niñas') str_clas = 4;
            
            data.sku = ('0'+str_clas+''+producto.categoria.titulo.substring(0,3)+''+producto.subcategoria.substring(0,3)+''+data.color.substring(0,3)+''+producto.titulo.substring(0,3)+''+data.talla).toUpperCase();

            console.log(data);

            const variacion = await this.producto_variedadModel.create(data);
            return { data: variacion}
        } catch (error) {
            console.log(error);
            
            return { data: undefined, message:'No se pudo agregar la variacion' }
        }
    }

    async uploadImgProducto(data,file){
        try {
            data.imagen = file.filename;
            const imagen = await this.producto_galeriaModel.create(data);
            return { data: imagen};
        } catch (error) {
            return { data: undefined, message:'No se pudo agregar la imagen' }
        }
        
    }

    async deleteVariacion(id){
        try {
            const variacion = await this.producto_variedadModel.findOne({_id:id});
            if(variacion){
                //
                
                if(variacion.cantidad == 0){
                    await this.producto_variedadModel.findOneAndRemove({_id:id});
                    return { data: true}
                }else{
                    return { data: undefined, message:'Hay unidades en la variación' }
                }
            }else{
                return { data: undefined, message:'No se pudo encontrar la variacion' }
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo eliminar la variacion' }
        }
    }

    async deleteImgProducto(id){
        try {
            const imagen = await this.producto_galeriaModel.findOne({_id:id});
            if(imagen){
                //
                await fs.remove(path.resolve('./uploads/productos/'+imagen.imagen));
                const imagen_delete = await this.producto_galeriaModel.findOneAndRemove({_id:imagen._id});
                return { data: imagen_delete};
            }else{
                return { data: undefined, message:'No se pudo encontrar la imagen' }
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo eliminar la imagen' }
        }
    }

    async getCategoriasCupon(filtro){
        try {
            let categorias = await this.categoriaModal.find({titulo:new RegExp(filtro,'i')});

            return {data: categorias};
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener las categorias.' }
        }
    }

    async getProductosCupon(filtro){
        try {
            
            let arr_productos = [];
            
            let productos = await this.productoModel.find({titulo:new RegExp(filtro,'i')}).populate('categoria');

            for(var element of productos){
                let variaciones = await this.producto_variedadModel.find({producto: element._id});
                console.log(variaciones.length);

                arr_productos.push({
                    producto: element,
                    variaciones
                });
            }

            console.log(arr_productos);
            

            return {data: arr_productos};
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener los productos.' }
        }
    }

    /////////////////////////////////////////////////////////////
    //CUPONES
    
    async createCupon(data){
        try {
            data.f_inicio = new Date(data.f_inicio+'T00:00:00');
            data.f_fin = new Date(data.f_fin+'T00:00:00');
            let cupon = await this.cuponModel.create(data);

            for(var item of data.detalles){
                item.cupon = cupon._id;
                await this.cupondetalleModel.create(item);
            }

            return { data: cupon}
        } catch (error) {
            return { data: undefined, message:'No se pudo crear el cupón.' }
        }
    }

    async getCupones(codigo){
        try {   
            if(codigo != 'Todos'){
                let cupones = await this.cuponModel.find({codigo:codigo}).sort({createdAt:-1});
                return {data: cupones}
            }else{
                let cupones = await this.cuponModel.find().sort({createdAt:-1});
                return {data: cupones}
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener los cupones.' }
        }
    }

    async getCupon(id){
        try {   
            let cupon = await this.cuponModel.findOne({_id:id});

            if(cupon){
                return {data:cupon}
            }else{
                return {data:undefined}
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener el cupon.' }
        }
    }

    async updateCupon(id,data){
        try {   
            let cupon = await this.cuponModel.findOne({_id:id});

            if(cupon){

                let reg = await this.cuponModel.findOneAndUpdate({_id:id},{
                    codigo: data.codigo,
                    descuento: data.descuento,
                    monto_max: data.monto_max,
                    canjes: data.canjes,
                    f_inicio: data.f_inicio+'T00:00:00',
                    f_fin: data.f_fin+'T23:59:59'
                });

                return {data:reg}
            }else{
                return {data:undefined}
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo actualizar el cupon.' }
        }
    }

    async getDetallesCupon(id){
        try {   
            let cupon = await this.cuponModel.findOne({_id:id});

            if(cupon){
                let detalles = await this.cupondetalleModel.find({cupon:id}).populate({
                    path: 'producto',
                    populate: {
                        path: 'categoria'
                    }
                }).populate('categoria');
                return {data:detalles}
            }else{
                return {data:undefined}
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener el cupon.' }
        }
    }

    async addDetalleCupon(data){
        try {   
            let cupon = await this.cuponModel.findOne({_id:data.cupon});

            if(cupon){
                let validate = false; //FALSE => NO SE PUEDE AGREGAR | TRUE => SI SE PUEDE

                if(cupon.tipo == 'Producto'){
                    let reg = await this.cupondetalleModel.find({cupon:cupon._id,producto:data.producto});

                    if(reg.length == 0) validate = true;
                }else if(cupon.tipo == 'Categoria'){
                    let reg = await this.cupondetalleModel.find({cupon:cupon._id,categoria:data.categoria});

                    if(reg.length == 0) validate = true;
                }
                
                if(validate){
                    let detalle = await this.cupondetalleModel.create(data);
                    return {data:detalle}
                }else{
                    return { data: undefined, message:'El detalle ya existe en el cupón.' }
                }
            }else{
                return {data:undefined}
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo agregar el detalle.' }
        }
    }

    async deleteCupon(id){
        try {   
            let detalle = await this.cupondetalleModel.findOne({_id:id});

            if(detalle){
                let reg = await this.cupondetalleModel.findOneAndRemove({_id:id});
                return {data:reg}
            }else{
                return {data:undefined}
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo eliminar el detalle.' }
        }
    }

    async updatePrecioVariacion(id,data){
        try {
            let variacion = await this.producto_variedadModel.findOne({_id:id});

            if(variacion){
                let reg = await this.producto_variedadModel.findOneAndUpdate({_id:id},{
                    precio: data.precio
                });
                return {data:reg}
            }else{
                return {data:undefined}
            }

        } catch (error) {
            return { data: undefined, message:'No se pudo actualizar el precio.' }
        }
    }
}

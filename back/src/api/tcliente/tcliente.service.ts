import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { log } from 'console';
import { EmailsService } from '../emails/emails.service';
import * as moment from 'moment';

@Injectable()
export class TclienteService {

    constructor(
        @InjectModel('cliente') private _clienteModel,
        @InjectModel('carrito') private _carritoModel,   
        @InjectModel('producto') private _productoModel,   
        @InjectModel('direccion') private _direccionModel,     
        @InjectModel('cupon') private _cuponModel,  
        @InjectModel('cupon_detalle') private _cuponDetalleModel,  
        @InjectModel('venta') private _ventaModel,  
        @InjectModel('venta_detalle') private _ventaDetalleModel,  
        @InjectModel('ingreso') private _ingresoModel,  
        @InjectModel('ingreso_detalle') private _ingresoDetalleModel,  
        private readonly _jwtService:JwtService,
        private readonly _emailService:EmailsService
    ){

    }

    async createtCliente(data:any){
        try {
            const _cliente = await this._clienteModel.find({email:data.email});

            if(_cliente.length >= 1){
                return { data: undefined, message: 'El correo electrónico esta uso.' }
            }else{
                var salt = await bcrypt.genSalt(10);
                var hash = await bcrypt.hash(data.password,salt);

                data.password = hash;
                data.email_validation = false;
                data.fullnames = data.nombres + ' ' + data.apellidos;
                data.tipo = 'Interno';
                const cliente = await this._clienteModel.create(data);
                this._emailService.sendEmailConfirmation(cliente._id);
                return { data: cliente };
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo crear el usuario' }
        }
    }

    async createtClienteGoogle(data:any){
        try {

            const _cliente = await this._clienteModel.find({email:data.email});

            if(_cliente.length == 0){
                data.email_validation = true;
                data.fullnames = data.nombres + ' ' + data.apellidos;
                data.tipo = 'Google';
                const cliente = await this._clienteModel.create(data);
          
                let jwt = this._jwtService.sign({
                    sub: cliente._id,
                    nombres: cliente.nombres,
                    apellidos: cliente.apellidos,
                    email: cliente.email
                });

                return { data: cliente, jwt }

            }else{
                if(_cliente[0].tipo == 'Google'){
                    let jwt = this._jwtService.sign({
                        sub: _cliente[0]._id,
                        nombres: _cliente[0].nombres,
                        apellidos: _cliente[0].apellidos,
                        email: _cliente[0].email
                    });

                    return { data: _cliente[0], jwt }
                }else{
                    return { data: undefined, message:'No se puede acceder con este email' }
                }
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo crear el usuario' }
        }
    }

    async logintCliente(data:any){
        try {
            let clientes = await this._clienteModel.find({email: data.email});

            if(clientes.length >= 1){
                //

                if(clientes[0].email_validation){
                    let compare = await bcrypt.compare(data.password,clientes[0].password);

                    if(compare){
                        let jwt = this._jwtService.sign({
                            sub: clientes[0]._id,
                            nombres: clientes[0].nombres,
                            apellidos: clientes[0].apellidos,
                            email: clientes[0].email
                        });

                        return { data: clientes[0], jwt }
                    }else{
                        return { data: undefined, message:'La contraseña es incorrecta.',tipo: 'password' }
                    }
                }else{
                    return { data: undefined, message:'El correo aun no esta confirmado.',tipo: 'email' }  
                }
                

            }else{
                return { data: undefined, message:'El correo electrónico no encontrado.', tipo: 'email' }
            }
        } catch (error) {
            console.log(error);
            
            return { data: undefined, message:'No se pudo autentificar el cliente',tipo: 'password' }
        }
    }

    async gettCliente(filtro){
        try {
            const searchTerm = filtro.split(" ");
            const regTerm = searchTerm.map(term => `(?=.*\\b${term}\\b)`);
            const regex = new RegExp(`^${regTerm.join("")}`,'i');
            var clientes = [];
            console.log(filtro);
            
            if(filtro != 'undefined'){
                clientes = await this._clienteModel.find({
                    $or: [
                        {fullnames: regex},
                        {nombres: new RegExp(filtro,'i')},
                        {email: new RegExp(filtro,'i')},
                        {apellidos: new RegExp(filtro,'i')},
                    ]
                });
            }else{
                clientes = await this._clienteModel.find();
            }
            
            return clientes;
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener los clientes'}
        }
    }

    async verificationCliente(token){
        try {
           const decoded = this._jwtService.verify(token); 
           const today = moment().unix();
           
           let cliente = await this._clienteModel.findOne({_id:decoded.cliente});

           if(cliente){
                //
                if(today <= decoded.exp){
                    await this._clienteModel.findOneAndUpdate({_id:decoded.cliente},{
                        email_validation: true
                    });
                    return { state: true}
                }else{
                    return { state: false ,message:'El correo de confirmación ya expiró.' }
                }
           }else{
                return { state: false ,message:'El token de verificación no es el correcto.' }
           }
            
        } catch (error) {
            return { data: undefined,state: false, message:'No se realizar la verificación.' }
        }
    }

    async addProductCart(data,id){
        try {
            data.cliente = id;
            let producto = await this._carritoModel.create(data);
            return { data: producto } 
        } catch (error) {
            return { data: undefined, message:'No se pudo agregar el producto.' }
        }
    }

    async getCliente(id:any){
        try {
            var cliente = await this._clienteModel.findOne({_id:id});
            if(cliente){
                return { data: cliente };
            }else{
                return { data: undefined, message:'No se pudo obtener el cliente' }
            }
        } catch (error) {
            console.log(error);
            
            return { data: undefined, message:'No se pudo obtener el cliente' }
        }
    }

    async getCartClient(id:any){
        try {
            let carrito = await this._carritoModel.find({cliente:id})
            .populate('producto')
            .populate('producto_variedad');
            return { data: carrito };
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener el carrito' }
        }
    }

    async deleteProductoCart(id:any){
        try {
            let producto = await this._carritoModel.findOneAndRemove({_id:id});
            return { data: producto };
        } catch (error) {
            return { data: undefined, message:'No se pudo eliminar el producto.' }
        }
    }

    async getNewProducts(){
        try {
            let productos = await this._productoModel.find().populate('categoria').limit(5).sort({createdAt:-1});
            return { data: productos };
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener los productos.' }
        }
    }
    
    async getClientPerfil(id:any){
        try {
            let cliente = await this._clienteModel.findOne({_id:id}).select('nombres apellidos email tipo');

            if(cliente){
                return { data: cliente };
            }else{
                return { data: undefined };
            }
            
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener el cliente.' }
        }
    }

    async updatePSWClient(data,id){
        try {
            let cliente = await this._clienteModel.findOne({_id:id});

            if(cliente){
                let compare = await bcrypt.compare(data.password,cliente.password); 

                if(compare){
                    return { data: undefined, message:'La nueva contraseña es la actual.' }
                }else{
                    var salt = await bcrypt.genSalt(10);
                    var hash = await bcrypt.hash(data.password,salt);

                    let psw = await this._clienteModel.findOneAndUpdate({_id:id},{
                        password: hash
                    });

                    return { data: psw}
                }
            }else{
                return { data: undefined, message:'No se pudo obtener el cliente.' }
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo actualizar la contraseña.' }
        }
    }

    async createDireccionClient(data,id){
        try {
            let cliente = await this._clienteModel.findOne({_id:id});

            if(cliente){
                data.cliente = id;
                let direccion = await this._direccionModel.create(data);
                return { data: direccion}
            }else{
                return { data: undefined, message:'No se pudo obtener el cliente.' }
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo crear la direccion.' }
        }
    }

    async getDireccionesCliente(id){
        try {
            let cliente = await this._clienteModel.findOne({_id:id});

            if(cliente){
                let direcciones = await this._direccionModel.find({cliente:id});
                return { data: direcciones}
            }else{
                return { data: undefined, message:'No se pudo obtener el cliente.' }
            }

        } catch (error) {
            return { data: undefined, message:'No se pudo obtener las direcciones.' }
        }
    }

    async deleteDireccionClient(id){
        try {
            let direccion = await this._direccionModel.findOne({_id:id});

            if(direccion){
                let reg = await this._direccionModel.findOneAndRemove({_id:id});
                return { data: reg}
            }else{
                return { data: undefined, message:'No se pudo obtener la dirección.' }
            }

        } catch (error) {
            return { data: undefined, message:'No se pudo eliminar la direccion.' }
        }
    }

    async getDireccionClient(id){
        try {
            let direccion = await this._direccionModel.findOne({_id:id});

            if(direccion){
                return { data: direccion}
            }else{
                return { data: undefined, message:'No se pudo obtener la dirección.' }
            }

        } catch (error) {
            return { data: undefined, message:'No se pudo obtener la direccion.' }
        }
    }

    async updateDireccionClient(id,data){
        try {
            let direccion = await this._direccionModel.findOne({_id:id});

            if(direccion){

                let reg = await this._direccionModel.findOneAndUpdate({_id:id},{
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    prefijo: data.prefijo,
                    telefono: data.telefono,

                    country: data.country,
                    region: data.region,
                    place: data.place,
                    locality: data.locality,
                    postcode: data.postcode,
                    address: data.address,

                    lat: data.lat,     
                    lng: data.lng,
                });

                return { data: reg}
            }else{
                return { data: undefined, message:'No se pudo obtener la dirección.' }
            }

        } catch (error) {
            return { data: undefined, message:'No se pudo obtener la direccion.' }
        }
    }

    async updateCantidadCart(id,data){
        try {
            let reg = await this._carritoModel.findOne({_id:id});

            if(reg){
                let cart = await this._carritoModel.findOneAndUpdate({_id:id},{
                    cantidad: data.cantidad
                });
                return { data: cart}
            }else{
                return { data: undefined, message:'No se pudo obtener el producto.' }
            }

        } catch (error) {
            return { data: undefined, message:'No se pudo obtener actualizar la cantidad.' }
        }
    }

    async applyCupon(codigo,data){
        try {
            console.log("Categorias " + data.categorias.length); //CATEGORIAS CART //1-2-3
            
           let cupones = await this._cuponModel.find({codigo: codigo});
           
            let today = new Date().getTime();
           if(cupones.length >= 1){
                let cupon = cupones[0];
                let detalles = await this._cuponDetalleModel.find({cupon:cupon._id}).populate('categoria');
                //1-2-3
                let tt_inicio = new Date(cupon.f_inicio).getTime();
                let tt_fin= new Date(cupon.f_fin).getTime();

                if(today >= tt_inicio && today <= tt_fin){
                    if(data.total <= cupon.monto_max){
                        if(cupon.tipo == 'General'){
                            return { data: cupon }
                        }else if(cupon.tipo == 'Categoria'){
                            let count = 0;
                            for(var cat of data.categorias){
                                let reg = detalles.filter(item=>item.categoria._id == cat)

                                if(reg.length >= 1){
                                    count++;
                                }
                            }

                            if(count == data.categorias.length){
                                return { data: cupon }
                            }else{
                                return { data: undefined, message:'El cupón no puede ser aplicado.'}
                            }
                        }else if(cupon.tipo == 'Producto'){
                            let count = 0;
                            for(var prod of data.productos){
                                let reg = detalles.filter(item=>item.producto == prod)

                                if(reg.length >= 1){
                                    count++;
                                }
                            }

                            if(count == data.productos.length){
                                return { data: cupon }
                            }else{
                                return { data: undefined, message:'El cupón no puede ser aplicado.'}
                            }
                        }
                       
                    }else{
                        return { data: undefined, message:'El monto máximo a aplicar es $'+cupon.monto_max }
                    }
                }else{
                    return { data: undefined, message:'El cupón no esta activo.' }
                }
                
                
           }else{
                return { data: undefined, message:'El cupón no fué encontrado.' }
           }
           
        } catch (error) {
            return { data: undefined, message:'No se pudo aplicar el cupon.' }
        }
    }

    async createVentaClient(data:any){
        try {
            let venta = await this._ventaModel.create(data);

            if(venta){
                for(let item of data.detalles){
                    item.venta = venta._id;
                    let detalle = await this._ventaDetalleModel.create(item);
                    let ingresos = await this._ingresoDetalleModel.find({producto_variedad:item.producto_variedad,estado:true}).sort({createdAt:1}).limit(item.cantidad);

                    for(let subitem of ingresos){
                        await this._ingresoDetalleModel.findOneAndUpdate({_id:subitem._id},{
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

    async getVentasClient(id){
        try {
            let cliente = await this._clienteModel.findOne({_id:id});

            if(cliente){
                let arr_ventas = [];
                let ventas = await this._ventaModel.find({cliente:id}).sort({createdAt:-1}).populate('cupon').populate('direccion');
                for(let item of ventas){
                    let detalles = await this._ventaDetalleModel.find({venta:item._id}).populate('producto').populate('producto_variedad');

                    arr_ventas.push({
                        venta: item,
                        detalles
                    });
                }

                return {data:arr_ventas}
            }else{
                return { data: undefined, message:'No se pudo obtener las ventas.' }
            }
        } catch (error) {
            console.log(error);
            return { data: undefined, message:'No se pudo obtener las ventas.' }
        }
    }

    async getVentaClient(id){
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

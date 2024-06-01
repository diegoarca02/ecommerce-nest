import { Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { TclienteService } from './tcliente.service';
import { ClientGuard } from 'src/guards/client/client.guard';

@Controller('')
export class TclienteController {
    
    constructor(
        private readonly _tclienteService:TclienteService
    ){

    }

    @Get('getNewProducts')
    async getNewProducts(@Res() res, @Req() req){
        const productos = await this._tclienteService.getNewProducts();
        res.status(200).send(productos);
    }

    @Post('createtCliente')
    async createtCliente(@Res() res, @Req() req){
        const data = req.body;
        const cliente = await this._tclienteService.createtCliente(data);
        res.status(200).send(cliente);
    }

    @Post('createtClienteGoogle')
    async createtClienteGoogle(@Res() res, @Req() req){
        const data = req.body;
        const cliente = await this._tclienteService.createtClienteGoogle(data);
        res.status(200).send(cliente);
    }
    

    @Post('logintCliente')
    async logintCliente(@Res() res, @Req() req){
        const data = req.body;
        const cliente = await this._tclienteService.logintCliente(data);
        res.status(200).send(cliente);
    }
    
    @Get('gettCliente/:filtro')
    async gettCliente(@Res() res, @Req() req,@Param('filtro') filtro:any){
        const clientes = await this._tclienteService.gettCliente(filtro);
        res.status(200).send(clientes);
    }

    @Get('verificationCliente/:token')
    async verificationCliente(@Res() res, @Req() req,@Param('token') token:any){
        const cliente = await this._tclienteService.verificationCliente(token);
        res.status(200).send(cliente);
    }

    @Get('getCliente/:id')
    @UseGuards(ClientGuard)
    async getCliente(@Res() res, @Req() req,@Param('id') id:any){
        const cliente = await this._tclienteService.getCliente(id);
        res.status(200).send(cliente);
    }

    @Post('addProductCart')
    @UseGuards(ClientGuard)
    async addProductCart(@Res() res, @Req() req){
        const data = req.body;
        const producto = await this._tclienteService.addProductCart(data,req.user.sub);
        res.status(200).send(producto);
    }

    @Get('getCartClient')
    @UseGuards(ClientGuard)
    async getCartClient(@Res() res, @Req() req){
        const cliente = await this._tclienteService.getCartClient(req.user.sub);
        res.status(200).send(cliente);
    }

    @Delete('deleteProductoCart/:id')
    @UseGuards(ClientGuard)
    async deleteProductoCart(@Res() res, @Req() req, @Param('id') id){
        const producto = await this._tclienteService.deleteProductoCart(id);
        res.status(200).send(producto);
    }

   
    @Get('getClientPerfil')
    @UseGuards(ClientGuard)
    async getClientPerfil(@Res() res, @Req() req){
        const cliente = await this._tclienteService.getClientPerfil(req.user.sub);
        res.status(200).send(cliente);
    }

    @Post('updatePSWClient')
    @UseGuards(ClientGuard)
    async updatePSWClient(@Res() res, @Req() req){
        const data = req.body;
        const cliente = await this._tclienteService.updatePSWClient(data,req.user.sub);
        res.status(200).send(cliente);
    }

    @Post('createDireccionClient')
    @UseGuards(ClientGuard)
    async createDireccionClient(@Res() res, @Req() req){
        const data = req.body;
        const direccion = await this._tclienteService.createDireccionClient(data,req.user.sub);
        res.status(200).send(direccion);
    }

    @Get('getDireccionesCliente')
    @UseGuards(ClientGuard)
    async getDireccionesCliente(@Res() res, @Req() req){
        const direcciones = await this._tclienteService.getDireccionesCliente(req.user.sub);
        res.status(200).send(direcciones);
    }

    @Delete('deleteDireccionClient/:id')
    @UseGuards(ClientGuard)
    async deleteDireccionClient(@Res() res, @Req() req, @Param('id') id){
        const direccion = await this._tclienteService.deleteDireccionClient(id);
        res.status(200).send(direccion);
    }

    @Get('getDireccionClient/:id')
    @UseGuards(ClientGuard)
    async getDireccionClient(@Res() res, @Req() req, @Param('id') id){
        const direcciones = await this._tclienteService.getDireccionClient(id);
        res.status(200).send(direcciones);
    }

    @Put('updateDireccionClient/:id') 
    @UseGuards(ClientGuard)
    async updateDireccionClient(@Res() res, @Req() req,@Param('id') id:any){
        let data = req.body;
        const direccion = await this._tclienteService.updateDireccionClient(id,data);
        res.status(200).send(direccion);
    }

    @Put('updateCantidadCart/:id') 
    @UseGuards(ClientGuard)
    async updateCantidadCart(@Res() res, @Req() req,@Param('id') id:any){
        let data = req.body;
        const producto = await this._tclienteService.updateCantidadCart(id,data);
        res.status(200).send(producto);
    }

    @Put('applyCupon/:codigo')
    async applyCupon(@Res() res, @Req() req, @Param('codigo') codigo){
        let data = req.body;
        const response = await this._tclienteService.applyCupon(codigo,data);
        res.status(200).send(response);
    }

    @Post('createVentaClient')
    @UseGuards(ClientGuard)
    async createVentaClient(@Res() res, @Req() req){
        const data = req.body;
        const venta = await this._tclienteService.createVentaClient(data);
        res.status(200).send(venta);
    }

    @Get('getVentasClient')
    @UseGuards(ClientGuard)
    async getVentasClient(@Res() res, @Req() req){
        const ventas = await this._tclienteService.getVentasClient(req.user.sub);
        res.status(200).send(ventas);
    }

    @Get('getVentaClient/:id')
    @UseGuards(ClientGuard)
    async getVentaClient(@Res() res, @Req() req, @Param('id') id){
        const venta = await this._tclienteService.getVentaClient(id);
        res.status(200).send(venta);
    }
}

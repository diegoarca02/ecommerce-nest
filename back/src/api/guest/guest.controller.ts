import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { GuestService } from './guest.service';
import * as path from 'path';

@Controller('')
export class GuestController {

    constructor(
        private readonly _guestService:GuestService
    ){
        
    }

    @Get('getProductosShop')
    async getProductosShop(@Res() res, @Req() req){
        const productos = await this._guestService.getProductosShop();
        res.status(200).send(productos);
    }

    @Get('getImgProductos/:file')
    async getImgProductos(@Res() res, @Req() req,@Param('file') file){
        const file_ = path.join(__dirname,'..','..','..','uploads','productos',file);
        res.status(200).sendFile(file_);
    }

    @Get('getCategoriasShop/:clasificacion')
    async getCategoriasShop(@Res() res, @Req() req,@Param('clasificacion') clasificacion){
        const categorias = await this._guestService.getCategoriasShop(clasificacion);
        res.status(200).send(categorias); 
    }
    
    @Get('getProductoShop/:slug')
    async getProductoShop(@Res() res, @Req() req,@Param('slug') slug){
        const producto = await this._guestService.getProductoShop(slug);
        res.status(200).send(producto); 
    }

    @Post('createVentaGuest')
    async createVentaGuest(@Res() res, @Req() req){
        const data = req.body;
        const venta = await this._guestService.createVentaGuest(data);
        res.status(200).send(venta);
    }

    @Get('getVentaGuest/:id')
    async getVentaGuest(@Res() res, @Req() req,@Param('id') id){
        let ventas = await this._guestService.getVentaGuest(id);
        res.status(200).send(ventas);
    }
    
}

import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { InventarioService } from './inventario.service';

@Controller('')
export class InventarioController {

    constructor(
        private readonly _inventarioService: InventarioService
    ){}

    @Get('getProductosInventario/:filtro')
    @UseGuards(AuthGuard)
    async getProductosInventario(@Res() res, @Req() req,@Param('filtro') filtro){
        const productos = await this._inventarioService.getProductosInventario(filtro);
        res.status(200).send(productos);
    }

    @Get('getVariacionInventario/:id')
    @UseGuards(AuthGuard)
    async getVariacionInventario(@Res() res, @Req() req,@Param('id') id){
        const variacion = await this._inventarioService.getVariacionInventario(id);
        res.status(200).send(variacion);
    }

}

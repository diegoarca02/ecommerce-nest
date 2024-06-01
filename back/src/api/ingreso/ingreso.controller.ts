import { Controller, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { IngresoService } from './ingreso.service';

@Controller('')
export class IngresoController {

    constructor(
        private readonly _ingresoService:IngresoService
    ){

    }


    @Post('createIngreso')
    @UseGuards(AuthGuard)
    async createIngreso(@Res() res, @Req() req){
        const data = req.body;
        const categoria = await this._ingresoService.createIngreso(data,req.user);
        res.status(200).send(categoria);
    }
    
    @Get('getIngresos/:inicio/:fin')
    @UseGuards(AuthGuard)
    async getIngresos(@Res() res, @Req() req,@Param('inicio') inicio,@Param('fin') fin){
        const ingresos = await this._ingresoService.getIngresos(inicio,fin);
        res.status(200).send(ingresos);
    }

    @Get('getIngreso/:id')
    @UseGuards(AuthGuard)
    async getIngreso(@Res() res, @Req() req,@Param('id') id){
        const ingreso = await this._ingresoService.getIngreso(id);
        res.status(200).send(ingreso);
    }

    @Put('setStateIngreso/:id')
    @UseGuards(AuthGuard)
    async setStateIngreso(@Res() res, @Req() req,@Param('id') id){
        const data = req.body;
        const user = req.user.sub;
        const ingreso = await this._ingresoService.setStateIngreso(id,data,user);
        res.status(200).send(ingreso);
    }
}

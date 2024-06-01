import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class EmailsService {

    constructor(
        @InjectModel('cliente') private _clienteModel,
        private readonly mailerService: MailerService,
        private _jwtService:JwtService,
        private _configService:ConfigService
    ){
        
    }

    async sendEmailConfirmation(id){
        let cliente = await this._clienteModel.findOne({_id:id});

        if(cliente){

            let token = this._jwtService.sign({
                cliente: cliente._id,
            });

            let context =  {
                nombres:cliente.nombres.split(' ')[0].toUpperCase(),
                apellidos: cliente.apellidos.split(' ')[0].toUpperCase(),
                _id: cliente._id,
                token: token,
                url: this._configService.get<string>('URL_TIENDA'),
            };

            await this.mailerService.sendMail({
                to: cliente.email,
                subject: 'Confirmación de cuenta en Shopper',
                template: 'email-verification',
                context: context
            });
        }else{
            return { data: undefined}
        }
    }
}

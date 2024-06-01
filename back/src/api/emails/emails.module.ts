import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClienteSchema } from 'src/schemas/cliente.schema';
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import * as path from 'path';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports:[
        MongooseModule.forFeature([
            {name: 'cliente', schema: ClienteSchema}
        ]),
        JwtModule.register({ 
            secret: 'diego1',
            signOptions: {
            expiresIn: '1d'
            }
        }),
        MailerModule.forRoot({
            transport: {
                service: 'Gmail',
                auth: {
                    user: 'diegoarca02@gmail.com',
                    pass: 'nisz iljb bjlu rykf'
                },
                tls: {
                    rejectUnauthorized: false 
                }
            },
            defaults: {
                from: '"Shopper" <diegoarca02@gmail.com>'
            }, 
            template: {
              dir: path.join(__dirname,'..','..','..','src','emails'),
              adapter: new EjsAdapter(),
              options: {
                strict:false
              }
            }
            
        }),
        ConfigModule.forRoot({
            isGlobal: true
        })
    ],
    controllers:[EmailsController],
    providers:[EmailsService],
    exports:[EmailsService]
})
export class EmailsModule {}

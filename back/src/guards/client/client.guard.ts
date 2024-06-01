import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { TclienteService } from 'src/api/tcliente/tcliente.service';

@Injectable()
export class ClientGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly _tclienteService:TclienteService,
    ){}


  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = context.switchToHttp().getRequest().headers.authorization;

    if(!token){
      throw new UnauthorizedException('Token no encontrado.');
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;

      var response = await this._tclienteService.getCliente(decoded.sub);
      
      if(response.data != undefined){
        return true;
      }else{
        return false;
      }

      
    } catch (error) {
      return false;
    }
  }
}

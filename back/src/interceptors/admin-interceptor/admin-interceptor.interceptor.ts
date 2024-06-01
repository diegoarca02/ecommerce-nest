import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UsuarioService } from 'src/api/usuario/usuario.service';

@Injectable()
export class AdminInterceptorInterceptor implements NestInterceptor {

  constructor(
    private readonly _userService:UsuarioService,
    private readonly jwtService: JwtService
  ){

  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const token = context.switchToHttp().getRequest().headers.authorization;

    try {
  
      const decoded = this.jwtService.verify(token);
      const response = await this._userService.getUsuario(decoded.sub);

      if(response.data != undefined){
        request.validate = true;
      }else{
        request.validate = false;
      }
      
    } catch (error) {
      request.validate = false;
    }

    return next.handle();
  }
}

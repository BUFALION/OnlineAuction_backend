import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { CookieService } from '../cookie.service';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class AuthGuardWs implements CanActivate {

  constructor(private readonly jwtService: JwtService){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const client: Socket = context.switchToWs().getClient() 

    const tokenCookie = client.handshake.headers.cookie;
    const tokenRegex = /access-token=([^;]+)/;
    const match = tokenRegex.exec(tokenCookie);
    const token = match ? match[1] : null;

    if(!token){
      throw new UnauthorizedException();
    }
    
    try{
      const sessionInfo = this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET })
  
      client['session'] = sessionInfo
    }catch{
      throw new UnauthorizedException()
    }

    return true;
  }
}
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { UserService } from 'src/user/user.service';
  import { Request } from 'express';
  import { GetSessionDto } from 'src/auth/dto/get-session.dto';
  
  @Injectable()
  export class CompanyOwnerGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest() as Request;
      const sessionInfo = req['session'] as GetSessionDto;
  
      const companyId = parseInt(req.params.companyId, 10);
  
      if (isNaN(companyId)) {
        throw new ForbiddenException('Invalid company ID');
      }
  
      const isOwner = await this.userService.isUserCompanyOwner(
        sessionInfo.id,
        companyId,
      );
  
      if (!isOwner) {
        throw new ForbiddenException('User is not a owner of this company');
      }
  
      return true;
    }
  }
  
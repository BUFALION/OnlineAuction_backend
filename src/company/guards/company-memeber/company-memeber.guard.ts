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
export class CompanyMemeberGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const sessionInfo = req['session'] as GetSessionDto;

    const companyId = parseInt(req.params.companyId, 10);

    if (isNaN(companyId)) {
      throw new ForbiddenException('Invalid company ID');
    }

    const isMember = await this.userService.isUserCompanyMember(
      sessionInfo.id,
      companyId,
    );

    if (!isMember) {
      throw new ForbiddenException('User is not a member of this company');
    }

    return true;
  }
}

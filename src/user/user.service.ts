import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GetSessionDto } from 'src/auth/dto/get-session.dto';
import { DbService } from 'src/db/db.service';
import { TokenDto } from 'src/token/dto/token.dto';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class UserService {
  constructor(
    private readonly db: DbService,
    private readonly tokenService: TokenService,
  ) {}

  async getUser(id: number) {
    const user = await this.db.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Use with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return await this.db.user.findFirst({ where: { email } });
  }

  async findById(id: number) {
    const user = await this.db.user.findFirst({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  //??
  async findAllCompanyMembers(companyId: number) {
    return this.db.user.findMany({
      where: {
        companyId: companyId,
      },
    });
  }

  //??
  async findAllUsersByCompanyId(companyId: number) {
    return this.db.user.findMany({ where: { companyId } });
  }

  async isUserCompanyMember(userId: number, companyId: number) {
    return await this.db.user.findFirst({
      where: {
        id: userId,
        companyId: companyId,
      },
    });
  }

  async isUserCompanyOwner(userId: number, companyId: number) {
    return await this.db.user.findUnique({
      where: {
        id: userId,
        createdCompany: {
          id: companyId,
          creatorId: userId
        }
      },
    })
  }

  async removeUserCompany(userId: number, companyId: number){
    const isUserCompanyMember = this.isUserCompanyMember(userId, companyId)

    if(!isUserCompanyMember) throw new NotFoundException('User not found')
    
    await this.db.user.update({
      where: {id: userId},
      data: {companyId: null}
    })
  }

  create(email: string, hash: string, salt: string) {
    return this.db.user.create({
      data: { email, hash, salt, firstName: 'fd', secondName: 'fd' },
    });
  }

  async assignUserToCompany(userId: number, companyId: number) {
    return await this.db.user.update({
      where: { id: userId },
      data: { companyId: companyId },
    });
  }

  async changeUserCompany(userSession: GetSessionDto, tokenUuid: string) {
    const invitationToken = await this.tokenService.findTokenById(tokenUuid);

    if (userSession.email !== invitationToken.email) {
      throw new UnauthorizedException('Email does not match invitation token.');
    }

    const user = this.db.user.update({
      where: { id: userSession.id },
      data: {
        companyId: invitationToken.companyId,
      },
    });

    await this.tokenService.deleteToken(invitationToken);
    return user;
  }
}

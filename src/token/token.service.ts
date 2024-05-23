import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokenDto } from './dto/token.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly db: DbService,
    private readonly emailService: EmailService,
  ) {}

  async findAllTokens() {
    return this.db.invitationToken.findMany();
  }

  async findTokenById(token: string) {
    const invitationToken = await this.db.invitationToken.findUnique({
      where: { token: token },
    });

    if (!invitationToken) {
      throw new NotFoundException(`Token with uuid ${token} not found`);
    }
    return invitationToken;
  }
 
  async deleteToken(token: TokenDto) {
    await this.db.invitationToken.delete({ where: { token: token.token } });
  }

  //REFACTORING
  async createToken(createTokenDto: CreateTokenDto) {
    const company = await this.db.company.findUnique({
      where: { id: createTokenDto.companyId },
    });

    if (!company) {
      throw new NotFoundException(
        `Company with id ${createTokenDto.companyId} not found`,
      );
    }

    const token = await this.db.invitationToken.create({
      data: { ...createTokenDto },
    });

    this.emailService.inviteCompanyEmail({
      email:createTokenDto.email,
      companyName: company.companyName,
      token: token.token
    })

    return token;
  }
}

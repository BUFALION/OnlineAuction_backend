import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { GetSessionDto } from 'src/auth/dto/get-session.dto';
import { DbService } from 'src/db/db.service';
import { TokenService } from 'src/token/token.service';
import { UpdateUser } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly db: DbService,
    private readonly tokenService: TokenService,
    private readonly httpService: HttpService,
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

  

  async uploadFile(photo: Express.Multer.File) {
    const formData = new FormData();
    formData.append('image', photo.buffer.toString('base64'));

    const { data } = await firstValueFrom(
      this.httpService
        .post(
          `https://api.imgbb.com/1/upload?key=6264bd3c1c686f1aa02b6d85cc41a6b8`,
          formData,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );
    return data.data.url;
  }

  async updateUser(id:number,updateUser: UpdateUser) {
    return await this.db.user.update({
      where: { id },
      data:{...updateUser}
    })
  }
}

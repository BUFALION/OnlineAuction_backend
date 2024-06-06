import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UserService } from 'src/user/user.service';
import { DbService } from 'src/db/db.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { CompanyUpdate, CompanyUpdateDto } from './dto/company-update.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly db: DbService,
    private readonly userSrvice: UserService,
    private readonly httpService: HttpService,
  ) {}

  async findAllCompany() {
    return this.db.company.findMany();
  }

  async findCompanyById(id: number) {
    const company = await this.db.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }
    return company;
  }

  async createCompany(createCompnayDto: CreateCompanyDto, creatorId: number) {
    const creator = await this.userSrvice.findById(creatorId);

    const existingCreatedCompany = await this.db.company.findUnique({
      where: {
        creatorId: creatorId,
      },
    });

    if (existingCreatedCompany) {
      throw new ConflictException('User already created a company');
    }

    if (creator.companyId) {
      throw new ForbiddenException('User is already part of another company');
    }

    const company = await this.db.company.create({
      data: {
        ...createCompnayDto,
        creatorId,
        imageUrl: 'test',
      },
    });

    this.userSrvice.assignUserToCompany(creatorId, company.id);

    return company;
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
  
  async updateCompany(id: number, companyUpdateDto: CompanyUpdate) {
    return this.db.company.update({
      where: { id },
      data: {
        ...companyUpdateDto
      },
    });
  }

}

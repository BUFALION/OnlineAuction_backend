import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UserService } from 'src/user/user.service';
import { DbService } from 'src/db/db.service';

@Injectable()
export class CompanyService {
  constructor(
    private readonly db: DbService,
    private readonly userSrvice: UserService,
  ) {}

  async findAllCompany() {
    return this.db.company.findMany()
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
    const creator = await this.userSrvice.findById(creatorId)

    const existingCreatedCompany = await this.db.company.findUnique({
      where: {
        creatorId: creatorId,
      },
    });

    if (existingCreatedCompany) {
      throw new ConflictException('User already created a company');
    }

    if(creator.companyId){
        throw new ForbiddenException('User is already part of another company');
      }

    const company = await this.db.company.create({
        data: {
            ...createCompnayDto,
            creatorId
        }
    })

    this.userSrvice.assignUserToCompany(creatorId, company.id)

    return company
  }
}

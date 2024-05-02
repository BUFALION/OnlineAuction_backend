import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateMakeDto } from './dto/create-make.dto';
import { MakeDto } from './dto/make.dto';

@Injectable()
export class MakeService {
  constructor(private readonly db: DbService) {}

  async create(createMakeDto: CreateMakeDto): Promise<MakeDto> {
    return await this.db.make.create({
      data: { ...createMakeDto },
    });
  }

  async getAll() {
    return await this.db.make.findMany()
  }
}

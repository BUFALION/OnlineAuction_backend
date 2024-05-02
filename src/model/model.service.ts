import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateMakeDto } from 'src/make/dto/create-make.dto';
import { MakeDto } from 'src/make/dto/make.dto';
import { ModelDto } from './dto/model.dto';
import { CreateModelDto } from './dto/create-model.dto';

@Injectable()
export class ModelService {
  constructor(private readonly db: DbService) {}

  async create(createModelDto: CreateModelDto): Promise<ModelDto> {
    return await this.db.model.create({
      data: { ...createModelDto }
    });
  }

  async findAll():Promise<ModelDto[]> {
    return await this.db.model.findMany()
  }

  async findByMakeId(makeId: number) :Promise<ModelDto[]> {
    return await this.db.model.findMany({
      where: {makeId: makeId}
    })
  }
  
  async deleteById(id: number){
    return await this.db.model.delete({
      where: {id: id}
    })
  }
}

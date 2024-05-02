import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateDescriptionDto } from './dto/create-descripttion.dto';

@Injectable()
export class DescriptionService {

    constructor(private readonly db: DbService){}

    async create(description : CreateDescriptionDto) {
        return this.db.description.create({
            data: {...description}
        })
    }

    async findById(id: number) {
        return this.db.description.findFirstOrThrow({
            where: {id: id}
        })
    } 
    

}

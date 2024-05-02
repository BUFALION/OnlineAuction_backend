import { Body, Controller, Get, Post } from '@nestjs/common';
import { MakeService } from './make.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { MakeDto } from './dto/make.dto';
import { CreateMakeDto } from './dto/create-make.dto';

@Controller('make')
export class MakeController {

    constructor(private readonly makeService: MakeService){}

    @Get()
    @ApiCreatedResponse({
        type: [MakeDto]
    })
    async getAll() : Promise<MakeDto[]>{
        return this.makeService.getAll()
    } 
    @Post()
    @ApiCreatedResponse({
        type: MakeDto
    })
    async create(@Body() createMakeDto: CreateMakeDto) : Promise<MakeDto>{
        return this.makeService.create(createMakeDto)
    } 

    

}

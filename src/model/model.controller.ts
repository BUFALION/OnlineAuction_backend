import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ModelService } from './model.service';
import { CreateModelDto } from './dto/create-model.dto';
import { ModelDto } from './dto/model.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('model')
export class ModelController {

    constructor(private readonly modelService: ModelService){}

    @Get()
    @ApiOkResponse({
        type: [ModelDto]
    })
    async getAll() : Promise<ModelDto[]>{
        return this.modelService.findAll()
    } 

    
    @Get('make/:makeId')
    @ApiOkResponse({
        type: [ModelDto]
    })
    async getByMakeId(@Param('makeId', ParseIntPipe) makeId: number ) : Promise<ModelDto[]>{
        return await this.modelService.findAll()
    } 

    @Post()
    @ApiCreatedResponse({
        type: ModelDto
    })
    async create(@Body() createMakeDto: CreateModelDto) : Promise<ModelDto>{
        return this.modelService.create(createMakeDto)
    } 

    @Delete(':id')
    @ApiOkResponse()
    async deleteById(@Param('id', ParseIntPipe) generationId: number ) {
      return await this.modelService.deleteById(generationId)
    }

}

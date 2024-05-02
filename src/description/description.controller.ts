import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { DescriptionService } from './description.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { DescriptionDto } from './dto/description.dto';
import { CreateDescriptionDto } from './dto/create-descripttion.dto';

@Controller('description')
export class DescriptionController {

    constructor(private readonly descriptionService: DescriptionService){}

    @ApiOkResponse({type: DescriptionDto})
    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number): Promise<DescriptionDto>{
        return this.descriptionService.findById(id)

    }

    @ApiOkResponse({type: DescriptionDto})
    @Post()
    async create(@Body() createDescriptionDto: CreateDescriptionDto ){
        return this.descriptionService.create(createDescriptionDto)
    }

}

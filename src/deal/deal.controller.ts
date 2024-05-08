import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { DealService } from './deal.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DealDto } from './dto/deal.dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionDto } from 'src/auth/dto/get-session.dto';
import { DealStatus } from '@prisma/client';

@Controller('deal')
@ApiTags('deals')
export class DealController {

constructor(private readonly dealService: DealService) {}

    @UseGuards(AuthGuard)
    @Post()
    @ApiCreatedResponse({
        type: DealDto,
      })
    async createDeal(@Body() body: CreateDealDto): Promise<DealDto>{
        return await this.dealService.create(body)
    }
    @UseGuards(AuthGuard)
    @Get()
    @ApiOkResponse({
        type: [DealDto]
    })
    async findAllDeals(){
        return await this.dealService.findAllDeals()
    }


    @UseGuards(AuthGuard)
    @Get('buyer')
    @ApiOkResponse({
        type: [DealDto]
    })
    async findAllDealsByBuyerId(@SessionInfo() session: GetSessionDto ){
        return await this.dealService.findByBuyerId(session.id)
    }

    @UseGuards(AuthGuard)
    @Put(':id/paid')
    @ApiOkResponse({
        type: DealDto
    })
    async paidOrder(@Param('id', ParseIntPipe) id: number ){
        return await this.dealService.changeStatus(id,DealStatus.PAID)
    }

    @UseGuards(AuthGuard)
    @Put(':id/confirm')
    @ApiOkResponse({
        type: DealDto
    })
    async confirmOrder(@Param('id', ParseIntPipe) id: number ){
        return await this.dealService.changeStatus(id,DealStatus.CONFIRMED)
    }


}

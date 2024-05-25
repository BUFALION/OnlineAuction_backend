import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionDto } from 'src/auth/dto/get-session.dto';
import { CreateAuctionDto } from './dto/create-auctiom.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuctionDto } from './dto/auction.dto';
import { ApiPaginatedResponse } from 'src/shared/decorators/api-paginated-response/api-paginated-response.decorator';
import { PaginatedOutputDto } from 'src/shared/dto/pagination.dto';
import { createPaginator } from 'prisma-pagination';
import { AuctionStatus, Prisma } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { CompanyMemeberGuard } from 'src/company/guards/company-memeber/company-memeber.guard';

@Controller('auction')
@ApiTags('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @UseGuards(AuthGuard, CompanyMemeberGuard)
  @Post('company/:companyId/:carId')
  @ApiCreatedResponse({
    type: AuctionDto,
  })
  async createAuction(
    @Body() body: CreateAuctionDto,
    @Param('carId', ParseIntPipe) carId: number,
    @Param('companyId', ParseIntPipe) companyId: number,
  ): Promise<AuctionDto> {
    return await this.auctionService.create(body, carId, companyId);
  }

  @ApiOkResponse({
    type: [AuctionDto],
  })
  @Get('company/:companyId')
  async findAuctionsByComapnyId(
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    return await this.auctionService.findAuctionsByComapnyId(companyId);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getAuctionByUserBids(@SessionInfo() session: GetSessionDto) {
    const auctions = await this.auctionService.getAuctionByUserBids(session.id);

    if (!auctions) {
      throw new NotFoundException(
        `No auctions found for user with ID ${session.id}`,
      );
    }

    return auctions;
  }

  @Get()
  @ApiPaginatedResponse(AuctionDto)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'minYear', description: 'Minimum year in the range', required: false })
  @ApiQuery({ name: 'maxYear', description: 'Maximum year in the range', required: false })
  @ApiQuery({ name: 'makeId', description: 'Make ID', required: false })
  @ApiQuery({ name: 'modelId', description: 'Model ID', required: false })
  async getAuctions(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
    @Query('minYear') minYear?: number, 
    @Query('maxYear') maxYear?: number,
    @Query('makeId') makeId?: number,
    @Query('modelId') modelId?: number,
  ): Promise<PaginatedOutputDto<AuctionDto>> {
    const yearRange = [+minYear, +maxYear];
    return await this.auctionService.findAll(page, perPage, {yearRange , makeId, modelId });
  }
  @Get('test')
  async getSortedAuctions(    
  @Query('minYear') minYear?: number, 
  @Query('maxYear') maxYear?: number,
  @Query('makeId') makeId?: number,
  @Query('modelId') modelId?: number) {
    const yearRange = [minYear, maxYear];
    return this.auctionService.getSortedAuctions({yearRange , makeId, modelId });
  }
  @Get(':auctionId')
  @ApiOkResponse({
    type: [AuctionDto],
  })
  async getAuctionsById(
    @Param('auctionId', ParseIntPipe) carId: number,
  ): Promise<AuctionDto> {
    return await this.auctionService.findById(carId);
  }


  @UseGuards(AuthGuard)
  @Put(':id/cancel')
  @ApiOkResponse({
      type: AuctionDto
  })
  async cancelAuction(@Param('id', ParseIntPipe) id: number ){
      return await this.auctionService.changeStatus(id,AuctionStatus.CANCELLED)
  }

  @UseGuards(AuthGuard)
  @Put(':id/played')
  @ApiOkResponse({
      type: AuctionDto
  })
  async playedAuction(@Param('id', ParseIntPipe) id: number ){
    return await this.auctionService.changeStatus(id,AuctionStatus.PLAYED)
  }

  @UseGuards(AuthGuard)
  @Put(':id/notplayed')
  @ApiOkResponse({
      type: AuctionDto
  })
  async notPlayedAuction(@Param('id', ParseIntPipe) id: number ){
    return await this.auctionService.changeStatus(id,AuctionStatus.NOT_PLAYED)
  }

  @UseGuards(AuthGuard)
  @Put(':id/inprogress')
  @ApiOkResponse({
      type: AuctionDto
  })
  async inProgrssAuction(@Param('id', ParseIntPipe) id: number ){
    return await this.auctionService.changeStatus(id,AuctionStatus.IN_PROGRESS)
  }




}

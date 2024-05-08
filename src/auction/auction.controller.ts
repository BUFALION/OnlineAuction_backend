import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
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
  ApiTags,
} from '@nestjs/swagger';
import { AuctionDto } from './dto/auction.dto';
import { ApiPaginatedResponse } from 'src/shared/decorators/api-paginated-response/api-paginated-response.decorator';
import { PaginatedOutputDto } from 'src/shared/dto/pagination.dto';
import { createPaginator } from 'prisma-pagination';
import { Prisma } from '@prisma/client';
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
    type: [AuctionDto]
  })
  @Get('company/:companyId')
  async findAuctionsByComapnyId(@Param('companyId', ParseIntPipe) companyId: number){
    return await this.auctionService.findAuctionsByComapnyId(companyId)
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
  async getAuctions(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
  ): Promise<PaginatedOutputDto<AuctionDto>> {
    return await this.auctionService.findAll(page, perPage);
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
}

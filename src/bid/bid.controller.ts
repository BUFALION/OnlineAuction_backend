import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { GetSessionDto } from 'src/auth/dto/get-session.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { BidService } from './bid.service';
import { BidCreateDto } from './dto/bid-create.dto';

@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @UseGuards(AuthGuard)
  @Post(':auctionId')
  async createByAuctinId(
    @Param('auctionId', ParseIntPipe) auctionId: number,
    @SessionInfo() session: GetSessionDto,
    @Body() body: BidCreateDto,
  ) {
    return await this.bidService.createByAuctionId(body, auctionId, session.id);
  }

  @Get('count/:auctionId')
  getCountBidsByAuction(@Param('auctionId', ParseIntPipe) auctionId: number){
    return this.bidService.getCountBidsByAuction(auctionId)
  }
  
  @Get('max/:auctionId')
  getMaxBidByAuction(@Param('auctionId', ParseIntPipe) auctionId: number){
    return this.bidService.getMaxBidByAuction(auctionId)
  }

}

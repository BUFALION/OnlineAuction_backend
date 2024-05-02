import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { BidCreateDto } from './dto/bid-create.dto';
import { AuctionService } from 'src/auction/auction.service';

@Injectable()
export class BidService {
  constructor(
    private readonly db: DbService,
    private readonly auctionService: AuctionService,
  ) {}

  async createByAuctionId(
    bidCreateDto: BidCreateDto,
    auctionId: number,
    userId: number,
  ) {
    const auction = await this.auctionService.findById(auctionId);



    return this.db.bid.create({
      data: {
        ...bidCreateDto,
        auctionId: auction.id,
        userId: userId,
      },
    });
  }

  async getCountBidsByAuction(auctionId: number) {
    const auction = await this.auctionService.findById(auctionId);

    return await  this.db.bid.count({
      where: {auctionId: auctionId}
    })
  }
  async getMaxBidByAuction(aucitonId: number) {
    const auction = await this.auctionService.findById(aucitonId);

    const maxBid = await this.db.bid.findFirst({
      where: { auctionId: aucitonId },
      select: { amount: true },
      orderBy: { amount: 'desc' },
    });

    return maxBid ? maxBid.amount : 0;
  }
  
  public async getLastHighestBid(auctionId: number) {
    const bid = await this.db.bid.findFirst({
      where: { auctionId },
      orderBy: { amount: 'desc' },
    });

    return bid;
  }
}

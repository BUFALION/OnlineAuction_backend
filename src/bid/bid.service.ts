import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { BidCreateDto } from './dto/bid-create.dto';
import { AuctionService } from 'src/auction/auction.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BidDto } from './dto/bid.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BidService {
  constructor(
    private readonly db: DbService,
    private readonly auctionService: AuctionService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private eventEmitter: EventEmitter2,
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

  private async getMaxBidFromCache(auctionId: number) {
    const cacheKey = `maxBid:${auctionId}`;
    const cachedBid = await this.cacheService.get<BidDto>(cacheKey);

    if (cachedBid) {
      return cachedBid;
    }
    return null;
  }

  //new Method this transactio
  async placeBid(
    bidCreateDto: BidCreateDto,
    auctionId: number,
    userId: number,
  ) {
    return this.db.$transaction(async (db) => {
      const highestBid = await this.getMaxBidFromCache(auctionId);

      if (highestBid && highestBid.amount >= bidCreateDto.amount) {
        throw new ConflictException('A higher or equal bid already exists');
      }

      const newBid = await db.bid.create({
        data: {
          auctionId,
          userId,
          amount: bidCreateDto.amount,
        },
      });

      await this.cacheService.set(`maxBid:${auctionId}`, newBid);

      this.eventEmitter.emit('bid.updated', newBid);

      return newBid;
    });
  }

  async getCountBidsByAuction(auctionId: number) {
    const auction = await this.auctionService.findById(auctionId);

    return await this.db.bid.count({
      where: { auctionId: auctionId },
    });
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

  public async getMaxBidUserId(auctionId: number): Promise<number | null> {
    const highestBid = await this.getMaxBidFromCache(auctionId);

    return highestBid ? highestBid.userId : null;
  }
}
